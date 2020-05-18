package validate

import (
	"github.com/cmsgov/easi-app/pkg/models"
)

// CheckUniqLifecycleCosts checks if it's a valid nullBool
func CheckUniqLifecycleCosts(costs models.EstimatedLifecycleCosts) bool {
	costMap := map[string]bool{}

	for _, cost := range costs {
		attribute := string(cost.Solution) + string(cost.Year) + string(cost.Phase)
		if costMap[attribute] {
			return false
		}
		costMap[attribute] = true
	}
	return true
}