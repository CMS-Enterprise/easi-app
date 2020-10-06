package storage

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

// CreateAction creates an Action item in the database
func (s *Store) CreateAction(ctx context.Context, action *models.SystemIntakeAction) (*models.SystemIntakeAction, error) {
	id := uuid.New()
	action.ID = id
	createAt := s.clock.Now()
	action.CreatedAt = &createAt
	const createActionSQL = `	
		INSERT INTO actions (
			id,
			action_type,
			actor_name,
		    actor_email,
		    actor_eua_user_id,
			intake_id,
			created_at
		) 
		VALUES (
			:id,
			:action_type,
		    :actor_name,
		    :actor_email,
			:actor_eua_user_id,
		    :intake_id,    
		    :created_at
		)`
	_, err := s.DB.NamedExec(
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
