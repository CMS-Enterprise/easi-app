package cedarcoremock

import (
	"time"

	"github.com/guregu/null/zero"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

var mockATOs = []*models.CedarAuthorityToOperate{
	{
		UUID:                  zero.StringFrom("{12A34567-1A23-1a23-ABC1-1A23BCD1E001}"),
		CedarID:               zero.StringFrom("123456AB-AB1C-12AB-A1B2-1234AB56C001"),
		ActualDispositionDate: zero.TimeFrom(time.Now().AddDate(-1, 0, 0)),
		ContainsPersonallyIdentifiableInformation: true,
		CountOfTotalNonPrivilegedUserPopulation:   0,
		CountOfOpenPoams:                          0,
		CountOfTotalPrivilegedUserPopulation:      0,
		DateAuthorizationMemoExpires:              zero.TimeFrom(time.Now().AddDate(0, 3, 0)),
		DateAuthorizationMemoSigned:               zero.TimeFrom(time.Now().AddDate(0, -3, 0)),
		EAuthenticationLevel:                      zero.StringFrom("N/A"),
		Fips199OverallImpactRating:                2,
		FismaSystemAcronym:                        zero.StringFrom("ACME"),
		FismaSystemName:                           zero.StringFrom("Always Create Medicare Expenses"),
		IsAccessedByNonOrganizationalUsers:        false,
		IsPiiLimitedToUserNameAndPass:             false,
		IsProtectedHealthInformation:              false,
		LastActScaDate:                            zero.TimeFrom(time.Now().AddDate(0, -6, 0)),
		LastAssessmentDate:                        zero.TimeFrom(time.Now().AddDate(0, -9, 0)),
		LastContingencyPlanCompletionDate:         zero.TimeFrom(time.Now().AddDate(-1, 0, 0)),
		LastPenTestDate:                           zero.TimeFrom(time.Now().AddDate(0, -9, 0)),
		PiaCompletionDate:                         zero.TimeFrom(time.Now().AddDate(-1, 0, 0)),
		PrimaryCyberRiskAdvisor:                   zero.StringFrom("USR1"),
		PrivacySubjectMatterExpert:                zero.StringFrom("A11Y"),
		RecoveryPointObjective:                    float64(4),
		RecoveryTimeObjective:                     float64(24),
		SystemOfRecordsNotice:                     []zero.String{},
		TLCPhase:                                  zero.StringFrom("Operate"),
		XLCPhase:                                  zero.StringFrom("Operate"),
	},
}

// GetATOs returns a mock ATO
func GetATOs() []*models.CedarAuthorityToOperate {
	return mockATOs
}
