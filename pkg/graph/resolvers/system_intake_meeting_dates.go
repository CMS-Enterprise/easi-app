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
	earliest := lo.Earliest(actualDates...)

	return &earliest
}

func SystemIntakeLastMeetingDate(ctx context.Context, obj *models.SystemIntake, now time.Time) *time.Time {
	// Construct a slice of potential dates to consider
	potentialDates := []*time.Time{
		obj.GRBDate,
		obj.GRTDate,
	}

	// Use lo.FilterMap to do 2 critical things:
	// 1) Filter out any nil/zero values from the slice
	// 2) Filters out anything not in the past
	actualDates := lo.FilterMap(potentialDates, func(t *time.Time, _ int) (time.Time, bool) {
		if t != nil && !t.IsZero() && t.Before(now) {
			return *t, true
		}
		return time.Time{}, false
	})

	// If there's nothing left after the filter operation, there's no Next Meeting Date
	if len(actualDates) == 0 {
		return nil
	}

	// Find the latest date from the remaining dates
	latest := lo.Latest(actualDates...)

	return &latest
}
