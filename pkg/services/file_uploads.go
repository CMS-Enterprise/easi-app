package services

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/handlers"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/upload"
)

// createFunc is a function that saves uploaded file metadata
type createFunc func(context.Context, *models.UploadedFile) (*models.UploadedFile, error)

// NewCreateFileUploadURL is a service to create a file upload URL via a pre-signed URL in S3
func NewCreateFileUploadURL(config Config, s3client upload.S3Client) handlers.CreateFileUploadURL {
	return func(ctx context.Context) (*models.PreSignedURL, error) {
		url, err := s3client.NewPutPresignedURL()
		if err != nil {
			return nil, err
		}
		return url, nil
	}
}

// NewCreateUploadedFile returns a function that saves the metadata of an uploaded file
func NewCreateUploadedFile(config Config, create createFunc) handlers.CreateUploadedFile {
	return func(ctx context.Context, file *models.UploadedFile) (*models.UploadedFile, error) {
		return create(ctx, file)
	}
}
