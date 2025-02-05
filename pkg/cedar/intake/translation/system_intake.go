package translation

import (
	"context"
	"encoding/json"
	"strings"
	"time"

	wire "github.com/cms-enterprise/easi-app/pkg/cedar/intake/gen/models"
	intakemodels "github.com/cms-enterprise/easi-app/pkg/cedar/intake/models"
	"github.com/cms-enterprise/easi-app/pkg/graph/resolvers"
	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// TranslatableSystemIntake is a wrapper around our SystemIntake model for translating into the CEDAR Intake API schema
type TranslatableSystemIntake models.SystemIntake

// ObjectID is a unique identifier for a TranslatableSystemIntake
func (si *TranslatableSystemIntake) ObjectID() string {
	return si.ID.String()
}

// ObjectType is a human-readable identifier for the SystemIntake type, for use in logging
func (si *TranslatableSystemIntake) ObjectType() string {
	return "system intake"
}

// CreateIntakeModel translates a SystemIntake into an IntakeInput
func (si *TranslatableSystemIntake) CreateIntakeModel(ctx context.Context) (*wire.IntakeInput, error) {
	fundingSources := make([]*intakemodels.EASIFundingSource, 0, len(si.FundingSources))
	for _, fundingSource := range si.FundingSources {
		fundingSources = append(fundingSources, &intakemodels.EASIFundingSource{
			FundingSourceID: fundingSource.ID.String(),
			Source:          fundingSource.Source.Ptr(),
			FundingNumber:   fundingSource.FundingNumber.Ptr(),
		})
	}

	clientStatus, err := resolvers.CalculateSystemIntakeAdminStatus(helpers.PointerTo(models.SystemIntake(*si)))
	if err != nil {
		return nil, err
	}

	contracts, err := resolvers.SystemIntakeContractNumbers(ctx, si.ID)
	if err != nil {
		return nil, err
	}

	numbers := make([]string, len(contracts))
	for i := range contracts {
		numbers[i] = contracts[i].ContractNumber
	}

	obj := &intakemodels.EASIIntake{
		IntakeID:                    si.ID.String(),
		UserEUA:                     si.EUAUserID.ValueOrZero(),
		Status:                      string(clientStatus),
		RequestType:                 string(si.RequestType),
		Requester:                   si.Requester,
		Component:                   si.Component.ValueOrZero(),
		BusinessOwner:               si.BusinessOwner.ValueOrZero(),
		BusinessOwnerComponent:      si.BusinessOwnerComponent.ValueOrZero(),
		ProductManager:              si.ProductManager.ValueOrZero(),
		ProductManagerComponent:     si.ProductManagerComponent.ValueOrZero(),
		IssoName:                    si.ISSOName.Ptr(),
		TrbCollaboratorName:         si.TRBCollaboratorName.Ptr(),
		OitSecurityCollaboratorName: si.OITSecurityCollaboratorName.Ptr(),
		EaCollaboratorName:          si.EACollaboratorName.Ptr(),
		ProjectName:                 si.ProjectName.ValueOrZero(),
		ProjectAcronym:              si.ProjectAcronym.Ptr(),
		FundingSource:               si.FundingSource.Ptr(),
		FundingSources:              fundingSources,
		FundingNumber:               si.FundingNumber.Ptr(),
		BusinessNeed:                si.BusinessNeed.ValueOrZero(),
		Solution:                    si.Solution.ValueOrZero(),
		ProcessStatus:               si.ProcessStatus.ValueOrZero(),
		ExistingContract:            si.ExistingContract.ValueOrZero(),
		CostIncrease:                si.CostIncrease.ValueOrZero(),
		CostIncreaseAmount:          si.CostIncreaseAmount.Ptr(),
		Contractor:                  si.Contractor.Ptr(),
		ContractVehicle:             si.ContractVehicle.Ptr(),
		ContractNumber:              helpers.PointerTo(strings.Join(numbers, ", ")),
		RequesterEmailAddress:       si.RequesterEmailAddress.Ptr(),
		LifecycleID:                 si.LifecycleID.Ptr(),
		LifecycleScope:              si.LifecycleScope.StringPointer(),
		DecisionNextSteps:           si.DecisionNextSteps.StringPointer(),
		RejectionReason:             si.RejectionReason.StringPointer(),
		AdminLead:                   si.AdminLead.Ptr(),

		ExistingFunding:       si.ExistingFunding.Ptr(),
		EaSupportRequest:      si.EASupportRequest.Ptr(),
		HasUIChanges:          si.HasUIChanges.Ptr(),
		ContractStartDate:     pStr(strDate(si.ContractStartDate)),
		ContractEndDate:       pStr(strDate(si.ContractEndDate)),
		SubmittedAt:           strDateTime(si.SubmittedAt),
		DecidedAt:             pStr(strDateTime(si.DecidedAt)),
		ArchivedAt:            pStr(strDateTime(si.ArchivedAt)),
		GrbDate:               pStr(strDate(si.GRBDate)),
		GrtDate:               pStr(strDate(si.GRTDate)),
		LifecycleExpiresAt:    pStr(strDate(si.LifecycleExpiresAt)),
		LifecycleCostBaseline: si.LifecycleCostBaseline.Ptr(),
	}

	blob, err := json.Marshal(&obj)
	if err != nil {
		return nil, err
	}

	result := wire.IntakeInput{
		ClientID:     pStr(si.ID.String()),
		Body:         pStr(string(blob)),
		ClientStatus: pStr(string(clientStatus)),

		// invariants for this type
		Type:       typeStr(intakeInputSystemIntake),
		Schema:     versionStr(IntakeInputSchemaEASIIntakeVersion),
		BodyFormat: pStr(wire.IntakeInputBodyFormatJSON),
	}

	if si.CreatedAt != nil {
		result.ClientCreatedDate = pStrfmtDateTime(si.CreatedAt)
	}

	// Optionally send the updated at date if it exists
	// Otherwise, send the created at date, falling back to the current time
	// This code exists because the `ClientLastUpdatedDate` field is required by the CEDAR API
	// but it's possible that the intake doesn't have it set (as we have it nullable)
	if si.UpdatedAt != nil {
		result.ClientLastUpdatedDate = pStrfmtDateTime(si.UpdatedAt)
	} else if si.CreatedAt != nil {
		result.ClientLastUpdatedDate = pStrfmtDateTime(si.CreatedAt)
	} else {
		now := time.Now()
		result.ClientLastUpdatedDate = pStrfmtDateTime(&now)
	}

	return &result, nil
}
