package services

import (
	"context"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// NewAuthorizeUserIsIntakeRequester returns a function
// that authorizes a user as being the requester of the given System Intake
func NewAuthorizeUserIsIntakeRequester() func(
	context.Context,
	*models.SystemIntake,
) (bool, error) {
	return func(ctx context.Context, intake *models.SystemIntake) (bool, error) {
		logger := appcontext.ZLogger(ctx)
		principal := appcontext.Principal(ctx)
		if !principal.AllowEASi() {
			logger.Error("unable to get EUA ID from context")
			return false, &apperrors.ContextError{
				Operation: apperrors.ContextGet,
				Object:    "EUA ID",
			}
		}

		// If intake is owned by user, authorize
		if principal.AllowEASi() && principal.ID() == intake.EUAUserID {
			logger.With(zap.Bool("Authorized", true)).
				With(zap.String("Operation", "UpdateSystemIntake")).
				Info("user authorized to save system intake")
			return true, nil
		}
		// Default to failure to authorize and create a quick audit log
		logger.With(zap.Bool("Authorized", false)).
			With(zap.String("Operation", "UpdateSystemIntake")).
			Info("unauthorized attempt to save system intake")
		return false, nil
	}
}

// NewAuthorizeHasEASiRole creates an authorizer that the user can use EASi
func NewAuthorizeHasEASiRole() func(
	context.Context,
) (bool, error) {
	return func(ctx context.Context) (bool, error) {
		logger := appcontext.ZLogger(ctx)
		principal := appcontext.Principal(ctx)
		if !principal.AllowEASi() {
			logger.Error("unable to get EUA ID from context")
			return false, &apperrors.ContextError{
				Operation: apperrors.ContextGet,
				Object:    "EUA ID",
			}
		}
		logger.With(zap.Bool("Authorized", true)).
			With(zap.String("Operation", "UpdateSystemIntake")).
			Info("user authorized to save system intake")
		return true, nil
	}
}

// NewAuthorizeRequireGRTJobCode returns a function
// that authorizes a user as being a member of the
// GRT (Governance Review Team)
func NewAuthorizeRequireGRTJobCode() func(context.Context) (bool, error) {
	return func(ctx context.Context) (bool, error) {
		logger := appcontext.ZLogger(ctx)
		principal := appcontext.Principal(ctx)
		if !principal.AllowGRT() {
			logger.Info("not a member of the GRT")
			return false, nil
		}
		return true, nil
	}
}
