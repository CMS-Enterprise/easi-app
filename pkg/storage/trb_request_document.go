package storage

import (
	_ "embed"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

//go:embed SQL/trb_request_document_get_by_request_id.sql
var trbRequestDocumentsGetByRequestIDSQL string

//go:embed SQL/trb_request_document_create.sql
var trbRequestDocumentCreateSQL string

//go:embed SQL/trb_request_document_delete.sql
var trbRequestDocumentDeleteSQL string

// GetTRBRequestDocumentsByRequestID queries the DB for all documents attached to the TRB request with the given ID
func (s *Store) GetTRBRequestDocumentsByRequestID(logger *zap.Logger, requestID uuid.UUID) ([]*models.TRBRequestDocument, error) {
	documents := []*models.TRBRequestDocument{}

	stmt, err := s.db.PrepareNamed(trbRequestDocumentsGetByRequestIDSQL)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{
		"trb_request_id": requestID,
	}

	err = stmt.Select(&documents, arg)
	if err != nil {
		logger.Error(
			"Failed to fetch TRB request documents for request ID "+requestID.String(),
			zap.Error(err),
			zap.String("requestID", requestID.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.TRBRequestDocument{},
			Operation: apperrors.QueryFetch,
		}
	}

	return documents, nil
}

// CreateTRBRequestDocument creates a record for a TRBRequestDocument in our database, *after* it's been uploaded to S3
func (s *Store) CreateTRBRequestDocument(logger *zap.Logger, document *models.TRBRequestDocument) (*models.TRBRequestDocument, error) {
	if document.ID == uuid.Nil {
		document.ID = uuid.New()
	}

	stmt, err := s.db.PrepareNamed(trbRequestDocumentCreateSQL)
	if err != nil {
		return nil, err
	}

	retDoc := models.TRBRequestDocument{}
	err = stmt.Get(&retDoc, document)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to create trb request document with error %s", err),
			zap.Error(err),
			zap.String("user", document.CreatedBy),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     document,
			Operation: apperrors.QueryPost,
		}
	}

	return &retDoc, nil
}

// DeleteTRBRequestDocument deletes an existing TRBRequestDocument, given its ID
func (s *Store) DeleteTRBRequestDocument(logger *zap.Logger, id uuid.UUID) (*models.TRBRequestDocument, error) {
	stmt, err := s.db.PrepareNamed(trbRequestDocumentDeleteSQL)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{
		"id": id,
	}

	retDoc := models.TRBRequestDocument{}
	err = stmt.Get(&retDoc, arg)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to delete trb request document with ID %s due to error %s", id, err),
			zap.Error(err),
			zap.String("id", id.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.TRBRequestDocument{},
			Operation: apperrors.QueryUpdate,
		}
	}

	return &retDoc, nil
}
