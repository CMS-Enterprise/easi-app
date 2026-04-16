package translation

import (
	"context"
	"time"

	"github.com/go-openapi/strfmt"

	wire "github.com/cms-enterprise/easi-app/pkg/cedar/intake/gen/models"
)

// IntakeObject represents a type that can be submitted to the CEDAR Intake API
type IntakeObject interface {
	ObjectID() string
	ObjectType() string
	CreateIntakeModel(context.Context) (*wire.IntakeInput, error)
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

func versionStr(version SchemaVersion) *string {
	return new(string(version))
}

func statusStr(status intakeInputStatus) *string {
	return new(string(status))
}

func typeStr(inputType intakeInputType) *string {
	return new(string(inputType))
}

// pStrfmtDateTime turns a time pointer into a strfmt.DateTime pointer;
// fields with "format": "date-time" in Swagger correspond to *strfmt.DateTime fields in generated code
func pStrfmtDateTime(t *time.Time) *strfmt.DateTime {
	if t == nil {
		return nil
	}

	strfmtDatetime := strfmt.DateTime(*t)
	return &strfmtDatetime
}
