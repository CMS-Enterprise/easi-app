package testhelpers

import (
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/models"
)

// NewAction generates an action to use in tests
func NewAction() models.Action {
	now := time.Now().UTC()
	return models.Action{
		ID:             uuid.New(),
		IntakeID:       nil,
		ActionType:     models.ActionTypeSUBMITINTAKE,
		ActorName:      "Fake Name",
		ActorEmail:     "fake@test.com",
		ActorEUAUserID: "ABCD",
		Feedback:       null.StringFrom("Test Feedback"),
		CreatedAt:      &now,
	}
}
