package services

import (
	"context"
	"fmt"

	"github.com/cmsgov/easi-app/pkg/handlers"
	"github.com/cmsgov/easi-app/pkg/models"
)

//PreSignedURLReturn is the return type of these functions
type PreSignedURLReturn func(context.Context) (*models.PreSignedURL, error)

// NewCreateFileUploadURL is a service to create a file upload URL via a pre-signed URL in S3
func NewCreateFileUploadURL(config Config) handlers.CreateFileUploadURL {
	return func(ctx context.Context) (*models.PreSignedURL, error) {
		var result *models.PreSignedURL
		fmt.Println("we handled a file")
		fmt.Println(result)

		return result, nil
	}
}
