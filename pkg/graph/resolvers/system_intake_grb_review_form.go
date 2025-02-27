package resolvers

import (
	"context"

	"github.com/cms-enterprise/easi-app/pkg/models"
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
	// Fetch intake by ID
	intake, err := store.FetchSystemIntakeByIDNP(ctx, store, input.SystemIntakeID)
	if err != nil {
		return nil, err
	}

	if input.GrbReviewType.IsSet() {
		intake.GrbReviewType = *input.GrbReviewType.Value()
	}

	if input.GrbReviewAsyncRecordingTime.IsSet() {
		intake.GrbReviewAsyncRecordingTime = input.GrbReviewAsyncRecordingTime.Value()
	}

	if input.GrbReviewAsyncEndDate.IsSet() {
		intake.GrbReviewAsyncEndDate = input.GrbReviewAsyncEndDate.Value()
	}

	if input.GrbReviewStandardGRBMeetingTime.IsSet() {
		intake.GrbReviewStandardGRBMeetingTime = input.GrbReviewStandardGRBMeetingTime.Value()
	}

	if input.GrbReviewAsyncGRBMeetingTime.IsSet() {
		intake.GrbReviewAsyncGRBMeetingTime = input.GrbReviewAsyncGRBMeetingTime.Value()
	}

	// Update system intake
	updatedIntake, err := store.UpdateSystemIntakeNP(ctx, store, intake)
	if err != nil {
		return nil, err
	}

	return &models.UpdateSystemIntakePayload{
		SystemIntake: updatedIntake,
	}, nil
}
