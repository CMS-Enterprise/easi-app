package cedarcoremock

import (
	"github.com/guregu/null/zero"

	"github.com/cmsgov/easi-app/pkg/models"
)

var mockThreats = []*models.CedarThreat{
	{
		AlternativeID:     zero.StringFrom("altID1"),
		ControlFamily:     zero.StringFrom("System and Services Acquisition"),
		DaysOpen:          1,
		ID:                zero.StringFrom("threat1"),
		ParentID:          zero.StringFrom("{11AB1A00-1234-5678-ABC1-1A001B00CC0A}"),
		Type:              zero.StringFrom("POA&M"),
		WeaknessRiskLevel: zero.StringFrom("Critical"),
	},
	{
		AlternativeID:     zero.StringFrom("altID2"),
		ControlFamily:     zero.StringFrom("Security Assessment and Authorization"),
		DaysOpen:          2,
		ID:                zero.StringFrom("threat2"),
		ParentID:          zero.StringFrom("{11AB1A00-1234-5678-ABC1-1A001B00CC1B}"),
		Type:              zero.StringFrom("POA&M"),
		WeaknessRiskLevel: zero.StringFrom("High"),
	},
	{
		AlternativeID:     zero.StringFrom("altID3"),
		ControlFamily:     zero.StringFrom("Contingency Planning"),
		DaysOpen:          3,
		ID:                zero.StringFrom("threat3"),
		ParentID:          zero.StringFrom("{11AB1A00-1234-5678-ABC1-1A001B00CC2C}"),
		Type:              zero.StringFrom("POA&M"),
		WeaknessRiskLevel: zero.StringFrom("Moderate"),
	},
	{
		AlternativeID:     zero.StringFrom("altID4"),
		ControlFamily:     zero.StringFrom("Access Control"),
		DaysOpen:          4,
		ID:                zero.StringFrom("threat4"),
		ParentID:          zero.StringFrom("{11AB1A00-1234-5678-ABC1-1A001B00CC3D}"),
		Type:              zero.StringFrom("POA&M"),
		WeaknessRiskLevel: zero.StringFrom("Low"),
	},
	{
		AlternativeID:     zero.StringFrom("altID5"),
		ControlFamily:     zero.StringFrom("Awareness and Training"),
		DaysOpen:          5,
		ID:                zero.StringFrom("threat5"),
		ParentID:          zero.StringFrom("{11AB1A00-1234-5678-ABC1-1A001B00CC4E}"),
		Type:              zero.StringFrom("POA&M"),
		WeaknessRiskLevel: zero.StringFrom("Not Rated"),
	},
}

func GetThreats() []*models.CedarThreat {
	return mockThreats
}
