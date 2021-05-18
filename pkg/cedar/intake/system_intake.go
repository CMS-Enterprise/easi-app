package intake

import (
	"context"
	"encoding/json"
	"fmt"

	wire "github.com/cmsgov/easi-app/pkg/cedar/intake/gen/models"
	"github.com/cmsgov/easi-app/pkg/models"
)

func translateSystemIntake(_ context.Context, si *models.SystemIntake) (*wire.IntakeInput, error) {
	if si == nil {
		return nil, fmt.Errorf("nil system intake received")
	}

	obj := &wire.EASIIntake{
		UserEUA:                     pStr(si.EUAUserID.ValueOrZero()),
		Status:                      pStr(string(si.Status)),
		RequestType:                 pStr(string(si.RequestType)),
		Requester:                   pStr(si.Requester),
		Component:                   pStr(si.Component.ValueOrZero()),
		BusinessOwner:               pStr(si.BusinessOwner.ValueOrZero()),
		BusinessOwnerComponent:      pStr(si.BusinessOwnerComponent.ValueOrZero()),
		ProductManager:              pStr(si.ProductManager.ValueOrZero()),
		ProductManagerComponent:     pStr(si.ProductManagerComponent.ValueOrZero()),
		Isso:                        pStr(si.ISSO.ValueOrZero()),
		IssoName:                    pStr(si.ISSOName.ValueOrZero()),
		TrbCollaborator:             pStr(si.TRBCollaborator.ValueOrZero()),
		TrbCollaboratorName:         pStr(si.TRBCollaboratorName.ValueOrZero()),
		OitSecurityCollaborator:     pStr(si.OITSecurityCollaborator.ValueOrZero()),
		OitSecurityCollaboratorName: pStr(si.OITSecurityCollaboratorName.ValueOrZero()),
		EaCollaborator:              pStr(si.EACollaborator.ValueOrZero()),
		EaCollaboratorName:          pStr(si.EACollaboratorName.ValueOrZero()),
		ProjectName:                 pStr(si.ProjectName.ValueOrZero()),
		ProjectAcronym:              pStr(si.ProjectAcronym.ValueOrZero()),
		FundingSource:               pStr(si.FundingSource.ValueOrZero()),
		FundingNumber:               pStr(si.FundingNumber.ValueOrZero()),
		BusinessNeed:                pStr(si.BusinessNeed.ValueOrZero()),
		Solution:                    pStr(si.Solution.ValueOrZero()),
		ProcessStatus:               pStr(si.ProcessStatus.ValueOrZero()),
		ExistingContract:            pStr(si.ExistingContract.ValueOrZero()),
		CostIncrease:                pStr(si.CostIncrease.ValueOrZero()),
		CostIncreaseAmount:          pStr(si.CostIncreaseAmount.ValueOrZero()),
		Contractor:                  pStr(si.Contractor.ValueOrZero()),
		ContractVehicle:             pStr(si.ContractVehicle.ValueOrZero()),
		GrtReviewEmailBody:          pStr(si.GrtReviewEmailBody.ValueOrZero()),
		RequesterEmailAddress:       pStr(si.RequesterEmailAddress.ValueOrZero()),
		LifecycleID:                 pStr(si.LifecycleID.ValueOrZero()),
		LifecycleScope:              pStr(si.LifecycleScope.ValueOrZero()),
		DecisionNextSteps:           pStr(si.DecisionNextSteps.ValueOrZero()),
		RejectionReason:             pStr(si.RejectionReason.ValueOrZero()),
		AdminLead:                   pStr(si.AdminLead.ValueOrZero()),

		ExistingFunding:    pBool(si.ExistingFunding),
		EaSupportRequest:   pBool(si.EASupportRequest),
		ContractStartDate:  pDate(si.ContractStartDate),
		ContractEndDate:    pDate(si.ContractEndDate),
		SubmittedAt:        pDateTime(si.SubmittedAt),
		DecidedAt:          pDateTime(si.DecidedAt),
		ArchivedAt:         pDateTime(si.ArchivedAt),
		GrbDate:            pDate(si.GRBDate),
		GrtDate:            pDate(si.GRTDate),
		LifecycleExpiresAt: pDate(si.LifecycleExpiresAt),
	}

	blob, err := json.Marshal(&obj)
	if err != nil {
		return nil, err
	}

	closedStatuses, err := models.GetStatusesByFilter(models.SystemIntakeStatusFilterCLOSED)
	if err != nil {
		return nil, err
	}

	status := wire.IntakeInputStatusInitiated
	for _, stat := range closedStatuses {
		if si.Status == stat {
			status = wire.IntakeInputStatusFinal
			break
		}
	}

	result := wire.IntakeInput{
		ID:     pStr(si.ID.String()),
		Body:   pStr(string(blob)),
		Status: pStr(status),

		// invariants for this type
		Type:       pStr(wire.IntakeInputTypeEASIIntake),
		Schema:     pStr(wire.IntakeInputSchemaEASIIntakeV01),
		BodyFormat: pStr(wire.IntakeInputBodyFormatJSON),
	}

	if si.CreatedAt != nil {
		result.CreatedDate = pDateTime(si.CreatedAt)
	}
	if si.UpdatedAt != nil {
		result.LastUpdate = pDateTime(si.UpdatedAt)
	}

	return &result, nil
}
