package sqlqueries

import _ "embed"

// getByUser holds the SQL query to get non-archived system intakes by EUA
//
//go:embed SQL/system_intake/get_by_user.sql
var getByUser string

// getByGRBReviewerID holds the SQL state to get a system intake by a GRB reviewer's ID
//
//go:embed SQL/system_intake/get_by_grb_reviewer_id.sql
var getByGRBReviewerID string

var SystemIntake = systemIntakeScripts{
	GetByUser:          getByUser,
	GetByGRBReviewerID: getByGRBReviewerID,
}

type systemIntakeScripts struct {
	GetByUser          string
	GetByGRBReviewerID string
}
