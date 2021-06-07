package intake

import (
	"context"
	"encoding/json"
	"fmt"
	"strconv"

	wire "github.com/cmsgov/easi-app/pkg/cedar/intake/gen/models"
	"github.com/cmsgov/easi-app/pkg/models"
)

func translateBizCase(ctx context.Context, bc *models.BusinessCase) (*wire.IntakeInput, error) {
	if bc == nil {
		return nil, fmt.Errorf("nil bizcase received")
	}

	bcID := bc.ID.String()
	obj := wire.EASIBizCase{
		UserEUA:              pStr(bc.EUAUserID),
		IntakeID:             pStr(bc.SystemIntakeID.String()),
		ProjectName:          pStr(bc.ProjectName.ValueOrZero()),
		Requester:            pStr(bc.Requester.ValueOrZero()),
		RequesterPhoneNumber: pStr(bc.RequesterPhoneNumber.ValueOrZero()),
		BusinessOwner:        pStr(bc.BusinessOwner.ValueOrZero()),
		BusinessNeed:         pStr(bc.BusinessNeed.ValueOrZero()),
		CmsBenefit:           pStr(bc.CMSBenefit.ValueOrZero()),
		PriorityAlignment:    pStr(bc.PriorityAlignment.ValueOrZero()),
		SuccessIndicators:    pStr(bc.SuccessIndicators.ValueOrZero()),

		AsIsTitle:       pStr(bc.AsIsTitle.ValueOrZero()),
		AsIsSummary:     pStr(bc.AsIsSummary.ValueOrZero()),
		AsIsPros:        pStr(bc.AsIsPros.ValueOrZero()),
		AsIsCons:        pStr(bc.AsIsCons.ValueOrZero()),
		AsIsCostSavings: pStr(bc.AsIsCostSavings.ValueOrZero()),

		BusinessSolutions: []*wire.EASIBusinessSolution{},

		SubmittedAt:        pDateTime(bc.SubmittedAt),
		ArchivedAt:         pDateTime(bc.ArchivedAt),
		InitialSubmittedAt: pDateTime(bc.InitialSubmittedAt),
		LastSubmittedAt:    pDateTime(bc.LastSubmittedAt),

		// 0-length slice instead of nil, because property is required even if
		// empty, i.e. in JSON want an empty array rather than a null or an
		// absent property
		LifecycleCostLines: []*wire.EASILifecycleCost{},
	}

	// build the collection of embedded objects

	// TODO: edit business case db model to hold solutions array instead of individual fields

	// business solutions
	// preferred (required)
	preferredSolution := &wire.EASIBusinessSolution{
		SolutionType:            pStr("preferred"),
		Title:                   pStr(bc.PreferredTitle.ValueOrZero()),
		Summary:                 pStr(bc.PreferredSummary.ValueOrZero()),
		AcquisitionApproach:     pStr(bc.PreferredAcquisitionApproach.ValueOrZero()),
		SecurityIsApproved:      pBool(bc.PreferredSecurityIsApproved),
		SecurityIsBeingReviewed: pStr(bc.PreferredSecurityIsBeingReviewed.ValueOrZero()),
		HostingType:             pStr(bc.PreferredHostingType.ValueOrZero()),
		HostingLocation:         pStr(bc.PreferredHostingLocation.ValueOrZero()),
		HostingCloudServiceType: pStr(bc.PreferredHostingCloudServiceType.ValueOrZero()),
		HasUI:                   pStr(bc.PreferredHasUI.ValueOrZero()),
		Pros:                    pStr(bc.PreferredPros.ValueOrZero()),
		Cons:                    pStr(bc.PreferredCons.ValueOrZero()),
		CostSavings:             pStr(bc.PreferredCostSavings.ValueOrZero()),
	}

	obj.BusinessSolutions = append(obj.BusinessSolutions, preferredSolution)

	// TODO: what is the best way to tell if alternative A and/or B are filled out?
	//       do i need to check each field individually?

	// alternative a (optional)
	alternativeASolution := &wire.EASIBusinessSolution{
		SolutionType:            pStr("alternativeA"),
		Title:                   pStr(bc.AlternativeATitle.ValueOrZero()),
		Summary:                 pStr(bc.AlternativeASummary.ValueOrZero()),
		AcquisitionApproach:     pStr(bc.AlternativeAAcquisitionApproach.ValueOrZero()),
		SecurityIsApproved:      pBool(bc.AlternativeASecurityIsApproved),
		SecurityIsBeingReviewed: pStr(bc.AlternativeASecurityIsBeingReviewed.ValueOrZero()),
		HostingType:             pStr(bc.AlternativeAHostingType.ValueOrZero()),
		HostingLocation:         pStr(bc.AlternativeAHostingLocation.ValueOrZero()),
		HostingCloudServiceType: pStr(bc.AlternativeAHostingCloudServiceType.ValueOrZero()),
		HasUI:                   pStr(bc.AlternativeAHasUI.ValueOrZero()),
		Pros:                    pStr(bc.AlternativeAPros.ValueOrZero()),
		Cons:                    pStr(bc.AlternativeACons.ValueOrZero()),
		CostSavings:             pStr(bc.AlternativeACostSavings.ValueOrZero()),
	}

	obj.BusinessSolutions = append(obj.BusinessSolutions, alternativeASolution)

	// alternative b (optional)
	alternativeBSolution := &wire.EASIBusinessSolution{
		SolutionType:            pStr("alternativeB"),
		Title:                   pStr(bc.AlternativeBTitle.ValueOrZero()),
		Summary:                 pStr(bc.AlternativeBSummary.ValueOrZero()),
		AcquisitionApproach:     pStr(bc.AlternativeBAcquisitionApproach.ValueOrZero()),
		SecurityIsApproved:      pBool(bc.AlternativeBSecurityIsApproved),
		SecurityIsBeingReviewed: pStr(bc.AlternativeBSecurityIsBeingReviewed.ValueOrZero()),
		HostingType:             pStr(bc.AlternativeBHostingType.ValueOrZero()),
		HostingLocation:         pStr(bc.AlternativeBHostingLocation.ValueOrZero()),
		HostingCloudServiceType: pStr(bc.AlternativeBHostingCloudServiceType.ValueOrZero()),
		HasUI:                   pStr(bc.AlternativeBHasUI.ValueOrZero()),
		Pros:                    pStr(bc.AlternativeBPros.ValueOrZero()),
		Cons:                    pStr(bc.AlternativeBCons.ValueOrZero()),
		CostSavings:             pStr(bc.AlternativeBCostSavings.ValueOrZero()),
	}

	obj.BusinessSolutions = append(obj.BusinessSolutions, alternativeBSolution)

	// lifecycle cost lines
	for _, line := range bc.LifecycleCostLines {
		lc := &wire.EASILifecycleCost{
			ID:             pStr(line.ID.String()),
			BusinessCaseID: pStr(bcID),
			Solution:       pStr(string(line.Solution)),
			Year:           pStr(string(line.Year)),
		}
		phase := ""
		if line.Phase != nil {
			phase = string(*line.Phase)
		}
		lc.Phase = pStr(phase)

		cost := ""
		if line.Cost != nil {
			cost = strconv.Itoa(*line.Cost)
		}
		lc.Cost = pStr(cost)

		obj.LifecycleCostLines = append(obj.LifecycleCostLines, lc)
	}

	blob, err := json.Marshal(&obj)
	if err != nil {
		return nil, err
	}

	status := wire.IntakeInputStatusInitiated
	if bc.Status == models.BusinessCaseStatusCLOSED {
		status = wire.IntakeInputStatusFinal
	}

	result := &wire.IntakeInput{
		ID:     pStr(bcID),
		Body:   pStr(string(blob)),
		Status: pStr(status),

		// invariants for this type
		BodyFormat: pStr(wire.IntakeInputBodyFormatJSON),
		Type:       pStr(wire.IntakeInputTypeEASIBizCase),
		Schema:     pStr(wire.IntakeInputSchemaEASIBizCaseV01),
	}

	if bc.CreatedAt != nil {
		result.CreatedDate = pDateTime(bc.CreatedAt)
	}
	if bc.UpdatedAt != nil {
		result.LastUpdate = pDateTime(bc.UpdatedAt)
	}

	return result, nil
}
