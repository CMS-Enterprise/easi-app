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
	if !null.Valid {
		return true
	}
	return false
}

// RequireNullString checks if it's a valid nullString
func RequireNullString(null null.String) bool {
	if !null.Valid {
		return true
	}
	return false
}

// RequireString checks if it's an empty string
func RequireString(s string) bool {
	if s == "" {
		return true
	}
	return false
}

// RequireTime checks if it's a zero time
func RequireTime(t time.Time) bool {
	if t.IsZero() {
		return true
	}
	return false
}

// RequireUUID checks if it's a zero valued uuid
func RequireUUID(id uuid.UUID) bool {
	if id == uuid.Nil {
		return true
	}
	return false
}

// RequireInt checks if it's not nil
func RequireInt(i *int) bool {
	if i == nil {
		return true
	}
	return false
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
	if p == nil {
		return true
	}
	return false
}
