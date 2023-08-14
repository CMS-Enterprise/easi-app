package resolvers

import (
	"context"
	"fmt"
	"time"

	"github.com/guregu/null"
	"golang.org/x/sync/errgroup"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/graph/resolvers/itgovactions/decision"
	"github.com/cmsgov/easi-app/pkg/graph/resolvers/itgovactions/newstep"
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

	adminUserInfo, err := fetchUserInfo(ctx, adminEUAID)
	if err != nil {
		return nil, err
	}

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

	// All the different database calls aren't in a single atomic transaction;
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

		_, errCreatingAction := store.CreateAction(ctx, &action)
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
	govReqFeedback.Type = models.GRFTRequester
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

// ReopenOrChangeDecisionOnIntake does a thing
// TODO - change comment
// potential overlap with EASI-3111 (issue decision or close request) - https://jiraent.cms.gov/browse/EASI-3111, though not for reopening
func ReopenOrChangeDecisionOnIntake(
	ctx context.Context,
	store *storage.Store,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	input model.SystemIntakeReopenOrChangeDecisionInput,
) (*models.SystemIntake, error) {
	// input:
	// 3. fields depending on which new resolution is selected (i.e. some require new steps, some don't)
	// 3.a. reopening
	// 3.a.i. "why are you reopening?" - optional (TODO - where does this get saved, if anywhere? it gets included in email)
	// 3.a.ii. additional notes in email - saved in actions.feedback
	// 3.a.iii. admin note
	// 3.b. not a governance request
	// 3.b.i. "why is this not an IT gov request?" - optional (TODO - where does this get saved, if anywhere? .RejectionReason field? (probably not, that's probably for not approved by GRB))
	// 3.b.ii. additional notes in email - saved in actions.feedback
	// 3.b.iii. admin note
	// 3.c. not approved by GRB
	// 3.c.i. reason - required (is this what .RejectionReason field is for?)
	// 3.c.ii. next steps - required
	// 3.c.iii. should this team consult with TRB? (strongly recommended, yes but not critical, no)	- required (TODO - doesn't seem like there's a field for this)
	// 3.c.iv. additional notes in email - saved in actions.feedback
	// 3.c.v. admin note
	// 3.d. issue LCID - (various fields we know how to handle) https://www.figma.com/file/ChzAP34A2DVvQUNQwD7lCt/IT-Governance-Next?type=design&node-id=1-24557&mode=design&t=aTBbPkFXgQbIZj4i-0

	adminEUAID := appcontext.Principal(ctx).ID()

	adminUserInfo, err := fetchUserInfo(ctx, adminEUAID)
	if err != nil {
		return nil, err
	}

	intake, err := store.FetchSystemIntakeByID(ctx, input.SystemIntakeID)
	if err != nil {
		return nil, err
	}

	err = decision.IsIntakeValid(intake, input.NewResolution)
	if err != nil {
		return nil, err
	}

	err = decision.UpdateIntakeDecision(intake, input.NewResolution)
	if err != nil {
		return nil, err
	}

	// All the different database calls aren't in a single atomic transaction;
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
		// have to declare this as a separate variable because we can't directly use &models.SystemIntakeStepDECISION;
		// not allowed to create a pointer to a constant
		stepForAction := models.SystemIntakeStepDECISION

		action := models.Action{
			IntakeID:       &input.SystemIntakeID,
			ActionType:     models.ActionTypeREOPENORCHANGEDECISION,
			ActorName:      adminUserInfo.CommonName,
			ActorEmail:     adminUserInfo.Email,
			ActorEUAUserID: adminEUAID,
			Step:           &stepForAction,
		}
		if input.AdditionalNote != nil {
			action.Feedback = null.StringFromPtr(input.AdditionalNote)
		}

		_, errCreatingAction := store.CreateAction(ctx, &action)
		if errCreatingAction != nil {
			return errCreatingAction
		}

		return nil
	})

	// save admin note
	if input.AdminNote != nil {
		errGroup.Go(func() error {
			adminNote := models.SystemIntakeNote{
				SystemIntakeID: input.SystemIntakeID,
				AuthorEUAID:    adminEUAID,
				AuthorName:     null.StringFrom(adminUserInfo.CommonName),
				Content:        null.StringFromPtr(input.AdminNote),
			}

			_, errCreatingAdminNote := store.CreateSystemIntakeNote(ctx, &adminNote)
			if errCreatingAdminNote != nil {
				return errCreatingAdminNote
			}

			return nil
		})
	}

	// TODO - save other stuff, if any?

	if err := errGroup.Wait(); err != nil {
		return nil, err
	}

	return updatedIntake, nil
}
