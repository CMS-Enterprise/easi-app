package services

import (
	"context"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
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
			logger.Info("does not have EASi job code")
			return false, nil
		}

		// If intake is owned by user, authorize
		if principal.ID() == intake.EUAUserID.ValueOrZero() {
			return true, nil
		}
		// Default to failure to authorize and create a quick audit log
		logger.With(zap.Bool("Authorized", false)).
			Info("user unauthorized as owning the system intake")
		return false, nil
	}
}

// NewAuthorizeUserIsBusinessCaseRequester returns a function
// that authorizes a user as being the requester of the given Business Case
func NewAuthorizeUserIsBusinessCaseRequester() func(
	context.Context,
	*models.BusinessCase,
) (bool, error) {
	return func(ctx context.Context, bizCase *models.BusinessCase) (bool, error) {
		logger := appcontext.ZLogger(ctx)
		principal := appcontext.Principal(ctx)
		if !principal.AllowEASi() {
			logger.Info("does not have EASi job code")
			return false, nil
		}

		// If business case is owned by user, authorize
		if principal.ID() == bizCase.EUAUserID {
			return true, nil
		}
		// Default to failure to authorize and create a quick audit log
		logger.With(zap.Bool("Authorized", false)).
			Info("user unauthorized as owning the business case")
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
			logger.Error("does not have EASi job code")
			return false, nil
		}
		logger.With(zap.Bool("Authorized", true)).
			Info("user authorized as EASi user")
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
