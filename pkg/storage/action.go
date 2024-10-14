package storage

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlqueries"
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
			step,
			feedback,
			created_at,
			lcid_expiration_change_new_date,
			lcid_expiration_change_previous_date,
			lcid_expiration_change_new_scope,
			lcid_expiration_change_previous_scope,
			lcid_expiration_change_new_next_steps,
			lcid_expiration_change_previous_next_steps,
			lcid_expiration_change_new_cost_baseline,
			lcid_expiration_change_previous_cost_baseline,
			lcid_retirement_change_new_date,
			lcid_retirement_change_previous_date
		)
		VALUES (
			:id,
			:action_type,
		    :actor_name,
		    :actor_email,
			:actor_eua_user_id,
		    :intake_id,
			:step,
			:feedback,
		    :created_at,
			:lcid_expiration_change_new_date,
			:lcid_expiration_change_previous_date,
			:lcid_expiration_change_new_scope,
			:lcid_expiration_change_previous_scope,
			:lcid_expiration_change_new_next_steps,
			:lcid_expiration_change_previous_next_steps,
			:lcid_expiration_change_new_cost_baseline,
			:lcid_expiration_change_previous_cost_baseline,
			:lcid_retirement_change_new_date,
			:lcid_retirement_change_previous_date
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

// GetActionsBySystemIntakeID fetches actions for a particular intake
func (s *Store) GetActionsBySystemIntakeID(ctx context.Context, systemIntakeID uuid.UUID) ([]models.Action, error) {
	actions := []models.Action{}
	err := namedSelect(ctx, s.db, &actions, sqlqueries.SystemIntakeActions.SelectBySystemIntakeID, args{
		"system_intake_id": systemIntakeID,
	})
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch actions",
			zap.String("intakeID", systemIntakeID.String()),
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

// GetActionsBySystemIntakeIDs fetches actions for a multiple intakes
func (s *Store) GetActionsBySystemIntakeIDs(ctx context.Context, systemIntakeIDs []uuid.UUID) ([]models.Action, error) {
	actions := []models.Action{}
	err := namedSelect(ctx, s.db, &actions, sqlqueries.SystemIntakeActions.SelectBySystemIntakeIDs, args{
		"system_intake_ids": pq.Array(systemIntakeIDs),
	})
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch actions",
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
