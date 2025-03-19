package resolvers

import (
	"context"
	"errors"
	"time"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
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

// UpdateSystemIntakeGRBReviewFormInputPresentationStandard is the resolver for
// updating the GRB Review Form Presentation Standard page.
func UpdateSystemIntakeGRBReviewFormInputPresentationStandard(
	ctx context.Context,
	store *storage.Store,
	input models.UpdateSystemIntakeGRBReviewFormInputPresentationStandard,
) (*models.UpdateSystemIntakePayload, error) {
	// Fetch intake by ID
	intake, err := store.FetchSystemIntakeByID(ctx, input.SystemIntakeID)
	if err != nil {
		return nil, err
	}

	intake.GRBDate = &input.GrbDate

	// Update system intake
	updatedIntake, err := store.UpdateSystemIntake(ctx, intake)
	if err != nil {
		return nil, err
	}

	return &models.UpdateSystemIntakePayload{
		SystemIntake: updatedIntake,
	}, nil
}

// UpdateSystemIntakeGRBReviewFormInputPresentationAsync is the resolver for
// updating the GRB Review Form Presentation Async page.
func UpdateSystemIntakeGRBReviewFormInputPresentationAsync(
	ctx context.Context,
	store *storage.Store,
	input models.UpdateSystemIntakeGRBReviewFormInputPresentationAsync,
) (*models.UpdateSystemIntakePayload, error) {
	// Fetch intake by ID
	intake, err := store.FetchSystemIntakeByID(ctx, input.SystemIntakeID)
	if err != nil {
		return nil, err
	}

	if input.GrbReviewAsyncRecordingTime.IsSet() {
		intake.GrbReviewAsyncRecordingTime = input.GrbReviewAsyncRecordingTime.Value()
	}

	// Update system intake
	updatedIntake, err := store.UpdateSystemIntake(ctx, intake)
	if err != nil {
		return nil, err
	}

	return &models.UpdateSystemIntakePayload{
		SystemIntake: updatedIntake,
	}, nil
}

// UpdateSystemIntakeGRBReviewFormInputTimeframeAsync is the resolver for
// updating the GRB Review Form Timeframe Async page.
func UpdateSystemIntakeGRBReviewFormInputTimeframeAsync(
	ctx context.Context,
	store *storage.Store,
	input models.UpdateSystemIntakeGRBReviewFormInputTimeframeAsync,
) (*models.UpdateSystemIntakePayload, error) {
	// Fetch intake by ID
	intake, err := store.FetchSystemIntakeByID(ctx, input.SystemIntakeID)
	if err != nil {
		return nil, err
	}

	intake.GrbReviewAsyncEndDate = &input.GrbReviewAsyncEndDate

	// Check if the review should be set to started. If already started error
	if input.StartGRBReview {
		if intake.GRBReviewStartedAt != nil {
			return nil, errors.New("review already started")
		}

		intake.GRBReviewStartedAt = helpers.PointerTo(time.Now())
	}

	// Update system intake
	updatedIntake, err := store.UpdateSystemIntake(ctx, intake)
	if err != nil {
		return nil, err
	}

	return &models.UpdateSystemIntakePayload{
		SystemIntake: updatedIntake,
	}, nil
}

// CalcSystemIntakeGRBReviewAsyncStatus calculates the status of the GRB Review Async page
func CalcSystemIntakeGRBReviewAsyncStatus(
	intake *models.SystemIntake,
) *models.SystemIntakeGRBReviewAsyncStatusType {
	currentTime := time.Now()

	if intake.GrbReviewType != models.SystemIntakeGRBReviewTypeAsync {
		return nil
	}

	if intake.GrbReviewAsyncManualEndDate != nil && currentTime.After(*intake.GrbReviewAsyncManualEndDate) {
		return helpers.PointerTo(models.SystemIntakeGRBReviewAsyncStatusTypeCompleted)
	}

	if intake.GrbReviewAsyncEndDate == nil {
		return nil
	}

	// Evaluate if the current time is before the Grb Review Async end date
	if intake.GrbReviewAsyncEndDate.After(currentTime) {
		return helpers.PointerTo(models.SystemIntakeGRBReviewAsyncStatusTypeInProgress)
	}

	// Fallthrough case:
	//		The current time is after the Grb Review Async end date
	return helpers.PointerTo(models.SystemIntakeGRBReviewAsyncStatusTypeCompleted)
}

// ManuallyEndSystemIntakeGRBReviewAsyncVoting ends voting for the GRB Review (Async)
func ManuallyEndSystemIntakeGRBReviewAsyncVoting(
	ctx context.Context,
	store *storage.Store,
	input models.ManuallyEndSystemIntakeGRBReviewAsyncVotingInput,
) (*models.UpdateSystemIntakePayload, error) {
	currentTime := time.Now()

	// Fetch intake by ID
	intake, err := store.FetchSystemIntakeByID(ctx, input.SystemIntakeID)
	if err != nil {
		return nil, err
	}

	intake.GrbReviewAsyncManualEndDate = &currentTime

	// Update system intake
	updatedIntake, err := store.UpdateSystemIntake(ctx, intake)
	if err != nil {
		return nil, err
	}

	return &models.UpdateSystemIntakePayload{
		SystemIntake: updatedIntake,
	}, nil
}
