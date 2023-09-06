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
	"github.com/cmsgov/easi-app/pkg/graph/resolvers/itgovactions/lcidactions"
	"github.com/cmsgov/easi-app/pkg/graph/resolvers/itgovactions/newstep"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// ProgressIntake handles a Progress to New Step action on an intake as part of Admin Actions v2
func ProgressIntake(
	ctx context.Context,
	store *storage.Store,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	input model.SystemIntakeProgressToNewStepsInput,
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

	// save action (including additional info for email, if any)
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
		if input.AdditionalInfo != nil {
			action.Feedback = input.AdditionalInfo
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
				Content:        input.AdminNote,
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

	updatedTime := time.Now()
	intake.UpdatedAt = &updatedTime

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
		Feedback:       input.AdditionalInfo,
		Step:           &intake.Step,
	})
	if err != nil {
		return nil, err
	}
	// TODO: Send Notification Email (EASI-3109)
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
			Content:        input.AdminNotes,
		})
		if err != nil {
			return nil, err
		}
	}
	return intake, nil
}

// RejectIntakeAsNotApproved handles a Not Approved by GRB action on an intake as part of Admin Actions v2
func RejectIntakeAsNotApproved(
	ctx context.Context,
	store *storage.Store,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	input model.SystemIntakeRejectIntakeInput,
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

	// No validity check needed:
	// * Issuing this decision is valid in all steps
	// * Issuing this decision is valid both when an intake is open and when it's closed (in the latter case, it's changing the decision)
	// * Even if a rejection decision has already been issued, an admin can confirm that decision on a reopened intake through this action

	// update workflow state
	intake.Step = models.SystemIntakeStepDECISION
	intake.State = models.SystemIntakeStateCLOSED
	intake.DecisionState = models.SIDSNotApproved

	// update other fields
	intake.RejectionReason = &input.Reason
	intake.DecisionNextSteps = &input.NextSteps
	intake.TRBFollowUpRecommendation = &input.TrbFollowUp

	updatedTime := time.Now()
	intake.UpdatedAt = &updatedTime

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

	// save action (including additional info for email, if any)
	errGroup.Go(func() error {
		action := models.Action{
			IntakeID:       &input.SystemIntakeID,
			ActionType:     models.ActionTypeREJECT,
			ActorName:      adminUserInfo.CommonName,
			ActorEmail:     adminUserInfo.Email,
			ActorEUAUserID: adminEUAID,
			Step:           &intake.Step,
		}
		if input.AdditionalInfo != nil {
			action.Feedback = input.AdditionalInfo
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
			adminNote := &models.SystemIntakeNote{
				SystemIntakeID: input.SystemIntakeID,
				AuthorEUAID:    adminEUAID,
				AuthorName:     null.StringFrom(adminUserInfo.CommonName),
				Content:        input.AdminNote,
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

// IssueLCID handles an Issue LCID action on an intake as part of Admin Actions v2
func IssueLCID(
	ctx context.Context,
	store *storage.Store,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	input model.SystemIntakeIssueLCIDInput,
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

	err = lcidactions.IsIntakeValidToIssueLCID(intake)
	if err != nil {
		return nil, err
	}

	// if a LCID wasn't passed in, we generate one
	newLCID, err := lcidactions.GenerateNewLCID(ctx, store, input.Lcid)
	if err != nil {
		return nil, err
	}

	// update workflow state
	intake.Step = models.SystemIntakeStepDECISION
	intake.State = models.SystemIntakeStateCLOSED
	intake.DecisionState = models.SIDSLcidIssued

	// update LCID-related fields
	intake.LifecycleID = null.StringFrom(newLCID)
	intake.LifecycleExpiresAt = &input.ExpiresAt
	intake.LifecycleScope = &input.Scope
	intake.DecisionNextSteps = &input.NextSteps
	intake.TRBFollowUpRecommendation = &input.TrbFollowUp
	intake.LifecycleCostBaseline = null.StringFromPtr(input.CostBaseline)

	// update other fields
	updatedTime := time.Now()
	intake.UpdatedAt = &updatedTime

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

	// save action (including additional info for email, if any)
	errGroup.Go(func() error {
		action := models.Action{
			IntakeID:       &input.SystemIntakeID,
			ActionType:     models.ActionTypeISSUELCID,
			ActorName:      adminUserInfo.CommonName,
			ActorEmail:     adminUserInfo.Email,
			ActorEUAUserID: adminEUAID,
			Step:           &intake.Step,
		}
		if input.AdditionalInfo != nil {
			action.Feedback = input.AdditionalInfo
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
			adminNote := &models.SystemIntakeNote{
				SystemIntakeID: input.SystemIntakeID,
				AuthorEUAID:    adminEUAID,
				AuthorName:     null.StringFrom(adminUserInfo.CommonName),
				Content:        input.AdminNote,
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

// CreateSystemIntakeActionReopenRequest reopens an intake request
func CreateSystemIntakeActionReopenRequest(
	ctx context.Context,
	store *storage.Store,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	input model.SystemIntakeReopenRequestInput,
) (*models.SystemIntake, error) {
	adminTakingAction, err := fetchUserInfo(ctx, appcontext.Principal(ctx).ID())
	if err != nil {
		return nil, err
	}
	intake, err := store.FetchSystemIntakeByID(ctx, input.SystemIntakeID)
	if err != nil {
		return nil, err
	}

	if intake.State == models.SystemIntakeStateOPEN {
		return nil, &apperrors.BadRequestError{
			Err: fmt.Errorf("intake is already open"),
		}
	}
	intake.State = models.SystemIntakeStateOPEN

	updatedTime := time.Now()
	intake.UpdatedAt = &updatedTime

	intake, err = store.UpdateSystemIntake(ctx, intake)
	if err != nil {
		return nil, err
	}
	// TODO: Send Notification Email (EASI-3109)
	// input.Reason is currently not persisted and only sent in the notification email
	_, err = store.CreateAction(ctx, &models.Action{
		ActionType:     models.ActionTypeREOPENREQUEST,
		ActorName:      adminTakingAction.CommonName,
		ActorEUAUserID: adminTakingAction.EuaUserID,
		ActorEmail:     adminTakingAction.Email,
		BusinessCaseID: intake.BusinessCaseID,
		IntakeID:       &intake.ID,
		Feedback:       input.AdditionalInfo,
		Step:           &intake.Step,
	})
	if err != nil {
		return nil, err
	}
	if input.AdminNotes != nil {
		_, err = store.CreateSystemIntakeNote(ctx, &models.SystemIntakeNote{
			SystemIntakeID: intake.ID,
			AuthorEUAID:    adminTakingAction.EuaUserID,
			AuthorName:     null.StringFrom(adminTakingAction.CommonName),
			Content:        input.AdminNotes,
		})
		if err != nil {
			return nil, err
		}
	}
	return intake, nil
}

// CreateSystemIntakeActionCloseRequest closes an intake request
func CreateSystemIntakeActionCloseRequest(
	ctx context.Context,
	store *storage.Store,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	input model.SystemIntakeCloseRequestInput,
) (*models.SystemIntake, error) {
	adminTakingAction, err := fetchUserInfo(ctx, appcontext.Principal(ctx).ID())
	if err != nil {
		return nil, err
	}
	intake, err := store.FetchSystemIntakeByID(ctx, input.SystemIntakeID)
	if err != nil {
		return nil, err
	}
	if intake.State == models.SystemIntakeStateCLOSED {
		return nil, &apperrors.BadRequestError{
			Err: fmt.Errorf("intake is already closed"),
		}
	}
	intake.State = models.SystemIntakeStateCLOSED

	updatedTime := time.Now()
	intake.UpdatedAt = &updatedTime

	intake, err = store.UpdateSystemIntake(ctx, intake)
	if err != nil {
		return nil, err
	}
	// TODO: Send Notification Email (EASI-3109)
	// input.Reason is currently not persisted and only sent in the notification email
	_, err = store.CreateAction(ctx, &models.Action{
		ActionType:     models.ActionTypeCLOSEREQUEST,
		ActorName:      adminTakingAction.CommonName,
		ActorEUAUserID: adminTakingAction.EuaUserID,
		ActorEmail:     adminTakingAction.Email,
		BusinessCaseID: intake.BusinessCaseID,
		IntakeID:       &intake.ID,
		Feedback:       input.AdditionalInfo,
		Step:           &intake.Step,
	})
	if err != nil {
		return nil, err
	}
	if input.AdminNotes != nil {
		_, err = store.CreateSystemIntakeNote(ctx, &models.SystemIntakeNote{
			SystemIntakeID: intake.ID,
			AuthorEUAID:    adminTakingAction.EuaUserID,
			AuthorName:     null.StringFrom(adminTakingAction.CommonName),
			Content:        input.AdminNotes,
		})
		if err != nil {
			return nil, err
		}
	}
	return intake, nil
}

// CreateSystemIntakeActionNotITGovRequest marks a request as closed, sets a decision of not an IT Gov req, and progress the step to decision
func CreateSystemIntakeActionNotITGovRequest(
	ctx context.Context,
	store *storage.Store,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	input model.SystemIntakeNotITGovReqInput,
) (*models.SystemIntake, error) {
	adminTakingAction, err := fetchUserInfo(ctx, appcontext.Principal(ctx).ID())
	if err != nil {
		return nil, err
	}
	intake, err := store.FetchSystemIntakeByID(ctx, input.SystemIntakeID)
	if err != nil {
		return nil, err
	}
	intake.State = models.SystemIntakeStateCLOSED
	intake.Step = models.SystemIntakeStepDECISION
	intake.DecisionState = models.SIDSNotGovernance

	updatedTime := time.Now()
	intake.UpdatedAt = &updatedTime

	intake, err = store.UpdateSystemIntake(ctx, intake)
	if err != nil {
		return nil, err
	}
	// TODO: Send Notification Email (EASI-3109)
	// input.Reason is currently not persisted and only sent in the notification email
	_, err = store.CreateAction(ctx, &models.Action{
		ActionType:     models.ActionTypeNOTITGOVREQUEST,
		ActorName:      adminTakingAction.CommonName,
		ActorEUAUserID: adminTakingAction.EuaUserID,
		ActorEmail:     adminTakingAction.Email,
		BusinessCaseID: intake.BusinessCaseID,
		IntakeID:       &intake.ID,
		Feedback:       input.AdditionalInfo,
		Step:           &intake.Step,
	})
	if err != nil {
		return nil, err
	}
	if input.AdminNotes != nil {
		_, err = store.CreateSystemIntakeNote(ctx, &models.SystemIntakeNote{
			SystemIntakeID: intake.ID,
			AuthorEUAID:    adminTakingAction.EuaUserID,
			AuthorName:     null.StringFrom(adminTakingAction.CommonName),
			Content:        input.AdminNotes,
		})
		if err != nil {
			return nil, err
		}
	}
	return intake, nil
}

// UpdateLCID is used to update the LCID on a system intake.
func UpdateLCID(
	ctx context.Context,
	store *storage.Store,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	input model.SystemIntakeUpdateLCIDInput,
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
	err = lcidactions.IsLCIDValidToUpdate(intake)
	if err != nil {
		return nil, err
	}
	// input.Reason //TODO: SW What to do with the reason field? It is stored in an email when we add the email

	// save action (including additional info for email, if any)
	errGroup := new(errgroup.Group)
	errGroup.Go(func() error {
		action, err := lcidactions.GetUpdateLCIDAction(intake, input.ExpiresAt, input.NextSteps, input.Scope, input.CostBaseline, *adminUserInfo)
		if err != nil {
			return err
		}
		if input.AdditionalInfo != nil {
			action.Feedback = input.AdditionalInfo
		}

		_, errCreatingAction := store.CreateAction(ctx, action)
		if errCreatingAction != nil {
			return errCreatingAction
		}

		return nil
	})

	updatedTime := time.Now()
	intake.UpdatedAt = &updatedTime

	// update workflow state
	intake.Step = models.SystemIntakeStepDECISION
	intake.State = models.SystemIntakeStateCLOSED
	intake.DecisionState = models.SIDSLcidIssued

	// update LCID-related fields when they are set
	if input.ExpiresAt != nil {
		intake.LifecycleExpiresAt = input.ExpiresAt
	}
	if input.Scope != nil {
		intake.LifecycleScope = input.Scope
	}
	if input.NextSteps != nil {
		intake.DecisionNextSteps = input.NextSteps
	}
	if input.CostBaseline != nil {
		intake.LifecycleCostBaseline = null.StringFromPtr(input.CostBaseline)
	}

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

	// save admin note
	if input.AdminNote != nil {
		errGroup.Go(func() error {
			adminNote := &models.SystemIntakeNote{
				SystemIntakeID: input.SystemIntakeID,
				AuthorEUAID:    adminEUAID,
				AuthorName:     null.StringFrom(adminUserInfo.CommonName),
				Content:        input.AdminNote,
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

// ConfirmLCID is used to confirm the choices of an already issued LCID. All fields are required, and should come back pre-populated by the front end with the previous answer
func ConfirmLCID(ctx context.Context,
	store *storage.Store,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	input model.SystemIntakeConfirmLCIDInput,
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
	err = lcidactions.IsLCIDValidToUpdate(intake)
	if err != nil {
		return nil, err
	}

	// save action (including additional info for email, if any)
	errGroup := new(errgroup.Group)
	errGroup.Go(func() error {
		action, err := lcidactions.GetUpdateLCIDAction(intake, &input.ExpiresAt, &input.NextSteps, &input.Scope, input.CostBaseline, *adminUserInfo)
		if err != nil {
			return err
		}
		action.ActionType = models.ActionTypeBIZCASENEEDSCHANGES
		if input.AdditionalInfo != nil {
			action.Feedback = input.AdditionalInfo
		}

		_, errCreatingAction := store.CreateAction(ctx, action)
		if errCreatingAction != nil {
			return errCreatingAction
		}

		return nil
	})
	//TODO: implement the check to get the TRB recommendation once EASI-3112 is merged
	return nil, nil

}
