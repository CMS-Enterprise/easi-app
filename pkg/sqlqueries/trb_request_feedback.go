package sqlqueries

import _ "embed"

// trbRequestFeedbackGetNewestByIDSQL holds the SQL query to get latest TRB request feedback by a specific TRB Req ID
//
//go:embed SQL/trb_request_feedback/get_newest_by_ID.sql
var trbRequestFeedbackGetNewestByIDSQL string

// trbRequestFeedbackGetNewestByIDSQL holds the SQL query to get latest TRB request feedback for a group of TRB Req IDs
//
//go:embed SQL/trb_request_feedback/get_newest_by_IDs.sql
var trbRequestFeedbackGetNewestsByIDsSQL string

// trbRequestFeedbackGetByIDSQL holds the SQL query to get all TRB request feedback for a specific TRB Req ID
//
//go:embed SQL/trb_request_feedback/get_by_ID.sql
var trbRequestFeedbackGetByIDSQL string

// trbRequestFeedbackGetByIDsSQL holds the SQL query to get all TRB request feedback for a group of TRB Req IDs
//
//go:embed SQL/trb_request_feedback/get_by_IDs.sql
var trbRequestFeedbackGetByIDsSQL string

// TRBRequestFeedback holds all relevant SQL scripts for TRB Request feedback
var TRBRequestFeedback = trbRequestFeedbackScripts{
	GetByID:           trbRequestFeedbackGetByIDSQL,
	GetByIDs:          trbRequestFeedbackGetByIDsSQL,
	GetByNewestByID:   trbRequestFeedbackGetNewestByIDSQL,
	GetByNewestsByIDs: trbRequestFeedbackGetNewestsByIDsSQL,
}

type trbRequestFeedbackScripts struct {
	GetByID           string
	GetByIDs          string
	GetByNewestByID   string
	GetByNewestsByIDs string
}
