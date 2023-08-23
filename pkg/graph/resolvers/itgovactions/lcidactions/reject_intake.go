package lcidactions

import (
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// IsRejectIntakeValid checks if an intake is valid to be Not Approved by GRB
// Issuing this decision is valid in all steps
// Issuing this decision is valid both when an intake is open and when it's closed (in the latter case, it's changing the decision)
// Even if a rejection decision has already been issued, an admin can confirm that decision on a reopened intake through this action
func IsRejectIntakeValid(intake *models.SystemIntake) error {
	if intake.State == models.SystemIntakeStateCLOSED && intake.DecisionState == models.SIDSNotApproved {
		return &apperrors.BadRequestError{
			Err: &apperrors.InvalidActionError{
				ActionType: models.ActionTypeISSUELCID,
				Message:    "Intake already closed as Not Approved",
			},
		}
	}

	return nil
}
