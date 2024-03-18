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

// CreateGovernanceRequestFeedback creates a governance request feedback record in the database
func (s *Store) CreateGovernanceRequestFeedback(ctx context.Context, requestFeedback *models.GovernanceRequestFeedback) (*models.GovernanceRequestFeedback, error) {
	if requestFeedback.ID == uuid.Nil {
		requestFeedback.ID = uuid.New()
	}

	const governanceRequestFeedbackCreateSQL = `
		INSERT INTO governance_request_feedback(
			id,
			intake_id,
			feedback,
			source_action,
			target_form,
			type,
			created_by
		) VALUES (
			:id,
			:intake_id,
			:feedback,
			:source_action,
			:target_form,
			:type,
			:created_by
		) RETURNING *;
	`

	stmt, err := s.db.PrepareNamed(governanceRequestFeedbackCreateSQL)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to create governance request feedback with error %s", err),
			zap.Error(err),
			zap.Any("user", requestFeedback.CreatedBy), // use zap.Any to handle possible nil pointers
		)
		return nil, err
	}
	defer stmt.Close()

	retFeedback := models.GovernanceRequestFeedback{}

	err = stmt.Get(&retFeedback, requestFeedback)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to create governance request feedback with error %s", err),
			zap.Error(err),
			zap.Any("user", requestFeedback.CreatedBy), // use zap.Any to handle possible nil pointers
		)
		return nil, err
	}

	return &retFeedback, nil
}

// GetGovernanceRequestFeedbacksByIntakeID returns all governance request feedback items for a given system intake
func (s *Store) GetGovernanceRequestFeedbacksByIntakeID(ctx context.Context, intakeID uuid.UUID) ([]*models.GovernanceRequestFeedback, error) {
	feedbacks := []*models.GovernanceRequestFeedback{}

	stmt, err := s.db.PrepareNamed(`SELECT * FROM governance_request_feedback WHERE intake_id = :intake_id`)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch governance request feedbacks",
			zap.Error(err),
			zap.String("intakeID", intakeID.String()),
		)
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{"intake_id": intakeID}

	err = stmt.Select(&feedbacks, arg)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch governance request feedbacks",
			zap.Error(err),
			zap.String("intakeID", intakeID.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     []*models.GovernanceRequestFeedback{},
			Operation: apperrors.QueryFetch,
		}
	}

	return feedbacks, nil
}
