package storage

import (
	"context"
	"database/sql"
	"errors"

	"github.com/google/uuid"

	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// CreateSystemIntakeContact creates a new system intake contact object in the database
func (s *Store) CreateSystemIntakeContact(ctx context.Context, systemIntakeContact *models.SystemIntakeContact) (*models.SystemIntakeContact, error) {
	now := s.clock.Now().UTC()
	if systemIntakeContact.CreatedAt == nil {
		systemIntakeContact.CreatedAt = &now
	}
	if systemIntakeContact.UpdatedAt == nil {
		systemIntakeContact.UpdatedAt = &now
	}

	systemIntakeContact.ID = uuid.New()
	const createSystemIntakeContactSQL = `
		INSERT INTO system_intake_contacts (
			id,
			eua_user_id,
			system_intake_id,
			role,
			component,
			user_id,
			created_at,
			updated_at
		)
		VALUES (
			:id,
			:eua_user_id,
			:system_intake_id,
			:role,
			:component,
		    :user_id,
			:created_at,
			:updated_at
		)`
	_, err := s.db.NamedExec(
		createSystemIntakeContactSQL,
		systemIntakeContact,
	)
	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to create system intake contact with error %s", zap.Error(err))
		return nil, err
	}
	return systemIntakeContact, nil
}

// UpdateSystemIntakeContact updates a system intake contact object in the database
func (s *Store) UpdateSystemIntakeContact(ctx context.Context, systemIntakeContact *models.SystemIntakeContact) (*models.SystemIntakeContact, error) {
	updatedAt := s.clock.Now().UTC()
	systemIntakeContact.UpdatedAt = &updatedAt
	const createSystemIntakeContactSQL = `
		UPDATE system_intake_contacts
		SET
			eua_user_id = :eua_user_id,
			system_intake_id = :system_intake_id,
			role = :role,
			component = :component,
			user_id = :user_id,
			updated_at = :updated_at
		WHERE system_intake_contacts.id = :id
	`
	_, err := s.db.NamedExec(
		createSystemIntakeContactSQL,
		systemIntakeContact,
	)
	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to create system intake contact with error %s", zap.Error(err))
		return nil, err
	}
	return systemIntakeContact, nil
}

// FetchSystemIntakeContactsBySystemIntakeID queries the DB for all the system intake contacts matching the given system intake ID
func (s *Store) FetchSystemIntakeContactsBySystemIntakeID(ctx context.Context, systemIntakeID uuid.UUID) ([]*models.SystemIntakeContact, error) {
	results := []*models.SystemIntakeContact{}

	const selectSystemIntakeContactSQL = `
		SELECT
			id,
			eua_user_id,
			system_intake_id,
			role,
			component,
			created_at,
			updated_at,
			user_id
		FROM system_intake_contacts
		WHERE system_intake_id=$1 AND eua_user_id IS NOT NULL
	`
	err := s.db.Select(&results, selectSystemIntakeContactSQL, systemIntakeID)

	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		appcontext.ZLogger(ctx).Error("Failed to fetch system intake contacts", zap.Error(err), zap.String("id", systemIntakeID.String()))
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.SystemIntakeContact{},
			Operation: apperrors.QueryFetch,
		}
	}
	return results, nil
}

// DeleteSystemIntakeContact deletes an existing system intake contact object in the database
func (s *Store) DeleteSystemIntakeContact(ctx context.Context, systemIntakeContact *models.SystemIntakeContact) (*models.SystemIntakeContact, error) {
	const deleteSystemIntakeContactSQL = `
		DELETE FROM system_intake_contacts
		WHERE id = $1;`

	_, err := s.db.Exec(deleteSystemIntakeContactSQL, systemIntakeContact.ID)

	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to delete system intake contact with error %s", zap.Error(err))
		return nil, err
	}

	return systemIntakeContact, nil
}
