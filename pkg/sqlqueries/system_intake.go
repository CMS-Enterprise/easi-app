package sqlqueries

import _ "embed"

// getByUser holds the SQL query to get non-archived system intakes by EUA
//
//go:embed SQL/system_intake/get_by_user.sql
var getByUser string

// getWhereGRBReviewIsHalfwayThrough holds the SQL query to get system intakes where the GRB review is halfway through
//
//go:embed SQL/system_intake/get_where_grb_voting_halfway_through.sql
var getWhereGRBReviewIsHalfwayThrough string

// getWhereGRBReviewPastDueNoQuorum holds the SQL query to get intakes with a past due GRB review but no quorum
//
//go:embed SQL/system_intake/get_where_grb_review_past_due_no_quorum.sql
var getWhereGRBReviewPastDueNoQuorum string

//
//go:embed SQL/system_intake/get_where_grb_review_complete_quorum_met.sql
var getWhereGRBReviewCompleteQuorumMet string

// getRequesterUpdateEmailData holds the SQL query to get requester update email data
//
//go:embed SQL/system_intake/get_requester_update_email_data.sql
var getRequesterUpdateEmailData string

// getSystemIntakeByGRBReviewerID holds the SQL query to get system intakes by GRB reviewer ID
//
//go:embed SQL/system_intake/get_by_grb_reviewer_id.sql
var getSystemIntakeByGRBReviewerID string

var SystemIntake = systemIntakeScripts{
	GetByUser:                         getByUser,
	GetWhereGRBReviewIsHalfwayThrough: getWhereGRBReviewIsHalfwayThrough,
	GetWhereGRBPastDueNoQuorum:        getWhereGRBReviewPastDueNoQuorum,
	GetWhereReviewCompleteQuorumMet:   getWhereGRBReviewCompleteQuorumMet,
	GetRequesterUpdateEmailData:       getRequesterUpdateEmailData,
	GetSystemIntakeByGRBReviewerID:    getSystemIntakeByGRBReviewerID,
}

type systemIntakeScripts struct {
	GetByUser                         string
	GetWhereGRBReviewIsHalfwayThrough string
	GetWhereGRBPastDueNoQuorum        string
	GetWhereReviewCompleteQuorumMet   string
	GetRequesterUpdateEmailData       string
	GetSystemIntakeByGRBReviewerID    string
}
