package resolvers

import (
	"context"
	"errors"

	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
)

// ProgressIntakeToNewStep handles a Progress to New Step action on an intake
func ProgressIntakeToNewStep(
	ctx context.Context,
	store *storage.Store,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	input *model.SystemIntakeProgressToNewStepsInput,
) (*models.SystemIntake, error) {
	// EUA ID of the admin taking this action
	adminEUAID := appcontext.Principal(ctx).ID()

	intake, err := store.FetchSystemIntakeByID(ctx, input.SystemIntakeID)
	if err != nil {
		return nil, err
	}

	if !intakeIsValidForProgressToNewStep(intake, input.NewStep) {
		// TODO - log?
		// TODO - more precise error type, error message
		return nil, errors.New("invalid state")
	}

	modifyIntakeToNewStep(intake, input.NewStep)

	// TODO - parallelize DB calls with errgroup?

	updatedIntake, err := store.UpdateSystemIntake(ctx, intake)
	if err != nil {
		return nil, err
	}

	// TODO - save action

	if input.Feedback != nil {
		feedbackForRequester := &models.GovernanceRequestFeedback{
			IntakeID:     updatedIntake.ID,
			Feedback:     *input.Feedback,
			SourceAction: models.GovernanceRequestFeedbackSourceActionProgressToNewStep,
			TargetForm:   models.GovernanceRequestFeedbackTargetNoTargetProvided,
		}
		feedbackForRequester.CreatedBy = adminEUAID

		_, err = store.CreateGovernanceRequestFeedback(ctx, feedbackForRequester)
		if err != nil {
			return nil, err
		}
	}

	if input.GrbRecommendations != nil {
		feedbackForGRB := &models.GovernanceRequestFeedback{
			IntakeID:     updatedIntake.ID,
			Feedback:     *input.GrbRecommendations,
			SourceAction: models.GovernanceRequestFeedbackSourceActionProgressToNewStep,
			TargetForm:   models.GovernanceRequestFeedbackTargetNoTargetProvided,
		}
		feedbackForGRB.CreatedBy = adminEUAID

		_, err = store.CreateGovernanceRequestFeedback(ctx, feedbackForGRB)
		if err != nil {
			return nil, err
		}
	}

	if input.AdminNote != nil {
		adminUserInfo, err := fetchUserInfo(ctx, adminEUAID)
		if err != nil {
			return nil, err
		}

		adminNote := &models.SystemIntakeNote{
			SystemIntakeID: input.SystemIntakeID,
			AuthorEUAID:    adminEUAID,
			AuthorName:     null.StringFrom(adminUserInfo.CommonName),
			Content:        null.StringFrom(*input.AdminNote),
		}

		_, err = store.CreateSystemIntakeNote(ctx, adminNote)
		if err != nil {
			return nil, err
		}
	}

	return updatedIntake, nil
}

// TODO - potentially inline if logic is simple enough
// TODO - if not inlined - better name
func intakeIsValidForProgressToNewStep(intake *models.SystemIntake, newStep model.SystemIntakeStepToProgressTo) bool {
	// TODO - implement
	return true
}

// TODO - potentially inline if logic is simple enough
// TODO - if not inlined - better name
func modifyIntakeToNewStep(intake *models.SystemIntake, newStep model.SystemIntakeStepToProgressTo) {
	// TODO - implement
}
