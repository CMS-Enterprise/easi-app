package storage

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/sqlutils"
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

// GetTRBRequestSystemIntakesByTRBRequestID retrieves all system intakes that have been related to a given TRB
// request ID
func (s *Store) GetTRBRequestSystemIntakesByTRBRequestID(ctx context.Context, trbRequestID uuid.UUID) ([]*models.SystemIntake, error) {
	results := []*models.SystemIntake{}

	err := s.db.Select(&results, `
		SELECT b.*
		FROM trb_request_system_intakes a
		JOIN system_intakes b
		ON b.id = a.system_intake_id
		WHERE a.trb_request_id = $1;`, trbRequestID)

	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		appcontext.ZLogger(ctx).Error(
			"Failed to fetch TRB request system intakes",
			zap.Error(err),
			zap.String("id", trbRequestID.String()))

		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.TRBRequestSystemIntake{},
			Operation: apperrors.QueryFetch,
		}
	}
	return results, nil
}
