package sqlqueries

import _ "embed"

// getAdminNotesByTRBReqIDSQL holds the SQL query to get Admin Notes by TRB Req ID
//
//go:embed SQL/trb_request_admin_notes/get_by_TRB_ID.sql
var getAdminNotesByTRBReqIDSQL string

// getAdminNotesByTRBReqIDsSQL holds the SQL query to get Admin Notes by TRB Req IDs
//
//go:embed SQL/trb_request_admin_notes/get_by_TRB_IDs.sql
var getAdminNotesByTRBReqIDsSQL string

var TRBRequestAdminNotes = trbAdminNotesScripts{
	GetByTRBID:  getAdminNotesByTRBReqIDSQL,
	GetByTRBIDs: getAdminNotesByTRBReqIDsSQL,
}

type trbAdminNotesScripts struct {
	GetByTRBID  string
	GetByTRBIDs string
}
