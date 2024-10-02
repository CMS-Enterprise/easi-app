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

// UpdateSystemIntakeSoftwareAcquisition clears and updates the Software Acquisition information of a system intake using an automatically created transaction
func (s *Store) UpdateSystemIntakeSoftwareAcquisition(ctx context.Context, systemIntakeID uuid.UUID, softwareAcquisition *models.SystemIntakeSoftwareAcquisition) (*models.SystemIntakeSoftwareAcquisition, error) {
	return sqlutils.WithTransactionRet[*models.SystemIntakeSoftwareAcquisition](ctx, s, func(tx *sqlx.Tx) (*models.SystemIntakeSoftwareAcquisition, error) {
		return s.UpdateSystemIntakeSoftwareAcquisitionNP(ctx, tx, systemIntakeID, softwareAcquisition)
	})
}

// UpdateSystemIntakeSoftwareAcquisitionNP clears and updates the Software Acquisition information of a system intake
func (s *Store) UpdateSystemIntakeSoftwareAcquisitionNP(ctx context.Context, tx *sqlx.Tx, systemIntakeID uuid.UUID, softwareAcquisition *models.SystemIntakeSoftwareAcquisition) (*models.SystemIntakeSoftwareAcquisition, error) {
	// TODO: NJD - do I need CreatedAt?
	// now := s.clock.Now()

	deleteSoftwareAcquisitionSQL := `
		DELETE FROM system_intake_software_acquisition
		WHERE system_intake_id = $1;
	`
	_, err := tx.Exec(deleteSoftwareAcquisitionSQL, systemIntakeID.String())

	if err != nil {
		appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to create Software Acquisition transaction, error %s", err))
		return nil, err
	}

	const createSoftwareAcquisitionSQL = `
				INSERT INTO system_intake_software_acquisition (
					id,
					system_intake_id,
					using_software,
					acquisition_methods,
					created_by,
					created_at,
					modified_by,
					modified_at
				)
				VALUES (
					:id,
					:system_intake_id,
					:using_software,
					:acquisition_methods,
					:created_by,
					:created_at,
					:modified_by,
					:modified_at
				)`

	_, err = tx.NamedExec(
		createSoftwareAcquisitionSQL,
		softwareAcquisition,
	)

	if err != nil {
		appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to insert Software Acquisition information, error %s", err))
		return nil, err
	}

	return softwareAcquisition, nil
}

// FetchSystemIntakeSoftwareAcquisitionByIntakeID fetches Software Acquisition information for a given system intake
func (s *Store) FetchSystemIntakeSoftwareAcquisitionByIntakeID(ctx context.Context, systemIntakeID uuid.UUID) (*models.SystemIntakeSoftwareAcquisition, error) {
	softwareAcuisition := models.SystemIntakeSoftwareAcquisition{}
	err := namedSelect(ctx, s, &softwareAcuisition, sqlqueries.SystemIntakeSoftwareAcquisition.GetBySystemIntakeID, args{
		"system_intake_id": systemIntakeID,
	})

	if err != nil {
		appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to fetch Software Acquisition information, error %s", err))
		return nil, err
	}

	return &softwareAcuisition, nil
}

// FetchSystemIntakeSoftwareAcquisitionByIntakeIDs fetches Software Acquisition information for a slice of system intake IDs
func (s *Store) FetchSystemIntakeSoftwareAcquisitionByIntakeIDs(ctx context.Context, systemIntakeIDs []uuid.UUID) ([]*models.SystemIntakeSoftwareAcquisition, error) {
	softwareAcuisitions := []*models.SystemIntakeSoftwareAcquisition{}
	err := namedSelect(ctx, s, &softwareAcuisitions, sqlqueries.SystemIntakeSoftwareAcquisition.GetBySystemIntakeIDs, args{
		"system_intake_ids": pq.Array(systemIntakeIDs),
	})

	if err != nil {
		appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to fetch Software Acquisition information from multiple intakes, error %s", err))
		return softwareAcuisitions, err
	}

	return softwareAcuisitions, nil
}
