package storage

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

// CreateTRBAdminNoteTRBDocumentLinks creates multiple link records relating a single TRB admin note to all TRB documents it references
func (s *Store) CreateTRBAdminNoteTRBDocumentLinks(
	ctx context.Context,
	trbRequestID uuid.UUID,
	trbAdminNoteID uuid.UUID,
	trbRequestDocumentIDs []uuid.UUID,
) ([]*models.TRBAdminNoteTRBRequestDocumentLink, error) {
	creatingUserEUAID := appcontext.Principal(ctx).ID()

	links := []*models.TRBAdminNoteTRBRequestDocumentLink{}

	for _, documentID := range trbRequestDocumentIDs {
		link := models.TRBAdminNoteTRBRequestDocumentLink{
			TRBRequestID:         trbRequestID,
			TRBAdminNoteID:       trbAdminNoteID,
			TRBRequestDocumentID: documentID,
		}
		link.ID = uuid.New()
		link.CreatedBy = creatingUserEUAID

		links = append(links, &link)
	}

	const trbAdminNoteTRBDocumentLinkCreateSQL = `
		INSERT INTO trb_admin_notes_trb_request_documents_links (
			id,
			trb_admin_note_id,
			trb_request_document_id,
			trb_request_id,
			created_by
		) VALUES (
			:id,
			:trb_admin_note_id,
			:trb_request_document_id,
			:trb_request_id,
			:created_by
		) RETURNING *;
	`

	// we use NamedQuery() here to insert multiple rows and get the results in a single query
	// we could also use NamedExec() to insert multiple rows, but we'd have to do a separate SELECT to get the results
	// Select() doesn't work with inserting multiple values with named arguments
	// PrepareNamed() doesn't work when inserting multiple values
	createdLinkRows, err := s.db.NamedQuery(trbAdminNoteTRBDocumentLinkCreateSQL, links)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to create links between TRB admin note and TRB recommendation with error %s", err),
			zap.Error(err),
			zap.String("user", creatingUserEUAID),
			zap.String("trbAdminNoteID", trbAdminNoteID.String()),
		)
		return nil, err
	}

	// loop through the sqlx.Rows value returned from NameQuery(), scan the results back into structs
	createdLinks := []*models.TRBAdminNoteTRBRequestDocumentLink{}
	for createdLinkRows.Next() {
		var createdLink models.TRBAdminNoteTRBRequestDocumentLink
		err = createdLinkRows.StructScan(&createdLink)
		if err != nil {
			appcontext.ZLogger(ctx).Error(
				fmt.Sprintf("Failed to read results from creating links between TRB admin note and TRB recommendation with error %s", err),
				zap.Error(err),
				zap.String("user", creatingUserEUAID),
				zap.String("trbAdminNoteID", trbAdminNoteID.String()),
			)
			return nil, err
		}

		createdLinks = append(createdLinks, &createdLink)
	}

	return createdLinks, nil
}
