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

		PreferredTitle:                   pStr(bc.PreferredTitle.ValueOrZero()),
		PreferredSummary:                 pStr(bc.PreferredSummary.ValueOrZero()),
		PreferredAcquisitionApproach:     pStr(bc.PreferredAcquisitionApproach.ValueOrZero()),
		PreferredSecurityIsApproved:      pBool(bc.PreferredSecurityIsApproved),
		PreferredSecurityIsBeingReviewed: pStr(bc.PreferredSecurityIsBeingReviewed.ValueOrZero()),
		PreferredHostingType:             pStr(bc.PreferredHostingType.ValueOrZero()),
		PreferredHostingLocation:         pStr(bc.PreferredHostingLocation.ValueOrZero()),
		PreferredHostingCloudServiceType: pStr(bc.PreferredHostingCloudServiceType.ValueOrZero()),
		PreferredHasUI:                   pStr(bc.PreferredHasUI.ValueOrZero()),
		PreferredPros:                    pStr(bc.PreferredPros.ValueOrZero()),
		PreferredCons:                    pStr(bc.PreferredCons.ValueOrZero()),
		PreferredCostSavings:             pStr(bc.PreferredCostSavings.ValueOrZero()),

		AlternativeATitle:                   pStr(bc.AlternativeATitle.ValueOrZero()),
		AlternativeASummary:                 pStr(bc.AlternativeASummary.ValueOrZero()),
		AlternativeAAcquisitionApproach:     pStr(bc.AlternativeAAcquisitionApproach.ValueOrZero()),
		AlternativeASecurityIsApproved:      pBool(bc.AlternativeASecurityIsApproved),
		AlternativeASecurityIsBeingReviewed: pStr(bc.AlternativeASecurityIsBeingReviewed.ValueOrZero()),
		AlternativeAHostingType:             pStr(bc.AlternativeAHostingType.ValueOrZero()),
		AlternativeAHostingLocation:         pStr(bc.AlternativeAHostingLocation.ValueOrZero()),
		AlternativeAHostingCloudServiceType: pStr(bc.AlternativeAHostingCloudServiceType.ValueOrZero()),
		AlternativeAHasUI:                   pStr(bc.AlternativeAHasUI.ValueOrZero()),
		AlternativeAPros:                    pStr(bc.AlternativeAPros.ValueOrZero()),
		AlternativeACons:                    pStr(bc.AlternativeACons.ValueOrZero()),
		AlternativeACostSavings:             pStr(bc.AlternativeACostSavings.ValueOrZero()),

		AlternativeBTitle:                   pStr(bc.AlternativeBTitle.ValueOrZero()),
		AlternativeBSummary:                 pStr(bc.AlternativeBSummary.ValueOrZero()),
		AlternativeBAcquisitionApproach:     pStr(bc.AlternativeBAcquisitionApproach.ValueOrZero()),
		AlternativeBSecurityIsApproved:      pBool(bc.AlternativeBSecurityIsApproved),
		AlternativeBSecurityIsBeingReviewed: pStr(bc.AlternativeBSecurityIsBeingReviewed.ValueOrZero()),
		AlternativeBHostingType:             pStr(bc.AlternativeBHostingType.ValueOrZero()),
		AlternativeBHostingLocation:         pStr(bc.AlternativeBHostingLocation.ValueOrZero()),
		AlternativeBHostingCloudServiceType: pStr(bc.AlternativeBHostingCloudServiceType.ValueOrZero()),
		AlternativeBHasUI:                   pStr(bc.AlternativeBHasUI.ValueOrZero()),
		AlternativeBPros:                    pStr(bc.AlternativeBPros.ValueOrZero()),
		AlternativeBCons:                    pStr(bc.AlternativeBCons.ValueOrZero()),
		AlternativeBCostSavings:             pStr(bc.PreferredCostSavings.ValueOrZero()),

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
