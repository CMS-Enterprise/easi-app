package storage

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlqueries"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
)

// UpdateSystemIntakeFundingSources clears and updates the funding sources of a system intake using an automatically created transaction
func (s *Store) UpdateSystemIntakeFundingSources(ctx context.Context, systemIntakeID uuid.UUID, fundingSources []*models.SystemIntakeFundingSource) ([]*models.SystemIntakeFundingSource, error) {
	return sqlutils.WithTransactionRet[[]*models.SystemIntakeFundingSource](ctx, s, func(tx *sqlx.Tx) ([]*models.SystemIntakeFundingSource, error) {
		return s.UpdateSystemIntakeFundingSourcesNP(ctx, tx, systemIntakeID, fundingSources)

	})
}

// UpdateSystemIntakeFundingSourcesNP clears and updates the funding sources of a system intake
func (s *Store) UpdateSystemIntakeFundingSourcesNP(ctx context.Context, tx *sqlx.Tx, systemIntakeID uuid.UUID, fundingSources []*models.SystemIntakeFundingSource) ([]*models.SystemIntakeFundingSource, error) {
	now := s.clock.Now()

	deleteFundingSourcesSQL := `
		DELETE FROM system_intake_funding_sources
		WHERE system_intake_id = $1;
	`
	_, err := tx.Exec(deleteFundingSourcesSQL, systemIntakeID.String())

	if err != nil {
		appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to create funding sources transaction, error %s", err))
		return nil, err
	}

	for _, fundingSource := range fundingSources {
		if fundingSource != nil {
			if fundingSource.ID == uuid.Nil {
				fundingSource.ID = uuid.New()
			}
			if fundingSource.CreatedAt == nil {
				fundingSource.CreatedAt = &now
			}
			fundingSource.SystemIntakeID = systemIntakeID

			const createFundingSourceSQL = `
				INSERT INTO system_intake_funding_sources (
					id,
					system_intake_id,
					source,
					funding_number,
					created_at
				)
				VALUES (
					:id,
					:system_intake_id,
					:source,
					:funding_number,
					:created_at
				)`

			_, err = tx.NamedExec(
				createFundingSourceSQL,
				fundingSource,
			)

			if err != nil {
				appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to insert a funding source, error %s", err))
				return nil, err
			}
		}
	}

	return fundingSources, nil
}

// FetchSystemIntakeFundingSourcesByIntakeID fetches all funding sources for a system intake
func (s *Store) FetchSystemIntakeFundingSourcesByIntakeID(ctx context.Context, systemIntakeID uuid.UUID) ([]*models.SystemIntakeFundingSource, error) {
	sources := []*models.SystemIntakeFundingSource{}
	err := namedSelect(ctx, s, &sources, sqlqueries.SystemIntakeFundingSources.GetAllBySystemIntakeID, args{
		"system_intake_id": systemIntakeID,
	})

	if err != nil {
		appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to fetch funding sources, error %s", err))
		return sources, err
	}

	return sources, nil
}

// FetchSystemIntakeFundingSourcesByIntakeIDs fetches all funding sources for a slice of system intake IDs
func (s *Store) FetchSystemIntakeFundingSourcesByIntakeIDs(ctx context.Context, systemIntakeIDs []uuid.UUID) ([]*models.SystemIntakeFundingSource, error) {
	sources := []*models.SystemIntakeFundingSource{}
	err := namedSelect(ctx, s, &sources, sqlqueries.SystemIntakeFundingSources.GetAllBySystemIntakeIDs, args{
		"system_intake_ids": pq.Array(systemIntakeIDs),
	})

	if err != nil {
		appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to fetch funding sources, error %s", err))
		return sources, err
	}

	return sources, nil
}
