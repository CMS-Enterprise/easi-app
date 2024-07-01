package testhelpers

import (
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

// NewNote generates a note to use in tests
func NewNote() models.SystemIntakeNote {
	now := time.Now().UTC()
	return models.SystemIntakeNote{
		ID:          uuid.New(),
		CreatedAt:   &now,
		AuthorEUAID: "ABCDE",
		AuthorName:  null.StringFrom("Fake Name"),
		Content:     models.HTMLPointer("Fake Content"),
	}
}
