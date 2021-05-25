package validate

import (
	"regexp"
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/models"
)

// RequireNullBool checks if it's a valid nullBool
func RequireNullBool(null null.Bool) bool {
	return !null.Valid
}

// RequireNullString checks if it's a valid nullString
func RequireNullString(null null.String) bool {
	return !null.Valid
}

// RequireString checks if it's an empty string
func RequireString(s string) bool {
	return s == ""
}

// RequireTime checks if it's a zero time
func RequireTime(t time.Time) bool {
	return t.IsZero()
}

// RequireUUID checks if it's a zero valued uuid
func RequireUUID(id uuid.UUID) bool {
	return id == uuid.Nil
}

// RequireInt checks if it's not nil
func RequireInt(i *int) bool {
	return i == nil
}

// FundingNumberInvalid checks if it's a six digit string
func FundingNumberInvalid(fundingNumber string) bool {
	re := regexp.MustCompile(`[0-9]{6}`)
	if re.MatchString(fundingNumber) && (len(fundingNumber) == 6) {
		return false
	}
	return true
}

// RequireCostPhase checks if it's not nil
func RequireCostPhase(p *models.LifecycleCostPhase) bool {
	return p == nil
}
