package cedarcore

import (
	"context"
	"fmt"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	apisystems "github.com/cmsgov/easi-app/pkg/cedar/core/gen/client/system"
	"github.com/cmsgov/easi-app/pkg/local"
	"github.com/cmsgov/easi-app/pkg/models"
)

// GetSystemDetail makes a GET call to the /system/detail/{id} endpoint
func (c *Client) GetSystemDetail(ctx context.Context, cedarSystemID string) (*models.CedarSystemDetails, error) {
	if c.mockEnabled {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		return &models.CedarSystemDetails{
			CedarSystem:                 local.GetMockSystem(cedarSystemID),
			BusinessOwnerInformation:    &models.BusinessOwnerInformation{},
			SystemMaintainerInformation: &models.SystemMaintainerInformation{},
		}, nil
	}

	cedarSystem, err := c.GetSystem(ctx, cedarSystemID)
	if err != nil {
		return nil, err
	}

	// Construct the parameters
	params := apisystems.NewSystemDetailFindByIDParams()
	params.SetID(cedarSystem.VersionID)
	params.HTTPClient = c.hc

	// Make the API call
	resp, err := c.sdk.System.SystemDetailFindByID(params, c.auth)
	if err != nil {
		return nil, err
	}

	sys := resp.Payload
	if sys == nil {
		return nil, fmt.Errorf("no body received")
	}

	retVal := &models.CedarSystemDetails{
		CedarSystem: cedarSystem,
	}

	if busOwnerInfo := sys.BusinessOwnerInformation; busOwnerInfo != nil {
		retVal.BusinessOwnerInformation = &models.BusinessOwnerInformation{
			BeneficiaryAddressPurpose:      busOwnerInfo.BeneficiaryAddressPurpose,
			BeneficiaryAddressPurposeOther: busOwnerInfo.BeneficiaryAddressPurposeOther,
			BeneficiaryAddressSource:       busOwnerInfo.BeneficiaryAddressSource,
			BeneficiaryAddressSourceOther:  busOwnerInfo.BeneficiaryAddressSourceOther,
			CostPerYear:                    busOwnerInfo.CostPerYear,
			IsCmsOwned:                     busOwnerInfo.IsCmsOwned,
			NumberOfContractorFte:          busOwnerInfo.NumberOfContractorFte,
			NumberOfFederalFte:             busOwnerInfo.NumberOfFederalFte,
			NumberOfSupportedUsersPerMonth: busOwnerInfo.NumberOfSupportedUsersPerMonth,
			StoresBankingData:              busOwnerInfo.StoresBankingData,
			StoresBeneficiaryAddress:       busOwnerInfo.StoresBeneficiaryAddress,
		}
	}

	if sysMaintInfo := sys.SystemMaintainerInformation; sysMaintInfo != nil {
		retVal.SystemMaintainerInformation = &models.SystemMaintainerInformation{
			AgileUsed:                  sysMaintInfo.AgileUsed,
			BusinessArtifactsOnDemand:  sysMaintInfo.BusinessArtifactsOnDemand,
			DeploymentFrequency:        sysMaintInfo.DeploymentFrequency,
			DevCompletionPercent:       sysMaintInfo.DevCompletionPercent,
			DevWorkDescription:         sysMaintInfo.DevWorkDescription,
			EcapParticipation:          sysMaintInfo.EcapParticipation,
			FrontendAccessType:         sysMaintInfo.FrontendAccessType,
			HardCodedIPAddress:         sysMaintInfo.HardCodedIPAddress,
			IP6EnabledAssetPercent:     sysMaintInfo.Ip6EnabledAssetPercent,
			IP6TransitionPlan:          sysMaintInfo.Ip6TransitionPlan,
			IPEnabledAssetCount:        sysMaintInfo.IPEnabledAssetCount,
			MajorRefreshDate:           sysMaintInfo.MajorRefreshDate.String(),
			NetAccessibility:           sysMaintInfo.NetAccessibility,
			OmDocumentationOnDemand:    sysMaintInfo.OmDocumentationOnDemand,
			PlansToRetireReplace:       sysMaintInfo.PlansToRetireReplace,
			QuarterToRetireReplace:     sysMaintInfo.QuarterToRetireReplace,
			RecordsManagementBucket:    sysMaintInfo.RecordsManagementBucket,
			SourceCodeOnDemand:         sysMaintInfo.SourceCodeOnDemand,
			SystemCustomization:        sysMaintInfo.SystemCustomization,
			SystemDesignOnDemand:       sysMaintInfo.SystemDesignOnDemand,
			SystemProductionDate:       sysMaintInfo.SystemProductionDate.String(),
			SystemRequirementsOnDemand: sysMaintInfo.SystemRequirementsOnDemand,
			TestPlanOnDemand:           sysMaintInfo.TestPlanOnDemand,
			TestReportsOnDemand:        sysMaintInfo.TestReportsOnDemand,
			TestScriptsOnDemand:        sysMaintInfo.TestScriptsOnDemand,
			YearToRetireReplace:        sysMaintInfo.YearToRetireReplace,
		}
	}
	return retVal, nil
}
