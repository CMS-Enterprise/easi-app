package sqlqueries

import _ "embed"

// deleteSystemIntakeSystemsSQL holds the SQL command to remove all linked systems from a System Intake
//
//go:embed SQL/system_intake_grb_reviewer/insert.sql
var insertSystemIntakeSystemsSQL string

// SystemIntakeSystemForm holds all relevant SQL scripts for a System Intake system
var SystemIntakeGRBReviewer = systemIntakeGRBReviewerScripts{
	Create: insertSystemIntakeSystemsSQL,
}

type systemIntakeGRBReviewerScripts struct {
	Create string
}
