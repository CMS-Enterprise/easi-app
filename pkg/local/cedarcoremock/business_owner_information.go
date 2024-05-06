package cedarcoremock

import (
	"github.com/guregu/null/zero"

	"github.com/cmsgov/easi-app/pkg/models"
)

var mockBusinessOwnerInformation = map[string]*models.BusinessOwnerInformation{
	"{11AB1A00-1234-5678-ABC1-1A001B00CC0A}": {
		BeneficiaryAddressPurpose:      []zero.String{zero.StringFrom("Purpose 1"), zero.StringFrom("Purpose 2")},
		BeneficiaryAddressPurposeOther: zero.StringFrom("Customer Service"),
		BeneficiaryAddressSource:       []zero.String{zero.StringFrom("Source 1"), zero.StringFrom("Source 2")},
		BeneficiaryAddressSourceOther:  zero.StringFrom("Medicaid Address"),
		BeneficiaryInformation:         []zero.String{zero.StringFrom("beneficiary"), zero.StringFrom("info")},
		CostPerYear:                    zero.StringFrom("175500.99"),
		EditBeneficiaryInformation:     true,
		IsCmsOwned:                     true,
		Nr508UserInterface:             zero.StringFrom("508 user interface"),
		NumberOfContractorFte:          zero.StringFrom("50"),
		NumberOfFederalFte:             zero.StringFrom("20"),
		NumberOfSupportedUsersPerMonth: zero.StringFrom("5000"),
		StoresBankingData:              true,
		StoresBeneficiaryAddress:       true,
	},
	"{11AB1A00-1234-5678-ABC1-1A001B00CC1B}": {
		BeneficiaryAddressPurpose:      []zero.String{zero.StringFrom("Beneficiary 1"), zero.StringFrom("Beneficiary 2")},
		BeneficiaryAddressPurposeOther: zero.StringFrom("Development"),
		BeneficiaryAddressSource:       []zero.String{zero.StringFrom("Bene Source 1"), zero.StringFrom("Bene Source 2")},
		BeneficiaryAddressSourceOther:  zero.StringFrom("Home Address"),
		BeneficiaryInformation:         []zero.String{zero.StringFrom("beneficiary"), zero.StringFrom("info")},
		CostPerYear:                    zero.StringFrom("2000000.01"),
		EditBeneficiaryInformation:     false,
		IsCmsOwned:                     false,
		Nr508UserInterface:             zero.StringFrom("Not 508 approved"),
		NumberOfContractorFte:          zero.StringFrom("175"),
		NumberOfFederalFte:             zero.StringFrom("44"),
		NumberOfSupportedUsersPerMonth: zero.StringFrom("250000"),
		StoresBankingData:              false,
		StoresBeneficiaryAddress:       false,
	},
	"{11AB1A00-1234-5678-ABC1-1A001B00CC2C}": {
		BeneficiaryAddressPurpose:      []zero.String{zero.StringFrom("Address 1"), zero.StringFrom("Address 2")},
		BeneficiaryAddressPurposeOther: zero.StringFrom("QA and Testing"),
		BeneficiaryAddressSource:       []zero.String{zero.StringFrom("Address Source 1"), zero.StringFrom("Address Source 2")},
		BeneficiaryAddressSourceOther:  zero.StringFrom("Office Building"),
		BeneficiaryInformation:         []zero.String{zero.StringFrom("beneficiary"), zero.StringFrom("info")},
		CostPerYear:                    zero.StringFrom("1900777.88"),
		EditBeneficiaryInformation:     true,
		IsCmsOwned:                     true,
		Nr508UserInterface:             zero.StringFrom("Not compliant"),
		NumberOfContractorFte:          zero.StringFrom("17"),
		NumberOfFederalFte:             zero.StringFrom("60"),
		NumberOfSupportedUsersPerMonth: zero.StringFrom("9001"),
		StoresBankingData:              true,
		StoresBeneficiaryAddress:       false,
	},
	"{11AB1A00-1234-5678-ABC1-1A001B00CC3D}": {
		BeneficiaryAddressPurpose:      []zero.String{zero.StringFrom("Bene Address Purpose 1"), zero.StringFrom("Bene Address Purpose 2")},
		BeneficiaryAddressPurposeOther: zero.StringFrom("Operations and Management"),
		BeneficiaryAddressSource:       []zero.String{zero.StringFrom("Source 1"), zero.StringFrom("Source 2"), zero.StringFrom("Source 3")},
		BeneficiaryAddressSourceOther:  zero.StringFrom("Medicaid Address"),
		BeneficiaryInformation:         []zero.String{zero.StringFrom("beneficiary"), zero.StringFrom("info")},
		CostPerYear:                    zero.StringFrom("123456.78"),
		EditBeneficiaryInformation:     true,
		IsCmsOwned:                     true,
		Nr508UserInterface:             zero.StringFrom("Compliant"),
		NumberOfContractorFte:          zero.StringFrom("1"),
		NumberOfFederalFte:             zero.StringFrom("85"),
		NumberOfSupportedUsersPerMonth: zero.StringFrom("2500000"),
		StoresBankingData:              false,
		StoresBeneficiaryAddress:       false,
	},
	"{11AB1A00-1234-5678-ABC1-1A001B00CC4E}": {
		BeneficiaryAddressPurpose:      []zero.String{zero.StringFrom("Purpose 1"), zero.StringFrom("Purpose 2"), zero.StringFrom("Purpose 3")},
		BeneficiaryAddressPurposeOther: zero.StringFrom("Customer Service"),
		BeneficiaryAddressSource:       []zero.String{zero.StringFrom("Bene Source 1"), zero.StringFrom("Bene Source 2"), zero.StringFrom("Bene Source 3")},
		BeneficiaryAddressSourceOther:  zero.StringFrom("Hospital Address"),
		BeneficiaryInformation:         []zero.String{zero.StringFrom("beneficiary"), zero.StringFrom("info")},
		CostPerYear:                    zero.StringFrom("7778881.99"),
		EditBeneficiaryInformation:     true,
		IsCmsOwned:                     false,
		Nr508UserInterface:             zero.StringFrom("Needs testing"),
		NumberOfContractorFte:          zero.StringFrom("1700"),
		NumberOfFederalFte:             zero.StringFrom("2900"),
		NumberOfSupportedUsersPerMonth: zero.StringFrom("40"),
		StoresBankingData:              true,
		StoresBeneficiaryAddress:       false,
	},
}

func GetBusinessOwnerInformation(cedarSystemId string) *models.BusinessOwnerInformation {
	if val, ok := mockBusinessOwnerInformation[cedarSystemId]; ok {
		return val
	}

	return &models.BusinessOwnerInformation{}
}
