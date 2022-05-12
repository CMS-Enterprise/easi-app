package cedarcore

import (
	"context"
	"fmt"
	"time"

	"github.com/guregu/null/zero"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"

	apiauthority "github.com/cmsgov/easi-app/pkg/cedar/core/gen/client/authority_to_operate"
)

// NOTE: This CEDAR endpoint in webMethods is called with a set of optional parameters (including a system ID) with the caveat that if
//   a system ID is provided then all other provided parameters are ignored. This poses an interesting scenario for EASi b/c we will
//   always be provide a system ID with our queries which effectively turns the system ID into a required parameter and nullifies/invalidates
//   the other optional parameters. For this reason we are not going to include the optional parameters in the client methods for EASi.

// GetAuthorityToOperate makes a GET call to the /authority_to_operate endpoint
func (c *Client) GetAuthorityToOperate(ctx context.Context, cedarSystemID string) ([]*models.CedarAuthorityToOperate, error) {
	if !c.cedarCoreEnabled(ctx) {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		return []*models.CedarAuthorityToOperate{}, nil
	}

	cedarSystem, err := c.GetSystem(ctx, cedarSystemID)
	if err != nil {
		return nil, err
	}

	// Construct the parameters
	params := apiauthority.NewAuthorityToOperateFindListParams()
	params.SetSystemID(&cedarSystem.VersionID)
	params.HTTPClient = c.hc

	// Make the API call
	resp, err := c.sdk.AuthorityToOperate.AuthorityToOperateFindList(params, c.auth)
	if err != nil {
		return []*models.CedarAuthorityToOperate{}, err
	}

	if resp.Payload == nil {
		return []*models.CedarAuthorityToOperate{}, fmt.Errorf("no body received")
	}

	// Convert the auto-generated struct to our own pkg/models struct
	retVal := []*models.CedarAuthorityToOperate{}

	// Populate the ATO fields by converting each item in resp.Payload.AuthorityToOperate
	for _, ato := range resp.Payload.AuthorityToOperateList {
		retVal = append(retVal, &models.CedarAuthorityToOperate{
			ActualDispositionDate: zero.TimeFrom(time.Time(ato.ActualDispositionDate)),
			CedarID:               *ato.CedarID,
			ContainsPersonallyIdentifiableInformation: ato.ContainsPersonallyIdentifiableInformation,
			CountOfTotalNonPrivilegedUserPopulation:   ato.CountOfTotalNonPrivilegedUserPopulation,
			CountOfOpenPoams:                          ato.CountOfOpenPoams,
			CountOfTotalPrivilegedUserPopulation:      ato.CountOfTotalPrivilegedUserPopulation,
			DateAuthorizationMemoExpires:              zero.TimeFrom(time.Time(ato.DateAuthorizationMemoExpires)),
			DateAuthorizationMemoSigned:               zero.TimeFrom(time.Time(ato.DateAuthorizationMemoSigned)),
			EAuthenticationLevel:                      ato.EAuthenticationLevel,
			Fips199OverallImpactRating:                ato.Fips199OverallImpactRating,
			FismaSystemAcronym:                        ato.FismaSystemAcronym,
			FismaSystemName:                           ato.FismaSystemName,
			IsAccessedByNonOrganizationalUsers:        ato.IsAccessedByNonOrganizationalUsers,
			IsPiiLimitedToUserNameAndPass:             ato.IsPiiLimitedToUserNameAndPass,
			IsProtectedHealthInformation:              ato.IsProtectedHealthInformation,
			LastActScaDate:                            zero.TimeFrom(time.Time(ato.LastActScaDate)),
			LastAssessmentDate:                        zero.TimeFrom(time.Time(ato.LastAssessmentDate)),
			LastContingencyPlanCompletionDate:         zero.TimeFrom(time.Time(ato.LastContingencyPlanCompletionDate)),
			LastPenTestDate:                           zero.TimeFrom(time.Time(ato.LastPenTestDate)),
			PiaCompletionDate:                         zero.TimeFrom(time.Time(ato.PiaCompletionDate)),
			PrimaryCyberRiskAdvisor:                   ato.PrimaryCyberRiskAdvisor,
			PrivacySubjectMatterExpert:                ato.PrivacySubjectMatterExpert,
			RecoveryPointObjective:                    ato.RecoveryPointObjective,
			RecoveryTimeObjective:                     ato.RecoveryTimeObjective,
			SystemOfRecordsNotice:                     ato.SystemOfRecordsNotice,
			TLCPhase:                                  ato.TlcPhase,
			XLCPhase:                                  ato.XlcPhase,
			UUID:                                      *ato.UUID,
		})
	}

	return retVal, nil
}
