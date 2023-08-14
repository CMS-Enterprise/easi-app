package decision

import (
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// IsIntakeValid does a thing
// TODO - change comment
func IsIntakeValid(intake *models.SystemIntake) error {
	if intake.State != models.SystemIntakeStateCLOSED {
		return &apperrors.BadRequestError{
			Err: &apperrors.InvalidActionError{
				ActionType: models.ActionTypeREOPENORCHANGEDECISION,
				Message:    "Can't take Reopen or Change Decision action on intakes that aren't closed",
			},
		}
	}

	// 2. if changing decision (don't check this if reopening), new resolution must not == current resolution (.DecisionState)
	// 3. if changing decision, can't go to closed with no reason (represented by .State == Closed && .DecisionState == NO_DECISION)

	return nil
}

// UpdateIntakeDecision does a thing
// TODO - change comment
func UpdateIntakeDecision(intake *models.SystemIntake) error {
	// TODO - implement
	return nil
}
