package resolvers

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	cedarcore "github.com/cms-enterprise/easi-app/pkg/cedar/core"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
)

func userIsOnAnyCEDARSystemTeam(
	ctx context.Context,
	cedarCoreClient *cedarcore.Client,
) (bool, error) {
	systems, err := cedarCoreClient.GetSystemSummary(ctx, cedarcore.SystemSummaryOpts.WithEuaIDFilter(appcontext.Principal(ctx).ID()))
	if err != nil {
		return false, err
	}

	return len(systems) > 0, nil
}

func userIsOnCEDARSystemTeam(
	ctx context.Context,
	cedarCoreClient *cedarcore.Client,
	cedarSystemID uuid.UUID,
) (bool, error) {
	systems, err := cedarCoreClient.GetSystemSummary(ctx, cedarcore.SystemSummaryOpts.WithEuaIDFilter(appcontext.Principal(ctx).ID()))
	if err != nil {
		return false, err
	}

	for _, system := range systems {
		if system != nil && system.ID == cedarSystemID {
			return true, nil
		}
	}

	return false, nil
}

func authorizeUserCanAccessCEDARSystemWorkspace(
	ctx context.Context,
	cedarCoreClient *cedarcore.Client,
	cedarSystemID uuid.UUID,
) error {
	if dataloaders.HasLoaders(ctx) {
		capabilities, err := GetCedarSystemViewerCapabilities(ctx, cedarSystemID)
		if err != nil {
			return err
		}

		if capabilities.ViewerCanAccessWorkspace {
			return nil
		}
	} else {
		isOnTeam, err := userIsOnCEDARSystemTeam(ctx, cedarCoreClient, cedarSystemID)
		if err != nil {
			return err
		}

		if isOnTeam {
			return nil
		}
	}

	return &apperrors.UnauthorizedError{Err: errors.New("unauthorized to access cedar system workspace")}
}

func authorizeUserCanAccessCEDARTeamMetadata(
	ctx context.Context,
	cedarCoreClient *cedarcore.Client,
) error {
	isOnAnyTeam, err := userIsOnAnyCEDARSystemTeam(ctx, cedarCoreClient)
	if err != nil {
		return err
	}

	if isOnAnyTeam {
		return nil
	}

	return &apperrors.UnauthorizedError{Err: errors.New("unauthorized to access cedar team metadata")}
}

func authorizeUserCanAccessCEDARSystemDirectory(ctx context.Context) error {
	principal := appcontext.Principal(ctx)
	if principal.AllowEASi() || principal.AllowGRT() || principal.AllowTRBAdmin() {
		return nil
	}

	return &apperrors.UnauthorizedError{Err: errors.New("unauthorized to access cedar system directory")}
}

func authorizeUserCanAccessCEDARContactLookup(
	ctx context.Context,
	cedarCoreClient *cedarcore.Client,
) error {
	principal := appcontext.Principal(ctx)
	if principal.AllowEASi() || principal.AllowTRBAdmin() {
		return nil
	}

	return authorizeUserCanAccessCEDARTeamMetadata(ctx, cedarCoreClient)
}

func authorizeUserCanAccessCEDARReadQueries(ctx context.Context) error {
	if appcontext.Principal(ctx).AllowEASi() {
		return nil
	}

	return &apperrors.UnauthorizedError{Err: errors.New("unauthorized to access cedar read queries")}
}

func authorizeUserCanManageCEDARSystemTeam(
	ctx context.Context,
	cedarCoreClient *cedarcore.Client,
	cedarSystemID uuid.UUID,
) error {
	if err := authorizeUserCanAccessCEDARSystemWorkspace(ctx, cedarCoreClient, cedarSystemID); err != nil {
		var unauthorizedErr *apperrors.UnauthorizedError
		if !errors.As(err, &unauthorizedErr) {
			return err
		}

		return &apperrors.UnauthorizedError{Err: errors.New("unauthorized to manage cedar system team")}
	}

	return nil
}
