package storage

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/testhelpers"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (s StoreTestSuite) TestCreateAccessibilityRequestNote() {
	ctx := context.Background()
	intake := testhelpers.NewSystemIntake()
	_, err := s.store.CreateSystemIntake(ctx, &intake)
	s.NoError(err)

	accessibilityRequest := testhelpers.NewAccessibilityRequest(intake.ID)
	_, err = s.store.CreateAccessibilityRequest(ctx, &accessibilityRequest)
	s.NoError(err)

	s.Run("create an accessibility request note succeeds", func() {

		note := models.AccessibilityRequestNote{
			Note:      "test note",
			RequestID: accessibilityRequest.ID,
		}

		returnedNote, err := s.store.CreateAccessibilityRequestNote(ctx, &note)
		s.NoError(err)
		s.Equal(note.Note, returnedNote.Note)
		s.Equal(note.RequestID, returnedNote.RequestID)
	})
}
