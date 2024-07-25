package resolvers

import (
	"context"
	"time"

	"github.com/samber/lo"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func SystemIntakeNextMeetingDate(ctx context.Context, obj *models.SystemIntake, now time.Time) *time.Time {
	// Construct a slice of potential dates to consider
	potentialDates := []*time.Time{
		obj.GRBDate,
		obj.GRTDate,
	}

	// Use lo.FilterMap to do 2 critical things:
	// 1) Filter out any nil/zero values from the slice
	// 2) Filters out anything not in the future
	actualDates := lo.FilterMap(potentialDates, func(t *time.Time, _ int) (time.Time, bool) {
		if t != nil && !t.IsZero() && t.After(now) {
			return *t, true
		}
		return time.Time{}, false
	})

	// If there's nothing left after the filter operation, there's no Next Meeting Date
	if len(actualDates) == 0 {
		return nil
	}

	// Find the earliest date from the remaining dates
	earliest := lo.MinBy(actualDates, func(t1 time.Time, t2 time.Time) bool {
		return t1.Before(t2)
	})

	return &earliest
}

func TRBRequestNextMeetingDate(ctx context.Context, obj *models.TRBRequest, now time.Time) *time.Time {
	// There's only one date to consider for TRBRequest, so just return it!
	// This function only really exists to match the signature/style of the System Intake version, but will
	// allow for easier future expansion if needed.
	if obj.ConsultMeetingTime != nil && !obj.ConsultMeetingTime.IsZero() && obj.ConsultMeetingTime.After(now) {
		return obj.ConsultMeetingTime
	}

	return nil
}
