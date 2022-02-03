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
		Isso:                        si.ISSO.ValueOrZero(),
		IssoName:                    si.ISSOName.ValueOrZero(),
		TrbCollaborator:             si.TRBCollaborator.ValueOrZero(),
		TrbCollaboratorName:         si.TRBCollaboratorName.ValueOrZero(),
		OitSecurityCollaborator:     si.OITSecurityCollaborator.ValueOrZero(),
		OitSecurityCollaboratorName: si.OITSecurityCollaboratorName.ValueOrZero(),
		EaCollaborator:              si.EACollaborator.ValueOrZero(),
		EaCollaboratorName:          si.EACollaboratorName.ValueOrZero(),
		ProjectName:                 si.ProjectName.ValueOrZero(),
		ProjectAcronym:              si.ProjectAcronym.ValueOrZero(),
		FundingSource:               si.FundingSource.ValueOrZero(),
		FundingNumber:               si.FundingNumber.ValueOrZero(),
		BusinessNeed:                si.BusinessNeed.ValueOrZero(),
		Solution:                    si.Solution.ValueOrZero(),
		ProcessStatus:               si.ProcessStatus.ValueOrZero(),
		ExistingContract:            si.ExistingContract.ValueOrZero(),
		CostIncrease:                si.CostIncrease.ValueOrZero(),
		CostIncreaseAmount:          si.CostIncreaseAmount.ValueOrZero(),
		Contractor:                  si.Contractor.ValueOrZero(),
		ContractVehicle:             si.ContractVehicle.ValueOrZero(),
		GrtReviewEmailBody:          si.GrtReviewEmailBody.ValueOrZero(),
		RequesterEmailAddress:       si.RequesterEmailAddress.ValueOrZero(),
		LifecycleID:                 si.LifecycleID.ValueOrZero(),
		LifecycleScope:              si.LifecycleScope.ValueOrZero(),
		DecisionNextSteps:           si.DecisionNextSteps.ValueOrZero(),
		RejectionReason:             si.RejectionReason.ValueOrZero(),
		AdminLead:                   si.AdminLead.ValueOrZero(),

		ExistingFunding:    strNullableBool(si.ExistingFunding),
		EaSupportRequest:   strNullableBool(si.EASupportRequest),
		ContractStartDate:  strDate(si.ContractStartDate),
		ContractEndDate:    strDate(si.ContractEndDate),
		SubmittedAt:        strDateTime(si.SubmittedAt),
		DecidedAt:          strDateTime(si.DecidedAt),
		ArchivedAt:         strDateTime(si.ArchivedAt),
		GrbDate:            strDate(si.GRBDate),
		GrtDate:            strDate(si.GRTDate),
		LifecycleExpiresAt: strDate(si.LifecycleExpiresAt),
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
