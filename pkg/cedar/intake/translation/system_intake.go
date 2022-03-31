package translation

import (
	"encoding/json"

	wire "github.com/cmsgov/easi-app/pkg/cedar/intake/gen/models"
	intakemodels "github.com/cmsgov/easi-app/pkg/cedar/intake/models"
	"github.com/cmsgov/easi-app/pkg/models"
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
func (si *TranslatableSystemIntake) CreateIntakeModel() (*wire.IntakeInput, error) {
	obj := &intakemodels.EASIIntake{
		UserEUA:                     si.EUAUserID.ValueOrZero(),
		Status:                      string(si.Status),
		RequestType:                 string(si.RequestType),
		Requester:                   si.Requester,
		Component:                   si.Component.ValueOrZero(),
		BusinessOwner:               si.BusinessOwner.ValueOrZero(),
		BusinessOwnerComponent:      si.BusinessOwnerComponent.ValueOrZero(),
		ProductManager:              si.ProductManager.ValueOrZero(),
		ProductManagerComponent:     si.ProductManagerComponent.ValueOrZero(),
		Isso:                        si.ISSO.Ptr(),
		IssoName:                    si.ISSOName.Ptr(),
		TrbCollaborator:             si.TRBCollaborator.Ptr(),
		TrbCollaboratorName:         si.TRBCollaboratorName.Ptr(),
		OitSecurityCollaborator:     si.OITSecurityCollaborator.Ptr(),
		OitSecurityCollaboratorName: si.OITSecurityCollaboratorName.Ptr(),
		EaCollaborator:              si.EACollaborator.Ptr(),
		EaCollaboratorName:          si.EACollaboratorName.Ptr(),
		ProjectName:                 si.ProjectName.ValueOrZero(),
		ProjectAcronym:              si.ProjectAcronym.Ptr(),
		FundingSource:               si.FundingSource.Ptr(),
		FundingNumber:               si.FundingNumber.Ptr(),
		BusinessNeed:                si.BusinessNeed.ValueOrZero(),
		Solution:                    si.Solution.ValueOrZero(),
		ProcessStatus:               si.ProcessStatus.ValueOrZero(),
		ExistingContract:            si.ExistingContract.ValueOrZero(),
		CostIncrease:                si.CostIncrease.ValueOrZero(),
		CostIncreaseAmount:          si.CostIncreaseAmount.Ptr(),
		Contractor:                  si.Contractor.Ptr(),
		ContractVehicle:             si.ContractVehicle.Ptr(),
		GrtReviewEmailBody:          si.GrtReviewEmailBody.Ptr(),
		RequesterEmailAddress:       si.RequesterEmailAddress.Ptr(),
		LifecycleID:                 si.LifecycleID.Ptr(),
		LifecycleScope:              si.LifecycleScope.Ptr(),
		DecisionNextSteps:           si.DecisionNextSteps.Ptr(),
		RejectionReason:             si.RejectionReason.Ptr(),
		AdminLead:                   si.AdminLead.Ptr(),

		ExistingFunding:    si.ExistingFunding.Ptr(),
		EaSupportRequest:   si.EASupportRequest.Ptr(),
		ContractStartDate:  pStr(strDate(si.ContractStartDate)),
		ContractEndDate:    pStr(strDate(si.ContractEndDate)),
		SubmittedAt:        strDateTime(si.SubmittedAt),
		DecidedAt:          pStr(strDateTime(si.DecidedAt)),
		ArchivedAt:         pStr(strDateTime(si.ArchivedAt)),
		GrbDate:            pStr(strDate(si.GRBDate)),
		GrtDate:            pStr(strDate(si.GRTDate)),
		LifecycleExpiresAt: pStr(strDate(si.LifecycleExpiresAt)),
	}

	blob, err := json.Marshal(&obj)
	if err != nil {
		return nil, err
	}

	closedStatuses, err := models.GetStatusesByFilter(models.SystemIntakeStatusFilterCLOSED)
	if err != nil {
		return nil, err
	}

	status := inputStatusInitiated
	for _, stat := range closedStatuses {
		if si.Status == stat {
			status = inputStatusFinal
			break
		}
	}

	result := wire.IntakeInput{
		ClientID:     pStr(si.ID.String()),
		Body:         pStr(string(blob)),
		ClientStatus: statusStr(status),

		// invariants for this type
		Type:       typeStr(intakeInputSystemIntake),
		Schema:     versionStr(IntakeInputSchemaEASIIntakeVersion),
		BodyFormat: pStr(wire.IntakeInputBodyFormatJSON),
	}

	if si.CreatedAt != nil {
		result.ClientCreatedDate = pStrfmtDateTime(si.CreatedAt)
	}
	if si.UpdatedAt != nil {
		result.ClientLastUpdatedDate = pStrfmtDateTime(si.UpdatedAt)
	}

	return &result, nil
}
