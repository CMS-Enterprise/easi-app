package testhelpers

import (
	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/models"
)

// NewAction generates an action to use in tests
func NewAction() models.Action {
	return models.Action{
		IntakeID:       nil,
		ActionType:     models.ActionTypeSUBMITINTAKE,
		ActorName:      "Fake Name",
		ActorEmail:     "fake@test.com",
		ActorEUAUserID: "ABCD",
		Feedback:       null.StringFrom("Test Feedback"),
	}
}
