package resolvers

import (
	"time"

	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
)

// CalculateSystemIntakeLCIDStatus calculates the current status of an intake's LCID, if present
// TODO - is there actually a possibility that this can return an error?
func CalculateSystemIntakeLCIDStatus(intake *models.SystemIntake, currentTime time.Time) (*model.SystemIntakeLCIDStatus, error) {
	panic("not implemented")
}
