package storage

import (
	"context"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlqueries"
)

func (s *Store) SetSystemIntakeGRBPresentationLinks(ctx context.Context, links *models.SystemIntakeGRBPresentationLinks) (*models.SystemIntakeGRBPresentationLinks, error) {
	var output models.SystemIntakeGRBPresentationLinks
	if err := namedGet(ctx, s.db, &output, sqlqueries.SystemIntakeGRBPresentationLinks.Upsert, links); err != nil {
		appcontext.ZLogger(ctx).Error("failed to set system intake GRB presentation links", zap.Error(err))
		return nil, err
	}

	return &output, nil
}

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
	_, err := namedExec(ctx, s.db, sqlqueries.SystemIntakeGRBPresentationLinks.Delete, args{
		"system_intake_id": systemIntakeID,
	})
	if err != nil {
		appcontext.ZLogger(ctx).Error("failed to delete GRB presentation links", zap.Error(err))
		return err
	}

	return nil
}
