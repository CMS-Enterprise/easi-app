package translation

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/guregu/null"

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
			Source:          fundingSource.Investment.Ptr(),
			FundingNumber:   fundingSource.ProjectNumber.Ptr(),
		})
	}

	// TODO, should we rebuild the dataloaders here?
	contacts, err := resolvers.SystemIntakeContactsGetBySystemIntakeID(ctx, si.ID)
	if err != nil {
		return nil, fmt.Errorf("error fetching contacts for system intake %s: %w", si.ID.String(), err)
	}

	clientStatus, err := resolvers.CalculateSystemIntakeAdminStatus(ctx, helpers.PointerTo(models.SystemIntake(*si)))
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
		IntakeID:    si.ID.String(),
		UserEUA:     si.EUAUserID.ValueOrZero(),
		Status:      string(clientStatus),
		RequestType: string(si.RequestType),
		// Requester:                       si.Requester,
		// Component:                       si.Component.ValueOrZero(), // IS THIS the Requester Component?
		// BusinessOwner:                   si.BusinessOwner.ValueOrZero(),
		// BusinessOwnerComponent:          si.BusinessOwnerComponent.ValueOrZero(),
		// ProductManager:                  si.ProductManager.ValueOrZero(),
		// ProductManagerComponent:         si.ProductManagerComponent.ValueOrZero(),
		IssoName:                        si.ISSOName.Ptr(),
		TrbCollaboratorName:             si.TRBCollaboratorName.Ptr(),
		OitSecurityCollaboratorName:     si.OITSecurityCollaboratorName.Ptr(),
		EaCollaboratorName:              si.EACollaboratorName.Ptr(),
		CollaboratorName508:             si.CollaboratorName508.Ptr(),
		ProjectName:                     si.ProjectName.ValueOrZero(),
		ProjectAcronym:                  si.ProjectAcronym.Ptr(),
		FundingSource:                   si.FundingSource.Ptr(),
		FundingSources:                  fundingSources,
		FundingNumber:                   si.FundingNumber.Ptr(),
		BusinessNeed:                    si.BusinessNeed.ValueOrZero(),
		Solution:                        si.Solution.ValueOrZero(),
		ProcessStatus:                   si.ProcessStatus.ValueOrZero(),
		ExistingContract:                si.ExistingContract.ValueOrZero(),
		CostIncrease:                    si.CostIncrease.ValueOrZero(),
		CostIncreaseAmount:              si.CostIncreaseAmount.Ptr(),
		Contractor:                      si.Contractor.Ptr(),
		ContractVehicle:                 si.ContractVehicle.Ptr(),
		ContractNumber:                  helpers.PointerTo(strings.Join(numbers, ", ")),
		RequesterEmailAddress:           si.RequesterEmailAddress.Ptr(),
		LifecycleID:                     si.LifecycleID.Ptr(),
		LifecycleScope:                  si.LifecycleScope.StringPointer(),
		DecisionNextSteps:               si.DecisionNextSteps.StringPointer(),
		RejectionReason:                 si.RejectionReason.StringPointer(),
		AdminLead:                       si.AdminLead.Ptr(),
		ExistingFunding:                 si.ExistingFunding.Ptr(),
		EaSupportRequest:                si.EASupportRequest.Ptr(),
		HasUIChanges:                    si.HasUIChanges.Ptr(),
		UsesAITech:                      si.UsesAITech.Ptr(),
		UsingSoftware:                   si.UsingSoftware.Ptr(),
		AcquisitionMethods:              si.AcquisitionMethods,
		CurrentAnnualSpending:           si.CurrentAnnualSpending.Ptr(),
		CurrentAnnualSpendingITPortion:  si.CurrentAnnualSpendingITPortion.Ptr(),
		PlannedYearOneSpending:          si.PlannedYearOneSpending.Ptr(),
		PlannedYearOneSpendingITPortion: si.PlannedYearOneSpendingITPortion.Ptr(),
		ContractStartDate:               pStr(strDate(si.ContractStartDate)),
		ContractEndDate:                 pStr(strDate(si.ContractEndDate)),
		SubmittedAt:                     strDateTime(si.SubmittedAt),
		DecidedAt:                       pStr(strDateTime(si.DecidedAt)),
		ArchivedAt:                      pStr(strDateTime(si.ArchivedAt)),
		GrbDate:                         pStr(strDate(si.GRBDate)),
		GrtDate:                         pStr(strDate(si.GRTDate)),
		LifecycleExpiresAt:              pStr(strDate(si.LifecycleExpiresAt)),
		LifecycleCostBaseline:           si.LifecycleCostBaseline.Ptr(),
		// ScheduledProductionDate:         pStr(""), // TODO: fill this out after field is added to intake
	}

	// Populate contacts. For now, don't stop submission if there is an error fetching these
	requester, _ := contacts.Requester()
	if requester != nil {
		reqAccount, _ := requester.UserAccount(ctx)
		if reqAccount != nil {
			si.Requester = reqAccount.Username
		}
		// TODO: verify component is what CEDAR expects here, and that it is meant to come from the requester
		si.Component = null.StringFrom(string(requester.Component))
	}
	businessOwners, _ := contacts.BusinessOwners()
	if len(businessOwners) > 0 {
		boAccount, _ := businessOwners[0].UserAccount(ctx)
		if boAccount != nil {
			si.BusinessOwner = null.StringFrom(boAccount.Username)
		}
		si.BusinessOwnerComponent = null.StringFrom(string(businessOwners[0].Component))
	}

	productManagers, _ := contacts.ProductManagers()
	if len(productManagers) > 0 {
		pmAccount, _ := productManagers[0].UserAccount(ctx)
		if pmAccount != nil {
			si.ProductManager = null.StringFrom(pmAccount.Username)
		}
		si.ProductManagerComponent = null.StringFrom(string(productManagers[0].Component))
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
