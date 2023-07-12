package resolvers

import (
	"errors"
	"time"

	"github.com/cmsgov/easi-app/pkg/models"
)

// SystemIntakeStatusRequesterGet calculates the status to display in the requester view for a System Intake request,
// based on the intake's current step, the state of that step, and the overall intake state (open/closed)
func SystemIntakeStatusRequesterGet(intake *models.SystemIntake, currentTime time.Time) (models.SystemIntakeStatusRequester, error) {
	// TODO - should this possibly return error? presumably, since it can't guarantee the intake it's valid is correct?
	return "", errors.New("not yet implemented")
}
