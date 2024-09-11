package storage

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *StoreTestSuite) TestNoteRoundtrip() {
	ctx := context.Background()
	euaID := "ZZZZ"

	// create the SystemIntake that we will operate on for testing Notes
	intake, err := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		RequestType: models.SystemIntakeRequestTypeNEW,
		EUAUserID:   null.StringFrom(euaID),
	})
	s.NoError(err)

	s.NotEqual(uuid.Nil, intake.ID)

	s.Run("create error cases", func() {
		testCases := map[string]*models.SystemIntakeNote{
			"missing system intake foreign key": {
				SystemIntakeID: uuid.Nil,
				AuthorEUAID:    euaID,
			},
			"missing author id": {
				SystemIntakeID: intake.ID,
			},
		}

		for name, tc := range testCases {
			s.Run(name, func() {
				_, err := s.store.CreateSystemIntakeNote(ctx, tc)
				s.Error(err, name)
				s.T().Logf("body: %v\n", err)
			})
		}
	})

	s.Run("create and read", func() {
		notes := map[uuid.UUID]*models.SystemIntakeNote{}

		// populate a set of notes for the given SystemIntake
		for ix := 0; ix < 3; ix++ {
			ts := time.Now().UTC()
			in := &models.SystemIntakeNote{
				SystemIntakeID: intake.ID,
				// CreatedAt:      &ts,
				AuthorEUAID: euaID,
				AuthorName:  null.StringFrom(ts.String()),
				Content:     models.HTMLPointer(ts.String()),
			}

			createdNote, err := s.store.CreateSystemIntakeNote(ctx, in)
			id := createdNote.ID
			s.NoError(err)

			out, err := s.store.FetchSystemIntakeNoteByID(ctx, id)
			s.NoError(err)
			s.Equal(id, out.ID)
			s.Equal(in.SystemIntakeID, out.SystemIntakeID)
			s.Equal(in.AuthorEUAID, out.AuthorEUAID)
			s.Equal(in.AuthorName, out.AuthorName)
			s.Equal(in.Content, out.Content)
			notes[id] = out
		}

		testCases := map[string]struct {
			id    uuid.UUID
			notes map[uuid.UUID]*models.SystemIntakeNote
		}{
			"happy path returnes several notes": {
				id:    intake.ID,
				notes: notes,
			},
			"non-existent system intake returns zero notes": {
				id:    uuid.Nil,
				notes: map[uuid.UUID]*models.SystemIntakeNote{},
			},
		}

		for name, tc := range testCases {
			s.Run(name, func() {
				results, err := s.store.FetchNotesBySystemIntakeID(ctx, tc.id)
				s.NoError(err)

				s.Equal(len(results), len(tc.notes))

				for _, note := range results {
					expected, ok := tc.notes[note.ID]
					s.True(ok)
					s.Equal(expected, note)
				}
			})
		}
	})

	s.Run("Setting a note to be archived sets IsArchived to true and sets ModifiedBy, ModifiedAt", func() {
		ts := time.Now().UTC()

		noteToUpdate := models.SystemIntakeNote{
			SystemIntakeID: intake.ID,
			CreatedAt:      &ts,
			AuthorEUAID:    euaID,
			AuthorName:     null.StringFrom(ts.String()),
			Content:        models.HTMLPointer(ts.String()),
		}

		createdNote, err := s.store.CreateSystemIntakeNote(ctx, &noteToUpdate)

		s.NoError(err)
		s.False(createdNote.IsArchived)

		archivingUser := "SF13"

		noteToUpdate.IsArchived = true
		noteToUpdate.ModifiedBy = &archivingUser
		noteToUpdate.ModifiedAt = &ts

		archivedNote, err := s.store.UpdateSystemIntakeNote(ctx, &noteToUpdate)
		s.NoError(err)

		s.True(archivedNote.IsArchived)
		s.EqualValues(archivingUser, *archivedNote.ModifiedBy)
		s.NotNil(archivedNote.ModifiedAt) // don't care about exact value, just that it was set to *something*
	})

	s.Run("Updating a note sets modified content and sets ModifiedBy, ModifiedAt", func() {
		ts := time.Now().UTC()

		noteToUpdate := models.SystemIntakeNote{
			SystemIntakeID: intake.ID,
			CreatedAt:      &ts,
			AuthorEUAID:    euaID,
			AuthorName:     null.StringFrom(ts.String()),
			Content:        models.HTMLPointer("Test content before update"),
		}

		createdNote, err := s.store.CreateSystemIntakeNote(ctx, &noteToUpdate)

		s.NoError(err)
		s.False(createdNote.IsArchived)

		archivingUser := "SF13"
		noteToUpdate.Content = models.HTMLPointer("Test content after updates")
		noteToUpdate.ModifiedBy = &archivingUser
		noteToUpdate.ModifiedAt = &ts

		updatedNote, err := s.store.UpdateSystemIntakeNote(ctx, &noteToUpdate)
		s.NoError(err)

		s.False(updatedNote.IsArchived)
		s.EqualValues(noteToUpdate.Content, updatedNote.Content)
		s.EqualValues(archivingUser, *updatedNote.ModifiedBy)
		s.NotNil(updatedNote.ModifiedAt) // don't care about exact value, just that it was set to *something*
	})
}
