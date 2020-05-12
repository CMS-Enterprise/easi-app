package validate

import (
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"
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
