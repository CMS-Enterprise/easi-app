package models

import (
	"github.com/guregu/null/zero"
)

// CedarAuthorityToOperate is the model for ATO information that comes back from the CEDAR Core API
type CedarAuthorityToOperate struct {
	// always-present fields
	CedarID               zero.String   `json:"cedarId"`
	UUID                  zero.String   `json:"uuid"`
	SystemOfRecordsNotice []zero.String `json:"systemOfRecordsNotice"`

	// possibly-null fields
	ActualDispositionDate                     zero.Time   `json:"actualDispositionDate"`
	ContainsPersonallyIdentifiableInformation bool        `json:"containsPersonallyIdentifiableInformation"`
	CountOfTotalNonPrivilegedUserPopulation   int         `json:"countOfTotalNonPrivilegedUserPopulation"`
	CountOfOpenPoams                          int         `json:"countOfOpenPoams"`
	CountOfTotalPrivilegedUserPopulation      int         `json:"countOfTotalPrivilegedUserPopulation"`
	DateAuthorizationMemoExpires              zero.Time   `json:"dateAuthorizationMemoExpires"`
	DateAuthorizationMemoSigned               zero.Time   `json:"dateAuthorizationMemoSigned"`
	EAuthenticationLevel                      zero.String `json:"eAuthenticationLevel"`
	Fips199OverallImpactRating                int         `json:"fips199OverallImpactRating"`
	FismaSystemAcronym                        zero.String `json:"fismaSystemAcronym"`
	FismaSystemName                           zero.String `json:"fismaSystemName"`
	IsAccessedByNonOrganizationalUsers        bool        `json:"isAccessedByNonOrganizationalUsers"`
	IsPiiLimitedToUserNameAndPass             bool        `json:"isPiiLimitedToUserNameAndPass"`
	IsProtectedHealthInformation              bool        `json:"isProtectedHealthInformation"`
	LastActScaDate                            zero.Time   `json:"lastActScaDate"`
	LastAssessmentDate                        zero.Time   `json:"lastAssessmentDate"`
	LastContingencyPlanCompletionDate         zero.Time   `json:"lastContingencyPlanCompletionDate"`
	LastPenTestDate                           zero.Time   `json:"lastPenTestDate"`
	PiaCompletionDate                         zero.Time   `json:"piaCompletionDate"`
	PrimaryCyberRiskAdvisor                   zero.String `json:"primaryCyberRiskAdvisor"`
	PrivacySubjectMatterExpert                zero.String `json:"privacySubjectMatterExpert"`
	RecoveryPointObjective                    float64     `json:"recoveryPointObjective"`
	RecoveryTimeObjective                     float64     `json:"recoveryTimeObjective"`
	TLCPhase                                  zero.String `json:"tlcPhase"`
	XLCPhase                                  zero.String `json:"xlcPhase"`
}
