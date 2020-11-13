package services

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/handlers"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/upload"
)

//PreSignedURLReturn is the return type of these functions
type PreSignedURLReturn func(context.Context) (*models.PreSignedURL, error)

// NewCreateFileUploadURL is a service to create a file upload URL via a pre-signed URL in S3
func NewCreateFileUploadURL(config Config, s3client upload.S3Client) handlers.CreateFileUploadURL {
	return func(ctx context.Context) (*models.PreSignedURL, error) {
		url, err := s3client.NewPutPresignedURL("test.jpg")
		if err != nil {
			return nil, err
		}
		return url, nil
	}
}
