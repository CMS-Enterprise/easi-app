package translation

import (
	"strconv"
	"time"

	"github.com/go-openapi/strfmt"
	"github.com/guregu/null"

	wire "github.com/cmsgov/easi-app/pkg/cedar/intake/gen/models"
)

// IntakeObject represents a type that can be submitted to the CEDAR Intake API
type IntakeObject interface {
	ObjectID() string
	ObjectType() string
	CreateIntakeModel() (*wire.IntakeInput, error)
}

func strDate(t *time.Time) string {
	str := ""
	if t != nil {
		str = strfmt.Date(*t).String()
	}
	return str
}

// strDateTime turns a nil Time pointer into an empty string,
// or a non-nil pointer into a ISO8601-format string, e.g. "2006-01-02T15:04:05Z"
func strDateTime(t *time.Time) string {
	str := ""
	if t != nil {
		str = t.UTC().Format(time.RFC3339)
	}
	return str
}

// pBool turns a nullable boolean into a string, using the empty
// string to represent the un-set case, or "true" or "false" otherwise
func strNullableBool(b null.Bool) string {
	str := ""
	if b.Ptr() != nil {
		str = strconv.FormatBool(b.Bool)
	}
	return str
}

// pStr is a quick helper for turning a string into a string-pointer
// inline, without having to clutter your mainline code with the
// indirection, e.g. when building a type and assigning properties
func pStr(s string) *string {
	return &s
}

func versionStr(version SchemaVersion) *string {
	return pStr(string(version))
}

// pDate turns a Time pointer into either an empty string in the
// negative case, or to a string rin CEDAR's preferred
// ISO8601 format, e.g. "2006-01-02T15:04:05Z"
func pDateTime(t *time.Time) *string {
	val := ""
	if t != nil {
		// val = strfmt.DateTime(*t).String()
		val = t.UTC().Format(time.RFC3339)
	}
	return pStr(val)
}
