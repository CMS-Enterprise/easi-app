package services

import (
	"context"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

// HasRole authorizes a user as having a given role
func HasRole(ctx context.Context, role models.Role) (bool, error) {
	logger := appcontext.ZLogger(ctx)
	principal := appcontext.Principal(ctx)
	switch role {
	case models.RoleEasiUser:
		if !principal.AllowEASi() {
			logger.Info("does not have EASi job code")
			return false, nil
		}
		logger.Info("user authorized as EASi user", zap.Bool("Authorized", true))
		return true, nil
	case models.RoleEasiGovteam:
		if !principal.AllowGRT() {
			logger.Info("does not have Govteam job code")
			return false, nil
		}
		logger.Info("user authorized as Govteam member", zap.Bool("Authorized", true))
		return true, nil
	case models.RoleEasiTrbAdmin:
		if !principal.AllowTRBAdmin() {
			logger.Info("does not have TRB Admin job code")
			return false, nil
		}
		logger.Info("user authorized as TRB admin", zap.Bool("Authorized", true))
		return true, nil
	default:
		logger.With(zap.String("Role", role.String())).Info("Unrecognized user role")
		return false, nil
	}
}

// AuthorizeUserIsIntakeRequester authorizes a user as being the requester of the given System Intake
func AuthorizeUserIsIntakeRequester(
	ctx context.Context,
	intake *models.SystemIntake,
) (bool, error) {
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

// AuthorizeUserIsBusinessCaseRequester authorizes a user as being the requester of the given Business Case
func AuthorizeUserIsBusinessCaseRequester(
	ctx context.Context,
	bizCase *models.BusinessCase,
) (bool, error) {
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

// AuthorizeHasEASiRole authorizes that the user can use EASi
func AuthorizeHasEASiRole(ctx context.Context) (bool, error) {
	return HasRole(ctx, models.RoleEasiUser)
}

// AuthorizeRequireGRTJobCode authorizes a user as being a member of the
// GRT (Governance Review Team)
func AuthorizeRequireGRTJobCode(ctx context.Context) (bool, error) {
	return HasRole(ctx, models.RoleEasiGovteam)
}

// AuthorizeUserIsIntakeRequesterOrHasGRTJobCode  authorizes a user as being a member of the
// GRT (Governance Review Team) or being the owner of the system intake
func AuthorizeUserIsIntakeRequesterOrHasGRTJobCode(ctx context.Context, existingIntake *models.SystemIntake) (bool, error) {
	authorIsAuthed, errAuthor := AuthorizeUserIsIntakeRequester(ctx, existingIntake)
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
