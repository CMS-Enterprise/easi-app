package storage

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"golang.org/x/exp/slices"

	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
)

// CreateTRBGuidanceLetterInsight creates a new TRB guidance letter insight record in the database.
// This insight will be positioned at the end of the guidance letter upon creation.
func (s *Store) CreateTRBGuidanceLetterInsight(
	ctx context.Context,
	recommendation *models.TRBGuidanceLetterInsight,
) (*models.TRBGuidanceLetterInsight, error) {
	if recommendation.ID == uuid.Nil {
		recommendation.ID = uuid.New()
	}

	// besides the normal fields, set position_in_letter based on the existing insights for this guidance letter
	// set position_in_letter to 1 + (the largest existing position for this guidance letter),
	// defaulting to 0 if there are no existing insights for this guidance letter
	// -	note: if the `category` changes, we must update the `category` field AND add to the end of the order
	// 		for the new category
	stmt, err := s.db.PrepareNamed(`
		INSERT INTO trb_guidance_letter_insights (
			id,
			trb_request_id,
			title,
			insight,
			links,
			created_by,
			modified_by,
			position_in_letter,
			category
		)
		SELECT
			:id,
			:trb_request_id,
			:title,
			:insight,
			:links,
			:created_by,
			:modified_by,
			COALESCE(MAX(position_in_letter) FILTER ( WHERE category = :category AND trb_request_id = :trb_request_id) + 1, 0),
			:category
		FROM trb_guidance_letter_insights
		WHERE trb_request_id = :trb_request_id
		RETURNING *;`)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to prepare SQL statement for creating TRB guidance letter insight with error %s", err),
			zap.Error(err),
			zap.String("user", recommendation.CreatedBy),
		)
		return nil, err
	}
	defer stmt.Close()

	created := models.TRBGuidanceLetterInsight{}

	err = stmt.Get(&created, recommendation)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to create TRB guidance letter insight with error %s", err),
			zap.Error(err),
			zap.String("user", recommendation.CreatedBy),
			zap.String("sql_statement", stmt.QueryString),
		)
		return nil, err
	}

	return &created, nil
}

// GetTRBGuidanceLetterInsightByID retrieves a TRB guidance letter insight record from the database
// It will not return any entities that have a deleted_at value
func (s *Store) GetTRBGuidanceLetterInsightByID(ctx context.Context, id uuid.UUID) (*models.TRBGuidanceLetterInsight, error) {
	insight := models.TRBGuidanceLetterInsight{}
	stmt, err := s.db.PrepareNamed(`SELECT * FROM trb_guidance_letter_insights WHERE id = :id AND deleted_at IS NULL`)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{"id": id}
	err = stmt.Get(&insight, arg)

	if err != nil {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch TRB guidance letter insight",
			zap.Error(err),
			zap.String("id", id.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     insight,
			Operation: apperrors.QueryFetch,
		}
	}
	return &insight, err
}

// GetTRBGuidanceLetterInsightsByTRBRequestID queries the DB for all the TRB guidance letter insights,
// filtering by the given TRB request ID and ordered in the user-specified positions
func (s *Store) GetTRBGuidanceLetterInsightsByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) ([]*models.TRBGuidanceLetterInsight, error) {
	results := []*models.TRBGuidanceLetterInsight{}

	err := s.db.Select(&results, `
		SELECT *
		FROM trb_guidance_letter_insights
		WHERE trb_request_id = $1
		AND deleted_at IS NULL
		ORDER BY position_in_letter ASC
	`, trbRequestID)

	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		appcontext.ZLogger(ctx).Error("Failed to fetch TRB guidance letter insights", zap.Error(err), zap.String("id", trbRequestID.String()))
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.TRBGuidanceLetterInsight{},
			Operation: apperrors.QueryFetch,
		}
	}
	return results, nil
}

// GetTRBGuidanceLetterInsightsByTRBRequestIDAndCategory queries the DB for all the TRB guidance letter insights,
// filtering by the given TRB request ID and ordered in the user-specified positions
func (s *Store) GetTRBGuidanceLetterInsightsByTRBRequestIDAndCategory(ctx context.Context, trbRequestID uuid.UUID, category models.TRBGuidanceLetterInsightCategory) ([]*models.TRBGuidanceLetterInsight, error) {
	results := []*models.TRBGuidanceLetterInsight{}

	err := s.db.Select(&results, `
		SELECT *
		FROM trb_guidance_letter_insights
		WHERE trb_request_id = $1
		AND category = $2
		AND deleted_at IS NULL
		ORDER BY position_in_letter ASC
	`, trbRequestID, category)

	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		appcontext.ZLogger(ctx).Error("Failed to fetch TRB guidance letter insights", zap.Error(err), zap.String("id", trbRequestID.String()))
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.TRBGuidanceLetterInsight{},
			Operation: apperrors.QueryFetch,
		}
	}
	return results, nil
}

// GetTRBGuidanceLetterInsightsSharingTRBRequestID queries the DB for all TRB guidance letter insights with the same TRB request ID as the given recommendation
// It will not return any entities that have a deleted_at value
func (s *Store) GetTRBGuidanceLetterInsightsSharingTRBRequestID(ctx context.Context, insightID uuid.UUID) ([]*models.TRBGuidanceLetterInsight, error) {
	stmt, err := s.db.PrepareNamed(`
		SELECT *
		FROM trb_guidance_letter_insights
		WHERE trb_request_id = (
			SELECT trb_request_id
			FROM trb_guidance_letter_insights
			WHERE id = :insightID
		) AND deleted_at IS NULL`)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to prepare SQL statement for GetTRBGuidanceLetterInsightsSharingTRBRequestID() with error %s", err),
			zap.Error(err),
			zap.String("id", insightID.String()),
		)
		return nil, err
	}
	defer stmt.Close()

	results := []*models.TRBGuidanceLetterInsight{}
	arg := map[string]interface{}{
		"insightID": insightID.String(),
	}
	err = stmt.Select(&results, arg)

	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to fetch TRB guidance letter insights with error %s", err),
			zap.Error(err),
			zap.String("id", insightID.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.TRBGuidanceLetterInsight{},
			Operation: apperrors.QueryFetch,
		}
	}
	return results, nil
}

// UpdateTRBGuidanceLetterInsight updates an existing TRB guidance letter insight record in the database
// This purposely does not update the position_in_letter column unless the `category` changes - to update the order through
// normal reordering operation, use UpdateTRBGuidanceLetterInsightOrder()
func (s *Store) UpdateTRBGuidanceLetterInsight(ctx context.Context, insight *models.TRBGuidanceLetterInsight) (*models.TRBGuidanceLetterInsight, error) {
	stmt, err := s.db.PrepareNamed(`
		UPDATE trb_guidance_letter_insights
		SET
			trb_request_id = :trb_request_id,
			title = :title,
			insight = :insight,
			links = :links,
			created_by = :created_by,
			modified_by = :modified_by,
			category = :category,
			-- update position in letter ONLY when category changes
			position_in_letter = CASE
				-- when category changes
				WHEN category <> :category
					THEN (SELECT COALESCE(MAX(position_in_letter) + 1, 0) FROM trb_guidance_letter_insights WHERE category = :category AND trb_request_id = :trb_request_id)
				-- when category does not change
				ELSE position_in_letter
			END
		WHERE id = :id
		RETURNING *;`)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to update TRB guidance letter insight %s", err),
			zap.String("id", insight.ID.String()),
		)
		return nil, err
	}
	defer stmt.Close()

	updated := models.TRBGuidanceLetterInsight{}

	err = stmt.Get(&updated, insight)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to update TRB guidance letter insight %s", err),
			zap.String("id", insight.ID.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     insight,
			Operation: apperrors.QueryUpdate,
		}
	}

	return &updated, err
}

// DeleteTRBGuidanceLetterInsight deletes an existing TRB guidance letter insight record in the database
func (s *Store) DeleteTRBGuidanceLetterInsight(ctx context.Context, id uuid.UUID, newOrder []uuid.UUID) (*models.TRBGuidanceLetterInsight, error) {
	return sqlutils.WithTransactionRet(ctx, s.db, func(tx *sqlx.Tx) (*models.TRBGuidanceLetterInsight, error) {

		stmt, err := tx.PrepareNamed(`
		UPDATE trb_guidance_letter_insights
		SET deleted_at = CURRENT_TIMESTAMP, position_in_letter = NULL
		WHERE id = :id
		RETURNING *;`)
		if err != nil {
			appcontext.ZLogger(ctx).Error(
				fmt.Sprintf("Failed to delete TRB guidance letter insight %s", err),
				zap.String("id", id.String()),
			)
			return nil, err
		}
		defer stmt.Close()

		toDelete := models.TRBGuidanceLetterInsight{}
		toDelete.ID = id
		deleted := models.TRBGuidanceLetterInsight{}

		err = stmt.Get(&deleted, &toDelete)
		if err != nil {
			appcontext.ZLogger(ctx).Error(
				fmt.Sprintf("Failed to delete TRB guidance letter insight %s", err),
				zap.String("id", id.String()),
			)
			return nil, &apperrors.QueryError{
				Err:       err,
				Model:     toDelete,
				Operation: apperrors.QueryUpdate,
			}
		}

		// remove from order
		if _, err := updateTRBGuidanceLetterInsightOrder(ctx, tx, models.UpdateTRBGuidanceLetterInsightOrderInput{
			TrbRequestID: deleted.TRBRequestID,
			NewOrder:     newOrder,
			Category:     deleted.Category,
		}); err != nil {
			return nil, err
		}

		return &deleted, err

	})
}

// UpdateTRBGuidanceLetterInsightOrder updates the ordering of insights for a given guidance letter,
// using the order of the insight IDs passed in as newOrder. No other insight columns/fields are updated.
func (s *Store) UpdateTRBGuidanceLetterInsightOrder(
	ctx context.Context,
	update models.UpdateTRBGuidanceLetterInsightOrderInput,
) ([]*models.TRBGuidanceLetterInsight, error) {
	return sqlutils.WithTransactionRet(ctx, s.db, func(tx *sqlx.Tx) ([]*models.TRBGuidanceLetterInsight, error) {
		return updateTRBGuidanceLetterInsightOrder(ctx, tx, update)
	})
}

func updateTRBGuidanceLetterInsightOrder(
	ctx context.Context,
	tx *sqlx.Tx,
	update models.UpdateTRBGuidanceLetterInsightOrderInput,
) ([]*models.TRBGuidanceLetterInsight, error) {
	// convert newOrder into a slice of maps with entries for insight ID and new position,
	// which can then be passed to SQL as JSON, then used in the query via json_to_recordset()
	newPositions := []map[string]any{}

	for index, insightID := range update.NewOrder {
		newEntry := map[string]any{
			// important to use the same keys as the columns in the SQL table, otherwise sqlx returns "missing destination name position" error
			"id":                 insightID,
			"position_in_letter": index,
		}
		newPositions = append(newPositions, newEntry)
	}

	newPositionsSerialized, err := json.Marshal(newPositions)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to marshal the JSON for updating TRB insight guidance letters with error %s", err),
			zap.Error(err),
			zap.String("trbRequestID", update.TrbRequestID.String()),
		)

		return nil, err
	}

	// json_to_recordset() lets us build a temporary table (new_positions) with the new positions for each insight,
	// which we can use in a CTE (common table expression, denoted by the WITH keyword) to update the insights
	// json_to_recordset() documentation - https://www.postgresql.org/docs/14/functions-json.html
	stmt, err := tx.PrepareNamed(`
		WITH new_positions AS (
			SELECT *
			FROM json_to_recordset(:newPositions)
			AS new_positions (id uuid, position_in_letter int)
		)
		UPDATE trb_guidance_letter_insights
		SET position_in_letter = new_positions.position_in_letter
		FROM new_positions
		WHERE trb_guidance_letter_insights.id = new_positions.id
		AND trb_guidance_letter_insights.trb_request_id = :trbRequestID
		AND trb_guidance_letter_insights.category = :category
		RETURNING *;`)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to prepare SQL statement for UpdateTRBGuidanceLetterInsightOrder() with error %s", err),
			zap.Error(err),
			zap.String("trbRequestID", update.TrbRequestID.String()),
		)
		return nil, err
	}
	defer stmt.Close()

	updatedInsights := []*models.TRBGuidanceLetterInsight{}
	arg := map[string]interface{}{
		"newPositions": string(newPositionsSerialized),
		"trbRequestID": update.TrbRequestID.String(),
		"category":     update.Category,
	}

	err = stmt.Select(&updatedInsights, arg)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to update the order of TRB insight guidance letters with error %s", err),
			zap.Error(err),
			zap.String("trbRequestID", update.TrbRequestID.String()),
		)
		return nil, err
	}

	// sort updated insights by position, return in correct order
	// (easier to do this in Go than in SQL; doing it in SQL would require wrapping the whole UPDATE query in another CTE, then using ORDER BY on that)
	slices.SortFunc(updatedInsights, func(insightA, insightB *models.TRBGuidanceLetterInsight) int {
		return int(insightA.PositionInLetter.ValueOrZero()) - int(insightB.PositionInLetter.ValueOrZero())
	})

	return updatedInsights, nil
}
