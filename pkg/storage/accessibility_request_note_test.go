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
			EUAUserID: testhelpers.RandomEUAID(),
		}

		returnedNote, err := s.store.CreateAccessibilityRequestNote(ctx, &note)
		s.NoError(err)
		s.Equal(note.Note, returnedNote.Note)
		s.Equal(note.RequestID, returnedNote.RequestID)
		s.Equal(note.EUAUserID, returnedNote.EUAUserID)
	})
}

func (s StoreTestSuite) TestFetchAccessibilityRequestsByRequestID() {
	// set up some notes
	ctx := context.Background()
	intake := testhelpers.NewSystemIntake()
	_, err := s.store.CreateSystemIntake(ctx, &intake)
	s.NoError(err)

	accessibilityRequest := testhelpers.NewAccessibilityRequest(intake.ID)
	_, err = s.store.CreateAccessibilityRequest(ctx, &accessibilityRequest)
	s.NoError(err)

	note1 := models.AccessibilityRequestNote{
		Note:      "first test note",
		RequestID: accessibilityRequest.ID,
		EUAUserID: "TADA",
	}

	note2 := models.AccessibilityRequestNote{
		Note:      "next test note",
		RequestID: accessibilityRequest.ID,
		EUAUserID: "BOOO",
	}

	note3 := models.AccessibilityRequestNote{
		Note:      "last created test note",
		RequestID: accessibilityRequest.ID,
		EUAUserID: "HAHA",
	}

	_, err = s.store.CreateAccessibilityRequestNote(ctx, &note1)
	s.NoError(err)
	_, err = s.store.CreateAccessibilityRequestNote(ctx, &note2)
	s.NoError(err)
	_, err = s.store.CreateAccessibilityRequestNote(ctx, &note3)
	s.NoError(err)

	s.Run("fetch accessibility request notes succeeds", func() {
		notes, err := s.store.FetchAccessibilityRequestsByRequestID(ctx, accessibilityRequest.ID)
		s.NoError(err)
		s.Equal(3, len(*notes))
		returnedNotes := *notes
		s.Equal("last created test note", returnedNotes[0].Note)
		s.Equal("HAHA", returnedNotes[0].EUAUserID)
		s.Equal("first test note", returnedNotes[2].Note)
		s.Equal("TADA", returnedNotes[2].EUAUserID)
	})

	s.Run("fetch accessibility request notes for request with no notes succeeds", func() {
		notes, err := s.store.FetchAccessibilityRequestsByRequestID(ctx, uuid.New())
		s.NoError(err)
		s.Equal(0, len(*notes))
	})
}
