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

// CreateTRBAdminNoteTRBInsightLinks creates multiple link records relating a single TRB admin note to all TRB guidance letter insights it references
func (s *Store) CreateTRBAdminNoteTRBInsightLinks(
	ctx context.Context,
	trbRequestID uuid.UUID,
	trbAdminNoteID uuid.UUID,
	trbGuidanceLetterInsightIDs []uuid.UUID,
) ([]*models.TRBAdminNoteTRBGuidanceLetterInsightLink, error) {
	creatingUserEUAID := appcontext.Principal(ctx).ID()

	links := []*models.TRBAdminNoteTRBGuidanceLetterInsightLink{}

	for _, insightID := range trbGuidanceLetterInsightIDs {
		link := models.TRBAdminNoteTRBGuidanceLetterInsightLink{
			TRBRequestID:               trbRequestID,
			TRBAdminNoteID:             trbAdminNoteID,
			TRBGuidanceLetterInsightID: insightID,
		}
		link.ID = uuid.New()
		link.CreatedBy = creatingUserEUAID

		links = append(links, &link)
	}

	const trbAdminNoteInsightLinkCreateSQL = `
		INSERT INTO trb_admin_notes_trb_admin_note_insights_links (
			id,
			trb_request_id,
			trb_admin_note_id,
			trb_guidance_letter_insight_id,
			created_by
		) VALUES (
			:id,
			:trb_request_id,
			:trb_admin_note_id,
			:trb_guidance_letter_insight_id,
			:created_by
		) RETURNING *;
	`

	// insert all links and return the created rows immediately
	// see Note [Use NamedQuery to insert multiple records]
	createdLinkRows, err := s.db.NamedQuery(trbAdminNoteInsightLinkCreateSQL, links)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to create links between TRB admin note and TRB guidance letter insights with error %s", err),
			zap.Error(err),
			zap.String("user", creatingUserEUAID),
			zap.String("trbAdminNoteID", trbAdminNoteID.String()),
		)
		return nil, err
	}
	defer createdLinkRows.Close()

	// loop through the sqlx.Rows value returned from NamedQuery(), scan the results back into structs
	createdLinks := []*models.TRBAdminNoteTRBGuidanceLetterInsightLink{}
	for createdLinkRows.Next() {
		var createdLink models.TRBAdminNoteTRBGuidanceLetterInsightLink
		err = createdLinkRows.StructScan(&createdLink)
		if err != nil {
			appcontext.ZLogger(ctx).Error(
				fmt.Sprintf("Failed to read results from creating links between TRB admin note and TRB guidance letter insights with error %s", err),
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

// GetTRBInsightsByAdminNoteID fetches all TRB guidance letter documents linked to a TRB admin note
// This function specifically fetches all insights (even deleted ones), as this function is called by the resolver for TRB Admin Notes,
// which need to display previously deleted insight titles
func (s *Store) GetTRBInsightsByAdminNoteID(ctx context.Context, adminNoteID uuid.UUID) ([]*models.TRBGuidanceLetterInsight, error) {
	const trbRequestInsightsGetByAdminNoteIDSQL = `
		SELECT trb_guidance_letter_insights.*
		FROM trb_guidance_letter_insights
		INNER JOIN trb_admin_notes_trb_admin_note_insights_links
			ON trb_guidance_letter_insights.id = trb_admin_notes_trb_admin_note_insights_links.trb_guidance_letter_insight_id
		WHERE trb_admin_notes_trb_admin_note_insights_links.trb_admin_note_id = :admin_note_id
	`

	stmt, err := s.db.PrepareNamed(trbRequestInsightsGetByAdminNoteIDSQL)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to prepare SQL statement for fetching TRB guidance letter insights by admin note ID with error %s", err),
			zap.Error(err),
			zap.String("adminNoteID", adminNoteID.String()),
		)
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"admin_note_id": adminNoteID,
	}

	insights := []*models.TRBGuidanceLetterInsight{}
	err = stmt.Select(&insights, arg)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to fetch TRB guidance letter insights by admin note ID with error %s", err),
			zap.Error(err),
			zap.String("adminNoteID", adminNoteID.String()),
		)

		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.TRBGuidanceLetterInsight{},
			Operation: apperrors.QueryFetch,
		}
	}

	return insights, nil
}
