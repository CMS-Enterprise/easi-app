package storage

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlqueries"
)

// SetSystemIntakeSystems links given System IDs to given System Intake ID
// This function opts to take a *sqlx.Tx instead of a NamedPreparer because the SQL calls inside this function are heavily intertwined, and we never want to call them outside the scope of a transaction
func (s *Store) SetSystemIntakeSystems(ctx context.Context, tx *sqlx.Tx, systemIntakeID uuid.UUID, systemIDs []string, systemRelationships []*models.SystemRelationship) error {
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

	// for i, systemID := range systemIDs {
	// 	systemIDLink := models.NewSystemIntakeSystem(userID)
	// 	systemIDLink.ID = uuid.New()
	// 	systemIDLink.ModifiedBy = &userID
	// 	systemIDLink.SystemIntakeID = systemIntakeID
	// 	systemIDLink.SystemID = systemID

	// 	setSystemIntakeSystemsLinks[i] = systemIDLink
	// }

	for i, relationship := range systemRelationships {
		systemIDLink := models.NewSystemIntakeSystem(userID)
		systemIDLink.ID = uuid.New()
		systemIDLink.ModifiedBy = &userID
		systemIDLink.SystemRelationshipType = relationship.SystemRelationshipType
		systemIDLink.OtherSystemRelationship = relationship.OtherTypeDescription

		setSystemIntakeSystemsLinks[i] = systemIDLink
	}

	if _, err := tx.NamedExec(sqlqueries.SystemIntakeSystemForm.Set, setSystemIntakeSystemsLinks); err != nil {
		appcontext.ZLogger(ctx).Error("Failed to insert linked system intake to system ids", zap.Error(err))
		return err
	}

	return nil
}

func (s *Store) SystemIntakeSystemsBySystemIntakeIDs(ctx context.Context, systemIntakeIDs []uuid.UUID) ([]*models.SystemIntakeSystem, error) {
	var systemIntakeSystems []*models.SystemIntakeSystem
	return systemIntakeSystems, namedSelect(ctx, s.db, &systemIntakeSystems, sqlqueries.SystemIntakeSystemForm.SelectBySystemIntakeIDs, args{
		"system_intake_ids": pq.Array(systemIntakeIDs),
	})
}

func (s *Store) SystemIntakesByCedarSystemIDs(ctx context.Context, requests []models.SystemIntakesByCedarSystemIDsRequest) ([]*models.SystemIntakesByCedarSystemIDsResponse, error) {
	// build lists for multiple `where` clauses
	var (
		cedarSystemIDs = make([]string, len(requests))
		states         = make([]models.SystemIntakeState, len(requests))
	)

	for i, req := range requests {
		cedarSystemIDs[i] = req.CedarSystemID
		states[i] = req.State
	}

	var systemIntakes []*models.SystemIntakesByCedarSystemIDsResponse
	return systemIntakes, namedSelect(ctx, s.db, &systemIntakes, sqlqueries.SystemIntakeSystemForm.SelectByCedarSystemIDs, args{
		"cedar_system_ids": pq.Array(cedarSystemIDs),
		"states":           pq.Array(states),
	})
}
