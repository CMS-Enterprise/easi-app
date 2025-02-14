package resolvers

import (
	"context"

	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

// UpdateSystemIntakeGRBReviewType updates the GRB review type on a system intake
func UpdateSystemIntakeGRBReviewType(
	ctx context.Context,
	store *storage.Store,
	input models.UpdateSystemIntakeGRBReviewTypeInput,
) (*models.UpdateSystemIntakePayload, error) {
	return storage.UpdateSystemIntakeGRBReviewType(
		ctx,
		store,
		input.SystemIntakeID,
		input.GrbReviewType,
	)
}

func UpdateSystemIntakeGRBReviewForm(
	ctx context.Context,
	store *storage.Store,
	input models.UpdateSystemIntakeGRBReviewFormInput,
) (*models.UpdateSystemIntakePayload, error) {
	return sqlutils.WithTransactionRet[*models.UpdateSystemIntakePayload](ctx, store, func(tx *sqlx.Tx) (*models.UpdateSystemIntakePayload, error) {
		// Fetch intake by ID
		intake, err := store.FetchSystemIntakeByIDNP(ctx, tx, input.SystemIntakeID)
		if err != nil {
			return nil, err
		}

		if input.GrbReviewType != nil {
			intake.GrbReviewType = *input.GrbReviewType
		}

		if input.GrbReviewAsyncRecordingTime != nil {
			intake.GrbReviewAsyncRecordingTime = input.GrbReviewAsyncRecordingTime
		}

		if input.GrbReviewAsyncEndDate != nil {
			intake.GrbReviewAsyncEndDate = input.GrbReviewAsyncEndDate
		}

		if input.GrbReviewStandardGRBMeetingTime != nil {
			intake.GrbReviewStandardGRBMeetingTime = input.GrbReviewStandardGRBMeetingTime
		}

		if input.GrbReviewAsyncGRBMeetingTime != nil {
			intake.GrbReviewAsyncGRBMeetingTime = input.GrbReviewAsyncGRBMeetingTime
		}

		// Update system intake
		updatedIntake, err := store.UpdateSystemIntakeNP(ctx, tx, intake)
		if err != nil {
			return nil, err
		}

		return &models.UpdateSystemIntakePayload{
			SystemIntake: updatedIntake,
		}, nil
	})
}
