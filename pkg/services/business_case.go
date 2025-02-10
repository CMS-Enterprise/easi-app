package services

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/appvalidation"
	"github.com/cms-enterprise/easi-app/pkg/graph/resolvers/systemintake/formstate"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// NewFetchBusinessCaseByID is a service to fetch the Business Case by id
func NewFetchBusinessCaseByID(
	config Config,
	fetch func(c context.Context, id uuid.UUID) (*models.BusinessCaseWithCosts, error),
	authorized func(context.Context) bool,
) func(c context.Context, id uuid.UUID) (*models.BusinessCaseWithCosts, error) {
	return func(ctx context.Context, id uuid.UUID) (*models.BusinessCaseWithCosts, error) {
		logger := appcontext.ZLogger(ctx)
		businessCase, err := fetch(ctx, id)
		if err != nil {
			logger.Error("failed to fetch Business Case")
			return &models.BusinessCaseWithCosts{}, &apperrors.QueryError{
				Err:       err,
				Model:     businessCase,
				Operation: apperrors.QueryFetch,
			}
		}
		if !authorized(ctx) {
			return &models.BusinessCaseWithCosts{}, &apperrors.UnauthorizedError{Err: errors.New("user is unauthorized to fetch Business Case")}
		}
		return businessCase, nil
	}
}

// NewCreateBusinessCase is a service to create a Business Case
func NewCreateBusinessCase(
	config Config,
	fetchIntake func(c context.Context, id uuid.UUID) (*models.SystemIntake, error),
	authorized func(c context.Context, i *models.SystemIntake) bool,
	createAction func(context.Context, *models.Action) (*models.Action, error),
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	createBizCase func(context.Context, *models.BusinessCaseWithCosts) (*models.BusinessCaseWithCosts, error),
	updateIntake func(context.Context, *models.SystemIntake) (*models.SystemIntake, error),
) func(c context.Context, b *models.BusinessCaseWithCosts) (*models.BusinessCaseWithCosts, error) {
	return func(ctx context.Context, businessCase *models.BusinessCaseWithCosts) (*models.BusinessCaseWithCosts, error) {
		intake, err := fetchIntake(ctx, businessCase.SystemIntakeID)
		if err != nil {
			// We return an empty id in this error because the Business Case hasn't been created
			return &models.BusinessCaseWithCosts{}, &apperrors.ResourceConflictError{
				Err:        errors.New("system intake is required to create a Business Case"),
				Resource:   models.BusinessCase{},
				ResourceID: "",
			}
		}
		if !authorized(ctx, intake) {
			return &models.BusinessCaseWithCosts{}, &apperrors.UnauthorizedError{Err: errors.New("user is unauthorized to create Business Case")}
		}
		err = appvalidation.BusinessCaseForCreation(businessCase, intake)
		if err != nil {
			return &models.BusinessCaseWithCosts{}, err
		}

		userInfo, err := fetchUserInfo(ctx, appcontext.Principal(ctx).ID())
		if err != nil {
			return &models.BusinessCaseWithCosts{}, err
		}
		if userInfo == nil || userInfo.Email == "" || userInfo.DisplayName == "" || userInfo.Username == "" {
			return &models.BusinessCaseWithCosts{}, &apperrors.ExternalAPIError{
				Err:       errors.New("user info fetch was not successful"),
				Model:     intake,
				ModelID:   intake.ID.String(),
				Operation: apperrors.Fetch,
				Source:    "Okta",
			}
		}

		action := models.Action{
			IntakeID:       &intake.ID,
			ActionType:     models.ActionTypeCREATEBIZCASE,
			ActorName:      userInfo.DisplayName,
			ActorEmail:     userInfo.Email,
			ActorEUAUserID: userInfo.Username,
		}
		_, err = createAction(ctx, &action)
		if err != nil {
			return &models.BusinessCaseWithCosts{}, &apperrors.QueryError{
				Err:       err,
				Model:     action,
				Operation: apperrors.QueryPost,
			}
		}

		// Autofill time and intake data
		now := config.clock.Now()
		businessCase.CreatedAt = &now
		businessCase.UpdatedAt = &now
		businessCase.Requester = null.StringFrom(intake.Requester)
		businessCase.BusinessOwner = intake.BusinessOwner
		businessCase.ProjectName = intake.ProjectName
		businessCase.BusinessNeed = intake.BusinessNeed
		businessCase.Status = models.BusinessCaseStatusOPEN
		if businessCase, err = createBizCase(ctx, businessCase); err != nil {
			return &models.BusinessCaseWithCosts{}, err
		}

		intake.UpdatedAt = &now
		if _, err = updateIntake(ctx, intake); err != nil {
			return &models.BusinessCaseWithCosts{}, err
		}

		return businessCase, nil
	}
}

// NewUpdateBusinessCase is a service to create a Business Case
func NewUpdateBusinessCase(
	config Config,
	fetchBusinessCase func(c context.Context, id uuid.UUID) (*models.BusinessCaseWithCosts, error),
	authorized func(c context.Context, b *models.BusinessCase) bool,
	update func(c context.Context, businessCase *models.BusinessCaseWithCosts) (*models.BusinessCaseWithCosts, error),
	fetchIntake func(c context.Context, id uuid.UUID) (*models.SystemIntake, error),
	updateIntake func(context.Context, *models.SystemIntake) (*models.SystemIntake, error),
) func(c context.Context, b *models.BusinessCaseWithCosts) (*models.BusinessCaseWithCosts, error) {
	return func(ctx context.Context, businessCase *models.BusinessCaseWithCosts) (*models.BusinessCaseWithCosts, error) {
		logger := appcontext.ZLogger(ctx)
		existingBusinessCase, err := fetchBusinessCase(ctx, businessCase.ID)
		if err != nil {
			return &models.BusinessCaseWithCosts{}, &apperrors.ResourceConflictError{
				Err:        errors.New("business case does not exist"),
				Resource:   businessCase,
				ResourceID: businessCase.ID.String(),
			}
		}
		if !authorized(ctx, &existingBusinessCase.BusinessCase) {
			return &models.BusinessCaseWithCosts{}, &apperrors.UnauthorizedError{Err: errors.New("user unauthorized to update Business Case")}
		}
		// Uncomment below when UI has changed for unique lifecycle costs
		//err = appvalidation.BusinessCaseForUpdate(businessCase)
		//if err != nil {
		//	return &models.BusinessCaseWithCosts{}, err
		//}
		updatedAt := config.clock.Now()
		businessCase.UpdatedAt = &updatedAt

		businessCase, err = update(ctx, businessCase)
		if err != nil {
			logger.Error("failed to update Business Case")
			return &models.BusinessCaseWithCosts{}, &apperrors.QueryError{
				Err:       err,
				Model:     businessCase,
				Operation: apperrors.QuerySave,
			}
		}

		intake, err := fetchIntake(ctx, existingBusinessCase.SystemIntakeID)
		if err != nil {
			logger.Error("failed to fetch system intake after updating Business Case")
			return businessCase, &apperrors.QueryError{ //return the error
				Err:       err,
				Model:     businessCase,
				Operation: apperrors.QuerySave,
			}
		}

		// Since the db doesn't differentiate between draft or final, we need to rely on the step the intake is in. If the intake isn't in that state, the Business Case state won't update.
		if intake.Step == models.SystemIntakeStepDRAFTBIZCASE {
			intake.DraftBusinessCaseState = formstate.GetNewStateForUpdatedForm(intake.DraftBusinessCaseState)
		} else if intake.Step == models.SystemIntakeStepFINALBIZCASE {
			intake.FinalBusinessCaseState = formstate.GetNewStateForUpdatedForm(intake.FinalBusinessCaseState)
		}
		_, err = updateIntake(ctx, intake)
		if err != nil {
			logger.Error("failed to update system intake businessCaseState after updating Business Case state")
			return businessCase, &apperrors.QueryError{ //return the error
				Err:       err,
				Model:     businessCase,
				Operation: apperrors.QuerySave,
			}
		}

		return businessCase, nil
	}
}
