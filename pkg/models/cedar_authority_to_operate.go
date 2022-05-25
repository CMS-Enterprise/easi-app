package models

import (
	"github.com/guregu/null/zero"
)

// CedarAuthorityToOperate is the model for ATO information that comes back from the CEDAR Core API
type CedarAuthorityToOperate struct {
	// always-present fields
	CedarID               string   `json:"cedarId"`
	UUID                  string   `json:"uuid"`
	SystemOfRecordsNotice []string `json:"systemOfRecordsNotice"`

	// possibly-null in CEDAR Swagger, but in practice are never null
	// per CEDAR team on Slack - "the count fields we get from CFACTS are 100% populated" - https://cmsgov.slack.com/archives/C02KTCN3ADD/p1652983526196749?thread_ts=1652982592.922789&cid=C02KTCN3ADD
	CountOfTotalNonPrivilegedUserPopulation int `json:"countOfTotalNonPrivilegedUserPopulation"`
	CountOfOpenPoams                        int `json:"countOfOpenPoams"`
	CountOfTotalPrivilegedUserPopulation    int `json:"countOfTotalPrivilegedUserPopulation"`

	// possibly-null fields
	ActualDispositionDate                     zero.Time   `json:"actualDispositionDate"`
	ContainsPersonallyIdentifiableInformation zero.Bool   `json:"containsPersonallyIdentifiableInformation"`
	DateAuthorizationMemoExpires              zero.Time   `json:"dateAuthorizationMemoExpires"`
	DateAuthorizationMemoSigned               zero.Time   `json:"dateAuthorizationMemoSigned"`
	EAuthenticationLevel                      zero.String `json:"eAuthenticationLevel"`
	Fips199OverallImpactRating                zero.Int    `json:"fips199OverallImpactRating"`
	FismaSystemAcronym                        zero.String `json:"fismaSystemAcronym"`
	FismaSystemName                           zero.String `json:"fismaSystemName"`
	IsAccessedByNonOrganizationalUsers        zero.Bool   `json:"isAccessedByNonOrganizationalUsers"`
	IsPiiLimitedToUserNameAndPass             zero.Bool   `json:"isPiiLimitedToUserNameAndPass"`
	IsProtectedHealthInformation              zero.Bool   `json:"isProtectedHealthInformation"`
	LastActScaDate                            zero.Time   `json:"lastActScaDate"`
	LastAssessmentDate                        zero.Time   `json:"lastAssessmentDate"`
	LastContingencyPlanCompletionDate         zero.Time   `json:"lastContingencyPlanCompletionDate"`
	LastPenTestDate                           zero.Time   `json:"lastPenTestDate"`
	PiaCompletionDate                         zero.Time   `json:"piaCompletionDate"`
	PrimaryCyberRiskAdvisor                   zero.String `json:"primaryCyberRiskAdvisor"`
	PrivacySubjectMatterExpert                zero.String `json:"privacySubjectMatterExpert"`
	RecoveryPointObjective                    zero.Float  `json:"recoveryPointObjective"`
	RecoveryTimeObjective                     zero.Float  `json:"recoveryTimeObjective"`
	TLCPhase                                  zero.String `json:"tlcPhase"`
	XLCPhase                                  zero.String `json:"xlcPhase"`
}
