package storage

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/sqlqueries"
)

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
	}

	if rowsAffected != 1 {
		return fmt.Errorf("problem deleting GRB presentation links, expected 1 row deleted, got %d", rowsAffected)
	}

	return nil
}
