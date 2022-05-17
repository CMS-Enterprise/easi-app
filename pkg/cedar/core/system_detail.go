package cedarcore

import (
	"context"
	"fmt"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	apisystems "github.com/cmsgov/easi-app/pkg/cedar/core/gen/client/system"
	"github.com/cmsgov/easi-app/pkg/models"
)

// GetSystemDetail makes a GET call to the /system/detail/{id} endpoint
func (c *Client) GetSystemDetail(ctx context.Context, cedarSystemID string) (*models.CedarSystemDetail, error) {
	if !c.cedarCoreEnabled(ctx) {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		return nil, nil
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

	retVal := &models.CedarSystemDetail{
		CedarSystem: *cedarSystem,
	}

	if busOwnerInfo := sys.BusinessOwnerInformation; busOwnerInfo != nil {
		retVal.BusinessOwnerInformation = &models.BusinessOwnerInformation{
			BeneficiaryAddressPurpose:      busOwnerInfo.BeneficiaryAddressPurpose,      // []string `json:"beneficiaryAddressPurpose"`
			BeneficiaryAddressPurposeOther: busOwnerInfo.BeneficiaryAddressPurposeOther, // string   `json:"beneficiaryAddressPurposeOther,omitempty"`
			BeneficiaryAddressSource:       busOwnerInfo.BeneficiaryAddressSource,       // []string `json:"beneficiaryAddressSource"`
			BeneficiaryAddressSourceOther:  busOwnerInfo.BeneficiaryAddressSourceOther,  // string   `json:"beneficiaryAddressSourceOther,omitempty"`
			CostPerYear:                    busOwnerInfo.CostPerYear,                    // string   `json:"costPerYear,omitempty"`
			IsCmsOwned:                     busOwnerInfo.IsCmsOwned,                     // bool     `json:"isCmsOwned,omitempty"`
			NumberOfContractorFte:          busOwnerInfo.NumberOfContractorFte,          // string   `json:"numberOfContractorFte,omitempty"`
			NumberOfFederalFte:             busOwnerInfo.NumberOfFederalFte,             // string   `json:"numberOfFederalFte,omitempty"`
			NumberOfSupportedUsersPerMonth: busOwnerInfo.NumberOfSupportedUsersPerMonth, // string   `json:"numberOfSupportedUsersPerMonth,omitempty"`
			StoresBankingData:              busOwnerInfo.StoresBankingData,              // bool     `json:"storesBankingData,omitempty"`
			StoresBeneficiaryAddress:       busOwnerInfo.StoresBeneficiaryAddress,       // bool     `json:"storesBeneficiaryAddress,omitempty"`
		}
	}

	if sysMaintInfo := sys.SystemMaintainerInformation; sysMaintInfo != nil {
		retVal.SystemMaintainerInformation = &models.SystemMaintainerInformation{
			AgileUsed:                  sysMaintInfo.AgileUsed,                     // bool     `json:"agileUsed,omitempty"`
			BusinessArtifactsOnDemand:  sysMaintInfo.BusinessArtifactsOnDemand,     // bool     `json:"businessArtifactsOnDemand,omitempty"`
			DeploymentFrequency:        sysMaintInfo.DeploymentFrequency,           // string   `json:"deploymentFrequency,omitempty"`
			DevCompletionPercent:       sysMaintInfo.DevCompletionPercent,          // string   `json:"devCompletionPercent,omitempty"`
			DevWorkDescription:         sysMaintInfo.DevWorkDescription,            // string   `json:"devWorkDescription,omitempty"`
			EcapParticipation:          sysMaintInfo.EcapParticipation,             // bool     `json:"ecapParticipation,omitempty"`
			FrontendAccessType:         sysMaintInfo.FrontendAccessType,            // string   `json:"frontendAccessType,omitempty"`
			HardCodedIPAddress:         sysMaintInfo.HardCodedIPAddress,            // bool     `json:"hardCodedIpAddress,omitempty"`
			IP6EnabledAssetPercent:     sysMaintInfo.Ip6EnabledAssetPercent,        // string   `json:"ip6EnabledAssetPercent,omitempty"`
			IP6TransitionPlan:          sysMaintInfo.Ip6TransitionPlan,             // string   `json:"ip6TransitionPlan,omitempty"`
			IPEnabledAssetCount:        sysMaintInfo.IPEnabledAssetCount,           // int32    `json:"ipEnabledAssetCount,omitempty"`
			MajorRefreshDate:           sysMaintInfo.MajorRefreshDate.String(),     // string   `json:"majorRefreshDate,omitempty"`
			NetAccessibility:           sysMaintInfo.NetAccessibility,              // string   `json:"netAccessibility,omitempty"`
			OmDocumentationOnDemand:    sysMaintInfo.OmDocumentationOnDemand,       // bool     `json:"omDocumentationOnDemand,omitempty"`
			PlansToRetireReplace:       sysMaintInfo.PlansToRetireReplace,          // string   `json:"plansToRetireReplace,omitempty"`
			QuarterToRetireReplace:     sysMaintInfo.QuarterToRetireReplace,        // string   `json:"quarterToRetireReplace,omitempty"`
			RecordsManagementBucket:    sysMaintInfo.RecordsManagementBucket,       // []string `json:"recordsManagementBucket"`
			SourceCodeOnDemand:         sysMaintInfo.SourceCodeOnDemand,            // bool     `json:"sourceCodeOnDemand,omitempty"`
			SystemCustomization:        sysMaintInfo.SystemCustomization,           // string   `json:"systemCustomization,omitempty"`
			SystemDesignOnDemand:       sysMaintInfo.SystemDesignOnDemand,          // bool     `json:"systemDesignOnDemand,omitempty"`
			SystemProductionDate:       sysMaintInfo.SystemProductionDate.String(), // string   `json:"systemProductionDate,omitempty"`
			SystemRequirementsOnDemand: sysMaintInfo.SystemRequirementsOnDemand,    // bool     `json:"systemRequirementsOnDemand,omitempty"`
			TestPlanOnDemand:           sysMaintInfo.TestPlanOnDemand,              // bool     `json:"testPlanOnDemand,omitempty"`
			TestReportsOnDemand:        sysMaintInfo.TestReportsOnDemand,           // bool     `json:"testReportsOnDemand,omitempty"`
			TestScriptsOnDemand:        sysMaintInfo.TestScriptsOnDemand,           // bool     `json:"testScriptsOnDemand,omitempty"`
			YearToRetireReplace:        sysMaintInfo.YearToRetireReplace,           // string   `json:"yearToRetireReplace,omitempty"`
		}
	}
	return retVal, nil
}
