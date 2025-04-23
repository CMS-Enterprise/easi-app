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

var SystemIntake = systemIntakeScripts{
	GetByUser:                         getByUser,
	GetWhereGRBReviewIsHalfwayThrough: getWhereGRBReviewIsHalfwayThrough,
	GetWhereGRBPastDueNoQuorum:        getWhereGRBReviewPastDueNoQuorum,
	GetWhereReviewCompleteQuorumMet:   getWhereGRBReviewCompleteQuorumMet,
}

type systemIntakeScripts struct {
	GetByUser                         string
	GetWhereGRBReviewIsHalfwayThrough string
	GetWhereGRBPastDueNoQuorum        string
	GetWhereReviewCompleteQuorumMet   string
}
