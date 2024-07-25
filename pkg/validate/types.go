package validate

import (
	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

// RequireNullString checks if it's a valid nullString
func RequireNullString(null null.String) bool {
	return !null.Valid
}

// RequireString checks if it's an empty string
func RequireString(s string) bool {
	return s == ""
}

// RequireUUID checks if it's a zero valued uuid
func RequireUUID(id uuid.UUID) bool {
	return id == uuid.Nil
}

// RequireInt checks if it's not nil
func RequireInt(i *int) bool {
	return i == nil
}

// RequireCostPhase checks if it's not nil
func RequireCostPhase(p *models.LifecycleCostPhase) bool {
	return p == nil
}
