package storage

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// GetSystemIntakeDocumentsByRequestID queries the DB for all documents attached to the system intake with the given ID
func (s *Store) GetSystemIntakeDocumentsByRequestID(ctx context.Context, systemIntakeRequestID uuid.UUID) ([]*models.SystemIntakeDocument, error) {
	const systemIntakeDocumentsGetByRequestIDSQL = `
		SELECT id,
			system_intake_id,
			file_name,
			document_type,
			other_type,
			bucket,
			s3_key,
			created_by,
			modified_by,
			created_at,
			modified_at
		FROM system_intake_documents
		WHERE system_intake_id = :system_intake_id
	`

	documents := []*models.SystemIntakeDocument{}

	stmt, err := s.db.PrepareNamed(systemIntakeDocumentsGetByRequestIDSQL)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to fetch System Intake request documents for request ID %s", systemIntakeRequestID.String()),
			zap.Error(err),
			zap.String("systemIntakeRequestID", systemIntakeRequestID.String()),
		)
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"system_intake_id": systemIntakeRequestID,
	}

	err = stmt.Select(&documents, arg)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to fetch System Intake request documents for request ID %s", systemIntakeRequestID.String()),
			zap.Error(err),
			zap.String("systemIntakeRequestID", systemIntakeRequestID.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.SystemIntakeDocument{},
			Operation: apperrors.QueryFetch,
		}
	}

	return documents, nil
}

// CreateSystemIntakeDocument creates a record for a SystemIntakeDocument in our database, *after* it's been uploaded to S3
func (s *Store) CreateSystemIntakeDocument(ctx context.Context, document *models.SystemIntakeDocument) (*models.SystemIntakeDocument, error) {
	const systemIntakeDocumentCreateSQL = `
		INSERT INTO system_intake_documents (
			id,
			system_intake_id,
			file_name,
			document_type,
			other_type,
			bucket,
			s3_key,
			created_by,
			modified_by
		) VALUES (
			:id,
			:system_intake_id,
			:file_name,
			:document_type,
			:other_type,
			:bucket,
			:s3_key,
			:created_by,
			:modified_by
		) RETURNING
			id,
			system_intake_id,
			file_name,
			document_type,
			other_type,
			bucket,
			s3_key,
			created_by,
			created_at,
			modified_by,
			modified_at
	`

	if document.ID == uuid.Nil {
		document.ID = uuid.New()
	}

	stmt, err := s.db.PrepareNamed(systemIntakeDocumentCreateSQL)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to create system intake document with error %s", err),
			zap.Error(err),
			zap.String("user", document.CreatedBy),
		)
		return nil, err
	}
	defer stmt.Close()

	retDoc := models.SystemIntakeDocument{}
	err = stmt.Get(&retDoc, document)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to create system intake document with error %s", err),
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

// DeleteSystemIntakeDocument deletes an existing SystemIntakeDocument, given its ID
func (s *Store) DeleteSystemIntakeDocument(ctx context.Context, id uuid.UUID) (*models.SystemIntakeDocument, error) {
	const systemIntakeDocumentDeleteSQL = `
		DELETE
		FROM system_intake_documents
		WHERE id = :id
		RETURNING
			id,
			system_intake_id,
			file_name,
			document_type,
			other_type,
			bucket,
			s3_key,
			created_by,
			created_at,
			modified_by,
			modified_at
	`

	stmt, err := s.db.PrepareNamed(systemIntakeDocumentDeleteSQL)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to delete system intake document with ID %s due to error %s", id, err),
			zap.Error(err),
			zap.String("id", id.String()),
		)
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"id": id,
	}

	retDoc := models.SystemIntakeDocument{}
	err = stmt.Get(&retDoc, arg)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to delete system intake document with ID %s due to error %s", id, err),
			zap.Error(err),
			zap.String("id", id.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.SystemIntakeDocument{},
			Operation: apperrors.QueryUpdate,
		}
	}

	return &retDoc, nil
}
