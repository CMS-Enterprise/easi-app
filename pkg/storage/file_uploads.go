package storage

import (
	"context"
	"database/sql"
	"errors"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// CreateUploadedFile stores metadata for files uploaded to S3
func (s *Store) CreateUploadedFile(ctx context.Context, file *models.UploadedFile) (*models.UploadedFile, error) {
	file.ID = uuid.New()
	createAt := s.clock.Now()
	file.CreatedAt = &createAt
	file.UpdatedAt = &createAt
	const createUploadedFileSQL = `INSERT INTO accessibility_request_files (
                         id,
                         file_type,
                         bucket,
                         file_key,
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
                         :file_key,
                         :created_at,
                         :updated_at,
                         :virus_scanned,
                         :virus_clean,
						 :request_id
                 )`
	_, err := s.db.NamedExec(createUploadedFileSQL, file)
	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to create file upload", zap.Error(err))
		return nil, err
	}
	return s.FetchUploadedFileByID(ctx, file.ID)
}

// FetchUploadedFileByID retrieves the metadata for a file uploaded to S3
func (s *Store) FetchUploadedFileByID(ctx context.Context, id uuid.UUID) (*models.UploadedFile, error) {
	var file models.UploadedFile

	err := s.db.Get(&file, "SELECT * FROM accessibility_request_files WHERE id=$1", id)
	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to fetch uploaded file", zap.Error(err))

		if errors.Is(err, sql.ErrNoRows) {
			return nil, &apperrors.ResourceNotFoundError{Err: err, Resource: models.UploadedFile{}}
		}

		return nil, err
	}

	return &file, nil
}

// FetchFilesByAccessibilityRequestID retrieves the info for a file with a given accessibility request id
func (s *Store) FetchFilesByAccessibilityRequestID(ctx context.Context, id uuid.UUID) (*[]models.UploadedFile, error) {
	if id == uuid.Nil {
		return nil, &apperrors.ResourceNotFoundError{Resource: models.UploadedFile{}}
	}

	results := []models.UploadedFile{}
	// eventually, we should use the id here, but we don't have the db relationship set up yet
	err := s.db.Select(&results, "SELECT * FROM accessibility_request_files where request_id=$1", id)

	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to fetch uploaded file", zap.Error(err))

		if errors.Is(err, sql.ErrNoRows) {
			return nil, &apperrors.ResourceNotFoundError{Err: err, Resource: models.UploadedFile{}}
		}

		return nil, err
	}

	return &results, nil
}
