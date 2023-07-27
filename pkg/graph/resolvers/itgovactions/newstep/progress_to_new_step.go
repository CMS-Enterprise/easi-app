package newstep

import (
	"context"
	"fmt"
	"time"

	"github.com/guregu/null"
	"golang.org/x/sync/errgroup"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// ProgressIntake handles a Progress to New Step action on an intake
func ProgressIntake(
	ctx context.Context,
	store *storage.Store,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	input *model.SystemIntakeProgressToNewStepsInput,
) (*models.SystemIntake, error) {
	adminEUAID := appcontext.Principal(ctx).ID()

	intake, err := store.FetchSystemIntakeByID(ctx, input.SystemIntakeID)
	if err != nil {
		return nil, err
	}

	err = intakeIsValidForProgressToNewStep(intake, input.NewStep)
	if err != nil {
		return nil, err
	}

	err = modifyIntakeToNewStep(intake, input.NewStep, input.MeetingDate, time.Now())
	if err != nil {
		return nil, err
	}

	// All the different data base calls aren't in a single atomic transaction;
	// in the case of a system failure, some data from the action might be saved, but not all.
	// As of this function's initial implementation, we're accepting that risk.
	// If we create a general way to wrap several store methods calls in a transaction later, we can use that.

	errGroup := new(errgroup.Group)
	var updatedIntake *models.SystemIntake // declare this outside the function we pass to errGroup.Go() so we can return it

	// save intake
	errGroup.Go(func() error {
		var errUpdateIntake error // declare this separately because if we use := on next line, compiler thinks we're declaring a new updatedIntake variable as well
		updatedIntake, errUpdateIntake = store.UpdateSystemIntake(ctx, intake)
		if errUpdateIntake != nil {
			return errUpdateIntake
		}

		return nil
	})

	// save action (including additional notes for email, if any)
	errGroup.Go(func() error {
		adminUserInfo, errCreatingAction := fetchUserInfo(ctx, adminEUAID)
		if errCreatingAction != nil {
			return errCreatingAction
		}

		stepForAction := models.SystemIntakeStep(input.NewStep)
		action := models.Action{
			IntakeID:       &input.SystemIntakeID,
			ActionType:     models.ActionTypePROGRESSTONEWSTEP,
			ActorName:      adminUserInfo.CommonName,
			ActorEmail:     adminUserInfo.Email,
			ActorEUAUserID: adminEUAID,
			Step:           &stepForAction,
		}
		if input.AdditionalNote != nil {
			action.Feedback = null.StringFromPtr(input.AdditionalNote)
		}

		_, errCreatingAction = store.CreateAction(ctx, &action)
		if errCreatingAction != nil {
			return errCreatingAction
		}

		return nil
	})

	// save feedback for requester
	if input.Feedback != nil {
		errGroup.Go(func() error {
			feedbackForRequester := &models.GovernanceRequestFeedback{
				IntakeID:     intake.ID,
				Feedback:     *input.Feedback,
				SourceAction: models.GRFSAProgressToNewStep,
				TargetForm:   models.GRFTFNoTargetProvided,
				Type:         models.GRFTRequester,
			}
			feedbackForRequester.CreatedBy = adminEUAID

			_, errRequesterFeedback := store.CreateGovernanceRequestFeedback(ctx, feedbackForRequester)
			if errRequesterFeedback != nil {
				return errRequesterFeedback
			}

			return nil
		})
	}

	// save feedback/recommendations for GRB
	if input.GrbRecommendations != nil {
		errGroup.Go(func() error {
			feedbackForGRB := &models.GovernanceRequestFeedback{
				IntakeID:     intake.ID,
				Feedback:     *input.GrbRecommendations,
				SourceAction: models.GRFSAProgressToNewStep,
				TargetForm:   models.GRFTFNoTargetProvided,
				Type:         models.GRFTGRB,
			}
			feedbackForGRB.CreatedBy = adminEUAID

			_, errGRBFeedback := store.CreateGovernanceRequestFeedback(ctx, feedbackForGRB)
			if errGRBFeedback != nil {
				return errGRBFeedback
			}

			return nil
		})
	}

	// save admin note
	if input.AdminNote != nil {
		errGroup.Go(func() error {
			adminUserInfo, errAdminUserInfo := fetchUserInfo(ctx, adminEUAID)
			if errAdminUserInfo != nil {
				return errAdminUserInfo
			}

			adminNote := &models.SystemIntakeNote{
				SystemIntakeID: input.SystemIntakeID,
				AuthorEUAID:    adminEUAID,
				AuthorName:     null.StringFrom(adminUserInfo.CommonName),
				Content:        null.StringFromPtr(input.AdminNote),
			}

			_, errCreateNote := store.CreateSystemIntakeNote(ctx, adminNote)
			if errCreateNote != nil {
				return errCreateNote
			}

			return nil
		})
	}

	if err := errGroup.Wait(); err != nil {
		return nil, err
	}

	return updatedIntake, nil
}

// TODO - if not inlined - better name
func intakeIsValidForProgressToNewStep(intake *models.SystemIntake, newStep model.SystemIntakeStepToProgressTo) error {
	if intake.State == models.SystemIntakeStateCLOSED {
		return &apperrors.InvalidActionError{
			ActionType: models.ActionTypePROGRESSTONEWSTEP,
			Message:    "Can't take Progress to New Step action on closed intakes",
		}
	}

	if string(intake.Step) == string(newStep) {
		return &apperrors.InvalidActionError{
			ActionType: models.ActionTypePROGRESSTONEWSTEP,
			Message:    "Progress to New Step needs to change intake to a different step",
		}
	}

	return nil
}

// TODO - better name
func modifyIntakeToNewStep(intake *models.SystemIntake, newStep model.SystemIntakeStepToProgressTo, newMeetingDate *time.Time, currentTime time.Time) error {
	switch newStep {
	case model.SystemIntakeStepToProgressToDraftBusinessCase:
		intake.Step = models.SystemIntakeStepDRAFTBIZCASE
		return nil

	case model.SystemIntakeStepToProgressToGrtMeeting:
		intake.Step = models.SystemIntakeStepGRTMEETING

		if newMeetingDate != nil {
			intake.GRTDate = newMeetingDate
		} else if intake.GRTDate != nil && intake.GRTDate.Before(currentTime) {
			intake.GRTDate = nil // if previously scheduled date has happened, and we don't have a new meeting date, clear the previous date
		}

		return nil

	case model.SystemIntakeStepToProgressToFinalBusinessCase:
		intake.Step = models.SystemIntakeStepFINALBIZCASE
		return nil

	case model.SystemIntakeStepToProgressToGrbMeeting:
		intake.Step = models.SystemIntakeStepGRBMEETING

		if newMeetingDate != nil {
			intake.GRBDate = newMeetingDate
		} else if intake.GRBDate != nil && intake.GRBDate.Before(currentTime) {
			intake.GRBDate = nil // if previously scheduled date has happened, and we don't have a new meeting date, clear the previous date
		}

		return nil

	default:
		return apperrors.NewInvalidEnumError(fmt.Errorf("newStep is an invalid value of SystemIntakeStepToProgressTo"), newStep, "SystemIntakeStepToProgressTo")
	}
}
