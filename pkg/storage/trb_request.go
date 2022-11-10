package storage

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"

	_ "embed"
)

//go:embed SQL/trb_request_collection_get.sql
var trbRequestCollectionGetSQL string

//go:embed SQL/trb_request_create.sql
var trbRequestCreateSQL string

//go:embed SQL/trb_request_form_create.sql
var trbRequestFormCreateSQL string

//go:embed SQL/trb_request_consult_session_create.sql
var trbRequestConsultSessionCreateSQL string

//go:embed SQL/trb_request_get_by_id.sql
var trbRequestGetByIDSQL string

//go:embed SQL/trb_request_update.sql
var trbRequestUpdateSQL string

// CreateTRBRequest creates a new TRBRequest record
func (s *Store) CreateTRBRequest(logger *zap.Logger, trb *models.TRBRequest) (*models.TRBRequest, error) {
	tx := s.db.MustBegin()
	defer tx.Rollback()

	if trb.ID == uuid.Nil {
		trb.ID = uuid.New()
	}

	stmt, err := tx.PrepareNamed(trbRequestCreateSQL)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to trb request with error %s", err),
			zap.String("user", trb.CreatedBy),
		)
		return nil, err
	}
	retTRB := models.TRBRequest{}

	err = stmt.Get(&retTRB, trb)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to create trb request with error %s", err),
			zap.String("user", trb.CreatedBy),
		)
		return nil, err
	}

	form := models.TRBRequestForm{
		TRBRequestID: retTRB.ID,
		Status:       models.TRBFormStatusReadyToStart,
		CollabGroups: pq.StringArray{},
	}
	form.ID = uuid.New()
	form.CreatedBy = retTRB.CreatedBy

	stmt, err = tx.PrepareNamed(trbRequestFormCreateSQL)

	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to update TRB create form %s", err),
			zap.String("id", form.ID.String()),
		)
		return nil, err
	}

	createdForm := models.TRBRequestForm{}
	err = stmt.Get(&createdForm, form)

	if err != nil {
		logger.Error("Failed to create TRB request form with error %s", zap.Error(err))
		return nil, err
	}

	consultSession := models.TRBRequestConsultSession{
		TRBRequestID: retTRB.ID,
	}
	consultSession.ID = uuid.New()
	consultSession.CreatedBy = retTRB.CreatedBy

	stmt, err = tx.PrepareNamed(trbRequestConsultSessionCreateSQL)

	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to update TRB create consult session %s", err),
			zap.String("id", consultSession.ID.String()),
		)
		return nil, err
	}

	createdSession := models.TRBRequestConsultSession{}
	err = stmt.Get(&createdSession, consultSession)

	if err != nil {
		logger.Error("Failed to create TRB request consult session with error %s", zap.Error(err))
		return nil, err
	}

	err = tx.Commit()

	if err != nil {
		logger.Error("Failed to create TRB request with error %s", zap.Error(err))
		return nil, err
	}

	return &retTRB, nil
}

// GetTRBRequestByID returns an TRBRequest from the db  for a given id
func (s *Store) GetTRBRequestByID(logger *zap.Logger, id uuid.UUID) (*models.TRBRequest, error) {

	trb := models.TRBRequest{}
	stmt, err := s.db.PrepareNamed(trbRequestGetByIDSQL)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{"id": id}
	err = stmt.Get(&trb, arg)

	if err != nil {
		logger.Error(
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
func (s *Store) UpdateTRBRequest(logger *zap.Logger, trb *models.TRBRequest) (*models.TRBRequest, error) {
	stmt, err := s.db.PrepareNamed(trbRequestUpdateSQL)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to update TRB request %s", err),
			zap.String("id", trb.ID.String()),
		)
		return nil, err
	}
	retTRB := models.TRBRequest{}

	err = stmt.Get(&retTRB, trb)
	if err != nil {
		logger.Error(
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

// GetTRBRequests returns the collection of models
func (s *Store) GetTRBRequests(logger *zap.Logger, archived bool) ([]*models.TRBRequest, error) {
	trbRequests := []*models.TRBRequest{}

	stmt, err := s.db.PrepareNamed(trbRequestCollectionGetSQL)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{
		"archived": archived,
	}
	err = stmt.Select(&trbRequests, arg)
	if err != nil {
		logger.Error(
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
