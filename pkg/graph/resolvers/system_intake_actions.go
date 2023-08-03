package resolvers

import (
	"context"
	"fmt"

	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

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
		targetForm = models.GovernanceRequestFeedbackTargetIntakeRequest
	case model.SystemIntakeFormStepDraftBusinessCase:
		intake.DraftBusinessCaseState = models.SIRFSEditsRequested
		intake.Step = models.SystemIntakeStepDRAFTBIZCASE
		targetForm = models.GovernanceRequestFeedbackTargetDraftBusinessCase
	case model.SystemIntakeFormStepFinalBusinessCase:
		intake.FinalBusinessCaseState = models.SIRFSEditsRequested
		intake.Step = models.SystemIntakeStepFINALBIZCASE
		targetForm = models.GovernanceRequestFeedbackTargetFinalBusinessCase
	default:
		return nil, &apperrors.BadRequestError{
			Err: fmt.Errorf("Cannot request edits on %s", input.IntakeFormStep),
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
	})
	if err != nil {
		return nil, err
	}
	govReqFeedback := &models.GovernanceRequestFeedback{}
	govReqFeedback.IntakeID = intake.ID
	govReqFeedback.CreatedBy = adminTakingAction.EuaUserID
	govReqFeedback.SourceAction = models.GovernanceRequestFeedbackSourceActionRequestEdits
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
