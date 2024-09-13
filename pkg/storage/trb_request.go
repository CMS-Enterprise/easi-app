package storage

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlqueries"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"

	_ "embed"
)

// CreateTRBRequest creates a new TRBRequest record
// Note this will be refactored to not use the store, but is left now for organization
func (s *Store) CreateTRBRequest(ctx context.Context, np sqlutils.NamedPreparer, trb *models.TRBRequest) (*models.TRBRequest, error) {
	if trb.ID == uuid.Nil {
		trb.ID = uuid.New()
	}

	stmt, err := np.PrepareNamed(sqlqueries.TRBRequest.Create)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to create trb request with error %s", err),
			zap.String("user", trb.CreatedBy),
		)
		return nil, err
	}
	defer stmt.Close()
	retTRB := models.TRBRequest{}

	err = stmt.Get(&retTRB, trb)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to create trb request with error %s", err),
			zap.String("user", trb.CreatedBy),
		)
		return nil, err
	}

	return &retTRB, nil
}

// GetTRBRequestByID takes in a NamedPreparer (db, tx) and returns an TRBRequest from the db  for a given id
func (s *Store) GetTRBRequestByID(ctx context.Context, id uuid.UUID) (*models.TRBRequest, error) {
	return sqlutils.WithTransactionRet[*models.TRBRequest](ctx, s, func(tx *sqlx.Tx) (*models.TRBRequest, error) {
		return s.GetTRBRequestByIDNP(ctx, tx, id)
	})
}

// GetTRBRequestByIDNP returns an TRBRequest from the db  for a given id
func (s *Store) GetTRBRequestByIDNP(ctx context.Context, np sqlutils.NamedPreparer, id uuid.UUID) (*models.TRBRequest, error) {

	trb := models.TRBRequest{}
	stmt, err := np.PrepareNamed(sqlqueries.TRBRequest.GetByID)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch TRB request",
			zap.Error(err),
			zap.String("id", id.String()),
		)
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{"id": id}
	err = stmt.Get(&trb, arg)

	if err != nil {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch TRB request",
			zap.Error(err),
			zap.String("id", id.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     trb,
			Operation: apperrors.QueryFetch,
		}
	}
	return &trb, err
}

// UpdateTRBRequest returns an TRBRequest from the db for a given id
func (s *Store) UpdateTRBRequest(ctx context.Context, trbRequest *models.TRBRequest) (*models.TRBRequest, error) {
	return sqlutils.WithTransactionRet[*models.TRBRequest](ctx, s, func(tx *sqlx.Tx) (*models.TRBRequest, error) {
		return s.UpdateTRBRequestNP(ctx, tx, trbRequest)
	})
}

// UpdateTRBRequestNP takes in a NamedPreparer (db, tx) and returns an TRBRequest from the db for a given id
func (s *Store) UpdateTRBRequestNP(ctx context.Context, np sqlutils.NamedPreparer, trb *models.TRBRequest) (*models.TRBRequest, error) {
	stmt, err := np.PrepareNamed(sqlqueries.TRBRequest.Update)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to update TRB request %s", err),
			zap.String("id", trb.ID.String()),
		)
		return nil, err
	}
	defer stmt.Close()

	retTRB := models.TRBRequest{}

	err = stmt.Get(&retTRB, trb)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to update TRB request %s", err),
			zap.String("id", trb.ID.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     trb,
			Operation: apperrors.QueryUpdate,
		}
	}

	return &retTRB, err
}

// GetTRBRequests returns the collection of TRB requests
func (s *Store) GetTRBRequests(ctx context.Context, archived bool) ([]*models.TRBRequest, error) {
	trbRequests := []*models.TRBRequest{}

	stmt, err := s.DB.PrepareNamed(sqlqueries.TRBRequest.CollectionGet)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch trb requests",
			zap.Error(err),
		)
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"archived": archived,
	}
	err = stmt.Select(&trbRequests, arg)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch trb requests",
			zap.Error(err),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.TRBRequest{},
			Operation: apperrors.QueryFetch,
		}
	}
	return trbRequests, err
}

// GetMyTRBRequests returns the collection of TRB requests that belong to the user in the context
func (s *Store) GetMyTRBRequests(ctx context.Context, archived bool) ([]*models.TRBRequest, error) {
	trbRequests := []*models.TRBRequest{}

	stmt, err := s.DB.PrepareNamed(sqlqueries.TRBRequest.CollectionGetByUserAndArchivedState)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch user's trb requests",
			zap.Error(err),
		)
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"archived":   archived,
		"created_by": appcontext.Principal(ctx).ID(),
	}
	err = stmt.Select(&trbRequests, arg)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch user's trb requests",
			zap.Error(err),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.TRBRequest{},
			Operation: apperrors.QueryFetch,
		}
	}
	return trbRequests, err
}
