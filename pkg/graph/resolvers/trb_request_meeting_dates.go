package resolvers

import (
	"context"
	"time"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func TRBRequestNextMeetingDate(ctx context.Context, obj *models.TRBRequest, now time.Time) *time.Time {
	// There's only one date to consider for TRBRequest, so just return it!
	// This function only really exists to match the signature/style of the System Intake version, but will
	// allow for easier future expansion if needed.
	if obj.ConsultMeetingTime != nil && !obj.ConsultMeetingTime.IsZero() && obj.ConsultMeetingTime.After(now) {
		return obj.ConsultMeetingTime
	}

	return nil
}

func TRBRequestLastMeetingDate(ctx context.Context, obj *models.TRBRequest, now time.Time) *time.Time {
	// There's only one date to consider for TRBRequest, so just return it!
	// This function only really exists to match the signature/style of the System Intake version, but will
	// allow for easier future expansion if needed.
	if obj.ConsultMeetingTime != nil && !obj.ConsultMeetingTime.IsZero() && obj.ConsultMeetingTime.Before(now) {
		return obj.ConsultMeetingTime
	}

	return nil
}
