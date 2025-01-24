package storage

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlqueries"
)

func (s *Store) SystemIntakeGRBPresentationLinksByIntakeIDs(ctx context.Context, systemIntakeIDs []uuid.UUID) ([]*models.SystemIntakeGRBPresentationLinks, error) {
	var links []*models.SystemIntakeGRBPresentationLinks
	if err := namedSelect(ctx, s.db, &links, sqlqueries.SystemIntakeGRBPresentationLinks.GetByIntakeIDs, args{
		"system_intake_ids": pq.Array(systemIntakeIDs),
	}); err != nil {
		appcontext.ZLogger(ctx).Error("failed to fetch system intake GRB presentation links by intake IDs", zap.Error(err))
		return nil, err
	}

	return links, nil
}

func (s *Store) DeleteSystemIntakeGRBPresentationLinks(ctx context.Context, systemIntakeID uuid.UUID) error {
	res, err := namedExec(ctx, s.db, sqlqueries.SystemIntakeGRBPresentationLinks.Delete, args{
		"system_intake_id": systemIntakeID,
	})
	if err != nil {
		appcontext.ZLogger(ctx).Error("failed to delete GRB presentation links", zap.Error(err))
		return err
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		appcontext.ZLogger(ctx).Error("failed to get rows affected when deleting GRB presentation links", zap.Error(err))
		// don't return here - prefer to err from the below
	}

	if rowsAffected != 1 {
		return fmt.Errorf("problem deleting GRB presentation links, expected 1 row deleted, got %d", rowsAffected)
	}

	return nil
}
