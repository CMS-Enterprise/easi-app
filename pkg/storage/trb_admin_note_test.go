package storage

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *StoreTestSuite) TestTRBAdminNoteStoreMethods() {
	ctx := context.Background()
	anonEUA := "ANON"

	s.Run("Creating an admin note returns a non-archived admin note with the passed-in data", func() {
		trbRequestID := createTRBRequest(ctx, s, anonEUA)

		category := models.TRBAdminNoteCategoryAdviceLetter
		noteText := "Creation test"
		noteToCreate := models.TRBAdminNote{
			Category: category,
			NoteText: noteText,
		}
		noteToCreate.TRBRequestID = trbRequestID
		noteToCreate.CreatedBy = anonEUA

		createdNote, err := s.store.CreateTRBAdminNote(ctx, &noteToCreate)
		s.NoError(err)
		s.EqualValues(trbRequestID, createdNote.TRBRequestID)
		s.EqualValues(anonEUA, createdNote.CreatedBy)
		s.EqualValues(category, createdNote.Category)
		s.EqualValues(noteText, createdNote.NoteText)
		s.False(createdNote.IsArchived)
	})

	s.Run("Creating, then fetching a note by TRB request ID returns the created note", func() {
		trbRequestID := createTRBRequest(ctx, s, anonEUA)
		category := models.TRBAdminNoteCategoryConsultSession
		noteText := "Creation, then fetch by TRB request ID test"
		noteToCreate := models.TRBAdminNote{
			Category: category,
			NoteText: noteText,
		}
		noteToCreate.TRBRequestID = trbRequestID
		noteToCreate.CreatedBy = anonEUA

		_, err := s.store.CreateTRBAdminNote(ctx, &noteToCreate)
		s.NoError(err)

		fetchedNotes, err := s.store.GetTRBAdminNotesByTRBRequestID(ctx, trbRequestID)
		s.NoError(err)

		s.Len(fetchedNotes, 1)
		fetchedNote := fetchedNotes[0]
		s.EqualValues(trbRequestID, fetchedNote.TRBRequestID)
		s.EqualValues(anonEUA, fetchedNote.CreatedBy)
		s.EqualValues(category, fetchedNote.Category)
		s.EqualValues(noteText, fetchedNote.NoteText)
		s.False(fetchedNote.IsArchived)
	})

	s.Run("Creating, then fetching a note by note ID returns the created note", func() {
		trbRequestID := createTRBRequest(ctx, s, anonEUA)
		category := models.TRBAdminNoteCategoryGeneralRequest
		noteText := "Creation, then fetch by note ID test"
		noteToCreate := models.TRBAdminNote{
			Category: category,
			NoteText: noteText,
		}
		noteToCreate.TRBRequestID = trbRequestID
		noteToCreate.CreatedBy = anonEUA

		createdNote, err := s.store.CreateTRBAdminNote(ctx, &noteToCreate)
		s.NoError(err)

		fetchedNote, err := s.store.GetTRBAdminNoteByID(ctx, createdNote.ID)
		s.NoError(err)

		s.EqualValues(trbRequestID, fetchedNote.TRBRequestID)
		s.EqualValues(anonEUA, fetchedNote.CreatedBy)
		s.EqualValues(category, fetchedNote.Category)
		s.EqualValues(noteText, fetchedNote.NoteText)
		s.False(fetchedNote.IsArchived)
	})

	s.Run("Creating two notes with the same TRB request ID, then fetching notes by TRB request ID, returns both different notes", func() {
		trbRequestID := createTRBRequest(ctx, s, anonEUA)

		category1 := models.TRBAdminNoteCategoryInitialRequestForm
		noteText1 := "Creating two notes, then fetch by TRB request ID test (note 1)"
		author1 := "ABCD"
		noteToCreate1 := models.TRBAdminNote{
			Category: category1,
			NoteText: noteText1,
		}
		noteToCreate1.TRBRequestID = trbRequestID
		noteToCreate1.CreatedBy = author1

		// make sure category2, noteText2, author2 are all distinct from category1, noteText1, author1
		category2 := models.TRBAdminNoteCategoryAdviceLetter
		noteText2 := "Creating two notes, then fetch by TRB request ID test (note 2)"
		author2 := "GRTB"
		noteToCreate2 := models.TRBAdminNote{
			Category: category2,
			NoteText: noteText2,
		}
		noteToCreate2.TRBRequestID = trbRequestID
		noteToCreate2.CreatedBy = author2

		_, err := s.store.CreateTRBAdminNote(ctx, &noteToCreate1)
		s.NoError(err)
		_, err = s.store.CreateTRBAdminNote(ctx, &noteToCreate2)
		s.NoError(err)

		fetchedNotes, err := s.store.GetTRBAdminNotesByTRBRequestID(ctx, trbRequestID)
		s.NoError(err)

		s.Len(fetchedNotes, 2)
		fetchedNote1 := fetchedNotes[0] // may not be noteToCreate1; order is undefined
		fetchedNote2 := fetchedNotes[1] // may not be noteToCreate2; order is undefined

		s.NotEqualValues(fetchedNote1.ID, fetchedNote2.ID)
		s.NotEqualValues(fetchedNote1.CreatedBy, fetchedNote2.CreatedBy)
		s.NotEqualValues(fetchedNote1.Category, fetchedNote2.Category)
		s.NotEqualValues(fetchedNote1.NoteText, fetchedNote2.NoteText)
	})

	s.Run("Updating a note returns a note with updated data and sets ModifiedBy, ModifiedAt", func() {
		trbRequestID := createTRBRequest(ctx, s, anonEUA)
		initialCategory := models.TRBAdminNoteCategoryGeneralRequest
		initialNoteText := "Update note test (initial)"
		noteToCreate := models.TRBAdminNote{
			Category: initialCategory,
			NoteText: initialNoteText,
		}
		noteToCreate.TRBRequestID = trbRequestID
		noteToCreate.CreatedBy = anonEUA

		noteToUpdate, err := s.store.CreateTRBAdminNote(ctx, &noteToCreate)
		s.NoError(err)

		updatedCategory := models.TRBAdminNoteCategoryAdviceLetter
		updatedNoteText := "Update note test (updated)"
		updatingUser := "USR1"

		noteToUpdate.Category = updatedCategory
		noteToUpdate.NoteText = updatedNoteText
		noteToUpdate.ModifiedBy = &updatingUser

		updatedNote, err := s.store.UpdateTRBAdminNote(ctx, noteToUpdate)
		s.NoError(err)

		s.EqualValues(updatedCategory, updatedNote.Category)
		s.EqualValues(updatedNoteText, updatedNote.NoteText)
		s.EqualValues(updatingUser, *updatedNote.ModifiedBy)
		s.NotNil(updatedNote.ModifiedAt) // don't care about exact value, just that it was set to *something*
	})

	s.Run("Setting a note to be archived sets IsArchived to true and sets ModifiedBy, ModifiedAt", func() {
		trbRequestID := createTRBRequest(ctx, s, anonEUA)

		noteToCreate := models.TRBAdminNote{
			Category: models.TRBAdminNoteCategoryAdviceLetter,
			NoteText: "Archive note test",
		}
		noteToCreate.TRBRequestID = trbRequestID
		noteToCreate.CreatedBy = anonEUA

		createdNote, err := s.store.CreateTRBAdminNote(ctx, &noteToCreate)
		s.NoError(err)
		s.False(createdNote.IsArchived)

		archivingUser := "SF13"

		archivedNote, err := s.store.SetTRBAdminNoteArchived(ctx, createdNote.ID, true, archivingUser)
		s.NoError(err)

		s.True(archivedNote.IsArchived)
		s.EqualValues(archivingUser, *archivedNote.ModifiedBy)
		s.NotNil(archivedNote.ModifiedAt) // don't care about exact value, just that it was set to *something*
	})
}
