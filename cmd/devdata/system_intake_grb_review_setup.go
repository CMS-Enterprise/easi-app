package main

import (
	"context"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/graph/resolvers"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

// Completes required fields for set up GRB review form
func setupSystemIntakeGRBReview(
	ctx context.Context,
	store *storage.Store,
	intake *models.SystemIntake,
	grbReviewType models.SystemIntakeGRBReviewType,
	endDate *time.Time,
) *models.SystemIntake {

	intake = updateSystemIntakeGRBReviewType(
		ctx,
		store,
		intake.ID,
		grbReviewType,
	)

	if endDate == nil {
		panic("End date must be set for GRB review")
	}

	// Async review type - set end date and start review

	if grbReviewType == models.SystemIntakeGRBReviewTypeAsync {
		intake = startGRBReviewAsync(
			ctx,
			store,
			intake.ID,
			endDate,
		)

		return intake
	}

	// Standard meeting type - set end date and start review

	intake = updateGRBReviewStandardEndDate(
		ctx,
		store,
		intake.ID,
		endDate,
	)

	startGRBReviewStandard(
		ctx,
		store,
		intake.ID,
	)

	return intake
}

func updateSystemIntakeGRBReviewType(
	ctx context.Context,
	store *storage.Store,
	systemIntakeID uuid.UUID,
	grbReviewType models.SystemIntakeGRBReviewType,
) *models.SystemIntake {
	intakePayload, err := resolvers.UpdateSystemIntakeGRBReviewType(
		ctx,
		store,
		models.UpdateSystemIntakeGRBReviewTypeInput{
			SystemIntakeID: systemIntakeID,
			GrbReviewType:  grbReviewType,
		})

	if err != nil {
		panic(err)
	}

	return intakePayload.SystemIntake
}

func updateGRBReviewStandardEndDate(
	ctx context.Context,
	store *storage.Store,
	systemIntakeID uuid.UUID,
	endDate *time.Time,
) *models.SystemIntake {
	intakePayload, err := resolvers.UpdateSystemIntakeGRBReviewFormInputPresentationStandard(
		ctx,
		store,
		models.UpdateSystemIntakeGRBReviewFormInputPresentationStandard{
			SystemIntakeID: systemIntakeID,
			GrbDate:        graphql.OmittableOf(endDate),
		})

	if err != nil {
		panic(err)
	}

	return intakePayload.SystemIntake
}

func startGRBReviewStandard(
	ctx context.Context,
	store *storage.Store,
	systemIntakeID uuid.UUID,
) {
	_, err := resolvers.StartGRBReview(
		ctx,
		store,
		nil,
		systemIntakeID,
	)

	if err != nil {
		panic(err)
	}
}

func startGRBReviewAsync(
	ctx context.Context,
	store *storage.Store,
	systemIntakeID uuid.UUID,
	endDate *time.Time,
) *models.SystemIntake {
	intakePayload, err := resolvers.UpdateSystemIntakeGRBReviewFormInputTimeframeAsync(
		ctx,
		store,
		nil,
		models.UpdateSystemIntakeGRBReviewFormInputTimeframeAsync{
			SystemIntakeID:        systemIntakeID,
			GrbReviewAsyncEndDate: *endDate,
			StartGRBReview:        true,
		},
	)

	if err != nil {
		panic(err)
	}

	return intakePayload.SystemIntake
}
