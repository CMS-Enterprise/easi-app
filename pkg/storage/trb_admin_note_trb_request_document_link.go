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

// TODO - flesh out this comment
// create multiple links at once to a single note
// assumes IDs for links haven't been set
func (s *Store) CreateTRBAdminNoteTRBDocumentLinks(
	ctx context.Context,
	trbAdminNoteID uuid.UUID,
	trbRequestDocumentIDs []uuid.UUID,
) ([]*models.TRBAdminNoteTRBRequestDocumentLink, error) {
	// TODO - have an early return if trbRequestDocumentIDs is empty? (should this return (nil, nil), or an error?)

	creatingUserEUAID := appcontext.Principal(ctx).ID()

	links := []*models.TRBAdminNoteTRBRequestDocumentLink{}

	for _, documentID := range trbRequestDocumentIDs {
		link := models.TRBAdminNoteTRBRequestDocumentLink{
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
			created_by
		) VALUES (
			:id,
			:trb_admin_note_id,
			:trb_request_document_id,
			:created_by
		) RETURNING *;
	`

	// _, err := s.db.NamedExec(trbAdminNoteTRBDocumentLinkCreateSQL, links)
	createdLinkRows, err := s.db.NamedQuery(trbAdminNoteTRBDocumentLinkCreateSQL, links)
	if err != nil {
		// TODO - proper error handling
		return nil, err
	}

	createdLinks := []*models.TRBAdminNoteTRBRequestDocumentLink{}
	for createdLinkRows.Next() {
		var createdLink models.TRBAdminNoteTRBRequestDocumentLink
		err = createdLinkRows.StructScan(&createdLink)
		if err != nil {
			// TODO - proper error handling
			return nil, err
		}

		createdLinks = append(createdLinks, &createdLink)
	}

	for _, createdLink := range createdLinks {
		fmt.Println(*createdLink)
	}

	return createdLinks, nil

	// stmt, err := s.db.PrepareNamed(trbAdminNoteTRBDocumentLinkCreateSQL)
	// if err != nil {
	// 	appcontext.ZLogger(ctx).Error(
	// 		fmt.Sprintf("Failed to prepare SQL statement for creating link between TRB admin note and TRB document with error %s", err),
	// 		zap.Error(err),
	// 		zap.String("user", creatingUserEUAID),
	// 		zap.String("trbAdminNoteID", trbAdminNoteID.String()),
	// 	)
	// 	return nil, err
	// }

	// _, err = stmt.Exec(links)
	// if err != nil {
	// 	// TODO - proper error handling
	// 	return nil, err
	// }

	// TODO - see if I can return the links that were created, returned from the DB
	// return links, nil

	// retLink := models.TRBAdminNoteTRBRequestDocumentLink{}

	// err = stmt.Get(&retLink, trbAdminNoteTRBDocumentLink)
	// if err != nil {
	// 	appcontext.ZLogger(ctx).Error(
	// 		fmt.Sprintf("Failed to create link between TRB admin note and TRB recommendation with error %s", err),
	// 		zap.Error(err),
	// 		zap.String("user", trbAdminNoteTRBDocumentLink.CreatedBy),
	// 		zap.String("trbAdminNoteID", trbAdminNoteTRBDocumentLink.TRBAdminNoteID.String()),
	// 		zap.String("trbRequestDocumentID", trbAdminNoteTRBDocumentLink.TRBRequestDocumentID.String()),
	// 	)
	// 	return nil, err
	// }

	// return &retLink, nil
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
