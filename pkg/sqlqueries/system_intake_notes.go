package sqlqueries

import _ "embed"

// getSystemIntakeNotesByIntakeID holds the SQL command to get all notes by an intake ID
//
//go:embed SQL/system_intake_notes/get_by_intake_ID.sql
var getSystemIntakeNotesByIntakeID string

// getSystemIntakeNotesByIntakeIDs holds the SQL command to get all notes by a list of intake IDs
//
//go:embed SQL/system_intake_notes/get_by_intake_IDs.sql
var getSystemIntakeNotesByIntakeIDs string

// SystemIntakeNotes holds all relevant SQL scripts for a System Intake system
var SystemIntakeNotes = systemIntakeNotesScripts{
	SelectBySystemIntakeID:  getSystemIntakeNotesByIntakeID,
	SelectBySystemIntakeIDs: getSystemIntakeNotesByIntakeIDs,
}

type systemIntakeNotesScripts struct {
	SelectBySystemIntakeIDs string
	SelectBySystemIntakeID  string
}
