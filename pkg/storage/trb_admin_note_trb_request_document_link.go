package storage

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *Store) CreateTRBAdminNoteTRBDocumentLink(
	ctx context.Context,
	trbAdminNoteTRBDocumentLink *models.TRBAdminNoteTRBRequestDocumentLink,
) (*models.TRBAdminNoteTRBRequestDocumentLink, error) {
	if trbAdminNoteTRBDocumentLink.ID == uuid.Nil {
		trbAdminNoteTRBDocumentLink.ID = uuid.New()
	}

	const trbAdminNoteTRBDocumentLinkCreateSQL = `
		INSERT INTO trb_admin_notes_trb_request_documents_links (
			id,
			trb_admin_note_id,
			trb_request_document_id,
			created_by
		) VALUES (
			:id,
			:trb_admin_note_id,
			:trb_request_document_id,
			:created_by
		) RETURNING *;
	`

	stmt, err := s.db.PrepareNamed(trbAdminNoteTRBDocumentLinkCreateSQL)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to prepare SQL statement for creating link between TRB admin note and TRB document with error %s", err),
			zap.Error(err),
			zap.String("user", trbAdminNoteTRBDocumentLink.CreatedBy),
			zap.String("trbAdminNoteID", trbAdminNoteTRBDocumentLink.TRBAdminNoteID.String()),
			zap.String("trbRequestDocumentID", trbAdminNoteTRBDocumentLink.TRBRequestDocumentID.String()),
		)
		return nil, err
	}

	retLink := models.TRBAdminNoteTRBRequestDocumentLink{}

	err = stmt.Get(&retLink, trbAdminNoteTRBDocumentLink)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to create link between TRB admin note and TRB recommendation with error %s", err),
			zap.Error(err),
			zap.String("user", trbAdminNoteTRBDocumentLink.CreatedBy),
			zap.String("trbAdminNoteID", trbAdminNoteTRBDocumentLink.TRBAdminNoteID.String()),
			zap.String("trbRequestDocumentID", trbAdminNoteTRBDocumentLink.TRBRequestDocumentID.String()),
		)
		return nil, err
	}

	return &retLink, nil
}

func (s *Store) DeleteTRBAdminNoteTRBDocumentLink(ctx context.Context, id uuid.UUID) (*models.TRBAdminNoteTRBRequestDocumentLink, error) {
	const trbAdminNoteTRBDocumentLinkDeleteSQL = `
		DELETE FROM trb_admin_notes_trb_request_documents_links
		WHERE id = :id
		RETURNING *;
	`

	stmt, err := s.db.PrepareNamed(trbAdminNoteTRBDocumentLinkDeleteSQL)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to prepare SQL statement for deleting link between TRB admin note and TRB document with error %s", err),
			zap.Error(err),
			zap.String("id", id.String()),
		)
		return nil, err
	}

	arg := map[string]interface{}{
		"id": id,
	}
	retLink := models.TRBAdminNoteTRBRequestDocumentLink{}

	err = stmt.Get(&retLink, arg)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to delete link between TRB admin note and TRB document with error %s", err),
			zap.Error(err),
			zap.String("id", id.String()),
		)
		return nil, err
	}

	return &retLink, nil
}
