package lcidactions

import (
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// IsIssueLCIDValid checks if an intake is valid to have an LCID issued for it
func IsIssueLCIDValid(intake *models.SystemIntake) error {
	// as well as checking DecisionState, check LifecycleID to replicate existing logic in pkg/services/system_intakes.go for issuing an LCID
	if intake.DecisionState == models.SIDSLcidIssued || intake.LifecycleID.ValueOrZero() != "" {
		return &apperrors.BadRequestError{
			Err: &apperrors.InvalidActionError{
				ActionType: models.ActionTypeISSUELCID,
				Message:    "LCID already issued for this intake, another LCID can't be issued",
			},
		}
	}

	return nil
}
