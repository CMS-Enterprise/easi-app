package resolvers

import (
	"context"
	"errors"
	"time"

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

	// Update system intake
	updatedIntake, err := store.UpdateSystemIntake(ctx, intake)
	if err != nil {
		return nil, err
	}

	return &models.UpdateSystemIntakePayload{
		SystemIntake: updatedIntake,
	}, nil
}

// PointerToSystemIntakeGRBReviewAsyncStatusType Create a reference to an Async GRB Review status
func PointerToSystemIntakeGRBReviewAsyncStatusType(
	status models.SystemIntakeGRBReviewAsyncStatusType,
) *models.SystemIntakeGRBReviewAsyncStatusType {
	return &status
}

// CalcSystemIntakeGRBReviewAsyncStatus calculates the status of the GRB Review Async page
func CalcSystemIntakeGRBReviewAsyncStatus(
	intake *models.SystemIntake,
) (*models.SystemIntakeGRBReviewAsyncStatusType, error) {
	currentTime := time.Now()

	if intake.GrbReviewType != models.SystemIntakeGRBReviewTypeAsync {
		return nil, errors.New("system intake is not of type GRB Review Async")
	}

	if intake.GrbReviewAsyncEndDate == nil {
		return nil, errors.New("system intake GRB Review Async end date is not set")
	}

	// Evaluate if the current time is before the Grb Review Async end date
	if intake.GrbReviewAsyncEndDate.After(currentTime) {
		return PointerToSystemIntakeGRBReviewAsyncStatusType(models.SystemIntakeGRBReviewAsyncStatusTypeInProgress), nil
	}

	// Fallthrough case:
	//		The current time is after the Grb Review Async end date
	return PointerToSystemIntakeGRBReviewAsyncStatusType(models.SystemIntakeGRBReviewAsyncStatusTypeCompleted), nil
}
