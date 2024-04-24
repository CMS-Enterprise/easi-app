package cedarcore

import (
	"context"
	"fmt"
	"time"
	"unicode"
	"unicode/utf8"

	"github.com/guregu/null/zero"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	apisystems "github.com/cmsgov/easi-app/pkg/cedar/core/gen/client/system"
	"github.com/cmsgov/easi-app/pkg/local/cedarcoremock"
	"github.com/cmsgov/easi-app/pkg/models"
)

// GetSystemDetail makes a GET call to the /system/detail/{id} endpoint
func (c *Client) GetSystemDetail(ctx context.Context, cedarSystemID string) (*models.CedarSystemDetails, error) {
	if c.mockEnabled {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		mocksys := cedarcoremock.GetSystem(cedarSystemID)
		if mocksys == nil {
			return nil, cedarcoremock.NoSystemFoundError()
		}
		return &models.CedarSystemDetails{
			CedarSystem:                 mocksys,
			BusinessOwnerInformation:    cedarcoremock.GetBusinessOwnerInformation(cedarSystemID),
			SystemMaintainerInformation: cedarcoremock.GetSystemMaintainerInformation(cedarSystemID),
		}, nil
	}

	cedarSystem, err := c.GetSystem(ctx, cedarSystemID)
	if err != nil {
		return nil, err
	}

	// Construct the parameters
	params := apisystems.NewSystemDetailFindByIDParams()
	params.SetID(cedarSystem.VersionID.String)
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
			BeneficiaryAddressPurpose:      models.ZeroStringsFrom(busOwnerInfo.BeneficiaryAddressPurpose),
			BeneficiaryAddressPurposeOther: zero.StringFrom(busOwnerInfo.BeneficiaryAddressPurposeOther),
			BeneficiaryAddressSource:       models.ZeroStringsFrom(busOwnerInfo.BeneficiaryAddressSource),
			BeneficiaryAddressSourceOther:  zero.StringFrom(busOwnerInfo.BeneficiaryAddressSourceOther),
			CostPerYear:                    zero.StringFrom(busOwnerInfo.CostPerYear),
			IsCmsOwned:                     busOwnerInfo.IsCmsOwned,
			NumberOfContractorFte:          zero.StringFrom(busOwnerInfo.NumberOfContractorFte),
			NumberOfFederalFte:             zero.StringFrom(busOwnerInfo.NumberOfFederalFte),
			NumberOfSupportedUsersPerMonth: zero.StringFrom(busOwnerInfo.NumberOfSupportedUsersPerMonth),
			StoresBankingData:              busOwnerInfo.StoresBankingData,
			StoresBeneficiaryAddress:       busOwnerInfo.StoresBeneficiaryAddress,
		}
	}

	if sysMaintInfo := sys.SystemMaintainerInformation; sysMaintInfo != nil {
		retVal.SystemMaintainerInformation = &models.SystemMaintainerInformation{
			AgileUsed:                  sysMaintInfo.AgileUsed,
			BusinessArtifactsOnDemand:  sysMaintInfo.BusinessArtifactsOnDemand,
			DeploymentFrequency:        zero.StringFrom(sysMaintInfo.DeploymentFrequency),
			DevCompletionPercent:       zero.StringFrom(sysMaintInfo.DevCompletionPercent),
			DevWorkDescription:         zero.StringFrom(sysMaintInfo.DevWorkDescription),
			EcapParticipation:          sysMaintInfo.EcapParticipation,
			FrontendAccessType:         zero.StringFrom(sysMaintInfo.FrontendAccessType),
			HardCodedIPAddress:         sysMaintInfo.HardCodedIPAddress,
			IP6EnabledAssetPercent:     zero.StringFrom(sysMaintInfo.Ip6EnabledAssetPercent),
			IP6TransitionPlan:          zero.StringFrom(sysMaintInfo.Ip6TransitionPlan),
			IPEnabledAssetCount:        int(sysMaintInfo.IPEnabledAssetCount),
			MajorRefreshDate:           zero.TimeFrom(time.Time(sysMaintInfo.MajorRefreshDate)),
			NetAccessibility:           zero.StringFrom(sysMaintInfo.NetAccessibility),
			OmDocumentationOnDemand:    sysMaintInfo.OmDocumentationOnDemand,
			PlansToRetireReplace:       zero.StringFrom(sysMaintInfo.PlansToRetireReplace),
			QuarterToRetireReplace:     zero.StringFrom(parseQuarterToRetireReplace(sysMaintInfo.QuarterToRetireReplace)),
			RecordsManagementBucket:    models.ZeroStringsFrom(sysMaintInfo.RecordsManagementBucket),
			SourceCodeOnDemand:         sysMaintInfo.SourceCodeOnDemand,
			SystemCustomization:        zero.StringFrom(sysMaintInfo.SystemCustomization),
			SystemDesignOnDemand:       sysMaintInfo.SystemDesignOnDemand,
			SystemProductionDate:       zero.TimeFrom(time.Time(sysMaintInfo.SystemProductionDate)),
			SystemRequirementsOnDemand: sysMaintInfo.SystemRequirementsOnDemand,
			TestPlanOnDemand:           sysMaintInfo.TestPlanOnDemand,
			TestReportsOnDemand:        sysMaintInfo.TestReportsOnDemand,
			TestScriptsOnDemand:        sysMaintInfo.TestScriptsOnDemand,
			YearToRetireReplace:        zero.StringFrom(sysMaintInfo.YearToRetireReplace),
		}
	}
	return retVal, nil
}

// Parses the `QuarterToRetireReplace` field from the CEDAR API, which comes back as a string
// that looks like:
// 3 (Hint : July 1 - September 30)
// or
// 4 (Hint : October 1 - December 31)
//
// This function just strips out the first character (the quarter #), and defaults to "" if it can't,
// or the string doesn't start with a number.
func parseQuarterToRetireReplace(s string) string {
	if len(s) == 0 {
		return ""
	}
	r, _ := utf8.DecodeRuneInString(s)
	if !unicode.IsDigit(r) {
		return ""
	}
	return string(r)
}
