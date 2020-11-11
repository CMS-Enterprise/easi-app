package storage

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (s StoreTestSuite) TestNoteRoundtrip() {
	ctx := context.Background()
	euaID := "ZZZZ"

	// create the SystemIntake that we will operate on for testing Notes
	intake, err := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		Status:      models.SystemIntakeStatusINTAKEDRAFT,
		RequestType: models.SystemIntakeRequestTypeNEW,
		EUAUserID:   euaID,
	})
	s.NoError(err)

	s.NotEqual(uuid.Nil, intake.ID)

	s.Run("create error cases", func() {
		testCases := map[string]*models.Note{
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
				_, err := s.store.CreateNote(ctx, tc)
				s.Error(err, name)
				s.T().Logf("body: %v\n", err)
			})
		}
	})

	s.Run("create and read", func() {
		notes := map[uuid.UUID]*models.Note{}

		// populate a set of notes for the given SystemIntake
		for ix := 0; ix < 3; ix++ {
			ts := time.Now().UTC()
			in := &models.Note{
				SystemIntakeID: intake.ID,
				// CreatedAt:      &ts,
				AuthorEUAID: euaID,
				AuthorName:  null.StringFrom(ts.String()),
				Content:     null.StringFrom(ts.String()),
			}

			createdNote, err := s.store.CreateNote(ctx, in)
			id := createdNote.ID
			s.NoError(err)

			out, err := s.store.FetchNoteByID(ctx, id)
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
			notes map[uuid.UUID]*models.Note
		}{
			"happy path returnes several notes": {
				id:    intake.ID,
				notes: notes,
			},
			"non-existent system intake returns zero notes": {
				id:    uuid.Nil,
				notes: map[uuid.UUID]*models.Note{},
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
}
