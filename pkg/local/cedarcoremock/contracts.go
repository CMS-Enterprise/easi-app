package cedarcoremock

import (
	"time"

	"github.com/guregu/null/zero"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

var mockContracts = []*models.CedarContract{
	{
		EndDate:         zero.TimeFrom(time.Now().AddDate(1, 0, 0)),
		StartDate:       zero.TimeFrom(time.Now().AddDate(-1, 0, 0)),
		ContractName:    zero.StringFrom("AB-12C-3456 / 12ABCD34E0001 Trendy Nano ABC"),
		ContractNumber:  zero.StringFrom("12ABCD34E0001"),
		Description:     zero.StringFrom("Strategic partners acquisition readiness"),
		IsDeliveryOrg:   false,
		ServiceProvided: zero.StringFromPtr(nil),
	},
	{
		EndDate:         zero.TimeFrom(time.Time{}),
		StartDate:       zero.TimeFrom(time.Time{}),
		ContractName:    zero.StringFrom("Cloud Arcade Cabinet & Pinball Services (Cloud ACAPS)"),
		ContractNumber:  zero.StringFrom("12ABCD34E0002"),
		Description:     zero.StringFromPtr(nil),
		IsDeliveryOrg:   false,
		ServiceProvided: zero.StringFromPtr(nil),
	},
	{
		EndDate:         zero.TimeFrom(time.Time{}),
		StartDate:       zero.TimeFrom(time.Time{}),
		ContractName:    zero.StringFrom("Mediocre Entertainment Division (MED)"),
		ContractNumber:  zero.StringFrom("12ABCD34E0003"),
		Description:     zero.StringFromPtr(nil),
		IsDeliveryOrg:   true,
		ServiceProvided: zero.StringFrom("this is a mock data string"),
	},
	{
		EndDate:         zero.TimeFrom(time.Now().AddDate(0, 3, 0)),
		StartDate:       zero.TimeFrom(time.Now().AddDate(0, -6, 0)),
		ContractName:    zero.StringFrom("Cool Products & Tools"),
		ContractNumber:  zero.StringFrom("12ABCD34E0004"),
		Description:     zero.StringFrom("All the best tools and products are found here."),
		IsDeliveryOrg:   false,
		ServiceProvided: zero.StringFromPtr(nil),
	},
	{
		EndDate:         zero.TimeFrom(time.Time{}),
		StartDate:       zero.TimeFrom(time.Time{}),
		ContractName:    zero.StringFrom("Cautionary Security Occurences and Training (Cloud SecOops)"),
		ContractNumber:  zero.StringFrom("12ABCD34E0005"),
		Description:     zero.StringFromPtr(nil),
		IsDeliveryOrg:   false,
		ServiceProvided: zero.StringFromPtr(nil),
	},
}

func GetContractsBySystem(cedarSystemID string) []*models.CedarContract {
	contracts := []*models.CedarContract{}
	for i := range mockContracts {
		contract := *mockContracts[i]
		contract.SystemID = zero.StringFrom(cedarSystemID)
		contracts = append(contracts, &contract)
	}
	return contracts
}
