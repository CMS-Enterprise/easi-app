package storage

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/sqlqueries"
)

func (s *Store) LinkedRequests(ctx context.Context, cedarSystemID string) (*models.CedarLinkedRequests, error) {
	var linkedRequests models.CedarLinkedRequests
	return &linkedRequests, s.db.Select(&linkedRequests, sqlqueries.CedarLinkedRequestsForm.Select, cedarSystemID)
}
