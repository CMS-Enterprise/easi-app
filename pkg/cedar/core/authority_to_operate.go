package cedarcore

import (
	"context"
	"fmt"
	"time"

	"github.com/go-openapi/strfmt"
	"github.com/guregu/null"
	"github.com/guregu/null/zero"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"

	apiauthority "github.com/cmsgov/easi-app/pkg/cedar/core/gen/client/authority_to_operate"
)

// GetAuthorityToOperateOptionalParams represents the optional parameters that can be used to filter ATO information when searching through the CEDAR API
type GetAuthorityToOperateOptionalParams struct {
	CedarSystemID                             null.String
	ContainsPersonallyIdentifiableInformation null.Bool
	DispositionDateAfter                      *time.Time
	DispositionDateBefore                     *time.Time
	FismaSystemAcronym                        null.String
	IsProtectedHealthInformation              null.Bool
	SystemID                                  null.String
	TlcPhase                                  null.String
	UUID                                      null.String
}

// GetAuthorityToOperate makes a GET call to the /authority_to_operate endpoint
func (c *Client) GetAuthorityToOperate(ctx context.Context, cedarSystemID string, optionalParams *GetAuthorityToOperateOptionalParams) ([]*models.CedarAuthorityToOperate, error) {
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

	if optionalParams != nil {
		if optionalParams.ContainsPersonallyIdentifiableInformation.Ptr() != nil {
			params.SetContainsPersonallyIdentifiableInformation(optionalParams.ContainsPersonallyIdentifiableInformation.Ptr())
		}

		if optionalParams.DispositionDateAfter != nil {
			strfmtDateAfter := strfmt.Date(*optionalParams.DispositionDateAfter)
			params.SetDispositionDateAfter(&strfmtDateAfter)
		}

		if optionalParams.DispositionDateBefore != nil {
			strfmtDateBefore := strfmt.Date(*optionalParams.DispositionDateBefore)
			params.SetDispositionDateBefore(&strfmtDateBefore)
		}

		if optionalParams.FismaSystemAcronym.Ptr() != nil {
			params.SetFismaSystemAcronym(optionalParams.FismaSystemAcronym.Ptr())
		}

		if optionalParams.IsProtectedHealthInformation.Ptr() != nil {
			params.SetIsProtectedHealthInformation(optionalParams.IsProtectedHealthInformation.Ptr())
		}

		if optionalParams.TlcPhase.Ptr() != nil {
			params.SetTlcPhase(optionalParams.TlcPhase.Ptr())
		}

		if optionalParams.UUID.Ptr() != nil {
			params.SetUUID(optionalParams.UUID.Ptr())
		}
	}

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
