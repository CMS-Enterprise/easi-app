package storage

import (
	"context"

	"github.com/google/uuid"
	"github.com/lib/pq"

	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlqueries"
)

// GetSystemIntakeDocumentsByRequestID queries the DB for all documents attached to the system intake with the given ID
func (s *Store) GetSystemIntakeDocumentsByRequestID(ctx context.Context, systemIntakeID uuid.UUID) ([]*models.SystemIntakeDocument, error) {
	var documents []*models.SystemIntakeDocument
	return documents, namedSelect(ctx, s.DB, &documents, sqlqueries.SystemIntakeDocument.SelectDocumentsBySystemIntakeID, args{
		"system_intake_id": systemIntakeID,
	})
}

// GetSystemIntakeDocumentsByRequestIDs queries the DB for all documents attached to system intakes with the given IDs
func (s *Store) GetSystemIntakeDocumentsByRequestIDs(ctx context.Context, systemIntakeIDs []uuid.UUID) ([]*models.SystemIntakeDocument, error) {
	var documents []*models.SystemIntakeDocument
	return documents, namedSelect(ctx, s.DB, &documents, sqlqueries.SystemIntakeDocument.SelectDocumentsBySystemIntakeIDs, args{
		"system_intake_ids": pq.Array(systemIntakeIDs),
	})
}

func (s *Store) GetSystemIntakeDocumentByID(ctx context.Context, docID uuid.UUID) (*models.SystemIntakeDocument, error) {
	var doc models.SystemIntakeDocument
	return &doc, namedGet(ctx, s.DB, &doc, sqlqueries.SystemIntakeDocument.GetByDocumentID, args{
		"id": docID,
	})
}

func (s *Store) GetSystemIntakeDocumentByS3Key(ctx context.Context, s3Key string) (*models.SystemIntakeDocument, error) {
	var doc models.SystemIntakeDocument
	return &doc, namedGet(ctx, s.DB, &doc, sqlqueries.SystemIntakeDocument.GetByS3Key, args{
		"s3_key": s3Key,
	})
}

// CreateSystemIntakeDocument creates a record for a SystemIntakeDocument in our database
func (s *Store) CreateSystemIntakeDocument(ctx context.Context, document *models.SystemIntakeDocument) (*models.SystemIntakeDocument, error) {
	if document.ID == uuid.Nil {
		document.ID = uuid.New()
	}

	var retDoc models.SystemIntakeDocument
	return &retDoc, namedGet(ctx, s.DB, &retDoc, sqlqueries.SystemIntakeDocument.Create, document)
}

// DeleteSystemIntakeDocument deletes an existing SystemIntakeDocument, given its ID
func (s *Store) DeleteSystemIntakeDocument(ctx context.Context, id uuid.UUID) (*models.SystemIntakeDocument, error) {
	var retDoc models.SystemIntakeDocument
	return &retDoc, namedGet(ctx, s.DB, &retDoc, sqlqueries.SystemIntakeDocument.Delete, args{
		"id": id,
	})
}
