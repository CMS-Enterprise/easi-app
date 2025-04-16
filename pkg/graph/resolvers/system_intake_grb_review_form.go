package resolvers

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"

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
	intake.GrbReviewAsyncManualEndDate = nil

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

// CalcSystemIntakeGRBReviewStandardStatus calculates the status of a standard (not async) GRB Review
// the logic here is _very_ similar to that in calcSystemIntakeStandardGRBReviewStatusAdmin
// TODO Consider refactoring to share the logic?
func CalcSystemIntakeGRBReviewStandardStatus(
	intake *models.SystemIntake,
) *models.SystemIntakeGRBReviewStandardStatusType {
	if intake.GrbReviewType != models.SystemIntakeGRBReviewTypeStandard {
		return nil
	}

	if intake.GRBDate == nil {
		return nil
	}

	if intake.GRBDate.After(time.Now()) {
		return helpers.PointerTo(models.SystemIntakeGRBReviewStandardStatusTypeScheduled)
	}

	return helpers.PointerTo(models.SystemIntakeGRBReviewStandardStatusTypeCompleted)
}

// ManuallyEndSystemIntakeGRBReviewAsyncVoting ends voting for the GRB Review (Async)
func ManuallyEndSystemIntakeGRBReviewAsyncVoting(
	ctx context.Context,
	store *storage.Store,
	systemIntakeID uuid.UUID,
) (*models.UpdateSystemIntakePayload, error) {
	currentTime := time.Now()

	// Fetch intake by ID
	intake, err := store.FetchSystemIntakeByID(ctx, systemIntakeID)
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

// ExtendGRBReviewDeadlineAsync extends the deadline for an async GRB review
func ExtendGRBReviewDeadlineAsync(
	ctx context.Context,
	store *storage.Store,
	input models.ExtendGRBReviewDeadlineInput,
) (*models.UpdateSystemIntakePayload, error) {
	// Fetch intake by ID
	intake, err := store.FetchSystemIntakeByID(ctx, input.SystemIntakeID)
	if err != nil {
		return nil, err
	}

	// Set the new end date
	intake.GrbReviewAsyncEndDate = &input.GrbReviewAsyncEndDate
	intake.GrbReviewAsyncManualEndDate = nil

	// Update system intake
	updatedIntake, err := store.UpdateSystemIntake(ctx, intake)
	if err != nil {
		return nil, err
	}

	return &models.UpdateSystemIntakePayload{
		SystemIntake: updatedIntake,
	}, nil
}

// RestartGRBReviewAsync restarts an async GRB review
func RestartGRBReviewAsync(
	ctx context.Context,
	store *storage.Store,
	systemIntakeID uuid.UUID,
) (*models.UpdateSystemIntakePayload, error) {
	// Fetch intake by ID
	intake, err := store.FetchSystemIntakeByID(ctx, systemIntakeID)
	if err != nil {
		return nil, err
	}

	// Set new review start time
	intake.GRBReviewStartedAt = helpers.PointerTo(time.Now())

	// Update system intake
	updatedIntake, err := store.UpdateSystemIntake(ctx, intake)
	if err != nil {
		return nil, err
	}

	return &models.UpdateSystemIntakePayload{
		SystemIntake: updatedIntake,
	}, nil
}
