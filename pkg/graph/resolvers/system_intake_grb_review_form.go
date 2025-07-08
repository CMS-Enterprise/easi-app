package resolvers

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/email/translation"
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

	// Don't continue with the update if the value is not set, just return the initial value
	if !input.GrbDate.IsSet() {
		return &models.UpdateSystemIntakePayload{
			SystemIntake: intake,
		}, nil
	}
	inputDate := input.GrbDate.Value()
	if inputDate == nil {
		if input.GrbDate.IsSet() {
			return &models.UpdateSystemIntakePayload{
				SystemIntake: intake,
			}, nil
		}
	}

	intake.GRBDate = inputDate

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
	emailClient *email.Client,
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

		if emailClient != nil {
			// get GRB reviewers
			reviewers, err := store.SystemIntakeGRBReviewersBySystemIntakeIDs(ctx, []uuid.UUID{intake.ID})
			if err != nil {
				return nil, err
			}

			// get user emails
			var emails []string
			for _, reviewer := range reviewers {
				userAccount, err := dataloaders.GetUserAccountByID(ctx, reviewer.UserID)
				if err != nil {
					return nil, err
				}

				emails = append(emails, userAccount.Email)
			}

			// send emails here
			if intake.GrbReviewAsyncEndDate != nil {
				for _, userEmail := range emails {
					if err := emailClient.SystemIntake.SendGRBReviewerInvitedToVoteEmail(
						ctx,
						email.SendGRBReviewerInvitedToVoteInput{
							Recipient:          models.EmailAddress(userEmail),
							StartDate:          *intake.GRBReviewStartedAt,
							EndDate:            *intake.GrbReviewAsyncEndDate,
							SystemIntakeID:     intake.ID,
							ProjectName:        intake.ProjectName.String,
							RequesterName:      intake.Requester,
							RequesterComponent: intake.Component.String,
						},
					); err != nil {
						appcontext.ZLogger(ctx).Error("problem sending invite to vote email to GRB reviewer", zap.Error(err), zap.String("user.email", userEmail))
						// don't exit, we can send out the rest
						continue
					}
				}
			}
		}
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
	ctx context.Context,
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

	grbVotingInformation, err := GRBVotingInformationGetBySystemIntake(ctx, intake)
	if err != nil {
		return nil
	}

	// If past end date and quorum is reached, review is completed
	if grbVotingInformation.QuorumReached() {
		return helpers.PointerTo(models.SystemIntakeGRBReviewAsyncStatusTypeCompleted)
	}

	// If past end date and quorum is not reached, review is past due
	return helpers.PointerTo(models.SystemIntakeGRBReviewAsyncStatusTypePastDue)
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
	emailClient *email.Client,
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

	// send email if able
	if intake.GRBReviewStartedAt != nil && intake.GrbReviewAsyncEndDate != nil {
		logger := appcontext.ZLogger(ctx)
		// get GRB reviewers
		reviewers, err := store.SystemIntakeGRBReviewersBySystemIntakeIDs(ctx, []uuid.UUID{intake.ID})
		if err != nil {
			// don't exit with error, just log
			logger.Error("problem getting reviewers when sending Deadline Extended email", zap.Error(err), zap.String("intake.id", intake.ID.String()))

			return &models.UpdateSystemIntakePayload{
				SystemIntake: updatedIntake,
			}, nil
		}

		// get user emails
		var emails []string
		for _, reviewer := range reviewers {
			userAccount, err := dataloaders.GetUserAccountByID(ctx, reviewer.UserID)
			if err != nil {
				// don't exit with error, just log
				logger.Error("problem getting accounts when sending Deadline Extended email", zap.Error(err), zap.String("intake.id", intake.ID.String()))
				return &models.UpdateSystemIntakePayload{
					SystemIntake: updatedIntake,
				}, nil
			}

			emails = append(emails, userAccount.Email)
		}

		for _, userEmail := range emails {
			if err := emailClient.SystemIntake.SendSystemIntakeGRBReviewDeadlineExtended(
				ctx,
				models.EmailNotificationRecipients{
					RegularRecipientEmails:   []models.EmailAddress{models.EmailAddress(userEmail)},
					ShouldNotifyITGovernance: false,
					ShouldNotifyITInvestment: false,
				},
				intake.ID,
				intake.ProjectName.String,
				intake.Requester,
				translation.GetComponentAcronym(intake.Component.String),
				*intake.GRBReviewStartedAt,
				*intake.GrbReviewAsyncEndDate,
			); err != nil {
				appcontext.ZLogger(ctx).Error("problem sending Deadline Extended email", zap.Error(err), zap.String("intake.id", intake.ID.String()), zap.String("user.email", userEmail))
				continue
			}
		}

	}

	return &models.UpdateSystemIntakePayload{
		SystemIntake: updatedIntake,
	}, nil
}

// RestartGRBReviewAsync restarts an async GRB review
func RestartGRBReviewAsync(
	ctx context.Context,
	store *storage.Store,
	emailClient *email.Client,
	input models.RestartGRBReviewInput,
) (*models.UpdateSystemIntakePayload, error) {
	// Fetch intake by ID
	intake, err := store.FetchSystemIntakeByID(ctx, input.SystemIntakeID)
	if err != nil {
		return nil, err
	}

	// Set new review start time
	intake.GRBReviewStartedAt = helpers.PointerTo(time.Now())

	// Set the new end date
	intake.GrbReviewAsyncEndDate = &input.NewGRBEndDate

	// Reset manual end date
	intake.GrbReviewAsyncManualEndDate = nil

	// Update system intake
	updatedIntake, err := store.UpdateSystemIntake(ctx, intake)
	if err != nil {
		return nil, err
	}

	if intake.GRBReviewStartedAt != nil && intake.GrbReviewAsyncEndDate != nil {
		if err := emailClient.SystemIntake.SendSystemIntakeGRBReviewRestarted(
			ctx,
			models.EmailNotificationRecipients{
				RegularRecipientEmails:   nil,
				ShouldNotifyITGovernance: true,
				ShouldNotifyITInvestment: false,
			},
			intake.ID,
			intake.ProjectName.String,
			intake.Requester,
			translation.GetComponentAcronym(intake.Component.String),
			*intake.GRBReviewStartedAt,
			*intake.GrbReviewAsyncEndDate,
		); err != nil {
			appcontext.ZLogger(ctx).Error("problem sending GRB review restarted email", zap.Error(err), zap.String("intake.id", intake.ID.String()))
			// no need to fail here, just continue
		}
	}

	return &models.UpdateSystemIntakePayload{
		SystemIntake: updatedIntake,
	}, nil
}

// isGRBReviewCompleted checks if the GRB review is completed for either standard or async
func isGRBReviewCompleted(ctx context.Context, intake *models.SystemIntake) (bool, error) {
	switch intake.GrbReviewType {
	case models.SystemIntakeGRBReviewTypeStandard:
		grbReviewState := CalcSystemIntakeGRBReviewStandardStatus(intake)
		if grbReviewState == nil {
			return false, nil
		}

		return *grbReviewState == models.SystemIntakeGRBReviewStandardStatusTypeCompleted, nil

	case models.SystemIntakeGRBReviewTypeAsync:
		grbReviewState := CalcSystemIntakeGRBReviewAsyncStatus(ctx, intake)
		if grbReviewState == nil {
			return false, nil
		}

		return *grbReviewState == models.SystemIntakeGRBReviewAsyncStatusTypeCompleted, nil

	default:
		return false, errors.New("invalid GRB review type")
	}
}
