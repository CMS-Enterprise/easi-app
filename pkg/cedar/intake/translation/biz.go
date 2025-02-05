package translation

import (
	"context"
	"encoding/json"
	"strconv"
	"time"

	wire "github.com/cms-enterprise/easi-app/pkg/cedar/intake/gen/models"
	intakemodels "github.com/cms-enterprise/easi-app/pkg/cedar/intake/models"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// TranslatableBusinessCase is a wrapper around our BusinessCase model for translating into the CEDAR Intake API schema
type TranslatableBusinessCase models.BusinessCaseWithCosts

// ObjectID is a unique identifier for a TranslatableAction
func (bc *TranslatableBusinessCase) ObjectID() string {
	return bc.ID.String()
}

// ObjectType is a human-readable identifier for the BusinessCase type, for use in logging
func (bc *TranslatableBusinessCase) ObjectType() string {
	return "business case"
}

// CreateIntakeModel translates a BusinessCase into an IntakeInput
func (bc *TranslatableBusinessCase) CreateIntakeModel(ctx context.Context) (*wire.IntakeInput, error) {
	obj := intakemodels.EASIBizCase{
		UserEUA:                bc.EUAUserID,
		BusinessCaseID:         bc.ID.String(),
		IntakeID:               pStr(bc.SystemIntakeID.String()),
		ProjectName:            bc.ProjectName.ValueOrZero(), // will always have a value by the time a draft business case is submitted
		Requester:              bc.Requester.ValueOrZero(),   // will always have a value by the time a draft business case is submitted
		RequesterPhoneNumber:   bc.RequesterPhoneNumber.Ptr(),
		BusinessOwner:          bc.BusinessOwner.ValueOrZero(), // will always have a value by the time a draft business case is submitted
		BusinessNeed:           bc.BusinessNeed.Ptr(),
		CurrentSolutionSummary: bc.CurrentSolutionSummary.Ptr(),
		CmsBenefit:             bc.CMSBenefit.Ptr(),
		PriorityAlignment:      bc.PriorityAlignment.Ptr(),
		SuccessIndicators:      bc.SuccessIndicators.Ptr(),
		Status:                 string(bc.Status),

		ArchivedAt: pStr(strDateTime(bc.ArchivedAt)),

		BusinessSolutions: []*intakemodels.EASIBusinessSolution{},
	}

	// Build the collection of embedded objects

	// Business solutions
	// Preferred (required)
	preferredSolution := &intakemodels.EASIBusinessSolution{
		SolutionType:            "preferred",
		Title:                   bc.PreferredTitle.Ptr(),
		Summary:                 bc.PreferredSummary.Ptr(),
		AcquisitionApproach:     bc.PreferredAcquisitionApproach.Ptr(),
		SecurityIsApproved:      bc.PreferredSecurityIsApproved.Ptr(),
		SecurityIsBeingReviewed: bc.PreferredSecurityIsBeingReviewed.Ptr(),
		HostingType:             bc.PreferredHostingType.Ptr(),
		HostingLocation:         bc.PreferredHostingLocation.Ptr(),
		HostingCloudServiceType: bc.PreferredHostingCloudServiceType.Ptr(),
		HasUI:                   bc.PreferredHasUI.Ptr(),
		Pros:                    bc.PreferredPros.Ptr(),
		Cons:                    bc.PreferredCons.Ptr(),
		CostSavings:             bc.PreferredCostSavings.Ptr(),
		LifecycleCostLines:      []intakemodels.EASILifecycleCost{},
	}

	// TODO: do we need to check if alternative a and b are filled out?
	// what is the best way to do that? need to check each field individually?

	// Alternative a (optional)
	alternativeASolution := &intakemodels.EASIBusinessSolution{
		SolutionType:            "alternativeA",
		Title:                   bc.AlternativeATitle.Ptr(),
		Summary:                 bc.AlternativeASummary.Ptr(),
		AcquisitionApproach:     bc.AlternativeAAcquisitionApproach.Ptr(),
		SecurityIsApproved:      bc.AlternativeASecurityIsApproved.Ptr(),
		SecurityIsBeingReviewed: bc.AlternativeASecurityIsBeingReviewed.Ptr(),
		HostingType:             bc.AlternativeAHostingType.Ptr(),
		HostingLocation:         bc.AlternativeAHostingLocation.Ptr(),
		HostingCloudServiceType: bc.AlternativeAHostingCloudServiceType.Ptr(),
		HasUI:                   bc.AlternativeAHasUI.Ptr(),
		Pros:                    bc.AlternativeAPros.Ptr(),
		Cons:                    bc.AlternativeACons.Ptr(),
		CostSavings:             bc.AlternativeACostSavings.Ptr(),
		LifecycleCostLines:      []intakemodels.EASILifecycleCost{},
	}

	// Alternative b (optional)
	alternativeBSolution := &intakemodels.EASIBusinessSolution{
		SolutionType:            "alternativeB",
		Title:                   bc.AlternativeBTitle.Ptr(),
		Summary:                 bc.AlternativeBSummary.Ptr(),
		AcquisitionApproach:     bc.AlternativeBAcquisitionApproach.Ptr(),
		SecurityIsApproved:      bc.AlternativeBSecurityIsApproved.Ptr(),
		SecurityIsBeingReviewed: bc.AlternativeBSecurityIsBeingReviewed.Ptr(),
		HostingType:             bc.AlternativeBHostingType.Ptr(),
		HostingLocation:         bc.AlternativeBHostingLocation.Ptr(),
		HostingCloudServiceType: bc.AlternativeBHostingCloudServiceType.Ptr(),
		HasUI:                   bc.AlternativeBHasUI.Ptr(),
		Pros:                    bc.AlternativeBPros.Ptr(),
		Cons:                    bc.AlternativeBCons.Ptr(),
		CostSavings:             bc.AlternativeBCostSavings.Ptr(),
		LifecycleCostLines:      []intakemodels.EASILifecycleCost{},
	}

	// Add lifecycle cost lines to business solutions
	bcID := bc.ID.String()

	for _, line := range bc.LifecycleCostLines {
		lc := intakemodels.EASILifecycleCost{
			Solution: string(line.Solution),
			Year:     string(line.Year),
		}

		phase := ""
		if line.Phase != nil {
			phase = string(*line.Phase)
		}
		lc.Phase = pStr(phase)

		cost := ""
		if line.Cost != nil {
			cost = strconv.FormatInt(*line.Cost, 10)
		}
		lc.Cost = pStr(cost)

		if line.Solution == models.LifecycleCostSolutionPREFERRED {
			preferredSolution.LifecycleCostLines = append(preferredSolution.LifecycleCostLines, lc)
		} else if line.Solution == models.LifecycleCostSolutionA {
			alternativeASolution.LifecycleCostLines = append(alternativeASolution.LifecycleCostLines, lc)
		} else if line.Solution == models.LifecycleCostSolutionB {
			alternativeBSolution.LifecycleCostLines = append(alternativeBSolution.LifecycleCostLines, lc)
		}
	}

	// Append all solution objects to business solutions list
	obj.BusinessSolutions = append(obj.BusinessSolutions, preferredSolution)
	obj.BusinessSolutions = append(obj.BusinessSolutions, alternativeASolution)
	obj.BusinessSolutions = append(obj.BusinessSolutions, alternativeBSolution)

	blob, err := json.Marshal(&obj)
	if err != nil {
		return nil, err
	}

	result := &wire.IntakeInput{
		ClientID: pStr(bcID),
		Body:     pStr(string(blob)),

		// invariants for this type
		BodyFormat: pStr(wire.IntakeInputBodyFormatJSON),
		Type:       typeStr(intakeInputBizCase),
		Schema:     versionStr(IntakeInputSchemaEASIBizCaseVersion),
	}

	if bc.Status == models.BusinessCaseStatusCLOSED {
		result.ClientStatus = statusStr(inputStatusFinal)
	} else {
		result.ClientStatus = statusStr(inputStatusInitiated)
	}

	if bc.CreatedAt != nil {
		result.ClientCreatedDate = pStrfmtDateTime(bc.CreatedAt)
	}

	// Optionally send the updated at date if it exists
	// Otherwise, send the created at date, falling back to the current time
	// This code exists because the `ClientLastUpdatedDate` field is required by the CEDAR API
	// but it's possible that the biz case doesn't have it set (as we have it nullable)
	if bc.UpdatedAt != nil {
		result.ClientLastUpdatedDate = pStrfmtDateTime(bc.UpdatedAt)
	} else if bc.CreatedAt != nil {
		result.ClientLastUpdatedDate = pStrfmtDateTime(bc.CreatedAt)
	} else {
		now := time.Now()
		result.ClientLastUpdatedDate = pStrfmtDateTime(&now)
	}

	return result, nil
}
