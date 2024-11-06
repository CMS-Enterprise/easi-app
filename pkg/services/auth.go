package services

import (
	"context"

	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// HasRole authorizes a user as having a given role
func HasRole(ctx context.Context, role models.Role) bool {
	logger := appcontext.ZLogger(ctx)
	principal := appcontext.Principal(ctx)
	switch role {
	case models.RoleEasiUser:
		if !principal.AllowEASi() {
			logger.Info("does not have EASi job code")
			return false
		}
		logger.Info("user authorized as EASi user", zap.Bool("Authorized", true))
		return true
	case models.RoleEasiGovteam:
		if !principal.AllowGRT() {
			logger.Info("does not have Govteam job code")
			return false
		}
		logger.Info("user authorized as Govteam member", zap.Bool("Authorized", true))
		return true
	case models.RoleEasiTrbAdmin:
		if !principal.AllowTRBAdmin() {
			logger.Info("does not have TRB Admin job code")
			return false
		}
		logger.Info("user authorized as TRB admin", zap.Bool("Authorized", true))
		return true
	default:
		logger.With(zap.String("Role", role.String())).Info("Unrecognized user role")
		return false
	}
}

// AuthorizeUserIsIntakeRequester authorizes a user as being the requester of the given System Intake
func AuthorizeUserIsIntakeRequester(ctx context.Context, intake *models.SystemIntake) bool {
	logger := appcontext.ZLogger(ctx)
	principal := appcontext.Principal(ctx)
	if !principal.AllowEASi() {
		logger.Info("does not have EASi job code")
		return false
	}

	// If intake is owned by user, authorize
	if principal.ID() == intake.EUAUserID.ValueOrZero() {
		return true
	}
	// Default to failure to authorize and create a quick audit log
	logger.With(zap.Bool("Authorized", false)).
		Info("user unauthorized as owning the system intake")
	return false
}

// AuthorizeUserIsBusinessCaseRequester authorizes a user as being the requester of the given Business Case
func AuthorizeUserIsBusinessCaseRequester(ctx context.Context, bizCase *models.BusinessCase) bool {
	logger := appcontext.ZLogger(ctx)
	principal := appcontext.Principal(ctx)
	if !principal.AllowEASi() {
		logger.Info("does not have EASi job code")
		return false
	}

	// If business case is owned by user, authorize
	if principal.ID() == bizCase.EUAUserID {
		return true
	}
	// Default to failure to authorize and create a quick audit log
	logger.With(zap.Bool("Authorized", false)).
		Info("user unauthorized as owning the business case")
	return false
}

// AuthorizeHasEASiRole authorizes that the user can use EASi
func AuthorizeHasEASiRole(ctx context.Context) bool {
	return HasRole(ctx, models.RoleEasiUser)
}

// AuthorizeRequireGRTJobCode authorizes a user as being a member of the
// GRT (Governance Review Team)
func AuthorizeRequireGRTJobCode(ctx context.Context) bool {
	return HasRole(ctx, models.RoleEasiGovteam)
}
