package sqlqueries

import _ "embed"

// deleteSystemIntakeSystemsSQL holds the SQL command to remove all linked systems from a System Intake
//
//go:embed SQL/system_intake_grb_reviewer/insert.sql
var insertSystemIntakeGRBReviewerSQL string

//go:embed SQL/system_intake_grb_reviewer/get_by_intake_id.sql
var getSystemIntakeGRBReviewersByIntakeIDsSQL string

//go:embed SQL/system_intake_grb_reviewer/get_intakes_where_review_requested.sql
var getSystemIntakesWhereReviewIsRequestedSQL string

//go:embed SQL/system_intake_grb_reviewer/update.sql
var updateSystemIntakeGRBReviewerByIDSQL string

//go:embed SQL/system_intake_grb_reviewer/delete.sql
var deleteSystemIntakeGRBReviewerByIDSQL string

// SystemIntakeGRBReviewer holds all SQL scripts for GRB Reviewers
var SystemIntakeGRBReviewer = systemIntakeGRBReviewerScripts{
	Create:                         insertSystemIntakeGRBReviewerSQL,
	GetBySystemIntakeID:            getSystemIntakeGRBReviewersByIntakeIDsSQL,
	GetIntakesWhereReviewRequested: getSystemIntakesWhereReviewIsRequestedSQL,
	Update:                         updateSystemIntakeGRBReviewerByIDSQL,
	Delete:                         deleteSystemIntakeGRBReviewerByIDSQL,
}

type systemIntakeGRBReviewerScripts struct {
	Create                         string
	GetBySystemIntakeID            string
	GetIntakesWhereReviewRequested string
	Update                         string
	Delete                         string
}
