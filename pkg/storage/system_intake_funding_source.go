package storage

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

// UpdateSystemIntakeFundingSources clears and updates the funding sources of a system intake
func (s *Store) UpdateSystemIntakeFundingSources(ctx context.Context, systemIntakeID uuid.UUID, fundingSources []*models.SystemIntakeFundingSource) ([]*models.SystemIntakeFundingSource, error) {
	now := s.clock.Now()

	tx := s.db.MustBegin()
	defer tx.Rollback()
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

	err = tx.Commit()
	if err != nil {
		appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to commit funding sources transaction, error %s", err))
		return nil, err
	}

	return fundingSources, nil
}

// FetchSystemIntakeFundingSourcesByIntakeID fetches all funding sources for a system intake
func (s *Store) FetchSystemIntakeFundingSourcesByIntakeID(ctx context.Context, systemIntakeID uuid.UUID) ([]*models.SystemIntakeFundingSource, error) {
	sources := []*models.SystemIntakeFundingSource{}
	err := s.db.Select(&sources, `
		SELECT *
		FROM system_intake_funding_sources
		WHERE system_intake_id=$1
	`, systemIntakeID)

	if err != nil {
		appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to fetch funding sources, error %s", err))
		return sources, err
	}

	return sources, nil
}
