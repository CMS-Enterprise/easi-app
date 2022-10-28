package resolvers

import (
	"context"
	"mime"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
	"github.com/cmsgov/easi-app/pkg/upload"
)

// GetTRBRequestDocumentsByRequestID fetches all documents attached to the TRB request with the given ID.
func GetTRBRequestDocumentsByRequestID(ctx context.Context, store *storage.Store, s3Client *upload.S3Client, requestID uuid.UUID) ([]*models.TRBRequestDocument, error) {
	documents, err := store.GetTRBRequestDocumentsByRequestID(appcontext.ZLogger(ctx), requestID)
	if err != nil {
		return nil, err
	}

	for _, document := range documents {
		presignedURL, err := s3Client.NewGetPresignedURL(document.S3Key)
		if err != nil {
			return nil, err
		}
		document.URL = presignedURL.URL
	}

	return documents, nil
}

// CreateTRBRequestDocument uploads a document to S3, then saves its metadata to our database.
func CreateTRBRequestDocument(ctx context.Context, store *storage.Store, s3Client *upload.S3Client, input model.CreateTRBRequestDocumentInput) (*models.TRBRequestDocument, error) {
	s3Key := uuid.New().String()

	// add file extension to key if we can get it from upload's MIME type
	mimeType := input.FileData.ContentType
	extensions, err := mime.ExtensionsByType(mimeType)
	if err == nil && len(extensions) > 0 {
		s3Key = s3Key + extensions[0]
	}

	err = s3Client.UploadFile(s3Key, input.FileData.File, mimeType)
	if err != nil {
		return nil, err
	}

	document := models.TRBRequestDocument{
		TRBRequestID:       input.RequestID,
		CommonDocumentType: input.DocumentType,
		FileName:           input.FileName,
		S3Key:              s3Key,
		// Status - either field isn't needed, or assign it to "PENDING"
		// URL - not saved to DB (generated only on retrieval, by calling S3)
		// Bucket - TODO - comes from config
	}
	document.CreatedBy = appcontext.Principal(ctx).ID()
	if input.OtherTypeDescription != nil {
		document.OtherType = *input.OtherTypeDescription
	}

	return store.CreateTRBRequestDocument(appcontext.ZLogger(ctx), &document)
}

// DeleteTRBRequestDocument deletes an existing TRBRequestDocument, given its ID.
//
// Does *not* delete the uploaded file from S3, following the example of 508/accessibility request documents.
func DeleteTRBRequestDocument(ctx context.Context, store *storage.Store, id uuid.UUID) (*models.TRBRequestDocument, error) {
	return store.DeleteTRBRequestDocument(appcontext.ZLogger(ctx), id)
}
