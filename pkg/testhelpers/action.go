package testhelpers

import (
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
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
		Feedback:       models.HTMLPointer("Test Feedback"),
		CreatedAt:      &now,
	}
}
