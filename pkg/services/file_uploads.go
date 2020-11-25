package services

import (
	"context"
	"errors"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/handlers"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/upload"
)

// createFunc is a function that saves uploaded file metadata
type createFunc func(context.Context, *models.UploadedFile) (*models.UploadedFile, error)

// authFunc is a function that deals with auth
type authFunc func(context.Context) (bool, error)

// NewCreateFileUploadURL is a service to create a file upload URL via a pre-signed URL in S3
func NewCreateFileUploadURL(config Config, authorize authFunc, s3client upload.S3Client) handlers.CreateFileUploadURL {
	return func(ctx context.Context) (*models.PreSignedURL, error) {
		ok, err := authorize(ctx)
		if err != nil {
			return nil, err
		}

		if !ok {
			return nil, &apperrors.ResourceNotFoundError{
				Err:      errors.New("failed to authorize pre-signed url generation"),
				Resource: models.PreSignedURL{},
			}
		}

		url, err := s3client.NewPutPresignedURL()
		if err != nil {
			return nil, err
		}
		return url, nil
	}
}

// NewCreateUploadedFile returns a function that saves the metadata of an uploaded file
func NewCreateUploadedFile(config Config, authorize authFunc, create createFunc) handlers.CreateUploadedFile {
	return func(ctx context.Context, file *models.UploadedFile) (*models.UploadedFile, error) {
		ok, err := authorize(ctx)
		if err != nil {
			return nil, err
		}

		if !ok {
			return nil, &apperrors.ResourceNotFoundError{
				Err:      errors.New("failed to authorize save uploaded file metadata"),
				Resource: models.PreSignedURL{},
			}
		}

		return create(ctx, file)
	}
}
