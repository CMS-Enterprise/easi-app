package resolvers

import (
	"slices"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *ResolverSuite) TestSystemIntakeNotes() {
	ctx := s.testConfigs.Context
	store := s.testConfigs.Store
	var intake *models.SystemIntake
	var notes []*models.SystemIntakeNote

	s.Run("create intake", func() {
		intake = s.createNewIntake()
	})
	s.Run("intake should be noteless", func() {
		fetchedNotes, err := SystemIntakeNotes(s.ctxWithNewDataloaders(), intake)
		s.NoError(err)
		s.Empty(fetchedNotes)
	})
	s.Run("create notes and add to intake", func() {
		reviewerEUA := "ABCD"
		userAcct := s.getOrCreateUserAcct(reviewerEUA)

		note, err := CreateSystemIntakeNote(ctx, store, models.CreateSystemIntakeNoteInput{
			IntakeID:   intake.ID,
			Content:    models.HTML("Rubber Baby Buggy Bumpers"),
			AuthorName: userAcct.Username,
		})
		s.NoError(err)
		notes = append(notes, note)
		note, err = CreateSystemIntakeNote(ctx, store, models.CreateSystemIntakeNoteInput{
			IntakeID:   intake.ID,
			Content:    models.HTML("Sally Sells Sea Shells"),
			AuthorName: userAcct.Username,
		})
		s.NoError(err)
		notes = append(notes, note)
		s.NotEmpty(notes)
		s.Len(notes, 2)
	})
	s.Run("intake should have added notes", func() {
		fetchedNotes, err := SystemIntakeNotes(s.ctxWithNewDataloaders(), intake)
		s.NoError(err)
		s.Len(fetchedNotes, 2)
		for _, note := range fetchedNotes {
			s.True(slices.ContainsFunc(notes, func(n *models.SystemIntakeNote) bool {
				return note.ID == n.ID
			}))
		}
	})
	s.Run("should update a note", func() {
		note := notes[0]
		newContent := "Peter Piper Picked a Peck of Pickled Peppers"
		updatedNote, err := UpdateSystemIntakeNote(ctx, store, s.fetchUserInfoStub, models.UpdateSystemIntakeNoteInput{
			ID:         note.ID,
			Content:    models.HTML(newContent),
			IsArchived: false,
		})
		s.NoError(err)
		s.Equal(updatedNote.ID, note.ID)
		s.False(updatedNote.IsArchived)
		s.Equal(updatedNote.Content.ValueOrEmptyString(), newContent)
	})
	s.Run("should archive a note", func() {
		note := notes[0]
		updatedNote, err := UpdateSystemIntakeNote(ctx, store, s.fetchUserInfoStub, models.UpdateSystemIntakeNoteInput{
			ID:         note.ID,
			Content:    *note.Content,
			IsArchived: true,
		})
		s.NoError(err)
		s.Equal(updatedNote.ID, note.ID)
		s.True(updatedNote.IsArchived)
		s.Equal(updatedNote.Content.ValueOrEmptyString(), note.Content.ValueOrEmptyString())
	})
	s.Run("archived notes shouldn't be fetched", func() {
		fetchedNotes, err := SystemIntakeNotes(s.ctxWithNewDataloaders(), intake)
		s.NoError(err)
		s.Len(fetchedNotes, 1)
		// note[0] was archived
		s.Equal(fetchedNotes[0].ID, notes[1].ID)
	})
}
