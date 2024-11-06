package storage

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlqueries"
)

// GetTRBRequestDocumentsByRequestID queries the DB for all documents attached to the TRB request with the given ID
// It will NOT return any items that have been soft-deleted (deleted_at NOT NULL)
func (s *Store) GetTRBRequestDocumentsByRequestID(ctx context.Context, trbRequestID uuid.UUID) ([]*models.TRBRequestDocument, error) {
	documents := []*models.TRBRequestDocument{}

	err := namedSelect(ctx, s.db, &documents, sqlqueries.TRBRequestDocuments.GetByTRBID, args{
		"trb_request_id": trbRequestID,
	})

	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to fetch TRB request documents for request ID %s", trbRequestID.String()),
			zap.Error(err),
			zap.String("trbRequestID", trbRequestID.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.TRBRequestDocument{},
			Operation: apperrors.QueryFetch,
		}
	}

	return documents, nil
}

// GetTRBRequestDocumentsByRequestIDs queries the DB for all documents attached to a list of TRB requests
// It will NOT return any items that have been soft-deleted (deleted_at NOT NULL)
func (s *Store) GetTRBRequestDocumentsByRequestIDs(ctx context.Context, trbRequestIDs []uuid.UUID) ([]*models.TRBRequestDocument, error) {
	documents := []*models.TRBRequestDocument{}

	err := namedSelect(ctx, s.db, &documents, sqlqueries.TRBRequestDocuments.GetByTRBIDs, args{
		"trb_request_ids": pq.Array(trbRequestIDs),
	})

	if err != nil {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch TRB request documents by request IDs",
			zap.Error(err),
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
func (s *Store) CreateTRBRequestDocument(ctx context.Context, document *models.TRBRequestDocument) (*models.TRBRequestDocument, error) {
	const trbRequestDocumentCreateSQL = `
		INSERT INTO trb_request_documents (
			id,
			trb_request_id,
			file_name,
			document_type,
			other_type,
			bucket,
			s3_key,
			created_by,
			modified_by,
			deleted_at
		) VALUES (
			:id,
			:trb_request_id,
			:file_name,
			:document_type,
			:other_type,
			:bucket,
			:s3_key,
			:created_by,
			:modified_by,
			NULL
		) RETURNING
			id,
			trb_request_id,
			file_name,
			document_type,
			other_type,
			bucket,
			s3_key,
			created_by,
			created_at,
			modified_by,
			modified_at,
			deleted_at
	`

	if document.ID == uuid.Nil {
		document.ID = uuid.New()
	}

	stmt, err := s.db.PrepareNamed(trbRequestDocumentCreateSQL)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to create trb request document with error %s", err),
			zap.Error(err),
			zap.String("user", document.CreatedBy),
		)
		return nil, err
	}
	defer stmt.Close()

	retDoc := models.TRBRequestDocument{}
	err = stmt.Get(&retDoc, document)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
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

// DeleteTRBRequestDocument sets the deleted_at property on an existing TRBRequestDocument, given its ID
func (s *Store) DeleteTRBRequestDocument(ctx context.Context, id uuid.UUID) (*models.TRBRequestDocument, error) {
	const trbRequestDocumentDeleteSQL = `
		UPDATE trb_request_documents SET deleted_at = CURRENT_TIMESTAMP
		WHERE id = :id
		RETURNING
			id,
			trb_request_id,
			file_name,
			document_type,
			other_type,
			bucket,
			s3_key,
			created_by,
			created_at,
			modified_by,
			modified_at,
			deleted_at
	`

	stmt, err := s.db.PrepareNamed(trbRequestDocumentDeleteSQL)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to delete trb request document with ID %s due to error %s", id, err),
			zap.Error(err),
			zap.String("id", id.String()),
		)
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"id": id,
	}

	retDoc := models.TRBRequestDocument{}
	err = stmt.Get(&retDoc, arg)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
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
