package storage

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/authentication"
	"github.com/cmsgov/easi-app/pkg/models"

	_ "embed"
)

//go:embed SQL/trb_request_collection_get.sql
var trbRequestCollectionGetSQL string

//go:embed SQL/trb_request_collection_get_my.sql
var trbRequestCollectionGetMySQL string

//go:embed SQL/trb_request_create.sql
var trbRequestCreateSQL string

//go:embed SQL/trb_request_form_create.sql
var trbRequestFormCreateSQL string

//go:embed SQL/trb_request_get_by_id.sql
var trbRequestGetByIDSQL string

//go:embed SQL/trb_request_update.sql
var trbRequestUpdateSQL string

// CreateTRBRequest creates a new TRBRequest record
func (s *Store) CreateTRBRequest(ctx context.Context, princ authentication.Principal, trb *models.TRBRequest) (*models.TRBRequest, error) {
	tx := s.db.MustBegin()
	defer tx.Rollback()

	if trb.ID == uuid.Nil {
		trb.ID = uuid.New()
	}
	//TODO: this logic should probably be moved up one more level. For now, we use the passed principal to set the created by fields.
	trb.CreatedBy = princ.Account().ID

	stmt, err := tx.PrepareNamed(trbRequestCreateSQL)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to create trb request with error %s", err),
			zap.Any("userID", trb.CreatedBy),
		)
		return nil, err
	}
	retTRB := models.TRBRequest{}

	err = stmt.Get(&retTRB, trb)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to create trb request with error %s", err),
			zap.Any("userID", trb.CreatedBy),
		)
		return nil, err
	}

	form := models.TRBRequestForm{
		TRBRequestID: retTRB.ID,
		Status:       models.TRBFormStatusReadyToStart,
		CollabGroups: pq.StringArray{},
	}
	form.ID = uuid.New()
	form.CreatedBy = princ.ID() //TODO: when the request form is migrated to use user accounts, this can be simplified to use the retTRB.CreatedBy field

	stmt, err = tx.PrepareNamed(trbRequestFormCreateSQL)

	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to update TRB create form %s", err),
			zap.String("id", form.ID.String()),
		)
		return nil, err
	}

	created := models.TRBRequestForm{}
	err = stmt.Get(&created, form)

	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to create TRB request form with error %s", zap.Error(err))
		return nil, err
	}

	err = tx.Commit()

	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to create TRB request with error %s", zap.Error(err))
		return nil, err
	}

	return &retTRB, nil
}

// GetTRBRequestByID returns an TRBRequest from the db  for a given id
func (s *Store) GetTRBRequestByID(ctx context.Context, id uuid.UUID) (*models.TRBRequest, error) {

	trb := models.TRBRequest{}
	stmt, err := s.db.PrepareNamed(trbRequestGetByIDSQL)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch TRB request",
			zap.Error(err),
			zap.String("id", id.String()),
		)
		return nil, err
	}
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
func (s *Store) UpdateTRBRequest(ctx context.Context, trb *models.TRBRequest) (*models.TRBRequest, error) {
	stmt, err := s.db.PrepareNamed(trbRequestUpdateSQL)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to update TRB request %s", err),
			zap.String("id", trb.ID.String()),
		)
		return nil, err
	}
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

	stmt, err := s.db.PrepareNamed(trbRequestCollectionGetSQL)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch trb requests",
			zap.Error(err),
		)
		return nil, err
	}
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

	stmt, err := s.db.PrepareNamed(trbRequestCollectionGetMySQL)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch user's trb requests",
			zap.Error(err),
		)
		return nil, err
	}
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
