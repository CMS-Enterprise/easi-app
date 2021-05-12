package storage

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// CreateAccessibilityRequestDocument stores metadata for files uploaded to S3
func (s *Store) CreateAccessibilityRequestDocument(ctx context.Context, file *models.AccessibilityRequestDocument) (*models.AccessibilityRequestDocument, error) {
	file.ID = uuid.New()
	createdAt := s.clock.Now()
	file.CreatedAt = &createdAt
	file.UpdatedAt = &createdAt
	const createAccessibilityRequestDocumentSQL = `INSERT INTO accessibility_request_documents (
                         id,
                         file_type,
                         bucket,
						 file_name,
						 file_size,
                         file_key,
						 document_type,
						 other_type,
                         created_at,
                         updated_at,
                         virus_scanned,
                         virus_clean,
						 request_id
                 )
                 VALUES (
                         :id,
                         :file_type,
                         :bucket,
						 :file_name,
						 :file_size,
                         :file_key,
                         :document_type,
                         :other_type,
                         :created_at,
                         :updated_at,
                         :virus_scanned,
                         :virus_clean,
						 :request_id
                 )`
	_, err := s.db.NamedExec(createAccessibilityRequestDocumentSQL, file)
	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to create accessibility request file", zap.Error(err))
		return nil, err
	}
	return s.FetchAccessibilityRequestDocumentByID(ctx, file.ID)
}

func assignDocumentStatus(document *models.AccessibilityRequestDocument) {
	status := "PENDING"
	if document.VirusScanned == null.BoolFrom(true) {
		if document.VirusClean == null.BoolFrom(false) {
			status = "UNAVAILABLE"
		}

		if document.VirusClean == null.BoolFrom(true) {
			status = "AVAILABLE"
		}
	}

	document.Status = models.AccessibilityRequestDocumentStatus(status)
}

// FetchAccessibilityRequestDocumentByID retrieves the metadata for a file uploaded to S3
func (s *Store) FetchAccessibilityRequestDocumentByID(ctx context.Context, id uuid.UUID) (*models.AccessibilityRequestDocument, error) {
	var document models.AccessibilityRequestDocument

	err := s.db.Get(&document, "SELECT * FROM accessibility_request_documents WHERE id=$1 AND deleted_at IS NULL", id)
	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to fetch uploaded file", zap.Error(err))

		if errors.Is(err, sql.ErrNoRows) {
			return nil, &apperrors.ResourceNotFoundError{Err: err, Resource: models.AccessibilityRequestDocument{}}
		}

		return nil, err
	}

	assignDocumentStatus(&document)

	return &document, nil
}

// FetchDocumentsByAccessibilityRequestID retrieves the info for a file with a given accessibility request id
func (s *Store) FetchDocumentsByAccessibilityRequestID(ctx context.Context, id uuid.UUID) ([]*models.AccessibilityRequestDocument, error) {
	if id == uuid.Nil {
		return nil, &apperrors.ResourceNotFoundError{Resource: models.AccessibilityRequestDocument{}}
	}

	results := []*models.AccessibilityRequestDocument{}

	// eventually, we should use the id here, but we don't have the db relationship set up yet
	err := s.db.Select(&results, "SELECT * FROM accessibility_request_documents where request_id=$1 AND deleted_at IS NULL", id)

	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to fetch uploaded file", zap.Error(err))

		if errors.Is(err, sql.ErrNoRows) {
			// not finding any associated records isn't an error
			return results, nil
		}

		return nil, err
	}

	for _, document := range results {
		assignDocumentStatus(document)
	}

	return results, nil
}

// DeleteAccessibilityRequestDocument archives a document
func (s *Store) DeleteAccessibilityRequestDocument(_ context.Context, id uuid.UUID) error {
	const archiveAccessibilityRequestDocumentSQL = `UPDATE accessibility_request_documents
SET deleted_at = $2
WHERE id = $1
`
	_, err := s.db.Exec(archiveAccessibilityRequestDocumentSQL, id, time.Now().UTC())
	return err
}
