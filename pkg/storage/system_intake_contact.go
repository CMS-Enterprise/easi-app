package storage

import (
	"context"
	"database/sql"
	"errors"

	"github.com/google/uuid"
	"github.com/lib/pq"

	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlqueries"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
)

// SystemIntakeContactGetByIDsLoader returns system intake contacts by their IDs
func SystemIntakeContactGetByIDsLoader(ctx context.Context, np sqlutils.NamedPreparer, _ *zap.Logger, systemIntakeContactIDs []uuid.UUID) ([]*models.SystemIntakeContact, error) {
	var contacts []*models.SystemIntakeContact

	err := namedSelect(ctx, np, &contacts, sqlqueries.SystemIntakeContact.GetByIDsLoader, args{
		"ids": pq.Array(systemIntakeContactIDs),
	})
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &apperrors.QueryError{
				Err:       err,
				Model:     models.SystemIntakeContact{},
				Operation: apperrors.QueryFetch,
			}
		}
		appcontext.ZLogger(ctx).Error("Failed to fetch system intake contacts by ids", zap.Error(err), zap.Any("ids", systemIntakeContactIDs))
		return nil, err
	}
	return contacts, nil
}

// CreateSystemIntakeContact creates a new system intake contact object in the database
func CreateSystemIntakeContact(ctx context.Context, np sqlutils.NamedPreparer, systemIntakeContact *models.SystemIntakeContact) (*models.SystemIntakeContact, error) {

	retContact := &models.SystemIntakeContact{}

	systemIntakeContact.ID = uuid.New()

	err := namedGet(ctx, np, retContact, sqlqueries.SystemIntakeContact.Create, systemIntakeContact)
	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to create system intake contact with error %s", zap.Error(err))
		return nil, err
	}
	return systemIntakeContact, nil
}

// UpdateSystemIntakeContact updates a system intake contact object in the database
func UpdateSystemIntakeContact(ctx context.Context, np sqlutils.NamedPreparer, systemIntakeContact *models.SystemIntakeContact) (*models.SystemIntakeContact, error) {
	retContact := &models.SystemIntakeContact{}

	err := namedGet(ctx, np, retContact, sqlqueries.SystemIntakeContact.Update, systemIntakeContact)
	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to create system intake contact with error %s", zap.Error(err))
		return nil, err
	}
	return retContact, nil
}

// SystemIntakeContactGetBySystemIntakeIDsLoader returns system intake contacts by their foreign key, the system intake ID
func SystemIntakeContactGetBySystemIntakeIDsLoader(ctx context.Context, np sqlutils.NamedPreparer, _ *zap.Logger, systemIntakeIDs []uuid.UUID) ([]*models.SystemIntakeContact, error) {
	var contacts []*models.SystemIntakeContact

	err := namedSelect(ctx, np, &contacts, sqlqueries.SystemIntakeContact.GetBySystemIntakeIDsLoader, args{
		"system_intake_ids": pq.Array(systemIntakeIDs),
	})
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &apperrors.QueryError{
				Err:       err,
				Model:     models.SystemIntakeContact{},
				Operation: apperrors.QueryFetch,
			}
		}
		appcontext.ZLogger(ctx).Error("Failed to fetch system intake contacts by ids", zap.Error(err), zap.Any("ids", systemIntakeIDs))
		return nil, err
	}
	return contacts, nil
}

// DeleteSystemIntakeContact deletes an existing system intake contact object in the database
func DeleteSystemIntakeContact(ctx context.Context, np sqlutils.NamedPreparer, id uuid.UUID) (*models.SystemIntakeContact, error) {
	deletedContact := &models.SystemIntakeContact{}
	err := namedGet(ctx, np, deletedContact, sqlqueries.SystemIntakeContact.Delete, args{
		"id": id,
	})
	if err != nil {
		return nil, err
	}
	return deletedContact, nil
}
