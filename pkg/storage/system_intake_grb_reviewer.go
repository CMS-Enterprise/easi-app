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
func (s *Store) CreateSystemIntakeGRBReviewer(ctx context.Context, tx *sqlx.Tx, systemIntakeID uuid.UUID, reviewer *models.SystemIntakeGRBReviewer) error {
	if reviewer.ID == uuid.Nil {
		reviewer.ID = uuid.New()
	}
	if _, err := tx.NamedExec(sqlqueries.SystemIntakeGRBReviewer.Create, reviewer); err != nil {
		appcontext.ZLogger(ctx).Error("failed to create GRB reviewer", zap.Error(err))
		return err
	}

	return nil
}

func (s *Store) UpdateSystemIntakeGRBReviewer(ctx context.Context, tx *sqlx.Tx, reviewerID uuid.UUID, votingRole models.SystemIntakeGRBReviewerVotingRole, grbRole models.SystemIntakeGRBReviewerRole) (*models.SystemIntakeGRBReviewer, error) {
	var reviewer models.SystemIntakeGRBReviewer
	stmt, err := tx.PrepareNamed(sqlqueries.SystemIntakeGRBReviewer.Update)
	if err != nil {
		appcontext.ZLogger(ctx).Error("failed to prepare update GRB reviewer query", zap.Error(err))
		return nil, err
	}
	defer stmt.Close()
	err = stmt.Get(&reviewer, args{
		"reviewer_id": reviewerID,
		"grb_role":    grbRole,
		"voting_role": votingRole,
		"modified_by": appcontext.Principal(ctx).Account().ID,
	})
	if err != nil {
		appcontext.ZLogger(ctx).Error("failed to update GRB reviewer", zap.Error(err))
		return nil, err
	}
	return &reviewer, nil
}

func (s *Store) DeleteSystemIntakeGRBReviewer(ctx context.Context, tx *sqlx.Tx, reviewerID uuid.UUID) error {
	if _, err := tx.NamedExec(sqlqueries.SystemIntakeGRBReviewer.Delete, args{
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
