package testhelpers

import (
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/models"
)

// NewSystemIntake generates a system intake to use in tests
func NewSystemIntake() models.SystemIntake {
	now := time.Now()
	return models.SystemIntake{
		ID:                      uuid.New(),
		EUAUserID:               null.StringFrom(RandomEUAID()),
		Status:                  models.SystemIntakeStatusINTAKEDRAFT,
		RequestType:             models.SystemIntakeRequestTypeNEW,
		Requester:               "Test Requester",
		Component:               null.StringFrom("Test Component"),
		BusinessOwner:           null.StringFrom("Test Business Owner"),
		BusinessOwnerComponent:  null.StringFrom("Test Business Owner Component"),
		ProductManager:          null.StringFrom("Test Product Manager"),
		ProductManagerComponent: null.StringFrom("Test Product Manager Component"),
		ISSO:                    null.StringFrom("Test ISSO"),
		TRBCollaborator:         null.StringFrom("Test TRB Collaborator"),
		OITSecurityCollaborator: null.StringFrom("Test OIT Collaborator"),
		EACollaborator:          null.StringFrom("Test EA Collaborator"),
		ProjectName:             null.StringFrom("Test Project Name"),
		ExistingFunding:         null.BoolFrom(true),
		FundingNumber:           null.StringFrom("123456"),
		FundingSource:           null.StringFrom("CLIA"),
		BusinessNeed:            null.StringFrom("Test Business Need"),
		Solution:                null.StringFrom("Test Solution"),
		ProcessStatus:           null.StringFrom("Just an idea"),
		EASupportRequest:        null.BoolFrom(false),
		ExistingContract:        null.StringFrom("NOT_NEEDED"),
		CostIncrease:            null.StringFrom("NO"),
		CostIncreaseAmount:      null.StringFrom(""),
		Contractor:              null.StringFrom(""),
		ContractVehicle:         null.StringFrom(""),
		ContractStartDate:       &now,
		ContractEndDate:         &now,
	}
}
