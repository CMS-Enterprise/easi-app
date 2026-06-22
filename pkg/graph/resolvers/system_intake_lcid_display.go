package resolvers

import (
	"strconv"
	"strings"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

// formatLCIDDisplay assembles the backend LCID display string from saved LCID metadata.
// The EASi UI uses this value so admins can quickly identify key LCID details.
// Keeping this formatting in the backend keeps LCID display consistent across views
// and avoids duplicating the same formatting logic in multiple frontend components.
// Example: 123456 - 2026 - OIT - NEW_SYSTEM - SHORTENED - LOW_IT
func formatLCIDDisplay(intake *models.SystemIntake) *string {
	if intake == nil || intake.LifecycleID.ValueOrZero() == "" {
		return nil
	}

	parts := []string{intake.LifecycleID.ValueOrZero()}
	if intake.LifecycleIssuedAt != nil {
		parts = append(parts, strconv.Itoa(intake.LifecycleIssuedAt.Year()))
	}

	if componentLabel := intake.LCIDComponent.LCIDDisplayLabel(); componentLabel != "" {
		parts = append(parts, componentLabel)
	}

	if intake.LCIDType != nil {
		switch *intake.LCIDType {
		case models.LCIDTypeNewSystem:
			parts = append(parts, "NEW_SYSTEM")
		case models.LCIDTypeRecompete:
			parts = append(parts, "RECOMPETE")
		}
	}

	if intake.LCIDIsShortened != nil && *intake.LCIDIsShortened {
		parts = append(parts, "SHORTENED")
	}
	if intake.LCIDIsLowIT != nil && *intake.LCIDIsLowIT {
		parts = append(parts, "LOW_IT")
	}

	display := strings.Join(parts, " - ")
	return &display
}
