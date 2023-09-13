package resolvers

import (
	"time"

	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
)

// CalculateSystemIntakeLCIDStatus calculates the current status of an intake's LCID, if present
func CalculateSystemIntakeLCIDStatus(intake *models.SystemIntake, currentTime time.Time) *model.SystemIntakeLCIDStatus {
	// copies of the constants, declared as local variables instead of constants so we can get pointers to them
	// which we need to return the type expected by gqlgen-generated code (*model.SystemIntakeLCIDStatus instead of model.SystemIntakeLCIDStatus)
	issuedStatus := model.SystemIntakeLCIDStatusIssued
	expiredStatus := model.SystemIntakeLCIDStatusExpired

	if intake == nil || intake.LifecycleID.ValueOrZero() == "" {
		return nil
	}

	// LifecycleExpiresAt should always be non-nil if an LCID has been issued; check just to avoid a panic if there's inconsistent data
	if intake.LifecycleExpiresAt != nil && intake.LifecycleExpiresAt.Before(currentTime) {
		return &expiredStatus
	}

	return &issuedStatus
}
