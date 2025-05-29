package storage

import (
	"context"

	"github.com/google/uuid"

	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// CreateSystemIntakeRelationship creates a new system intake Relationship object in the database
func (s *Store) CreateSystemIntakeRelationship(ctx context.Context, systemIntakeRelationship *models.SystemIntakeRelationship) (*models.SystemIntakeRelationship, error) {
	now := s.clock.Now().UTC()
	if systemIntakeRelationship.CreatedAt == nil {
		systemIntakeRelationship.CreatedAt = &now
	}
	if systemIntakeRelationship.UpdatedAt == nil {
		systemIntakeRelationship.UpdatedAt = &now
	}

	systemIntakeRelationship.ID = uuid.New()
	const createSystemIntakeRelationshipSQL = `
		INSERT INTO system_relationships (
			id,
			system_id,
			system_relationship_type,
			other_type_description
		) VALUES (
		 	:id,
			:system_id,
			:system_relationship_type,
			:other_type_description
		)`
	_, err := s.db.NamedExec(
		createSystemIntakeRelationshipSQL,
		systemIntakeRelationship,
	)
	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to create system intake relationship with error %s", zap.Error(err))
		return nil, err
	}
	return systemIntakeRelationship, nil
}

// // UpdateSystemIntakeRelationship updates a system intake Relationship object in the database
// func (s *Store) UpdateSystemIntakeRelationship(ctx context.Context, systemIntakeRelationship *models.SystemIntakeRelationship) (*models.SystemIntakeRelationship, error) {
// 	updatedAt := s.clock.Now().UTC()
// 	systemIntakeRelationship.UpdatedAt = &updatedAt
// 	const createSystemIntakeRelationshipSQL = `
// 		UPDATE system_intake_Relationships
// 		SET
// 			eua_user_id = :eua_user_id,
// 			system_intake_id = :system_intake_id,
// 			role = :role,
// 			component = :component,
// 			updated_at = :updated_at
// 		WHERE system_intake_Relationships.id = :id
// 	`
// 	_, err := s.db.NamedExec(
// 		createSystemIntakeRelationshipSQL,
// 		systemIntakeRelationship,
// 	)
// 	if err != nil {
// 		appcontext.ZLogger(ctx).Error("Failed to create system intake Relationship with error %s", zap.Error(err))
// 		return nil, err
// 	}
// 	return systemIntakeRelationship, nil
// }

// // FetchSystemIntakeRelationshipsBySystemIntakeID queries the DB for all the system intake Relationships matching the given system intake ID
// func (s *Store) FetchSystemIntakeRelationshipsBySystemIntakeID(ctx context.Context, systemIntakeID uuid.UUID) ([]*models.SystemIntakeRelationship, error) {
// 	results := []*models.SystemIntakeRelationship{}

// 	err := s.db.Select(&results, `SELECT * FROM system_intake_Relationships WHERE system_intake_id=$1`, systemIntakeID)

// 	if err != nil && !errors.Is(err, sql.ErrNoRows) {
// 		appcontext.ZLogger(ctx).Error("Failed to fetch system intake Relationships", zap.Error(err), zap.String("id", systemIntakeID.String()))
// 		return nil, &apperrors.QueryError{
// 			Err:       err,
// 			Model:     models.SystemIntakeRelationship{},
// 			Operation: apperrors.QueryFetch,
// 		}
// 	}
// 	return results, nil
// }

// // DeleteSystemIntakeRelationship deletes an existing system intake Relationship object in the database
// func (s *Store) DeleteSystemIntakeRelationship(ctx context.Context, systemIntakeRelationship *models.SystemIntakeRelationship) (*models.SystemIntakeRelationship, error) {
// 	const deleteSystemIntakeRelationshipSQL = `
// 		DELETE FROM system_intake_Relationships
// 		WHERE id = $1;`

// 	_, err := s.db.Exec(deleteSystemIntakeRelationshipSQL, systemIntakeRelationship.ID)

// 	if err != nil {
// 		appcontext.ZLogger(ctx).Error("Failed to delete system intake Relationship with error %s", zap.Error(err))
// 		return nil, err
// 	}

// 	return systemIntakeRelationship, nil
// }
