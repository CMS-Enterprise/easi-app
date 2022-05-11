package models

import (
	"github.com/guregu/null/zero"
)

// CedarAuthorityToOperate is the model for ATO information that comes back from the CEDAR Core API
type CedarAuthorityToOperate struct {
	ActualDispositionDate                     zero.Time `json:"actualDispositionDate"`
	CedarID                                   string    `json:"cedarId"` // required
	ContainsPersonallyIdentifiableInformation bool      `json:"containsPersonallyIdentifiableInformation"`
	CountOfTotalNonPrivilegedUserPopulation   int32     `json:"countOfTotalNonPrivilegedUserPopulation"`
	CountOfOpenPoams                          int32     `json:"countOfOpenPoams"`
	CountOfTotalPrivilegedUserPopulation      int32     `json:"countOfTotalPrivilegedUserPopulation"`
	DateAuthorizationMemoExpires              zero.Time `json:"dateAuthorizationMemoExpires"`
	DateAuthorizationMemoSigned               zero.Time `json:"dateAuthorizationMemoSigned"`
	EAuthenticationLevel                      string    `json:"eAuthenticationLevel"`
	Fips199OverallImpactRating                int32     `json:"fips199OverallImpactRating"`
	FismaSystemAcronym                        string    `json:"fismaSystemAcronym"`
	FismaSystemName                           string    `json:"fismaSystemName"`
	IsAccessedByNonOrganizationalUsers        bool      `json:"isAccessedByNonOrganizationalUsers"`
	IsPiiLimitedToUserNameAndPass             bool      `json:"isPiiLimitedToUserNameAndPass"`
	IsProtectedHealthInformation              bool      `json:"isProtectedHealthInformation"`
	LastActScaDate                            zero.Time `json:"lastActScaDate"`
	LastAssessmentDate                        zero.Time `json:"lastAssessmentDate"`
	LastContingencyPlanCompletionDate         zero.Time `json:"lastContingencyPlanCompletionDate"`
	LastPenTestDate                           zero.Time `json:"lastPenTestDate"`
	PiaCompletionDate                         zero.Time `json:"piaCompletionDate"`
	PrimaryCyberRiskAdvisor                   string    `json:"primaryCyberRiskAdvisor"`
	PrivacySubjectMatterExpert                string    `json:"privacySubjectMatterExpert"`
	RecoveryPointObjective                    float32   `json:"recoveryPointObjective"`
	RecoveryTimeObjective                     float32   `json:"recoveryTimeObjective"`
	SystemOfRecordsNotice                     []string  `json:"systemOfRecordsNotice"`
	TLCPhase                                  string    `json:"tlcPhase"`
	XLCPhase                                  string    `json:"xlcPhase"`
	UUID                                      string    `json:"uuid"` // required
}
