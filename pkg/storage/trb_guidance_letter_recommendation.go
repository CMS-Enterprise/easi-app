package storage

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"golang.org/x/exp/slices"

	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// CreateTRBGuidanceLetterRecommendation creates a new TRB advice letter recommendation record in the database.
// This recommendation will be positioned at the end of the advice letter upon creation.
func (s *Store) CreateTRBGuidanceLetterRecommendation(
	ctx context.Context,
	recommendation *models.TRBGuidanceLetterRecommendation,
) (*models.TRBGuidanceLetterRecommendation, error) {
	if recommendation.ID == uuid.Nil {
		recommendation.ID = uuid.New()
	}

	// besides the normal fields, set position_in_letter pased on the existing recommendations for this advice letter
	// set position_in_letter to 1 + (the largeting existing position for this advice letter),
	// defaulting to 0 if there are no existing recommendations for this advice letter
	stmt, err := s.db.PrepareNamed(`
		INSERT INTO trb_guidance_letter_recommendations (
			id,
			trb_request_id,
			title,
			recommendation,
			links,
			created_by,
			modified_by,
			position_in_letter
		)
		SELECT
			:id,
			:trb_request_id,
			:title,
			:recommendation,
			:links,
			:created_by,
			:modified_by,
			COALESCE(MAX(position_in_letter) + 1, 0)
		FROM trb_guidance_letter_recommendations
		WHERE trb_request_id = :trb_request_id
		RETURNING *;`)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to prepare SQL statement for creating TRB advice letter recommendation with error %s", err),
			zap.Error(err),
			zap.String("user", recommendation.CreatedBy),
		)
		return nil, err
	}
	defer stmt.Close()

	created := models.TRBGuidanceLetterRecommendation{}

	err = stmt.Get(&created, recommendation)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to create TRB advice letter recommendation with error %s", err),
			zap.Error(err),
			zap.String("user", recommendation.CreatedBy),
		)
		return nil, err
	}

	return &created, nil
}

// GetTRBGuidanceLetterRecommendationByID retrieves a TRB advice letter recommendation record from the database
// It will not return any entities that have a deleted_at value
func (s *Store) GetTRBGuidanceLetterRecommendationByID(ctx context.Context, id uuid.UUID) (*models.TRBGuidanceLetterRecommendation, error) {
	recommendation := models.TRBGuidanceLetterRecommendation{}
	stmt, err := s.db.PrepareNamed(`SELECT * FROM trb_guidance_letter_recommendations WHERE id = :id AND deleted_at IS NULL`)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{"id": id}
	err = stmt.Get(&recommendation, arg)

	if err != nil {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch TRB advice letter recommendation",
			zap.Error(err),
			zap.String("id", id.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     recommendation,
			Operation: apperrors.QueryFetch,
		}
	}
	return &recommendation, err
}

// GetTRBGuidanceLetterRecommendationsByTRBRequestID queries the DB for all the TRB advice letter recommendations,
// filtering by the given TRB request ID and ordered in the user-specified positions
func (s *Store) GetTRBGuidanceLetterRecommendationsByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) ([]*models.TRBGuidanceLetterRecommendation, error) {
	results := []*models.TRBGuidanceLetterRecommendation{}

	err := s.db.Select(&results, `
		SELECT *
		FROM trb_guidance_letter_recommendations
		WHERE trb_request_id = $1
		AND deleted_at IS NULL
		ORDER BY position_in_letter ASC
	`, trbRequestID)

	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		appcontext.ZLogger(ctx).Error("Failed to fetch TRB advice letter recommendations", zap.Error(err), zap.String("id", trbRequestID.String()))
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.TRBGuidanceLetterRecommendation{},
			Operation: apperrors.QueryFetch,
		}
	}
	return results, nil
}

// GetTRBGuidanceLetterRecommendationsSharingTRBRequestID queries the DB for all TRB advice letter recommendations with the same TRB request ID as the given recommendation
// It will not return any entities that have a deleted_at value
func (s *Store) GetTRBGuidanceLetterRecommendationsSharingTRBRequestID(ctx context.Context, recommendationID uuid.UUID) ([]*models.TRBGuidanceLetterRecommendation, error) {
	stmt, err := s.db.PrepareNamed(`
		SELECT *
		FROM trb_guidance_letter_recommendations
		WHERE trb_request_id = (
			SELECT trb_request_id
			FROM trb_guidance_letter_recommendations
			WHERE id = :recommendationID
		) AND deleted_at IS NULL`)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to prepare SQL statement for GetTRBGuidanceLetterRecommendationsSharingTRBRequestID() with error %s", err),
			zap.Error(err),
			zap.String("id", recommendationID.String()),
		)
		return nil, err
	}
	defer stmt.Close()

	results := []*models.TRBGuidanceLetterRecommendation{}
	arg := map[string]interface{}{
		"recommendationID": recommendationID.String(),
	}
	err = stmt.Select(&results, arg)

	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to fetch TRB advice letter recommendations with error %s", err),
			zap.Error(err),
			zap.String("id", recommendationID.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.TRBGuidanceLetterRecommendation{},
			Operation: apperrors.QueryFetch,
		}
	}
	return results, nil
}

// UpdateTRBGuidanceLetterRecommendation updates an existing TRB guidance letter recommendation record in the database
// This purposely does not update the position_in_letter column - to update that, use UpdateTRBGuidanceLetterRecommendationOrder()
func (s *Store) UpdateTRBGuidanceLetterRecommendation(ctx context.Context, recommendation *models.TRBGuidanceLetterRecommendation) (*models.TRBGuidanceLetterRecommendation, error) {
	stmt, err := s.db.PrepareNamed(`
		UPDATE trb_guidance_letter_recommendations
		SET
			trb_request_id = :trb_request_id,
			title = :title,
			recommendation = :recommendation,
			links = :links,
			created_by = :created_by,
			modified_by = :modified_by
		WHERE id = :id
		RETURNING *;`)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to update TRB advice letter recommendation %s", err),
			zap.String("id", recommendation.ID.String()),
		)
		return nil, err
	}
	defer stmt.Close()

	updated := models.TRBGuidanceLetterRecommendation{}

	err = stmt.Get(&updated, recommendation)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to update TRB advice letter recommendation %s", err),
			zap.String("id", recommendation.ID.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     recommendation,
			Operation: apperrors.QueryUpdate,
		}
	}

	return &updated, err
}

// DeleteTRBGuidanceLetterRecommendation deletes an existing TRB guidance letter recommendation record in the database
func (s *Store) DeleteTRBGuidanceLetterRecommendation(ctx context.Context, id uuid.UUID) (*models.TRBGuidanceLetterRecommendation, error) {
	stmt, err := s.db.PrepareNamed(`
		UPDATE trb_guidance_letter_recommendations
		SET deleted_at = CURRENT_TIMESTAMP, position_in_letter = NULL
		WHERE id = :id
		RETURNING *;`)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to delete TRB advice letter recommendation %s", err),
			zap.String("id", id.String()),
		)
		return nil, err
	}
	defer stmt.Close()

	toDelete := models.TRBGuidanceLetterRecommendation{}
	toDelete.ID = id
	deleted := models.TRBGuidanceLetterRecommendation{}

	err = stmt.Get(&deleted, &toDelete)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to delete TRB advice letter recommendation %s", err),
			zap.String("id", id.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     toDelete,
			Operation: apperrors.QueryUpdate,
		}
	}

	return &deleted, err
}

// UpdateTRBGuidanceLetterRecommendationOrder updates the ordering of recommendations for a given advice letter,
// using the order of the recommendation IDs passed in as newOrder. No other recommendation columns/fields are updated.
func (s *Store) UpdateTRBGuidanceLetterRecommendationOrder(
	ctx context.Context,
	trbRequestID uuid.UUID,
	newOrder []uuid.UUID,
) ([]*models.TRBGuidanceLetterRecommendation, error) {
	// convert newOrder into a slice of maps with entries for recommendation ID and new position,
	// which can then be passed to SQL as JSON, then used in the query via json_to_recordset()
	newPositions := []map[string]any{}

	for index, recommendationID := range newOrder {
		newEntry := map[string]any{
			// important to use the same keys as the columns in the SQL table, otherwise sqlx returns "missing destination name position" error
			"id":                 recommendationID,
			"position_in_letter": index,
		}
		newPositions = append(newPositions, newEntry)
	}

	newPositionsSerialized, err := json.Marshal(newPositions)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to marshal the JSON for updating TRB recommendation advice letters with error %s", err),
			zap.Error(err),
			zap.String("trbRequestID", trbRequestID.String()),
		)

		return nil, err
	}

	// json_to_recordset() lets us build a temporary table (new_positions) with the new positions for each recommendation,
	// which we can use in a CTE (common table expression, denoted by the WITH keyword) to update the recommendations
	// json_to_recordset() documentation - https://www.postgresql.org/docs/14/functions-json.html
	stmt, err := s.db.PrepareNamed(`
		WITH new_positions AS (
			SELECT *
			FROM json_to_recordset(:newPositions)
			AS new_positions (id uuid, position_in_letter int)
		)
		UPDATE trb_guidance_letter_recommendations
		SET position_in_letter = new_positions.position_in_letter
		FROM new_positions
		WHERE trb_guidance_letter_recommendations.id = new_positions.id
		AND trb_guidance_letter_recommendations.trb_request_id = :trbRequestID
		RETURNING *;`)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to prepare SQL statement for UpdateTRBGuidanceLetterRecommendationOrder() with error %s", err),
			zap.Error(err),
			zap.String("trbRequestID", trbRequestID.String()),
		)
		return nil, err
	}
	defer stmt.Close()

	updatedRecommendations := []*models.TRBGuidanceLetterRecommendation{}
	arg := map[string]interface{}{
		"newPositions": string(newPositionsSerialized),
		"trbRequestID": trbRequestID.String(),
	}

	err = stmt.Select(&updatedRecommendations, arg)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to update the order of TRB recommendation advice letters with error %s", err),
			zap.Error(err),
			zap.String("trbRequestID", trbRequestID.String()),
		)
		return nil, err
	}

	// sort updated recommendations by position, return in correct order
	// (easier to do this in Go than in SQL; doing it in SQL would require wrapping the whole UPDATE query in another CTE, then using ORDER BY on that)
	slices.SortFunc(updatedRecommendations, func(recommendationA, recommendationB *models.TRBGuidanceLetterRecommendation) int {
		return int(recommendationA.PositionInLetter.ValueOrZero()) - int(recommendationB.PositionInLetter.ValueOrZero())
	})

	return updatedRecommendations, nil
}
