package storage

import (
	"context"
	"database/sql"
	"errors"

	"github.com/google/uuid"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// CreateSystemIntakeContact creates a new system intake contact object in the database
func (s *Store) CreateSystemIntakeContact(ctx context.Context, systemIntakeContact *models.SystemIntakeContact) (*models.SystemIntakeContact, error) {
	euaUserID := appcontext.Principal(ctx).ID()
	createAt := s.clock.Now().UTC()

	systemIntakeContact.CreatedAt = &createAt
	systemIntakeContact.EUAUserID = euaUserID
	const createSystemIntakeContactSQL = `
		INSERT INTO system_intake_contacts (
			eua_user_id,
			system_intake_id,
			created_at
		)
		VALUES (
			:eua_user_id,
			:system_intake_id,
			:created_at
		) ON CONFLICT ON CONSTRAINT system_intake_contacts_pkey DO UPDATE SET created_at = :created_at`
	_, err := s.db.NamedExecContext(
		ctx,
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

	err := s.db.SelectContext(ctx, &results, `SELECT * FROM system_intake_contacts WHERE system_intake_id=$1`, systemIntakeID)

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
	euaUserID := appcontext.Principal(ctx).ID()

	const deleteSystemIntakeContactSQL = `
		DELETE FROM system_intake_contacts
		WHERE eua_user_id = $1
		AND system_intake_id = $2;`

	_, err := s.db.Exec(deleteSystemIntakeContactSQL, euaUserID, systemIntakeContact.SystemIntakeID)

	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to delete system intake contact with error %s", zap.Error(err))
		return nil, err
	}

	return systemIntakeContact, nil
}
