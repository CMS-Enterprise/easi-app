package storage

import (
	"context"
	"fmt"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlqueries"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
)

// UpdateSystemIntakeELAInfo clears and updates the ELA information of a system intake using an automatically created transaction
func (s *Store) UpdateSystemIntakeELAInfo(ctx context.Context, systemIntakeID uuid.UUID, elaInfo []*models.SystemIntakeELAInfo) ([]*models.SystemIntakeELAInfo, error) {
	return sqlutils.WithTransactionRet[[]*models.SystemIntakeELAInfo](ctx, s, func(tx *sqlx.Tx) ([]*models.SystemIntakeELAInfo, error) {
		return s.UpdateSystemIntakeELAInfoNP(ctx, tx, systemIntakeID, elaInfo)

	})
}

// UpdateSystemIntakeELAInfoNP clears and updates the ELA information of a system intake
func (s *Store) UpdateSystemIntakeELAInfoNP(ctx context.Context, tx *sqlx.Tx, systemIntakeID uuid.UUID, elaInfo []*models.SystemIntakeELAInfo) ([]*models.SystemIntakeELAInfo, error) {
	now := s.clock.Now()

	deleteELAInfoSQL := `
		DELETE FROM system_intake_ela_info
		WHERE system_intake_id = $1;
	`
	_, err := tx.Exec(deleteELAInfoSQL, systemIntakeID.String())

	if err != nil {
		appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to create ELA info transaction, error %s", err))
		return nil, err
	}

	for _, ela := range elaInfo {
		if ela != nil {
			if ela.ID == uuid.Nil {
				ela.ID = uuid.New()
			}
			if ela.CreatedAt == nil {
				ela.CreatedAt = &now
			}
			ela.SystemIntakeID = systemIntakeID

			const createELAInfoSQL = `
				INSERT INTO system_intake_ela_info (
					id,
					system_intake_id,
					ela_name,
					created_at
				)
				VALUES (
					:id,
					:system_intake_id,
					:ela_name,
					:created_at
				)`

			_, err = tx.NamedExec(
				createELAInfoSQL,
				ela,
			)

			if err != nil {
				appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to insert ELA information, error %s", err))
				return nil, err
			}
		}
	}

	return elaInfo, nil
}

// FetchSystemIntakeELAInfoByIntakeID fetches ELA information for a given system intake
func (s *Store) FetchSystemIntakeELAInfoByIntakeID(ctx context.Context, systemIntakeID uuid.UUID) ([]*models.SystemIntakeELAInfo, error) {
	sources := []*models.SystemIntakeELAInfo{}
	err := namedSelect(ctx, s, &sources, sqlqueries.SystemIntakeElaInfo.GetBySystemIntakeID, args{
		"system_intake_id": systemIntakeID,
	})

	if err != nil {
		appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to fetch ELA information, error %s", err))
		return sources, err
	}

	return sources, nil
}

// FetchSystemIntakeELAInfoByIntakeIDs fetches ELA information for a slice of system intake IDs
func (s *Store) FetchSystemIntakeELAInfoByIntakeIDs(ctx context.Context, systemIntakeIDs []uuid.UUID) ([]*models.SystemIntakeELAInfo, error) {
	sources := []*models.SystemIntakeELAInfo{}
	err := namedSelect(ctx, s, &sources, sqlqueries.SystemIntakeElaInfo.GetBySystemIntakeIDs, args{
		"system_intake_ids": pq.Array(systemIntakeIDs),
	})

	if err != nil {
		appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to fetch ELA information from multiple intakes, error %s", err))
		return sources, err
	}

	return sources, nil
}
