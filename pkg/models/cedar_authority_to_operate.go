package models

import (
	"github.com/guregu/null"
	"github.com/guregu/null/zero"
)

// CedarAuthorityToOperate is the model for ATO information that comes back from the CEDAR Core API
type CedarAuthorityToOperate struct {
	// always-present fields
	CedarID               string   `json:"cedarId"`
	UUID                  string   `json:"uuid"`
	SystemOfRecordsNotice []string `json:"systemOfRecordsNotice"`

	// possibly-null fields
	ActualDispositionDate                     zero.Time   `json:"actualDispositionDate"`
	ContainsPersonallyIdentifiableInformation null.Bool   `json:"containsPersonallyIdentifiableInformation"`
	CountOfTotalNonPrivilegedUserPopulation   zero.Int    `json:"countOfTotalNonPrivilegedUserPopulation"`
	CountOfOpenPoams                          zero.Int    `json:"countOfOpenPoams"`
	CountOfTotalPrivilegedUserPopulation      zero.Int    `json:"countOfTotalPrivilegedUserPopulation"`
	DateAuthorizationMemoExpires              zero.Time   `json:"dateAuthorizationMemoExpires"`
	DateAuthorizationMemoSigned               zero.Time   `json:"dateAuthorizationMemoSigned"`
	EAuthenticationLevel                      zero.String `json:"eAuthenticationLevel"`
	Fips199OverallImpactRating                zero.Int    `json:"fips199OverallImpactRating"`
	FismaSystemAcronym                        zero.String `json:"fismaSystemAcronym"`
	FismaSystemName                           zero.String `json:"fismaSystemName"`
	IsAccessedByNonOrganizationalUsers        null.Bool   `json:"isAccessedByNonOrganizationalUsers"`
	IsPiiLimitedToUserNameAndPass             null.Bool   `json:"isPiiLimitedToUserNameAndPass"`
	IsProtectedHealthInformation              null.Bool   `json:"isProtectedHealthInformation"`
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
