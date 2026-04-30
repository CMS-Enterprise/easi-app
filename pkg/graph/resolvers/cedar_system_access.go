package resolvers

import (
	"context"
	"slices"
	"sync"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	cedarcore "github.com/cms-enterprise/easi-app/pkg/cedar/core"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func GetCedarSystemViewerCapabilities(ctx context.Context, cedarSystemID uuid.UUID) (*models.CedarSystemViewerCapabilities, error) {
	return dataloaders.GetCedarSystemViewerCapabilities(ctx, cedarSystemID)
}

func GetCedarSystem(
	ctx context.Context,
	cedarCoreClient *cedarcore.Client,
	cedarSystemID uuid.UUID,
) (*models.CedarSystem, error) {
	if err := authorizeUserCanAccessCEDARReadQueries(ctx); err != nil {
		return nil, err
	}

	return cedarCoreClient.GetSystem(ctx, cedarSystemID)
}

func GetCedarSystems(
	ctx context.Context,
	cedarCoreClient *cedarcore.Client,
) ([]*models.CedarSystem, error) {
	if err := authorizeUserCanAccessCEDARSystemDirectory(ctx); err != nil {
		return nil, err
	}

	return cedarCoreClient.GetSystemSummary(ctx)
}

func GetCedarSystemWorkspace(
	ctx context.Context,
	cedarCoreClient *cedarcore.Client,
	cedarSystemID uuid.UUID,
) (*models.CedarSystemWorkspace, error) {
	if err := authorizeUserCanAccessCEDARSystemWorkspace(ctx, cedarCoreClient, cedarSystemID); err != nil {
		return nil, err
	}

	cedarSystem, err := cedarCoreClient.GetSystem(ctx, cedarSystemID)
	if err != nil {
		return nil, err
	}

	cedarRoles, err := cedarCoreClient.GetRolesBySystem(ctx, cedarSystemID, nil)
	if err != nil {
		return nil, err
	}

	userEua := appcontext.Principal(ctx).ID()
	isMySystem := slices.ContainsFunc(cedarRoles, func(role *models.CedarRole) bool {
		return role.AssigneeUsername.String == userEua
	})

	return &models.CedarSystemWorkspace{
		ID: cedarSystem.ID,
		CedarSystem: &models.CedarSystemWorkspaceSystem{
			ID:   cedarSystem.ID,
			Name: cedarSystem.Name.String,
		},
		Roles:      cedarRoles,
		IsMySystem: isMySystem,
	}, nil
}

func GetCedarSystemDetails(
	ctx context.Context,
	cedarCoreClient *cedarcore.Client,
	cedarSystemID uuid.UUID,
) (*models.CedarSystemDetails, error) {
	if err := authorizeUserCanAccessCEDARReadQueries(ctx); err != nil {
		return nil, err
	}

	logger := appcontext.ZLogger(ctx)

	sysDetail, err := cedarCoreClient.GetSystemDetail(ctx, cedarSystemID)
	if err != nil {
		return nil, err
	}

	var cedarRoles []*models.CedarRole
	var cedarDeployments []*models.CedarDeployment
	var cedarThreats []*models.CedarThreat
	var cedarURLs []*models.CedarURL

	var wg sync.WaitGroup
	wg.Add(4)

	go func() {
		defer wg.Done()
		var fetchErr error
		cedarRoles, fetchErr = cedarCoreClient.GetRolesBySystem(ctx, cedarSystemID, nil)
		if fetchErr != nil {
			logger.Error("problem fetching roles for system", zap.Error(fetchErr), zap.String("system.id", cedarSystemID.String()))
			cedarRoles = nil
		}
	}()

	go func() {
		defer wg.Done()
		var fetchErr error
		cedarDeployments, fetchErr = cedarCoreClient.GetDeployments(ctx, cedarSystemID, nil)
		if fetchErr != nil {
			logger.Error("problem fetching deployments for system", zap.Error(fetchErr), zap.String("system.id", cedarSystemID.String()))
			cedarDeployments = nil
		}
	}()

	go func() {
		defer wg.Done()
		var fetchErr error
		cedarThreats, fetchErr = cedarCoreClient.GetThreat(ctx, cedarSystemID)
		if fetchErr != nil {
			logger.Error("problem fetching threats for system", zap.Error(fetchErr), zap.String("system.id", cedarSystemID.String()))
			cedarThreats = nil
		}
	}()

	go func() {
		defer wg.Done()
		var fetchErr error
		cedarURLs, fetchErr = cedarCoreClient.GetURLsForSystem(ctx, cedarSystemID)
		if fetchErr != nil {
			logger.Error("problem fetching urls for system", zap.Error(fetchErr), zap.String("system.id", cedarSystemID.String()))
			cedarURLs = nil
		}
	}()

	wg.Wait()

	userEua := appcontext.Principal(ctx).ID()
	isMySystem := false
	if cedarRoles != nil {
		isMySystem = slices.ContainsFunc(cedarRoles, func(role *models.CedarRole) bool {
			return role.AssigneeUsername.String == userEua
		})
	}

	dCedarSys := models.CedarSystemDetails{
		CedarSystem:                 sysDetail.CedarSystem,
		BusinessOwnerInformation:    sysDetail.BusinessOwnerInformation,
		SystemMaintainerInformation: sysDetail.SystemMaintainerInformation,
		Roles:                       cedarRoles,
		Deployments:                 cedarDeployments,
		Threats:                     cedarThreats,
		URLs:                        cedarURLs,
		IsMySystem:                  isMySystem,
	}

	return &dCedarSys, nil
}

func GetCedarAuthorityToOperate(
	ctx context.Context,
	cedarCoreClient *cedarcore.Client,
	cedarSystemID uuid.UUID,
) ([]*models.CedarAuthorityToOperate, error) {
	if err := authorizeUserCanAccessCEDARReadQueries(ctx); err != nil {
		return nil, err
	}

	return cedarCoreClient.GetAuthorityToOperate(ctx, cedarSystemID)
}

func GetCedarBudget(
	ctx context.Context,
	cedarCoreClient *cedarcore.Client,
	cedarSystemID uuid.UUID,
) ([]*models.CedarBudget, error) {
	if err := authorizeUserCanAccessCEDARReadQueries(ctx); err != nil {
		return nil, err
	}

	return cedarCoreClient.GetBudgetBySystem(ctx, cedarSystemID)
}

func GetCedarBudgetSystemCost(
	ctx context.Context,
	cedarCoreClient *cedarcore.Client,
	cedarSystemID uuid.UUID,
) (*models.CedarBudgetSystemCost, error) {
	if err := authorizeUserCanAccessCEDARReadQueries(ctx); err != nil {
		return nil, err
	}

	return cedarCoreClient.GetBudgetSystemCostBySystem(ctx, cedarSystemID)
}

func GetCedarPersonsByCommonName(
	ctx context.Context,
	searchCommonNameContains func(context.Context, string) ([]*models.UserInfo, error),
	commonName string,
) ([]*models.UserInfo, error) {
	if err := authorizeUserCanAccessCEDARReadQueries(ctx); err != nil {
		return nil, err
	}

	return searchCommonNameContains(ctx, commonName)
}

func GetCedarSoftwareProducts(
	ctx context.Context,
	cedarCoreClient *cedarcore.Client,
	cedarSystemID uuid.UUID,
) (*models.CedarSoftwareProducts, error) {
	if err := authorizeUserCanAccessCEDARReadQueries(ctx); err != nil {
		return nil, err
	}

	return cedarCoreClient.GetSoftwareProductsBySystem(ctx, cedarSystemID)
}

func GetCedarSubSystems(
	ctx context.Context,
	cedarCoreClient *cedarcore.Client,
	cedarSystemID uuid.UUID,
) ([]*models.CedarSubSystem, error) {
	if err := authorizeUserCanAccessCEDARReadQueries(ctx); err != nil {
		return nil, err
	}

	systems, err := cedarCoreClient.GetSystemSummary(ctx, cedarcore.SystemSummaryOpts.WithSubSystems(cedarSystemID))
	if err != nil {
		return nil, err
	}

	var subSystems []*models.CedarSubSystem
	for _, system := range systems {
		subSystems = append(subSystems, &models.CedarSubSystem{
			ID:          system.ID,
			Name:        system.Name,
			Acronym:     system.Acronym,
			Description: system.Description,
		})
	}

	return subSystems, nil
}

func GetCedarContractsBySystem(
	ctx context.Context,
	cedarCoreClient *cedarcore.Client,
	cedarSystemID uuid.UUID,
) ([]*models.CedarContract, error) {
	if err := authorizeUserCanAccessCEDARReadQueries(ctx); err != nil {
		return nil, err
	}

	return cedarCoreClient.GetContractBySystem(ctx, cedarSystemID)
}

func GetCedarThreat(
	ctx context.Context,
	cedarCoreClient *cedarcore.Client,
	cedarSystemID uuid.UUID,
) ([]*models.CedarThreat, error) {
	if err := authorizeUserCanAccessCEDARReadQueries(ctx); err != nil {
		return nil, err
	}

	return cedarCoreClient.GetThreat(ctx, cedarSystemID)
}

func GetDeployments(
	ctx context.Context,
	cedarCoreClient *cedarcore.Client,
	cedarSystemID uuid.UUID,
	deploymentType *string,
	state *string,
	status *string,
) ([]*models.CedarDeployment, error) {
	if err := authorizeUserCanAccessCEDARReadQueries(ctx); err != nil {
		return nil, err
	}

	var optionalParams *cedarcore.GetDeploymentsOptionalParams
	if deploymentType != nil || state != nil || status != nil {
		optionalParams = &cedarcore.GetDeploymentsOptionalParams{}

		if deploymentType != nil {
			optionalParams.DeploymentType = deploymentType
		}

		if state != nil {
			optionalParams.State = state
		}

		if status != nil {
			optionalParams.Status = status
		}
	}

	return cedarCoreClient.GetDeployments(ctx, cedarSystemID, optionalParams)
}

func GetRoleTypes(
	ctx context.Context,
	cedarCoreClient *cedarcore.Client,
) ([]*models.CedarRoleType, error) {
	if err := authorizeUserCanAccessCEDARTeamMetadata(ctx, cedarCoreClient); err != nil {
		return nil, err
	}

	return cedarCoreClient.GetRoleTypes(ctx)
}

func GetRoles(
	ctx context.Context,
	cedarCoreClient *cedarcore.Client,
	cedarSystemID uuid.UUID,
	roleTypeID *string,
) ([]*models.CedarRole, error) {
	if err := authorizeUserCanAccessCEDARSystemWorkspace(ctx, cedarCoreClient, cedarSystemID); err != nil {
		return nil, err
	}

	return cedarCoreClient.GetRolesBySystem(ctx, cedarSystemID, roleTypeID)
}

func GetExchanges(
	ctx context.Context,
	cedarCoreClient *cedarcore.Client,
	cedarSystemID uuid.UUID,
) ([]*models.CedarExchange, error) {
	if err := authorizeUserCanAccessCEDARReadQueries(ctx); err != nil {
		return nil, err
	}

	return cedarCoreClient.GetExchangesBySystem(ctx, cedarSystemID)
}

func GetURLs(
	ctx context.Context,
	cedarCoreClient *cedarcore.Client,
	cedarSystemID uuid.UUID,
) ([]*models.CedarURL, error) {
	if err := authorizeUserCanAccessCEDARReadQueries(ctx); err != nil {
		return nil, err
	}

	return cedarCoreClient.GetURLsForSystem(ctx, cedarSystemID)
}
