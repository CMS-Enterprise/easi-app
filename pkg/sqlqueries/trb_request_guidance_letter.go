package sqlqueries

import _ "embed"

// getGuidanceLetterByTRBReqIDSQL holds the SQL query to get the Guidance Letter by TRB Req ID
//
//go:embed SQL/trb_request_guidance_letter/get_by_req_ID.sql
var getGuidanceLetterByTRBReqIDSQL string

// getGuidanceLettersByTRBReqIDsSQL holds the SQL query to get Guidance Letters by TRB Req IDs
//
//go:embed SQL/trb_request_guidance_letter/get_by_req_IDs.sql
var getGuidanceLettersByTRBReqIDsSQL string

var TRBRequestGuidanceLetter = trbGuidanceLetterScripts{
	GetByTRBID:  getGuidanceLetterByTRBReqIDSQL,
	GetByTRBIDs: getGuidanceLettersByTRBReqIDsSQL,
}

type trbGuidanceLetterScripts struct {
	GetByTRBID  string
	GetByTRBIDs string
}
