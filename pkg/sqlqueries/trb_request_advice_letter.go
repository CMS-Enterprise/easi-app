package sqlqueries

import _ "embed"

// GetAdviceLetterByTRBReqIDSQL holds the SQL query to get the Advice Letter by TRB Req ID
//
//go:embed SQL/trb_request_advice_letter/get_by_req_ID.sql
var getAdviceLetterByTRBReqIDSQL string

// GetAdviceLettersByTRBReqIDsSQL holds the SQL query to get Advice Letters by TRB Req IDs
//
//go:embed SQL/trb_request_advice_letter/get_by_req_IDs.sql
var getAdviceLettersByTRBReqIDsSQL string

var TRBRequestAdviceLetter = trbAdviceLetterScripts{
	GetByTRBID:  getAdviceLetterByTRBReqIDSQL,
	GetByTRBIDs: getAdviceLettersByTRBReqIDsSQL,
}

type trbAdviceLetterScripts struct {
	GetByTRBID  string
	GetByTRBIDs string
}
