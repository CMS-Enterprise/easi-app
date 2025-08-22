package storage

import (
	"context"
	"database/sql"
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
func (s *Store) SetSystemIntakeSystems(ctx context.Context, tx *sqlx.Tx, systemIntakeID uuid.UUID, systemRelationships []*models.SystemRelationshipInput) error {
	if systemIntakeID == uuid.Nil {
		return errors.New("unexpected nil system intake ID when linking system intake to system id")
	}

	_, err := tx.NamedExec(sqlqueries.SystemIntakeSystemForm.Delete, map[string]interface{}{
		"system_intake_id": systemIntakeID,
	})
	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to delete system ids linked to system intake", zap.Error(err))
		return err
	}

	// no need to run insert if we are not inserting new system ids
	if len(systemRelationships) < 1 {
		return nil
	}

	userID := appcontext.Principal(ctx).Account().ID

	setSystemIntakeSystemsLinks := make([]models.SystemIntakeSystem, len(systemRelationships))

	for i, relationship := range systemRelationships {
		systemIDLink := models.NewSystemIntakeSystem(userID)
		systemIDLink.SystemID = *relationship.CedarSystemID
		systemIDLink.ID = uuid.New()
		systemIDLink.SystemIntakeID = systemIntakeID
		systemIDLink.ModifiedBy = &userID
		systemIDLink.SystemRelationshipType = relationship.SystemRelationshipType
		systemIDLink.OtherSystemRelationshipDescription = relationship.OtherSystemRelationshipDescription

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

func (s *Store) AddSystemIntakeSystem(ctx context.Context, input models.SystemIntakeSystem) (models.SystemIntakeSystem, error) {
	var newSystemIntakeSystem models.SystemIntakeSystem

	newSystemIntakeSystem.ID = uuid.New()
	newSystemIntakeSystem.SystemIntakeID = input.SystemIntakeID
	newSystemIntakeSystem.SystemID = input.SystemID
	newSystemIntakeSystem.SystemRelationshipType = input.SystemRelationshipType
	newSystemIntakeSystem.OtherSystemRelationshipDescription = input.OtherSystemRelationshipDescription

	return newSystemIntakeSystem, namedGet(ctx, s.db, &newSystemIntakeSystem, sqlqueries.SystemIntakeSystemForm.Insert, newSystemIntakeSystem)
}

func (s *Store) DeleteSystemIntakeSystemByID(ctx context.Context, systemIntakeSystemID uuid.UUID) (models.SystemIntakeSystem, error) {
	var deletedSystem models.SystemIntakeSystem
	return deletedSystem, namedGet(ctx, s.db, &deletedSystem, sqlqueries.SystemIntakeSystemForm.DeleteByID, args{
		"system_intake_system_id": systemIntakeSystemID,
	})
}

func (s *Store) UpdateSystemIntakeSystemByID(ctx context.Context, input models.UpdateSystemLinkInput) (models.SystemIntakeSystem, error) {
	var linkedSystemToUpdate models.SystemIntakeSystem

	linkedSystemToUpdate.ID = input.ID
	linkedSystemToUpdate.SystemIntakeID = input.SystemIntakeID
	linkedSystemToUpdate.SystemID = input.SystemID
	linkedSystemToUpdate.SystemRelationshipType = input.SystemRelationshipType
	linkedSystemToUpdate.OtherSystemRelationshipDescription = input.OtherSystemRelationshipDescription

	return linkedSystemToUpdate, namedGet(ctx, s.db, &linkedSystemToUpdate, sqlqueries.SystemIntakeSystemForm.UpdateByID, linkedSystemToUpdate)
}

func (s *Store) GetLinkedSystemByID(ctx context.Context, systemIntakeSystemID uuid.UUID) (*models.SystemIntakeSystem, error) {
	var systemIntakeSystem models.SystemIntakeSystem

	err := namedGet(ctx, s.db, &systemIntakeSystem, sqlqueries.SystemIntakeSystemForm.GetByID, args{
		"id": systemIntakeSystemID,
	})

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil // Treat "not found" as a nil result, no error
		}
		return nil, err
	}

	return &systemIntakeSystem, nil
}
