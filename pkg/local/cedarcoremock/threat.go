package cedarcoremock

import (
	"github.com/guregu/null/zero"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

var mockThreats = []*models.CedarThreat{
	{
		AlternativeID:     zero.StringFrom("12345"),
		ControlFamily:     zero.StringFrom("System and Services Acquisition"),
		DaysOpen:          1,
		ID:                zero.StringFrom("{11AB1A00-1234-5678-ABC1-1A001B00CC0A}"),
		ParentID:          zero.StringFrom("{11AB1A00-1234-5678-ABC1-1A001B00CC0A}"),
		Type:              zero.StringFrom("POA&M"),
		WeaknessRiskLevel: zero.StringFrom("Critical"),
	},
	{
		AlternativeID:     zero.StringFrom("54321"),
		ControlFamily:     zero.StringFrom("Security Assessment and Authorization"),
		DaysOpen:          2,
		ID:                zero.StringFrom("{11AB1A00-1234-5678-ABC1-1A001B00CC1B}"),
		ParentID:          zero.StringFrom("{11AB1A00-1234-5678-ABC1-1A001B00CC1B}"),
		Type:              zero.StringFrom("POA&M"),
		WeaknessRiskLevel: zero.StringFrom("High"),
	},
	{
		AlternativeID:     zero.StringFrom("67890"),
		ControlFamily:     zero.StringFrom("Contingency Planning"),
		DaysOpen:          3,
		ID:                zero.StringFrom("{11AB1A00-1234-5678-ABC1-1A001B00CC2C}"),
		ParentID:          zero.StringFrom("{11AB1A00-1234-5678-ABC1-1A001B00CC2C}"),
		Type:              zero.StringFrom("POA&M"),
		WeaknessRiskLevel: zero.StringFrom("Moderate"),
	},
	{
		AlternativeID:     zero.StringFrom("09876"),
		ControlFamily:     zero.StringFrom("Access Control"),
		DaysOpen:          4,
		ID:                zero.StringFrom("{11AB1A00-1234-5678-ABC1-1A001B00CC3D}"),
		ParentID:          zero.StringFrom("{11AB1A00-1234-5678-ABC1-1A001B00CC3D}"),
		Type:              zero.StringFrom("POA&M"),
		WeaknessRiskLevel: zero.StringFrom("Low"),
	},
	{
		AlternativeID:     zero.StringFrom("24680"),
		ControlFamily:     zero.StringFrom("Awareness and Training"),
		DaysOpen:          5,
		ID:                zero.StringFrom("{11AB1A00-1234-5678-ABC1-1A001B00CC4E}"),
		ParentID:          zero.StringFrom("{11AB1A00-1234-5678-ABC1-1A001B00CC4E}"),
		Type:              zero.StringFrom("POA&M"),
		WeaknessRiskLevel: zero.StringFrom("Not Rated"),
	},
}

func GetThreats() []*models.CedarThreat {
	return mockThreats
}
