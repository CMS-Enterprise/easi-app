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
	intake, err := store.FetchSystemIntakeByID(ctx, input.SystemIntakeID)
	if err != nil {
		return nil, err
	}
	var targetForm models.GovernanceRequestFeedbackTargetForm
	switch intake.Step {
	case models.SystemIntakeStepINITIALFORM:
		intake.RequestFormState = models.SIRFSEditsRequested
		targetForm = models.GovernanceRequestFeedbackTargetIntakeRequest
	case models.SystemIntakeStepDRAFTBIZCASE:
		intake.DraftBusinessCaseState = models.SIRFSEditsRequested
		targetForm = models.GovernanceRequestFeedbackTargetDraftBusinessCase
	case models.SystemIntakeStepFINALBIZCASE:
		intake.FinalBusinessCaseState = models.SIRFSEditsRequested
		targetForm = models.GovernanceRequestFeedbackTargetFinalBusinessCase
	case models.SystemIntakeStepGRBMEETING:
		fallthrough
	case models.SystemIntakeStepGRTMEETING:
		fallthrough
	case models.SystemIntakeStepDECISION:
		fallthrough
	default:
		return nil, &apperrors.BadRequestError{
			Err: fmt.Errorf("Cannot request edits on %s", intake.Step),
		}
	}
	intake, err = store.UpdateSystemIntake(ctx, intake)
	if err != nil {
		return nil, err
	}
	adminTakingAction, err := fetchUserInfo(ctx, appcontext.Principal(ctx).ID())
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
	govReqFeedback := new(models.GovernanceRequestFeedback)
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
			Content:        null.StringFrom(*input.AdminNotes),
		})
		if err != nil {
			return nil, err
		}
	}
	return intake, nil
}
