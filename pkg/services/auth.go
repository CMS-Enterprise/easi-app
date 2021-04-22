package services

import (
	"context"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
)

// HasRole authorizes a user as having a given role
func HasRole(ctx context.Context, role model.Role) (bool, error) {
	logger := appcontext.ZLogger(ctx)
	principal := appcontext.Principal(ctx)
	switch role {
	case model.RoleEasiUser:
		if !principal.AllowEASi() {
			logger.Info("does not have EASi job code")
			return false, nil
		}
		logger.Info("user authorized as EASi user", zap.Bool("Authorized", true))
		return true, nil
	case model.RoleEasiGovteam:
		if !principal.AllowGRT() {
			logger.Info("does not have Govteam job code")
			return false, nil
		}
		logger.Info("user authorized as Govteam member", zap.Bool("Authorized", true))
		return true, nil
	case model.RoleEasi508Tester:
		if !principal.Allow508Tester() {
			logger.Info("does not have 508 tester job code")
			return false, nil
		}
		logger.Info("user authorized as 508 Tester", zap.Bool("Authorized", true))
		return true, nil
	case model.RoleEasi508User:
		if !principal.Allow508User() {
			logger.Info("does not have 508 User job code")
			return false, nil
		}
		logger.Info("user authorized as 508 User", zap.Bool("Authorized", true))
		return true, nil
	default:
		logger.With(zap.String("Role", role.String())).Info("Unrecognized user role")
		return false, nil
	}
}

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

// AuthorizeHasEASiRole authorizes that the user can use EASi
func AuthorizeHasEASiRole(ctx context.Context) (bool, error) {
	return HasRole(ctx, model.RoleEasiUser)
}

// AuthorizeRequireGRTJobCode authorizes a user as being a member of the
// GRT (Governance Review Team)
func AuthorizeRequireGRTJobCode(ctx context.Context) (bool, error) {
	return HasRole(ctx, model.RoleEasiGovteam)
}

// AuthorizeUserIsIntakeRequesterOrHasGRTJobCode  authorizes a user as being a member of the
// GRT (Governance Review Team) or being the owner of the system intake
func AuthorizeUserIsIntakeRequesterOrHasGRTJobCode(ctx context.Context, existingIntake *models.SystemIntake) (bool, error) {
	authorIsAuthed, errAuthor := NewAuthorizeUserIsIntakeRequester()(ctx, existingIntake)
	if errAuthor != nil {
		return false, errAuthor
	}

	reviewerIsAuthed, errReviewer := AuthorizeRequireGRTJobCode(ctx)
	if errReviewer != nil {
		return false, errReviewer
	}

	if !authorIsAuthed && !reviewerIsAuthed {
		return false, errAuthor
	}

	return true, nil
}

// AuthorizeUserIsRequestOwnerOr508Team authorizes the user owns the system intake or is a member of the 508 team
func AuthorizeUserIsRequestOwnerOr508Team(ctx context.Context, intake *models.SystemIntake) (bool, error) {
	userIsIntakeRequester, err := NewAuthorizeUserIsIntakeRequester()(ctx, intake)
	if err != nil {
		return false, err
	}

	userIs508Tester, err := HasRole(ctx, model.RoleEasi508Tester)
	if err != nil {
		return false, err
	}

	userIs508User, err := HasRole(ctx, model.RoleEasi508User)
	if err != nil {
		return false, err
	}

	if !userIsIntakeRequester && !userIs508User && !userIs508Tester {
		return false, nil
	}

	return true, nil
}
