package resolvers

import (
	"context"
	"time"

	"golang.org/x/sync/errgroup"

	"fmt"

	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/graph/resolvers/itgovactions/newstep"

	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
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

	err = newstep.IsIntakeValid(intake, input.NewStep)
	if err != nil {
		return nil, err
	}

	err = newstep.UpdateIntake(intake, input.NewStep, input.MeetingDate, time.Now())
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

// CreateSystemIntakeActionRequestEdits creates a new action to request edits on an intake form as part of Admin Actions v2
func CreateSystemIntakeActionRequestEdits(
	ctx context.Context,
	store *storage.Store,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	input model.SystemIntakeRequestEditsInput,
) (*models.SystemIntake, error) {
	adminTakingAction, err := fetchUserInfo(ctx, appcontext.Principal(ctx).ID())
	if err != nil {
		return nil, err
	}
	intake, err := store.FetchSystemIntakeByID(ctx, input.SystemIntakeID)
	if err != nil {
		return nil, err
	}
	var targetForm models.GovernanceRequestFeedbackTargetForm
	// Set the state of the requested form step and set the targeted feedback step
	switch input.IntakeFormStep {
	case model.SystemIntakeFormStepInitialRequestForm:
		intake.RequestFormState = models.SIRFSEditsRequested
		intake.Step = models.SystemIntakeStepINITIALFORM
		targetForm = models.GRFTFIntakeRequest
	case model.SystemIntakeFormStepDraftBusinessCase:
		intake.DraftBusinessCaseState = models.SIRFSEditsRequested
		intake.Step = models.SystemIntakeStepDRAFTBIZCASE
		targetForm = models.GRFTFDraftBusinessCase
	case model.SystemIntakeFormStepFinalBusinessCase:
		intake.FinalBusinessCaseState = models.SIRFSEditsRequested
		intake.Step = models.SystemIntakeStepFINALBIZCASE
		targetForm = models.GRFTFinalBusinessCase
	default:
		return nil, &apperrors.BadRequestError{
			Err: fmt.Errorf("cannot request edits on %s", input.IntakeFormStep),
		}
	}
	intake, err = store.UpdateSystemIntake(ctx, intake)
	if err != nil {
		return nil, err
	}
	_, err = store.CreateAction(ctx, &models.Action{
		ActionType:     models.ActionTypeREQUESTEDITS,
		ActorName:      adminTakingAction.CommonName,
		ActorEUAUserID: adminTakingAction.EuaUserID,
		ActorEmail:     adminTakingAction.Email,
		BusinessCaseID: intake.BusinessCaseID,
		IntakeID:       &intake.ID,
		Feedback:       null.StringFrom(input.EmailFeedback),
		Step:           &intake.Step,
	})
	if err != nil {
		return nil, err
	}
	govReqFeedback := &models.GovernanceRequestFeedback{}
	govReqFeedback.IntakeID = intake.ID
	govReqFeedback.CreatedBy = adminTakingAction.EuaUserID
	govReqFeedback.SourceAction = models.GRFSARequestEdits
	govReqFeedback.TargetForm = targetForm
	govReqFeedback.Feedback = input.EmailFeedback
	_, err = store.CreateGovernanceRequestFeedback(ctx, govReqFeedback)
	if err != nil {
		return nil, err
	}
	if input.AdminNotes != nil {
		_, err = store.CreateSystemIntakeNote(ctx, &models.SystemIntakeNote{
			SystemIntakeID: intake.ID,
			AuthorEUAID:    adminTakingAction.EuaUserID,
			AuthorName:     null.StringFrom(adminTakingAction.CommonName),
			Content:        null.StringFromPtr(input.AdminNotes),
		})
		if err != nil {
			return nil, err
		}
	}
	return intake, nil
}
