package resolvers

import (
	"context"
	"fmt"
	"time"

	"github.com/guregu/null"
	"golang.org/x/sync/errgroup"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/graph/resolvers/itgovactions/lcidactions"
	"github.com/cms-enterprise/easi-app/pkg/graph/resolvers/itgovactions/newstep"
	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

// ProgressIntake handles a Progress to New Step action on an intake as part of Admin Actions v2
func ProgressIntake(
	ctx context.Context,
	store *storage.Store,
	emailClient *email.Client,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	input models.SystemIntakeProgressToNewStepsInput,
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

	// save intake, action, feedback, recommendations, admin note
	// see Note [Database calls from resolvers aren't atomic]

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
			ActorName:      adminUserInfo.DisplayName,
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
			feedbackForRequester.CreatedBy = &adminEUAID

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
			feedbackForGRB.CreatedBy = &adminEUAID

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
				AuthorName:     null.StringFrom(adminUserInfo.DisplayName),
				Content:        input.AdminNote,
			}

			_, errCreateNote := store.CreateSystemIntakeNote(ctx, adminNote)
			if errCreateNote != nil {
				return errCreateNote
			}

			return nil
		})
	}
	if emailClient != nil && input.NotificationRecipients != nil { // Don't email if no recipients are provided or there isn't an email client
		errGroup.Go(func() error {
			err = emailClient.SystemIntake.SendProgressToNewStepNotification(ctx,
				*input.NotificationRecipients,
				intake.ID,
				input.NewStep,
				intake.ProjectName.ValueOrZero(),
				intake.Requester,
				input.Feedback,
				input.AdditionalInfo,
			)
			if err != nil {
				return err
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
	emailClient *email.Client,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	input models.SystemIntakeRequestEditsInput,
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
	case models.SystemIntakeFormStepInitialRequestForm:
		intake.RequestFormState = models.SIRFSEditsRequested
		intake.Step = models.SystemIntakeStepINITIALFORM
		targetForm = models.GRFTFIntakeRequest
	case models.SystemIntakeFormStepDraftBusinessCase:
		intake.DraftBusinessCaseState = models.SIRFSEditsRequested
		intake.Step = models.SystemIntakeStepDRAFTBIZCASE
		targetForm = models.GRFTFDraftBusinessCase
	case models.SystemIntakeFormStepFinalBusinessCase:
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

	// save intake, action, feedback, admin note
	// see Note [Database calls from resolvers aren't atomic]

	intake, err = store.UpdateSystemIntake(ctx, intake)
	if err != nil {
		return nil, err
	}
	_, err = store.CreateAction(ctx, &models.Action{
		ActionType:     models.ActionTypeREQUESTEDITS,
		ActorName:      adminTakingAction.DisplayName,
		ActorEUAUserID: adminTakingAction.Username,
		ActorEmail:     adminTakingAction.Email,
		BusinessCaseID: intake.BusinessCaseID,
		IntakeID:       &intake.ID,
		Feedback:       input.AdditionalInfo,
		Step:           &intake.Step,
	})
	if err != nil {
		return nil, err
	}

	govReqFeedback := &models.GovernanceRequestFeedback{}
	govReqFeedback.IntakeID = intake.ID
	govReqFeedback.CreatedBy = &adminTakingAction.Username
	govReqFeedback.SourceAction = models.GRFSARequestEdits
	govReqFeedback.TargetForm = targetForm
	govReqFeedback.Feedback = input.EmailFeedback
	govReqFeedback.Type = models.GRFTRequester
	_, err = store.CreateGovernanceRequestFeedback(ctx, govReqFeedback)
	if err != nil {
		return nil, err
	}
	if input.AdminNote != nil {
		_, err = store.CreateSystemIntakeNote(ctx, &models.SystemIntakeNote{
			SystemIntakeID: intake.ID,
			AuthorEUAID:    adminTakingAction.Username,
			AuthorName:     null.StringFrom(adminTakingAction.DisplayName),
			Content:        input.AdminNote,
		})
		if err != nil {
			return nil, err
		}
	}
	if emailClient != nil && input.NotificationRecipients != nil { // Don't email if no recipients are provided or there isn't an email client
		err = emailClient.SystemIntake.SendRequestEditsNotification(ctx,
			*input.NotificationRecipients,
			intake.ID,
			targetForm,
			intake.ProjectName.ValueOrZero(),
			intake.Requester,
			input.EmailFeedback,
			input.AdditionalInfo,
		)
		if err != nil {
			return intake, err
		}
	}
	return intake, nil
}

// RejectIntakeAsNotApproved handles a Not Approved by GRB action on an intake as part of Admin Actions v2
func RejectIntakeAsNotApproved(
	ctx context.Context,
	store *storage.Store,
	emailClient *email.Client,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	input models.SystemIntakeRejectIntakeInput,
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
	intake.State = models.SystemIntakeStateClosed
	intake.DecisionState = models.SIDSNotApproved

	// update other fields
	intake.RejectionReason = &input.Reason
	intake.DecisionNextSteps = &input.NextSteps
	intake.TRBFollowUpRecommendation = &input.TrbFollowUp

	updatedTime := time.Now()
	intake.UpdatedAt = &updatedTime

	// save intake, action, admin note
	// See Note [Database calls from resolvers aren't atomic]

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
			ActorName:      adminUserInfo.DisplayName,
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
				AuthorName:     null.StringFrom(adminUserInfo.DisplayName),
				Content:        input.AdminNote,
			}

			_, errCreateNote := store.CreateSystemIntakeNote(ctx, adminNote)
			if errCreateNote != nil {
				return errCreateNote
			}

			return nil
		})
	}

	if emailClient != nil && input.NotificationRecipients != nil { // Don't email if no recipients are provided or there isn't an email client
		errGroup.Go(func() error {
			err = emailClient.SystemIntake.SendNotApprovedNotification(ctx,
				*input.NotificationRecipients,
				intake.ID,
				intake.ProjectName.ValueOrZero(),
				intake.Requester,
				input.Reason,
				input.NextSteps,
				input.AdditionalInfo,
			)
			if err != nil {
				return err
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
	emailClient *email.Client,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	input models.SystemIntakeIssueLCIDInput,
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

	// get current time
	currTime := time.Now()

	// update workflow state
	intake.Step = models.SystemIntakeStepDECISION
	intake.State = models.SystemIntakeStateClosed
	intake.DecisionState = models.SIDSLcidIssued

	// update LCID-related fields
	intake.LifecycleID = null.StringFrom(newLCID)
	intake.LifecycleExpiresAt = &input.ExpiresAt
	intake.LifecycleExpirationAlertTS = nil // whenever we update intake.LifecycleExpiresAt (above), we should clear this field so alerts fire properly
	intake.LifecycleIssuedAt = &currTime
	intake.LifecycleScope = &input.Scope
	intake.DecisionNextSteps = &input.NextSteps
	intake.TRBFollowUpRecommendation = &input.TrbFollowUp
	intake.LifecycleCostBaseline = null.StringFromPtr(input.CostBaseline)

	// update other fields
	intake.UpdatedAt = &currTime

	// save intake, action, admin note
	// see Note [Database calls from resolvers aren't atomic]

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
			ActorName:      adminUserInfo.DisplayName,
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
				AuthorName:     null.StringFrom(adminUserInfo.DisplayName),
				Content:        input.AdminNote,
			}

			_, errCreateNote := store.CreateSystemIntakeNote(ctx, adminNote)
			if errCreateNote != nil {
				return errCreateNote
			}

			return nil
		})
	}

	if emailClient != nil && input.NotificationRecipients != nil { // Don't email if no recipients are provided or there isn't an email client
		errGroup.Go(func() error {
			err = emailClient.SystemIntake.SendIssueLCIDNotification(ctx,
				*input.NotificationRecipients,
				intake.ID,
				intake.ProjectName.ValueOrZero(),
				newLCID,
				currTime,
				&input.ExpiresAt,
				input.Scope,
				input.CostBaseline,
				input.NextSteps,
				input.TrbFollowUp,
				intake.Requester,
				input.AdditionalInfo,
			)
			if err != nil {
				return err
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
	emailClient *email.Client,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	input models.SystemIntakeReopenRequestInput,
) (*models.SystemIntake, error) {
	adminTakingAction, err := fetchUserInfo(ctx, appcontext.Principal(ctx).ID())
	if err != nil {
		return nil, err
	}
	intake, err := store.FetchSystemIntakeByID(ctx, input.SystemIntakeID)
	if err != nil {
		return nil, err
	}

	if intake.State == models.SystemIntakeStateOpen {
		return nil, &apperrors.BadRequestError{
			Err: fmt.Errorf("intake is already open"),
		}
	}
	intake.State = models.SystemIntakeStateOpen

	updatedTime := time.Now()
	intake.UpdatedAt = &updatedTime

	// save intake, action, admin note
	// see Note [Database calls from resolvers aren't atomic]

	intake, err = store.UpdateSystemIntake(ctx, intake)
	if err != nil {
		return nil, err
	}

	// input.Reason is currently not persisted and only sent in the notification email

	_, err = store.CreateAction(ctx, &models.Action{
		ActionType:     models.ActionTypeREOPENREQUEST,
		ActorName:      adminTakingAction.DisplayName,
		ActorEUAUserID: adminTakingAction.Username,
		ActorEmail:     adminTakingAction.Email,
		BusinessCaseID: intake.BusinessCaseID,
		IntakeID:       &intake.ID,
		Feedback:       input.AdditionalInfo,
		Step:           &intake.Step,
	})
	if err != nil {
		return nil, err
	}
	if input.AdminNote != nil {
		_, err = store.CreateSystemIntakeNote(ctx, &models.SystemIntakeNote{
			SystemIntakeID: intake.ID,
			AuthorEUAID:    adminTakingAction.Username,
			AuthorName:     null.StringFrom(adminTakingAction.DisplayName),
			Content:        input.AdminNote,
		})
		if err != nil {
			return nil, err
		}
	}
	if emailClient != nil && input.NotificationRecipients != nil { // Don't email if no recipients are provided or there isn't an email client
		err = emailClient.SystemIntake.SendReopenRequestNotification(ctx,
			*input.NotificationRecipients,
			intake.ID,
			intake.ProjectName.ValueOrZero(),
			intake.Requester,
			input.Reason,
			intake.SubmittedAt,
			input.AdditionalInfo,
		)
		if err != nil {
			return intake, err
		}
	}
	return intake, nil
}

// CreateSystemIntakeActionCloseRequest closes an intake request
func CreateSystemIntakeActionCloseRequest(
	ctx context.Context,
	store *storage.Store,
	emailClient *email.Client,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	input models.SystemIntakeCloseRequestInput,
) (*models.SystemIntake, error) {
	adminTakingAction, err := fetchUserInfo(ctx, appcontext.Principal(ctx).ID())
	if err != nil {
		return nil, err
	}
	intake, err := store.FetchSystemIntakeByID(ctx, input.SystemIntakeID)
	if err != nil {
		return nil, err
	}
	if intake.State == models.SystemIntakeStateClosed {
		return nil, &apperrors.BadRequestError{
			Err: fmt.Errorf("intake is already closed"),
		}
	}
	intake.State = models.SystemIntakeStateClosed

	updatedTime := time.Now()
	intake.UpdatedAt = &updatedTime

	// save intake, action, admin note
	// see Note [Database calls from resolvers aren't atomic]

	intake, err = store.UpdateSystemIntake(ctx, intake)
	if err != nil {
		return nil, err
	}

	// input.Reason is currently not persisted and only sent in the notification email

	_, err = store.CreateAction(ctx, &models.Action{
		ActionType:     models.ActionTypeCLOSEREQUEST,
		ActorName:      adminTakingAction.DisplayName,
		ActorEUAUserID: adminTakingAction.Username,
		ActorEmail:     adminTakingAction.Email,
		BusinessCaseID: intake.BusinessCaseID,
		IntakeID:       &intake.ID,
		Feedback:       input.AdditionalInfo,
		Step:           &intake.Step,
	})
	if err != nil {
		return nil, err
	}
	if input.AdminNote != nil {
		_, err = store.CreateSystemIntakeNote(ctx, &models.SystemIntakeNote{
			SystemIntakeID: intake.ID,
			AuthorEUAID:    adminTakingAction.Username,
			AuthorName:     null.StringFrom(adminTakingAction.DisplayName),
			Content:        input.AdminNote,
		})
		if err != nil {
			return nil, err
		}
	}
	if emailClient != nil && input.NotificationRecipients != nil { // Don't email if no recipients are provided or there isn't an email client
		err = emailClient.SystemIntake.SendCloseRequestNotification(ctx,
			*input.NotificationRecipients,
			intake.ID,
			intake.ProjectName.ValueOrZero(),
			intake.Requester,
			input.Reason,
			intake.SubmittedAt,
			input.AdditionalInfo,
		)
		if err != nil {
			return intake, err
		}
	}
	return intake, nil
}

// CreateSystemIntakeActionNotITGovRequest marks a request as closed, sets a decision of not an IT Gov req, and progress the step to decision
func CreateSystemIntakeActionNotITGovRequest(
	ctx context.Context,
	store *storage.Store,
	emailClient *email.Client,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	input models.SystemIntakeNotITGovReqInput,
) (*models.SystemIntake, error) {
	adminTakingAction, err := fetchUserInfo(ctx, appcontext.Principal(ctx).ID())
	if err != nil {
		return nil, err
	}
	intake, err := store.FetchSystemIntakeByID(ctx, input.SystemIntakeID)
	if err != nil {
		return nil, err
	}
	intake.State = models.SystemIntakeStateClosed
	intake.Step = models.SystemIntakeStepDECISION
	intake.RejectionReason = input.Reason
	intake.DecisionState = models.SIDSNotGovernance

	updatedTime := time.Now()
	intake.UpdatedAt = &updatedTime

	// save intake, action, admin note
	// see Note [Database calls from resolvers aren't atomic]

	intake, err = store.UpdateSystemIntake(ctx, intake)
	if err != nil {
		return nil, err
	}

	_, err = store.CreateAction(ctx, &models.Action{
		ActionType:     models.ActionTypeNOTITGOVREQUEST,
		ActorName:      adminTakingAction.DisplayName,
		ActorEUAUserID: adminTakingAction.Username,
		ActorEmail:     adminTakingAction.Email,
		BusinessCaseID: intake.BusinessCaseID,
		IntakeID:       &intake.ID,
		Feedback:       input.AdditionalInfo,
		Step:           &intake.Step,
	})
	if err != nil {
		return nil, err
	}
	if input.AdminNote != nil {
		_, err = store.CreateSystemIntakeNote(ctx, &models.SystemIntakeNote{
			SystemIntakeID: intake.ID,
			AuthorEUAID:    adminTakingAction.Username,
			AuthorName:     null.StringFrom(adminTakingAction.DisplayName),
			Content:        input.AdminNote,
		})
		if err != nil {
			return nil, err
		}
	}
	if emailClient != nil && input.NotificationRecipients != nil { // Don't email if no recipients are provided or there isn't an email client
		err = emailClient.SystemIntake.SendNotITGovRequestNotification(ctx,
			*input.NotificationRecipients,
			intake.ID,
			intake.ProjectName.ValueOrZero(),
			intake.Requester,
			input.Reason,
			input.AdditionalInfo,
		)
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
	emailClient *email.Client,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	input models.SystemIntakeUpdateLCIDInput,
) (*models.SystemIntake, error) {
	adminEUAID := appcontext.Principal(ctx).ID()

	adminUserInfo, err := fetchUserInfo(ctx, adminEUAID)
	if err != nil {
		return nil, err
	}

	intake, err := store.FetchSystemIntakeByID(ctx, input.SystemIntakeID)
	if err != nil || intake == nil {
		return nil, err
	}
	err = lcidactions.IsLCIDValidToUpdate(intake)
	if err != nil {
		return nil, err
	}
	// input.Reason //TODO: The reason field will be retained in the DB in a future ticket

	// action is populated first as it serves to audit the changes to the relevant LCID fields on an intake. Intake is saved later after the action fields are populated
	action := lcidactions.GetUpdateLCIDAction(*intake, input.ExpiresAt, input.NextSteps, input.Scope, input.CostBaseline, *adminUserInfo)

	updatedTime := time.Now()
	intake.UpdatedAt = &updatedTime

	// update workflow state
	intake.Step = models.SystemIntakeStepDECISION
	intake.State = models.SystemIntakeStateClosed
	intake.DecisionState = models.SIDSLcidIssued

	// Capture current LCID data for email notification
	var prevExpiration *time.Time
	var prevScope *models.HTML
	var prevSteps *models.HTML
	var prevCostBaseline string
	var newCostBaseline string
	if intake.LifecycleScope != nil {
		scope := *intake.LifecycleScope
		prevScope = &scope
	}
	if intake.LifecycleExpiresAt != nil {
		expirationTime := *intake.LifecycleExpiresAt
		prevExpiration = &expirationTime
	}
	if intake.DecisionNextSteps != nil {
		steps := *intake.DecisionNextSteps
		prevSteps = &steps
	}
	prevCostBaseline = intake.LifecycleCostBaseline.ValueOrZero()

	// update LCID-related fields when they are set
	if input.ExpiresAt != nil && !helpers.DatesEqual(intake.LifecycleExpiresAt, input.ExpiresAt) { // if the expiration date has changed, update the expiration date and alert TS accordingly
		intake.LifecycleExpiresAt = input.ExpiresAt
		intake.LifecycleExpirationAlertTS = nil // whenever we update intake.LifecycleExpiresAt (above), we should clear this field so alerts fire properly
	}
	if input.Scope != nil {
		intake.LifecycleScope = input.Scope
	}
	if input.NextSteps != nil {
		intake.DecisionNextSteps = input.NextSteps
	}
	if input.CostBaseline != nil {
		newCostBaseline = *input.CostBaseline
		intake.LifecycleCostBaseline = null.StringFromPtr(input.CostBaseline)
	}

	var updatedIntake *models.SystemIntake // declare this outside the function we pass to errGroup.Go() so we can return it

	// save intake, action, admin note
	// see Note [Database calls from resolvers aren't atomic]

	// save action (including additional info for email, if any)
	errGroup := new(errgroup.Group)

	errGroup.Go(func() error {
		if input.AdditionalInfo != nil {
			action.Feedback = input.AdditionalInfo
		}

		_, errCreatingAction := store.CreateAction(ctx, &action)
		if errCreatingAction != nil {
			return errCreatingAction
		}

		return nil
	})
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
				AuthorName:     null.StringFrom(adminUserInfo.DisplayName),
				Content:        input.AdminNote,
			}

			_, errCreateNote := store.CreateSystemIntakeNote(ctx, adminNote)
			if errCreateNote != nil {
				return errCreateNote
			}

			return nil
		})
	}

	if emailClient != nil && input.NotificationRecipients != nil { // Don't email if no recipients are provided or there isn't an email client
		errGroup.Go(func() error {
			err = emailClient.SystemIntake.SendUpdateLCIDNotification(ctx,
				*input.NotificationRecipients,
				intake.LifecycleID.ValueOrZero(),
				intake.LifecycleIssuedAt,
				prevExpiration,
				input.ExpiresAt,
				prevScope,
				input.Scope,
				prevCostBaseline,
				newCostBaseline,
				prevSteps,
				input.NextSteps,
				updatedTime,
				input.Reason,
				input.AdditionalInfo,
			)
			if err != nil {
				return err
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
	emailClient *email.Client,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	input models.SystemIntakeConfirmLCIDInput,
) (*models.SystemIntake, error) {

	adminEUAID := appcontext.Principal(ctx).ID()

	adminUserInfo, err := fetchUserInfo(ctx, adminEUAID)
	if err != nil {
		return nil, err
	}

	intake, err := store.FetchSystemIntakeByID(ctx, input.SystemIntakeID)
	if err != nil || intake == nil {
		return nil, err
	}
	err = lcidactions.IsLCIDValidToConfirm(intake)
	if err != nil {
		return nil, err
	}
	// action is populated first as it serves to audit the changes to the relevant LCID fields on an intake. Intake is saved later after the action fields are populated
	action := lcidactions.GetConfirmLCIDAction(*intake, input.ExpiresAt, input.NextSteps, input.Scope, input.CostBaseline, *adminUserInfo)

	updatedTime := time.Now()
	intake.UpdatedAt = &updatedTime

	// update workflow state
	intake.Step = models.SystemIntakeStepDECISION
	intake.State = models.SystemIntakeStateClosed
	intake.DecisionState = models.SIDSLcidIssued

	// update LCID-related fields
	intake.TRBFollowUpRecommendation = &input.TrbFollowUp
	if !helpers.DatesEqual(intake.LifecycleExpiresAt, &input.ExpiresAt) { // if the expiration date has changed, update the expiration date and alert TS accordingly
		intake.LifecycleExpiresAt = &input.ExpiresAt
		intake.LifecycleExpirationAlertTS = nil // whenever we update intake.LifecycleExpiresAt (above), we should clear this field so alerts fire properly
	}
	intake.LifecycleScope = &input.Scope
	intake.DecisionNextSteps = &input.NextSteps
	if input.CostBaseline != nil {
		intake.LifecycleCostBaseline = null.StringFromPtr(input.CostBaseline)
	}

	var updatedIntake *models.SystemIntake // declare this outside the function we pass to errGroup.Go() so we can return it

	// save intake, action, admin note
	// see Note [Database calls from resolvers aren't atomic]

	errGroup := new(errgroup.Group)
	// save action (including additional info for email, if any)
	errGroup.Go(func() error {

		if input.AdditionalInfo != nil {
			action.Feedback = input.AdditionalInfo
		}

		_, errCreatingAction := store.CreateAction(ctx, &action)
		if errCreatingAction != nil {
			return errCreatingAction
		}

		return nil
	})

	// save intake
	errGroup.Go(func() error {
		var errUpdateIntake error // declare this separately because if we use := on next line, compiler thinks we're declaring a new updatedIntake variable as well
		updatedIntake, errUpdateIntake = store.UpdateSystemIntake(ctx, intake)
		if errUpdateIntake != nil {
			return errUpdateIntake
		}

		return nil
	})
	// TODO: EASI-3109 will send an email from this mutation

	// save admin note
	if input.AdminNote != nil {
		errGroup.Go(func() error {
			adminNote := &models.SystemIntakeNote{
				SystemIntakeID: input.SystemIntakeID,
				AuthorEUAID:    adminEUAID,
				AuthorName:     null.StringFrom(adminUserInfo.DisplayName),
				Content:        input.AdminNote,
			}

			_, errCreateNote := store.CreateSystemIntakeNote(ctx, adminNote)
			if errCreateNote != nil {
				return errCreateNote
			}

			return nil
		})
	}

	if emailClient != nil && input.NotificationRecipients != nil { // Don't email if no recipients are provided or there isn't an email client
		errGroup.Go(func() error {
			err = emailClient.SystemIntake.SendConfirmLCIDNotification(ctx,
				*input.NotificationRecipients,
				intake.ID,
				intake.ProjectName.ValueOrZero(),
				intake.LifecycleID.ValueOrZero(),
				&input.ExpiresAt,
				intake.LifecycleIssuedAt,
				input.Scope,
				input.CostBaseline,
				input.NextSteps,
				input.TrbFollowUp,
				intake.Requester,
				input.AdditionalInfo,
			)
			if err != nil {
				return err
			}
			return nil
		})
	}

	if err := errGroup.Wait(); err != nil {
		return nil, err
	}

	return updatedIntake, nil
}

// ExpireLCID handles an Expire LCID action on an intake as part of Admin Actions v2
func ExpireLCID(
	ctx context.Context,
	store *storage.Store,
	emailClient *email.Client,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	input models.SystemIntakeExpireLCIDInput,
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

	currentTime := time.Now()

	err = lcidactions.IsIntakeValidToExpireLCID(intake, currentTime)
	if err != nil {
		return nil, err
	}

	// update intake

	// set the expiration date's year/month/day based on current values, but leave the time as 00:00:00 (in UTC)
	// matches the (v1) frontend logic for setting the expiration date:
	currentTimeUTC := currentTime.UTC()
	expirationDate := time.Date(
		currentTimeUTC.Year(),
		currentTimeUTC.Month(),
		currentTimeUTC.Day(),
		0,
		0,
		0,
		0,
		time.UTC,
	)

	// create action record before updating intake, while we still have access to intake's previous expiration date/next step
	action := lcidactions.GetExpireLCIDAction(*intake, expirationDate, input.NextSteps, *adminUserInfo)

	// Update LCID Expiry info
	// NOTE: In most other places we need to update intake.LifecycleExpirationAlertTS = nil, but not here, since we don't alert on already-expired LCIDs
	intake.LifecycleExpiresAt = &expirationDate

	intake.DecisionNextSteps = input.NextSteps
	// not currently persisting input.Reason
	intake.UpdatedAt = &currentTime

	// save intake, action, admin note
	// See Note [Database calls from resolvers aren't atomic]

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

	// save action (including additional info for email, if any), using record returned from GetExpireLCIDAction()
	errGroup.Go(func() error {
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
				AuthorName:     null.StringFrom(adminUserInfo.DisplayName),
				Content:        input.AdminNote,
			}

			_, errCreateNote := store.CreateSystemIntakeNote(ctx, adminNote)
			if errCreateNote != nil {
				return errCreateNote
			}

			return nil
		})
	}

	if emailClient != nil && input.NotificationRecipients != nil { // Don't email if no recipients are provided or there isn't an email client
		errGroup.Go(func() error {
			err = emailClient.SystemIntake.SendExpireLCIDNotification(ctx,
				*input.NotificationRecipients,
				intake.LifecycleID.ValueOrZero(),
				intake.LifecycleExpiresAt,
				intake.LifecycleIssuedAt,
				intake.LifecycleScope,
				intake.LifecycleCostBaseline.ValueOrZero(),
				input.Reason,
				input.NextSteps,
				input.AdditionalInfo,
			)
			if err != nil {
				return err
			}
			return nil
		})
	}

	if err := errGroup.Wait(); err != nil {
		return nil, err
	}

	return updatedIntake, nil
}

// RetireLCID handles a Retire LCID action on an intake as part of Admin Actions v2
func RetireLCID(
	ctx context.Context,
	store *storage.Store,
	emailClient *email.Client,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	input models.SystemIntakeRetireLCIDInput,
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

	err = lcidactions.IsLCIDValidToRetire(intake)
	if err != nil {
		return nil, err
	}

	// create action record before updating intake, while we still have access to intake's previous retirement date
	action := lcidactions.GetRetireLCIDAction(*intake, input.RetiresAt, *adminUserInfo)

	// update intake
	// not currently persisting input.Reason
	intake.LifecycleRetiresAt = &input.RetiresAt

	// save intake, action, admin note
	// See Note [Database calls from resolvers aren't atomic]

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

	// save action (including additional info for email, if any), using record returned from GetRetireLCIDAction()
	errGroup.Go(func() error {
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
				AuthorName:     null.StringFrom(adminUserInfo.DisplayName),
				Content:        input.AdminNote,
			}

			_, errCreateNote := store.CreateSystemIntakeNote(ctx, adminNote)
			if errCreateNote != nil {
				return errCreateNote
			}

			return nil
		})
	}

	if emailClient != nil && input.NotificationRecipients != nil { // Don't email if no recipients are provided or there isn't an email client
		errGroup.Go(func() error {
			err = emailClient.SystemIntake.SendRetireLCIDNotification(ctx,
				*input.NotificationRecipients,
				intake.LifecycleID.ValueOrZero(),
				&input.RetiresAt,
				intake.LifecycleExpiresAt,
				intake.LifecycleIssuedAt,
				intake.LifecycleScope,
				intake.LifecycleCostBaseline.ValueOrZero(),
				input.Reason,
				intake.DecisionNextSteps,
				input.AdditionalInfo,
			)
			if err != nil {
				return err
			}
			return nil
		})
	}

	if err := errGroup.Wait(); err != nil {
		return nil, err
	}

	return updatedIntake, nil
}

// UnretireLCID handles an Unretire LCID action on an intake as part of Admin Actions v2
func UnretireLCID(
	ctx context.Context,
	store *storage.Store,
	emailClient *email.Client,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	input models.SystemIntakeUnretireLCIDInput,
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

	// create action record before updating intake, while we still have access to intake's previous retirement date
	action := lcidactions.GetUnretireLCIDAction(*intake, *adminUserInfo)

	// Reset LCID RetiresAt to nil
	intake.LifecycleRetiresAt = nil

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

	// save action (including additional info for email, if any), using record returned from GetUnretireLCIDAction()
	errGroup.Go(func() error {
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
				AuthorName:     null.StringFrom(adminUserInfo.DisplayName),
				Content:        input.AdminNote,
			}

			_, errCreateNote := store.CreateSystemIntakeNote(ctx, adminNote)
			if errCreateNote != nil {
				return errCreateNote
			}

			return nil
		})
	}

	if emailClient != nil && input.NotificationRecipients != nil { // Don't email if no recipients are provided or there isn't an email client
		errGroup.Go(func() error {
			err = emailClient.SystemIntake.SendUnretireLCIDNotification(ctx,
				*input.NotificationRecipients,
				intake.LifecycleID.ValueOrZero(),
				intake.LifecycleExpiresAt,
				intake.LifecycleIssuedAt,
				intake.LifecycleScope,
				intake.LifecycleCostBaseline.ValueOrZero(),
				intake.DecisionNextSteps,
				input.AdditionalInfo,
			)
			if err != nil {
				return err
			}
			return nil
		})
	}

	if err := errGroup.Wait(); err != nil {
		return nil, err
	}

	return updatedIntake, nil
}

// ChangeLCIDRetirementDate handles a Change LCID Retirement Date action on an intake as part of Admin Actions v2
func ChangeLCIDRetirementDate(
	ctx context.Context,
	store *storage.Store,
	emailClient *email.Client,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	input models.SystemIntakeChangeLCIDRetirementDateInput,
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

	err = lcidactions.IsLCIDValidToChangeRetirementDate(intake)
	if err != nil {
		return nil, err
	}

	// create action record before updating intake, while we still have access to intake's previous retirement date
	action := lcidactions.GetChangeLCIDRetirementDateAction(*intake, input.RetiresAt, *adminUserInfo)

	// update intake
	intake.LifecycleRetiresAt = &input.RetiresAt

	// TODO: EASI-3109 will send an email from this mutation

	// save intake, action, admin note
	// See Note [Database calls from resolvers aren't atomic]

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

	// save action (including additional info for email, if any), using record returned from GetRetireLCIDAction()
	errGroup.Go(func() error {
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
				AuthorName:     null.StringFrom(adminUserInfo.DisplayName),
				Content:        input.AdminNote,
			}

			_, errCreateNote := store.CreateSystemIntakeNote(ctx, adminNote)
			if errCreateNote != nil {
				return errCreateNote
			}

			return nil
		})
	}

	if emailClient != nil && input.NotificationRecipients != nil { // Don't email if no recipients are provided or there isn't an email client
		errGroup.Go(func() error {
			err = emailClient.SystemIntake.SendChangeLCIDRetirementDateNotification(ctx,
				*input.NotificationRecipients,
				intake.LifecycleID.ValueOrZero(),
				&input.RetiresAt,
				intake.LifecycleExpiresAt,
				intake.LifecycleIssuedAt,
				intake.LifecycleScope,
				intake.LifecycleCostBaseline.ValueOrZero(),
				intake.DecisionNextSteps,
				input.AdditionalInfo,
			)
			if err != nil {
				return err
			}
			return nil
		})
	}

	if err := errGroup.Wait(); err != nil {
		return nil, err
	}

	return updatedIntake, nil
}

// Note [Database calls from resolvers aren't atomic]
// All the different database calls in a resolver (saving the intake, action, admin note, etc.) aren't in a single atomic transaction;
// in the case of a system failure, some data from the action might be saved, but not all.
// We're currently accepting that risk, largely due to the difficulty of wrapping multiple store method calls in a single transaction.
// If we create a general way to wrap several store methods calls in a transaction later, we can use that.
