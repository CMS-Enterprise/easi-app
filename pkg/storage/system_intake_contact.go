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
	"github.com/cms-enterprise/easi-app/pkg/sqlqueries"
)

// GetSystemIntakeContactByID returns a system intake contact by it's ID
func (s *Store) GetSystemIntakeContactByID(ctx context.Context, id uuid.UUID) (*models.SystemIntakeContact, error) {
	//TODO this is just a placeholder, refactor and put SQL in it's own package etc. Ideally, make this a data loader
	var contact models.SystemIntakeContact
	err := s.db.Get(&contact, sqlqueries.SystemIntakeContact.GetByID, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &apperrors.QueryError{
				Err:       err,
				Model:     models.SystemIntakeContact{},
				Operation: apperrors.QueryFetch,
			}
		}
		appcontext.ZLogger(ctx).Error("Failed to fetch system intake contact", zap.Error(err), zap.String("id", id.String()))
		return nil, err
	}
	return &contact, nil
}

// CreateSystemIntakeContact creates a new system intake contact object in the database
func (s *Store) CreateSystemIntakeContact(ctx context.Context, systemIntakeContact *models.SystemIntakeContact) (*models.SystemIntakeContact, error) {
	// TODO: this should be re-worked to match base struct paradigms for

	// now := s.clock.Now().UTC()
	// if systemIntakeContact.CreatedAt == nil {
	// 	systemIntakeContact.CreatedAt = &now
	// }
	// if systemIntakeContact.ModifiedAt == nil {
	// 	systemIntakeContact.ModifiedAt = &now
	// }
	retContact := &models.SystemIntakeContact{}

	systemIntakeContact.ID = uuid.New()
	// _, err := s.db.NamedExec(
	// 	sqlqueries.SystemIntakeContact.Create,
	// 	systemIntakeContact,
	// )
	err := namedGet(ctx, s, retContact, sqlqueries.SystemIntakeContact.Create, systemIntakeContact)
	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to create system intake contact with error %s", zap.Error(err))
		return nil, err
	}
	return systemIntakeContact, nil
}

// UpdateSystemIntakeContact updates a system intake contact object in the database
func (s *Store) UpdateSystemIntakeContact(ctx context.Context, systemIntakeContact *models.SystemIntakeContact) (*models.SystemIntakeContact, error) {
	// TODO: this should be re-worked to match base struct paradigms
	modifiedAt := s.clock.Now().UTC()
	systemIntakeContact.ModifiedAt = &modifiedAt

	_, err := s.db.NamedExec(
		sqlqueries.SystemIntakeContact.Update,
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

	err := s.db.Select(&results, sqlqueries.SystemIntakeContact.GetBySystemIntakeID, systemIntakeID)

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
func (s *Store) DeleteSystemIntakeContact(ctx context.Context, id uuid.UUID) (*models.SystemIntakeContact, error) {
	deletedContact := &models.SystemIntakeContact{}
	err := namedGet(ctx, s, deletedContact, sqlqueries.SystemIntakeContact.Delete, args{
		"id": id,
	})
	if err != nil {
		return nil, err
	}
	return deletedContact, nil
}
