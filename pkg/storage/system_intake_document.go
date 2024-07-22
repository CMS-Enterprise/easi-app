package storage

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlqueries"
)

// GetSystemIntakeDocumentsByRequestID queries the DB for all documents attached to the system intake with the given ID
func (s *Store) GetSystemIntakeDocumentsByRequestID(ctx context.Context, systemIntakeID uuid.UUID) ([]*models.SystemIntakeDocument, error) {
	var documents []*models.SystemIntakeDocument
	return documents, namedSelect(ctx, s, &documents, sqlqueries.SystemIntakeDocument.SelectDocumentsBySystemIntakeID, args{
		"system_intake_id": systemIntakeID,
	})
}

func (s *Store) GetSystemIntakeDocumentByID(ctx context.Context, docID uuid.UUID) (*models.SystemIntakeDocument, error) {
	var doc models.SystemIntakeDocument
	return &doc, namedGet(ctx, s, &doc, sqlqueries.SystemIntakeDocument.GetByDocumentID, args{
		"id": docID,
	})
}

func (s *Store) GetSystemIntakeDocumentByS3Key(ctx context.Context, s3Key string) (*models.SystemIntakeDocument, error) {
	var doc models.SystemIntakeDocument
	return &doc, namedGet(ctx, s, &doc, sqlqueries.SystemIntakeDocument.GetByS3Key, args{
		"s3_key": s3Key,
	})
}

// CreateSystemIntakeDocument creates a record for a SystemIntakeDocument in our database
func (s *Store) CreateSystemIntakeDocument(ctx context.Context, document *models.SystemIntakeDocument) (*models.SystemIntakeDocument, error) {
	if document.ID == uuid.Nil {
		document.ID = uuid.New()
	}

	var retDoc models.SystemIntakeDocument
	return &retDoc, namedGet(ctx, s, &retDoc, sqlqueries.SystemIntakeDocument.Create, document)
}

// DeleteSystemIntakeDocument deletes an existing SystemIntakeDocument, given its ID
func (s *Store) DeleteSystemIntakeDocument(ctx context.Context, id uuid.UUID) (*models.SystemIntakeDocument, error) {
	var retDoc models.SystemIntakeDocument
	return &retDoc, namedGet(ctx, s, &retDoc, sqlqueries.SystemIntakeDocument.Delete, args{
		"id": id,
	})
}
