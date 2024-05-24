package storage

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/sqlqueries"
)

// SetSystemIntakeSystems links given System IDs to given System Intake ID
// This function opts to take a *sqlx.Tx instead of a NamedPreparer because the SQL calls inside this function are heavily intertwined, and we never want to call them outside the scope of a transaction
func (s *Store) SetSystemIntakeSystems(ctx context.Context, tx *sqlx.Tx, systemIntakeID uuid.UUID, systemIDs []string) error {
	if systemIntakeID == uuid.Nil {
		return errors.New("unexpected nil system intake ID when linking system intake to system id")
	}

	if _, err := tx.NamedExec(sqlqueries.SystemIntakeSystemForm.Delete, map[string]interface{}{
		"system_ids":       pq.StringArray(systemIDs),
		"system_intake_id": systemIntakeID,
	}); err != nil {
		appcontext.ZLogger(ctx).Error("Failed to delete system ids linked to system intake", zap.Error(err))
		return err
	}

	// no need to run insert if we are not inserting new system ids
	if len(systemIDs) < 1 {
		return nil
	}

	userID := appcontext.Principal(ctx).Account().ID

	setSystemIntakeSystemsLinks := make([]models.SystemIntakeSystem, len(systemIDs))

	for i, systemID := range systemIDs {
		systemIDLink := models.NewSystemIntakeSystem(userID)
		systemIDLink.ID = uuid.New()
		systemIDLink.ModifiedBy = &userID
		systemIDLink.SystemIntakeID = systemIntakeID
		systemIDLink.SystemID = systemID

		setSystemIntakeSystemsLinks[i] = systemIDLink
	}

	if _, err := tx.NamedExec(sqlqueries.SystemIntakeSystemForm.Set, setSystemIntakeSystemsLinks); err != nil {
		appcontext.ZLogger(ctx).Error("Failed to insert linked system intake to system ids", zap.Error(err))
		return err
	}

	return nil
}

// SystemIntakeSystemsBySystemIntakeIDLOADER gets multiple groups of system ids by System Intake ID
func (s *Store) SystemIntakeSystemsBySystemIntakeIDLOADER(ctx context.Context, paramTableJSON string) (map[string][]*models.SystemIntakeSystem, error) {
	stmt, err := s.db.PrepareNamed(sqlqueries.SystemIntakeSystemForm.SelectBySystemIntakeIDLOADER)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	var systems []*models.SystemIntakeSystem
	err = stmt.Select(&systems, map[string]interface{}{
		"param_table_json": paramTableJSON,
	})
	if err != nil {
		return nil, err
	}

	ids, err := extractSystemIntakeIDs(paramTableJSON)
	if err != nil {
		return nil, err
	}

	store := map[string][]*models.SystemIntakeSystem{}

	for _, id := range ids {
		store[id] = []*models.SystemIntakeSystem{}
	}

	for _, system := range systems {
		key := system.SystemIntakeID.String()
		store[key] = append(store[key], system)
	}

	return store, nil
}

func (s *Store) SystemIntakeSystemsBySystemIntakeIDLOADER2(ctx context.Context, systemIntakeIDs []uuid.UUID) ([][]*models.SystemIntakeSystem, []error) {
	rows, err := s.db.QueryContext(ctx, sqlqueries.SystemIntakeSystemForm.SelectBySystemIntakeIDLOADER2, pq.Array(systemIntakeIDs))
	if err != nil {
		return nil, []error{err}
	}
	defer rows.Close()

	var (
		systemIntakeSystems []*models.SystemIntakeSystem
		errs                []error
	)

	for rows.Next() {
		var systemIntakeSystem models.SystemIntakeSystem
		if err := rows.Scan(
			&systemIntakeSystem.ID,
			&systemIntakeSystem.SystemIntakeID,
			&systemIntakeSystem.SystemID,
			&systemIntakeSystem.CreatedBy,
			&systemIntakeSystem.CreatedAt,
			&systemIntakeSystem.ModifiedBy,
			&systemIntakeSystem.ModifiedAt,
		); err != nil {
			errs = append(errs, err)
			continue
		}

		systemIntakeSystems = append(systemIntakeSystems, &systemIntakeSystem)
	}

	systemMap := map[uuid.UUID][]*models.SystemIntakeSystem{}

	// populate map
	for _, id := range systemIntakeIDs {
		systemMap[id] = []*models.SystemIntakeSystem{}
	}

	for _, systemIntakeSystem := range systemIntakeSystems {
		systemMap[systemIntakeSystem.SystemIntakeID] = append(systemMap[systemIntakeSystem.SystemIntakeID], systemIntakeSystem)
	}

	var out [][]*models.SystemIntakeSystem
	for _, id := range systemIntakeIDs {
		out = append(out, systemMap[id])
	}

	return out, errs
}

func (s *Store) SystemIntakesByCedarSystemID(ctx context.Context, cedarSystemID string) ([]*models.SystemIntake, error) {
	var systemIntakes []*models.SystemIntake
	return systemIntakes, s.db.Select(&systemIntakes, sqlqueries.SystemIntakeSystemForm.SelectByCedarSystemID, cedarSystemID)
}
