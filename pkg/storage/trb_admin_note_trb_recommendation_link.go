package storage

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

// CreateTRBAdminNoteTRBRecommendationLink creates a new record in the database representing a link between a TRB admin note and a TRB recommendation
func (s *Store) CreateTRBAdminNoteTRBRecommendationLink(
	ctx context.Context,
	trbAdminNoteRecommendationLink *models.TRBAdminNoteTRBAdviceLetterRecommendationLink,
) (*models.TRBAdminNoteTRBAdviceLetterRecommendationLink, error) {
	if trbAdminNoteRecommendationLink.ID == uuid.Nil {
		trbAdminNoteRecommendationLink.ID = uuid.New()
	}

	const trbAdminNoteRecommendationLinkCreateSQL = `
		INSERT INTO trb_admin_notes_trb_admin_note_recommendations_link (
			id,
			trb_admin_note_id,
			trb_advice_letter_recommendation_id,
			created_by
		) VALUES (
			:id,
			:trb_admin_note_id,
			:trb_advice_letter_recommendation_id,
			:created_by
		) RETURNING *;
	`
	stmt, err := s.db.PrepareNamed(trbAdminNoteRecommendationLinkCreateSQL)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to prepare SQL statement for creating link between TRB admin note and TRB recommendation with error %s", err),
			zap.Error(err),
			zap.String("user", trbAdminNoteRecommendationLink.CreatedBy),
			zap.String("trbAdminNoteID", trbAdminNoteRecommendationLink.TRBAdminNoteID.String()),
			zap.String("trbAdviceLetterRecommendationID", trbAdminNoteRecommendationLink.TRBAdviceLetterRecommendationID.String()),
		)
		return nil, err
	}

	retLink := models.TRBAdminNoteTRBAdviceLetterRecommendationLink{}

	err = stmt.Get(&retLink, trbAdminNoteRecommendationLink)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to create link between TRB admin note and TRB recommendation with error %s", err),
			zap.Error(err),
			zap.String("user", trbAdminNoteRecommendationLink.CreatedBy),
			zap.String("trbAdminNoteID", trbAdminNoteRecommendationLink.TRBAdminNoteID.String()),
			zap.String("trbAdviceLetterRecommendationID", trbAdminNoteRecommendationLink.TRBAdviceLetterRecommendationID.String()),
		)
		return nil, err
	}

	return &retLink, nil
}
