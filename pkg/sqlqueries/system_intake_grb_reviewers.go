package sqlqueries

import _ "embed"

// deleteSystemIntakeSystemsSQL holds the SQL command to remove all linked systems from a System Intake
//
//go:embed SQL/system_intake_grb_reviewer/insert.sql
var insertSystemIntakeGRBReviewerSQL string

//go:embed SQL/system_intake_grb_reviewer/get_by_intake_id.sql
var getSystemIntakeGRBReviewersByIntakeIDsSQL string

// SystemIntakeGRBReviewer holds all SQL scripts for GRB Reviewers
var SystemIntakeGRBReviewer = systemIntakeGRBReviewerScripts{
	Create:              insertSystemIntakeGRBReviewerSQL,
	GetBySystemIntakeID: getSystemIntakeGRBReviewersByIntakeIDsSQL,
}

type systemIntakeGRBReviewerScripts struct {
	Create              string
	GetBySystemIntakeID string
}
