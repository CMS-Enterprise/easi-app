package storage

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// CreateTRBAdminNoteTRBRecommendationLinks creates multiple link records relating a single TRB admin note to all TRB advice letter recommendations it references
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
	defer createdLinkRows.Close()

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

// GetTRBRecommendationsByAdminNoteID fetches all TRB advice letter documents linked to a TRB admin note
// This function specifically fetches all recommendations (even deleted ones), as this function is called by the resolver for TRB Admin Notes,
// which need to display previously deleted recommendation titles
func (s *Store) GetTRBRecommendationsByAdminNoteID(ctx context.Context, adminNoteID uuid.UUID) ([]*models.TRBAdviceLetterRecommendation, error) {
	const trbRequestRecommendationsGetByAdminNoteIDSQL = `
		SELECT trb_advice_letter_recommendations.*
		FROM trb_advice_letter_recommendations
		INNER JOIN trb_admin_notes_trb_admin_note_recommendations_links
			ON trb_advice_letter_recommendations.id = trb_admin_notes_trb_admin_note_recommendations_links.trb_advice_letter_recommendation_id
		WHERE trb_admin_notes_trb_admin_note_recommendations_links.trb_admin_note_id = :admin_note_id
	`

	stmt, err := s.db.PrepareNamed(trbRequestRecommendationsGetByAdminNoteIDSQL)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to prepare SQL statement for fetching TRB advice letter recommendations by admin note ID with error %s", err),
			zap.Error(err),
			zap.String("adminNoteID", adminNoteID.String()),
		)
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"admin_note_id": adminNoteID,
	}

	recommendations := []*models.TRBAdviceLetterRecommendation{}
	err = stmt.Select(&recommendations, arg)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to fetch TRB advice letter recommendations by admin note ID with error %s", err),
			zap.Error(err),
			zap.String("adminNoteID", adminNoteID.String()),
		)

		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.TRBAdviceLetterRecommendation{},
			Operation: apperrors.QueryFetch,
		}
	}

	return recommendations, nil
}
