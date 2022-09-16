package storage

import (
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"

	_ "embed"
)

//go:embed SQL/trb_request_collection_get.sql
var trbRequestCollectionGetSQL string

//go:embed SQL/trb_request_create.sql
var trbRequestCreateSQL string

//go:embed SQL/trb_request_get_by_id.sql
var trbRequestGetByIDSQL string

//go:embed SQL/trb_request_update.sql
var trbRequestUpdateSQL string

// CreateTRBRequest creates a new TRBRequest record
func (s *Store) CreateTRBRequest(logger *zap.Logger, trb *models.TRBRequest) (*models.TRBRequest, error) {

	if trb.ID == uuid.Nil {
		trb.ID = uuid.New()
	}

	stmt, err := s.db.PrepareNamed(trbRequestCreateSQL)
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

	// This could be more efficient by using a join with one single query, and writing logic to
	// parse out the rows and populate the slice of attendees, but this is a lot simpler
	attendees, err := s.GetTRBRequestAttendeesByTRBRequestID(logger, id)

	if err != nil {
		logger.Error(
			"Failed to fetch TRB request attendees",
			zap.Error(err),
			zap.String("id", id.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     trb,
			Operation: apperrors.QueryFetch,
		}
	}

	trb.Attendees = attendees
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
