package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// GetTRBRequestDocumentsByRequestID fetches all documents attached to the TRB request with the given ID
func GetTRBRequestDocumentsByRequestID(ctx context.Context, store *storage.Store, requestID uuid.UUID) ([]*models.TRBRequestDocument, error) {
	documents, err := store.GetTRBRequestDocumentsByRequestID(appcontext.ZLogger(ctx), requestID)
	if err != nil {
		return nil, err
	}

	// TODO - get presigned URLs for each document, populate each document.URL appropriately
	return documents, nil
}

// TODO rework parameters - takes a request ID, file data (graphql.Upload), DocumentType, and OtherTypeDescription; needs to save document to s3, then save to DB

// CreateTRBRequestDocument uploads a document to S3, then saves its metadata to our database
func CreateTRBRequestDocument(ctx context.Context, store *storage.Store /*, document *models.TRBRequestDocument*/) (*models.TRBRequestDocument, error) {
	// TODO - upload document to S3
	panic("Not yet implemented")
	// return store.CreateTRBRequestDocument(appcontext.ZLogger(ctx), document)

}

// DeleteTRBRequestDocument deletes an existing TRBRequestDocument, given its ID
func DeleteTRBRequestDocument(ctx context.Context, store *storage.Store, id uuid.UUID) (*models.TRBRequestDocument, error) {
	return store.DeleteTRBRequestDocument(appcontext.ZLogger(ctx), id)
}
