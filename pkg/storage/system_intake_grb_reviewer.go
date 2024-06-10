package storage

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
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
	fmt.Printf("%v\n", reviewer)
	if _, err := tx.NamedExec(sqlqueries.SystemIntakeGRBReviewer.Create, reviewer); err != nil {
		appcontext.ZLogger(ctx).Error("failed to create GRB reviewer", zap.Error(err))
		return err
	}

	return nil
}
