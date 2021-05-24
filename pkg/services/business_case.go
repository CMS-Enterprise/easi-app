package services

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/appvalidation"
	"github.com/cmsgov/easi-app/pkg/models"
)

// NewFetchBusinessCaseByID is a service to fetch the business case by id
func NewFetchBusinessCaseByID(
	config Config,
	fetch func(c context.Context, id uuid.UUID) (*models.BusinessCase, error),
	authorize func(context.Context) (bool, error),
) func(c context.Context, id uuid.UUID) (*models.BusinessCase, error) {
	return func(ctx context.Context, id uuid.UUID) (*models.BusinessCase, error) {
		logger := appcontext.ZLogger(ctx)
		businessCase, err := fetch(ctx, id)
		if err != nil {
			logger.Error("failed to fetch business case")
			return &models.BusinessCase{}, &apperrors.QueryError{
				Err:       err,
				Model:     businessCase,
				Operation: apperrors.QueryFetch,
			}
		}
		ok, err := authorize(ctx)
		if err != nil {
			logger.Error("failed to authorize fetch business case")
			return &models.BusinessCase{}, err
		}
		if !ok {
			return &models.BusinessCase{}, &apperrors.UnauthorizedError{Err: err}
		}
		return businessCase, nil
	}
}

// NewCreateBusinessCase is a service to create a business case
func NewCreateBusinessCase(
	config Config,
	fetchIntake func(c context.Context, id uuid.UUID) (*models.SystemIntake, error),
	authorize func(c context.Context, i *models.SystemIntake) (bool, error),
	createAction func(context.Context, *models.Action) (*models.Action, error),
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	createBizCase func(context.Context, *models.BusinessCase) (*models.BusinessCase, error),
	updateIntake func(context.Context, *models.SystemIntake) (*models.SystemIntake, error),
) func(c context.Context, b *models.BusinessCase) (*models.BusinessCase, error) {
	return func(ctx context.Context, businessCase *models.BusinessCase) (*models.BusinessCase, error) {
		intake, err := fetchIntake(ctx, businessCase.SystemIntakeID)
		if err != nil {
			// We return an empty id in this error because the business case hasn't been created
			return &models.BusinessCase{}, &apperrors.ResourceConflictError{
				Err:        errors.New("system intake is required to create a business case"),
				Resource:   models.BusinessCase{},
				ResourceID: "",
			}
		}
		ok, err := authorize(ctx, intake)
		if err != nil {
			return &models.BusinessCase{}, err
		}
		if !ok {
			return &models.BusinessCase{}, &apperrors.UnauthorizedError{Err: err}
		}
		err = appvalidation.BusinessCaseForCreation(businessCase, intake)
		if err != nil {
			return &models.BusinessCase{}, err
		}

		userInfo, err := fetchUserInfo(ctx, appcontext.Principal(ctx).ID())
		if err != nil {
			return &models.BusinessCase{}, err
		}
		if userInfo == nil || userInfo.Email == "" || userInfo.CommonName == "" || userInfo.EuaUserID == "" {
			return &models.BusinessCase{}, &apperrors.ExternalAPIError{
				Err:       errors.New("user info fetch was not successful"),
				Model:     intake,
				ModelID:   intake.ID.String(),
				Operation: apperrors.Fetch,
				Source:    "CEDAR LDAP",
			}
		}

		action := models.Action{
			IntakeID:       &intake.ID,
			ActionType:     models.ActionTypeCREATEBIZCASE,
			ActorName:      userInfo.CommonName,
			ActorEmail:     userInfo.Email,
			ActorEUAUserID: userInfo.EuaUserID,
		}
		_, err = createAction(ctx, &action)
		if err != nil {
			return &models.BusinessCase{}, &apperrors.QueryError{
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
			return &models.BusinessCase{}, err
		}

		intake.Status = models.SystemIntakeStatusBIZCASEDRAFT
		intake.UpdatedAt = &now
		if _, err = updateIntake(ctx, intake); err != nil {
			return &models.BusinessCase{}, err
		}

		return businessCase, nil
	}
}

// NewUpdateBusinessCase is a service to create a business case
func NewUpdateBusinessCase(
	config Config,
	fetchBusinessCase func(c context.Context, id uuid.UUID) (*models.BusinessCase, error),
	authorize func(c context.Context, b *models.BusinessCase) (bool, error),
	update func(c context.Context, businessCase *models.BusinessCase) (*models.BusinessCase, error),
) func(c context.Context, b *models.BusinessCase) (*models.BusinessCase, error) {
	return func(ctx context.Context, businessCase *models.BusinessCase) (*models.BusinessCase, error) {
		logger := appcontext.ZLogger(ctx)
		existingBusinessCase, err := fetchBusinessCase(ctx, businessCase.ID)
		if err != nil {
			return &models.BusinessCase{}, &apperrors.ResourceConflictError{
				Err:        errors.New("business case does not exist"),
				Resource:   businessCase,
				ResourceID: businessCase.ID.String(),
			}
		}
		ok, err := authorize(ctx, existingBusinessCase)
		if err != nil {
			return &models.BusinessCase{}, err
		}
		if !ok {
			return &models.BusinessCase{}, &apperrors.UnauthorizedError{Err: err}
		}
		// Uncomment below when UI has changed for unique lifecycle costs
		//err = appvalidation.BusinessCaseForUpdate(businessCase)
		//if err != nil {
		//	return &models.BusinessCase{}, err
		//}
		updatedAt := config.clock.Now()
		businessCase.UpdatedAt = &updatedAt

		businessCase, err = update(ctx, businessCase)
		if err != nil {
			logger.Error("failed to update business case")
			return &models.BusinessCase{}, &apperrors.QueryError{
				Err:       err,
				Model:     businessCase,
				Operation: apperrors.QuerySave,
			}
		}

		return businessCase, nil
	}
}

// NewCloseBusinessCase is a service to close a businessCase
func NewCloseBusinessCase(
	config Config,
	fetch func(c context.Context, id uuid.UUID) (*models.BusinessCase, error),
	update func(context.Context, *models.BusinessCase) (*models.BusinessCase, error),
) func(context.Context, uuid.UUID) error {
	return func(ctx context.Context, id uuid.UUID) error {
		businessCase, fetchErr := fetch(ctx, id)
		if fetchErr != nil {
			return &apperrors.QueryError{
				Err:       fetchErr,
				Operation: apperrors.QueryFetch,
				Model:     businessCase,
			}
		}

		if businessCase.Status != models.BusinessCaseStatusCLOSED {
			updatedTime := config.clock.Now()
			businessCase.UpdatedAt = &updatedTime
			businessCase.Status = models.BusinessCaseStatusCLOSED

			_, err := update(ctx, businessCase)
			if err != nil {
				return &apperrors.QueryError{
					Err:       err,
					Model:     businessCase,
					Operation: apperrors.QuerySave,
				}
			}
		}

		return nil
	}
}
