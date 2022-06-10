package storage

import (
	"context"

	"github.com/google/uuid"

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
			if fundingSource.UpdatedAt == nil {
				fundingSource.UpdatedAt = &now
			}
			const createFundingSourceSQL = `
				INSERT INTO system_intakes (
					id,
					system_intake_id,
					source,
					funding_number,
					created_at,
					updated_at
				)
				VALUES (
					:id,
					:system_intake_id,
					:source,
					:funding_number,
					:created_at,
					:updated_at
				)`

			_, err = tx.NamedExec(
				createFundingSourceSQL,
				fundingSource,
			)

			if err != nil {
				return nil, err
			}
		}
	}

	err = tx.Commit()
	if err != nil {
		return nil, err
	}

	return fundingSources, nil
}
