package storage

import (
	"context"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/sqlqueries"
)

// CreateSystemIntakeGRBReviewer creates a GRB Reviewer
func (s *Store) CreateSystemIntakeGRBReviewer(ctx context.Context, tx *sqlx.Tx, reviewer *models.SystemIntakeGRBReviewer) error {
	if reviewer.ID == uuid.Nil {
		reviewer.ID = uuid.New()
	}
	if _, err := namedExec(ctx, tx, sqlqueries.SystemIntakeGRBReviewer.Create, reviewer); err != nil {
		appcontext.ZLogger(ctx).Error("failed to create GRB reviewer", zap.Error(err))
		return err
	}

	return nil
}

func (s *Store) UpdateSystemIntakeGRBReviewer(ctx context.Context, tx *sqlx.Tx, reviewerID uuid.UUID, votingRole models.SystemIntakeGRBReviewerVotingRole, grbRole models.SystemIntakeGRBReviewerRole) (*models.SystemIntakeGRBReviewer, error) {
	updatedReviewer := &models.SystemIntakeGRBReviewer{}
	if err := namedGet(ctx, tx, updatedReviewer, sqlqueries.SystemIntakeGRBReviewer.Update, args{
		"reviewer_id": reviewerID,
		"grb_role":    grbRole,
		"voting_role": votingRole,
		"modified_by": appcontext.Principal(ctx).Account().ID,
	}); err != nil {
		appcontext.ZLogger(ctx).Error(
			"error updating system intake GRB reviewer",
			zap.String("reviewer_id", reviewerID.String()),
		)
	}

	return updatedReviewer, nil
}

func (s *Store) DeleteSystemIntakeGRBReviewer(ctx context.Context, tx *sqlx.Tx, reviewerID uuid.UUID) error {
	if _, err := namedExec(ctx, tx, sqlqueries.SystemIntakeGRBReviewer.Delete, args{
		"reviewer_id": reviewerID,
	}); err != nil {
		appcontext.ZLogger(ctx).Error("failed to delete GRB reviewer", zap.Error(err))
		return err
	}
	return nil
}

func (s *Store) SystemIntakeGRBReviewersBySystemIntakeIDs(ctx context.Context, systemIntakeIDs []uuid.UUID) ([]*models.SystemIntakeGRBReviewer, error) {
	var systemIntakeGRBReviewers []*models.SystemIntakeGRBReviewer
	return systemIntakeGRBReviewers, namedSelect(ctx, s, &systemIntakeGRBReviewers, sqlqueries.SystemIntakeGRBReviewer.GetBySystemIntakeID, args{
		"system_intake_ids": pq.Array(systemIntakeIDs),
	})
}
