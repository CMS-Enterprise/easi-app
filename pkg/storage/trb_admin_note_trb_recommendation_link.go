package storage

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

// Creates multiple link records relating a single TRB admin note to all TRB advice letter recommendations it references
func (s *Store) CreateTRBAdminNoteTRBRecommendationLinks(
	ctx context.Context,
	trbRequestID uuid.UUID,
	trbAdminNoteID uuid.UUID,
	trbAdviceLetterRecommendationIDs []uuid.UUID,
) ([]*models.TRBAdminNoteTRBAdviceLetterRecommendationLink, error) {
	creatingUserEUAID := appcontext.Principal(ctx).ID()

	links := []*models.TRBAdminNoteTRBAdviceLetterRecommendationLink{}

	for _, recommendationID := range trbAdviceLetterRecommendationIDs {
		link := models.TRBAdminNoteTRBAdviceLetterRecommendationLink{
			TRBRequestID:                    trbRequestID,
			TRBAdminNoteID:                  trbAdminNoteID,
			TRBAdviceLetterRecommendationID: recommendationID,
		}
		link.ID = uuid.New()
		link.CreatedBy = creatingUserEUAID

		links = append(links, &link)
	}

	const trbAdminNoteRecommendationLinkCreateSQL = `
		INSERT INTO trb_admin_notes_trb_admin_note_recommendations_links (
			id,
			trb_request_id,
			trb_admin_note_id,
			trb_advice_letter_recommendation_id,
			created_by
		) VALUES (
			:id,
			:trb_request_id,
			:trb_admin_note_id,
			:trb_advice_letter_recommendation_id,
			:created_by
		) RETURNING *;
	`

	// insert all links and return the created rows immediately
	// see Note [Use NamedQuery to insert multiple records]
	createdLinkRows, err := s.db.NamedQuery(trbAdminNoteRecommendationLinkCreateSQL, links)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to create links between TRB admin note and TRB advice letter recommendations with error %s", err),
			zap.Error(err),
			zap.String("user", creatingUserEUAID),
			zap.String("trbAdminNoteID", trbAdminNoteID.String()),
		)
		return nil, err
	}

	// loop through the sqlx.Rows value returned from NamedQuery(), scan the results back into structs
	createdLinks := []*models.TRBAdminNoteTRBAdviceLetterRecommendationLink{}
	for createdLinkRows.Next() {
		var createdLink models.TRBAdminNoteTRBAdviceLetterRecommendationLink
		err = createdLinkRows.StructScan(&createdLink)
		if err != nil {
			appcontext.ZLogger(ctx).Error(
				fmt.Sprintf("Failed to read results from creating links between TRB admin note and TRB advice letter recommendations with error %s", err),
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
