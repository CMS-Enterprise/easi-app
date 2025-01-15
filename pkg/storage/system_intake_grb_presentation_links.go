package storage

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/sqlqueries"
)

func (s *Store) DeleteSystemIntakeGRBPresentationLinks(ctx context.Context, systemIntakeID uuid.UUID) error {
	_, err := namedExec(ctx, s.db, sqlqueries.SystemIntakeGRBPresentationLinks.Delete, args{
		"system_intake_id": systemIntakeID,
	})
	return err
}
