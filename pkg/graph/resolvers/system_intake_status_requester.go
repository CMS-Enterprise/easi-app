package resolvers

import (
	"errors"

	"github.com/cmsgov/easi-app/pkg/models"
)

// SystemIntakeStatusRequesterGet calculates the status to display in the requester view for a System Intake request,
// based on the intake's current step, the state of that step, and the overall intake state (open/closed)
func SystemIntakeStatusRequesterGet(intake *models.SystemIntake) (models.SystemIntakeStatusRequester, error) {
	return "", errors.New("not yet implemented")
}
