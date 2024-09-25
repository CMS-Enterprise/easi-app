package storage

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"

	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlqueries"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
)

// CreateTRBRequestSystemIntakes deletes all TRB Intake relations for the given trbRequestID and recreates them
func (s *Store) CreateTRBRequestSystemIntakes(ctx context.Context, trbRequestID uuid.UUID, systemIntakeIDs []uuid.UUID) ([]*models.TRBRequestSystemIntake, error) {
	return sqlutils.WithTransactionRet[[]*models.TRBRequestSystemIntake](ctx, s.db, func(tx *sqlx.Tx) ([]*models.TRBRequestSystemIntake, error) {

		deleteTRBRequestSystemIntakesSQL := `
		DELETE FROM trb_request_system_intakes
		WHERE trb_request_id = $1;
	`
		if _, err := tx.Exec(deleteTRBRequestSystemIntakesSQL, trbRequestID); err != nil {
			appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to create TRB request system intakes transaction, error %s", err))
			return nil, err
		}

		// Create a new TRBRequestSystemIntake for each SystemIntake ID
		trbRequestSystemIntakes := []models.TRBRequestSystemIntake{}
		for _, systemIntakeID := range systemIntakeIDs {
			trbIntake := models.TRBRequestSystemIntake{
				TRBRequestID:   trbRequestID,
				SystemIntakeID: systemIntakeID,
			}
			trbIntake.CreatedBy = appcontext.Principal(ctx).ID()
			trbIntake.ID = uuid.New()
			trbRequestSystemIntakes = append(trbRequestSystemIntakes, trbIntake)
		}

		if len(trbRequestSystemIntakes) > 0 {
			insertTRBRequestSystemIntakesSQL := `
			INSERT INTO trb_request_system_intakes (
					id,
					trb_request_id,
					system_intake_id,
					created_by,
					modified_by
				)
				VALUES (
					:id,
					:trb_request_id,
					:system_intake_id,
					:created_by,
					:modified_by
				)
			`
			if _, err := tx.NamedExec(insertTRBRequestSystemIntakesSQL, trbRequestSystemIntakes); err != nil {
				appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to create TRB request system intakes transaction, error %s", err))
				return nil, err
			}
		}

		insertedTRBRequestSystemIntakes := []*models.TRBRequestSystemIntake{}
		getTRBRequestIntakesSQL := `SELECT * FROM trb_request_system_intakes WHERE trb_request_id = $1;`
		if err := tx.Select(&insertedTRBRequestSystemIntakes, getTRBRequestIntakesSQL, trbRequestID); err != nil {
			appcontext.ZLogger(ctx).Error(fmt.Sprintf("Failed to create TRB request system intakes transaction, error %s", err))
			return nil, err
		}

		return insertedTRBRequestSystemIntakes, nil
	})
}

// GetTRBRequestFormSystemIntakesByTRBRequestID retrieves all system intakes that have been related to a given TRB
// request ID
func (s *Store) GetTRBRequestFormSystemIntakesByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) ([]*models.SystemIntake, error) {
	results := []*models.SystemIntake{}
	err := namedSelect(ctx, s.db, &results, sqlqueries.TRBRequestFormSystemIntakes.GetByTRBRequestID, args{
		"trb_request_id": trbRequestID,
	})
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch TRB request system intakes",
			zap.Error(err),
			zap.String("id", trbRequestID.String()),
		)

		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.SystemIntake{},
			Operation: apperrors.QueryFetch,
		}
	}
	return results, nil
}

// GetTRBRequestFormSystemIntakesByTRBRequestIDs retrieves all system intakes that have been related to a list of TRB
// request IDs
func (s *Store) GetTRBRequestFormSystemIntakesByTRBRequestIDs(ctx context.Context, trbRequestIDs []uuid.UUID) ([]*models.RelatedSystemIntake, error) {
	results := []*models.RelatedSystemIntake{}
	err := namedSelect(ctx, s.db, &results, sqlqueries.TRBRequestFormSystemIntakes.GetByTRBRequestIDs, args{
		"trb_request_ids": pq.Array(trbRequestIDs),
	})
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch TRB request system intakes",
			zap.Error(err),
		)

		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.RelatedSystemIntake{},
			Operation: apperrors.QueryFetch,
		}
	}
	return results, nil
}
