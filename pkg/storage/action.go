package storage

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// CreateAction creates an Action item in the database
func (s *Store) CreateAction(ctx context.Context, action *models.Action) (*models.Action, error) {
	id := uuid.New()
	action.ID = id
	if action.CreatedAt == nil {
		createAt := s.clock.Now()
		action.CreatedAt = &createAt
	}
	const createActionSQL = `
		INSERT INTO actions (
			id,
			action_type,
			actor_name,
		    actor_email,
		    actor_eua_user_id,
			intake_id,
			feedback,
			created_at
		)
		VALUES (
			:id,
			:action_type,
		    :actor_name,
		    :actor_email,
			:actor_eua_user_id,
		    :intake_id,
			:feedback,
		    :created_at
		)`
	_, err := s.db.NamedExec(
		createActionSQL,
		action,
	)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to create action with error %s", err),
			zap.String("user", appcontext.Principal(ctx).ID()),
		)
		return nil, err
	}
	return action, nil
}

// GetActionsByRequestID fetches actions for a particular request
func (s *Store) GetActionsByRequestID(ctx context.Context, id uuid.UUID) ([]models.Action, error) {
	actions := []models.Action{}
	const fetchActionsByRequestIDSQL = `
		SELECT
		       *
		FROM
		     actions
		WHERE actions.intake_id=$1
		ORDER BY created_at DESC
	`
	err := s.db.Select(&actions, fetchActionsByRequestIDSQL, id)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch actions",
			zap.String("intakeID", id.String()),
			zap.String("error", err.Error()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     []models.Action{},
			Operation: apperrors.QueryFetch,
		}
	}
	return actions, nil
}
