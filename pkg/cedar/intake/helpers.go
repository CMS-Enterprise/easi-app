package intake

import (
	"strconv"
	"time"

	"github.com/go-openapi/strfmt"
	"github.com/guregu/null"
)

const iso8601 = "2006-01-02 15:04:05Z07:00"

func pStr(s string) *string {
	return &s
}

func pDate(t *time.Time) *string {
	val := ""
	if t != nil {
		val = strfmt.Date(*t).String()
	}
	return pStr(val)
}

func pDateTime(t *time.Time) *string {
	val := ""
	if t != nil {
		// val = strfmt.DateTime(*t).String()
		val = t.Format(iso8601)
	}
	return pStr(val)
}

func pBool(b null.Bool) *string {
	val := ""
	if b.Ptr() != nil {
		val = strconv.FormatBool(b.Bool)
	}
	return pStr(val)
}
