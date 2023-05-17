package resolvers

import (
	"context"
	"path/filepath"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
	"github.com/cmsgov/easi-app/pkg/upload"
)

// GetTRBRequestDocumentsByRequestID fetches all documents attached to the TRB request with the given ID.
func GetTRBRequestDocumentsByRequestID(ctx context.Context, store *storage.Store, s3Client *upload.S3Client, id uuid.UUID) ([]*models.TRBRequestDocument, error) {
	return store.GetTRBRequestDocumentsByRequestID(ctx, id)
}

// GetURLForTRBRequestDocument queries S3 for a presigned URL that can be used to fetch the document with the given s3Key
func GetURLForTRBRequestDocument(s3Client *upload.S3Client, s3Key string) (string, error) {
	presignedURL, err := s3Client.NewGetPresignedURL(s3Key)
	if err != nil {
		return "", err
	}

	return presignedURL.URL, nil
}

// GetStatusForTRBRequestDocument queries S3 for the virus-scanning status of a document with the given s3Key
func GetStatusForTRBRequestDocument(s3Client *upload.S3Client, s3Key string) (models.TRBRequestDocumentStatus, error) {
	avStatus, err := s3Client.TagValueForKey(s3Key, upload.AVStatusTagName)
	if err != nil {
		return "", err
	}

	// possible tag values come from virus scanning lambda
	// this is the same logic as in schema.resolvers.go's Documents() method for 508 documents
	if avStatus == "CLEAN" {
		return models.TRBRequestDocumentStatusAvailable, nil
	} else if avStatus == "INFECTED" {
		return models.TRBRequestDocumentStatusUnavailable, nil
	} else {
		return models.TRBRequestDocumentStatusPending, nil
	}
}

// CreateTRBRequestDocument uploads a document to S3, then saves its metadata to our database.
func CreateTRBRequestDocument(ctx context.Context, store *storage.Store, s3Client *upload.S3Client, input model.CreateTRBRequestDocumentInput) (*models.TRBRequestDocument, error) {
	s3Key := uuid.New().String()

	existingExtension := filepath.Ext(input.FileData.Filename)
	if existingExtension != "" {
		s3Key += existingExtension
	} else {
		s3Key += fallbackExtension
	}

	err := s3Client.UploadFile(s3Key, input.FileData.File)
	if err != nil {
		return nil, err
	}

	documentDatabaseRecord := models.TRBRequestDocument{
		TRBRequestID:       input.RequestID,
		CommonDocumentType: input.DocumentType,
		FileName:           input.FileData.Filename,
		S3Key:              s3Key,
		Bucket:             s3Client.GetBucket(),
		// Status isn't saved in database - will be fetched from S3
		// URL isn't saved in database - will be generated by querying S3
	}
	documentDatabaseRecord.CreatedBy = appcontext.Principal(ctx).ID()
	if input.OtherTypeDescription != nil {
		documentDatabaseRecord.OtherType = *input.OtherTypeDescription
	}

	return store.CreateTRBRequestDocument(ctx, &documentDatabaseRecord)
}

// DeleteTRBRequestDocument deletes an existing TRBRequestDocument, given its ID.
//
// Does *not* delete the uploaded file from S3, following the example of 508/accessibility request documents.
func DeleteTRBRequestDocument(ctx context.Context, store *storage.Store, id uuid.UUID) (*models.TRBRequestDocument, error) {
	return store.DeleteTRBRequestDocument(ctx, id)
}
