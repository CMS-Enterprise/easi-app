package intake

import (
	"context"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/go-openapi/strfmt"
	"github.com/guregu/null"
	"github.com/hashicorp/go-multierror"

	wire "github.com/cmsgov/easi-app/pkg/cedar/intake/gen/models"
)

const iso8601 = "2006-01-02 15:04:05Z07:00"

// pStr is a quick helper for turning a string into a string-pointer
// inline, without having to clutter your mainline code with the
// indirection, e.g. when building a type and assigning properties
func pStr(s string) *string {
	return &s
}

// pDate turns a Time pointer into either an empty string in the
// negative case, or to a whole day string in CEDAR's preferred
// ISO8601 format, e.g. "2006-01-02"
func pDate(t *time.Time) *string {
	val := ""
	if t != nil {
		val = strfmt.Date(*t).String()
	}
	return pStr(val)
}

// pDate turns a Time pointer into either an empty string in the
// negative case, or to a string rin CEDAR's preferred
// ISO8601 format, e.g. "2006-01-02 15:04:05Z"
func pDateTime(t *time.Time) *string {
	val := ""
	if t != nil {
		// val = strfmt.DateTime(*t).String()
		val = t.UTC().Format(iso8601)
	}
	return pStr(val)
}

// pBool turns a nullable boolean into a string, using the empty
// string to represent the un-set case, or "true" or "false"
// otherwise
func pBool(b null.Bool) *string {
	val := ""
	if b.Ptr() != nil {
		val = strconv.FormatBool(b.Bool)
	}
	return pStr(val)
}

type validater interface {
	Validate(strfmt.Registry) error
}

// validateInputs ensures each of the payload bodies that we build are fully
// adhering to the schema requirements
func validateInputs(c context.Context, iis []*wire.IntakeInput) error {
	var errs *multierror.Error
	for _, ii := range iis {
		if err := validateInput(c, ii); err != nil {
			errs = multierror.Append(errs, err)
		}
	}
	return errs.ErrorOrNil()
}

func validateInput(_ context.Context, ii *wire.IntakeInput) error {
	if ii == nil {
		return fmt.Errorf("nil IntakeInput disallowed")
	}

	inID := "n/a"
	if ii.ID != nil {
		inID = *ii.ID
	}
	inType := "n/a"
	if ii.Type != nil {
		inType = *ii.Type
	}
	ePrefix := fmt.Sprintf("id:%s type:%s", inID, inType)
	if err := ii.Validate(strfmt.Default); err != nil {
		return fmt.Errorf("%s: %w", ePrefix, err)
	}

	inSchema := *ii.Schema
	if !strings.HasPrefix(inSchema, inType) {
		return fmt.Errorf("%s: schema disagreement: %s", ePrefix, inSchema)
	}

	var v validater
	switch inSchema {
	case wire.IntakeInputSchemaEASIActionV01:
		v = &wire.EASIAction{}
	case wire.IntakeInputSchemaEASIBizCaseV01:
		v = &wire.EASIBizCase{}
	case wire.IntakeInputSchemaEASIGrtFeedbackV01:
		v = &wire.EASIGrtFeedback{}
	case wire.IntakeInputSchemaEASIIntakeV01:
		v = &wire.EASIIntake{}
	case wire.IntakeInputSchemaEASILifecycleCostV01:
		v = &wire.EASILifecycleCost{}
	case wire.IntakeInputSchemaEASINoteV01:
		v = &wire.EASINote{}
	default:
		return fmt.Errorf("unrecognized schema: %s", inSchema)
	}

	body := *ii.Body
	if err := json.Unmarshal([]byte(body), v); err != nil {
		return fmt.Errorf("%s: %w", ePrefix, err)
	}
	if err := v.Validate(strfmt.Default); err != nil {
		return fmt.Errorf("%s: %w", ePrefix, err)
	}

	return nil
}
