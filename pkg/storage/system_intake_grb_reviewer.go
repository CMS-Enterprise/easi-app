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

func (s *Store) SystemIntakeGRBReviewersBySystemIntakeIDs(ctx context.Context, systemIntakeIDs []uuid.UUID) ([]*models.SystemIntakeGRBReviewer, error) {
	var systemIntakeGRBReviewers []*models.SystemIntakeGRBReviewer
	return systemIntakeGRBReviewers, selectNamed(ctx, s, &systemIntakeGRBReviewers, sqlqueries.SystemIntakeGRBReviewer.GetBySystemIntakeID, args{
		"system_intake_ids": pq.Array(systemIntakeIDs),
	})
}
