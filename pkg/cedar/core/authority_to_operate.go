package cedarcore

import (
	"context"
	"fmt"
	"time"

	"github.com/guregu/null/zero"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/local/cedarcoremock"
	"github.com/cms-enterprise/easi-app/pkg/models"

	apiauthority "github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/client/authority_to_operate"
)

// NOTE: This CEDAR endpoint in webMethods is called with a set of optional parameters (including a system ID) with the caveat that if
//   a system ID is provided then all other provided parameters are ignored. This poses an interesting scenario for EASi b/c we will
//   always provide a system ID with our queries which effectively turns the system ID into a required parameter and nullifies/invalidates
//   the other optional parameters. For this reason we are not going to include the optional parameters in the client methods for EASi.

// GetAuthorityToOperate makes a GET call to the /authority_to_operate endpoint
func (c *Client) GetAuthorityToOperate(ctx context.Context, cedarSystemID string) ([]*models.CedarAuthorityToOperate, error) {
	if c.mockEnabled {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		if cedarcoremock.IsMockSystem(cedarSystemID) {
			return cedarcoremock.GetATOs(), nil
		}
		return nil, cedarcoremock.NoSystemFoundError()
	}

	// Construct the parameters
	params := apiauthority.NewAuthorityToOperateFindListParams()
	params.SetSystemID(&cedarSystemID)
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
			UUID:    zero.StringFromPtr(ato.UUID),    // required
			CedarID: zero.StringFromPtr(ato.CedarID), // required

			ActualDispositionDate:                     zero.TimeFrom(time.Time(ato.ActualDispositionDate)),
			ContainsPersonallyIdentifiableInformation: ato.ContainsPersonallyIdentifiableInformation,
			CountOfTotalNonPrivilegedUserPopulation:   int(ato.CountOfTotalNonPrivilegedUserPopulation),
			CountOfOpenPoams:                          int(ato.CountOfOpenPoams),
			CountOfTotalPrivilegedUserPopulation:      int(ato.CountOfTotalPrivilegedUserPopulation),
			DateAuthorizationMemoExpires:              zero.TimeFrom(time.Time(ato.DateAuthorizationMemoExpires)),
			DateAuthorizationMemoSigned:               zero.TimeFrom(time.Time(ato.DateAuthorizationMemoSigned)),
			EAuthenticationLevel:                      zero.StringFrom(ato.EAuthenticationLevel),
			Fips199OverallImpactRating:                int(ato.Fips199OverallImpactRating),
			FismaSystemAcronym:                        zero.StringFrom(ato.FismaSystemAcronym),
			FismaSystemName:                           zero.StringFrom(ato.FismaSystemName),
			IsAccessedByNonOrganizationalUsers:        ato.IsAccessedByNonOrganizationalUsers,
			IsPiiLimitedToUserNameAndPass:             ato.IsPiiLimitedToUserNameAndPass,
			IsProtectedHealthInformation:              ato.IsProtectedHealthInformation,
			LastActScaDate:                            zero.TimeFrom(time.Time(ato.LastActScaDate)),
			LastAssessmentDate:                        zero.TimeFrom(time.Time(ato.LastAssessmentDate)),
			LastContingencyPlanCompletionDate:         zero.TimeFrom(time.Time(ato.LastContingencyPlanCompletionDate)),
			LastPenTestDate:                           zero.TimeFrom(time.Time(ato.LastPenTestDate)),
			OaStatus:                                  zero.StringFrom(ato.OaStatus),
			PiaCompletionDate:                         zero.TimeFrom(time.Time(ato.PiaCompletionDate)),
			PrimaryCyberRiskAdvisor:                   zero.StringFrom(ato.PrimaryCyberRiskAdvisor),
			PrivacySubjectMatterExpert:                zero.StringFrom(ato.PrivacySubjectMatterExpert),
			RecoveryPointObjective:                    float64(ato.RecoveryPointObjective),
			RecoveryTimeObjective:                     float64(ato.RecoveryTimeObjective),
			SystemOfRecordsNotice:                     models.ZeroStringsFrom(ato.SystemOfRecordsNotice),
			TLCPhase:                                  zero.StringFrom(ato.TlcPhase),
			XLCPhase:                                  zero.StringFrom(ato.XlcPhase),
		})
	}

	return retVal, nil
}
