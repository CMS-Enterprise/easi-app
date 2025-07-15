package sqlqueries

import _ "embed"

//go:embed SQL/system_intake_review_type/update.sql
var updateSystemIntakeGrbReviewTypeByIntakeIDSQL string

// SystemIntakeGRBReviewType holds all SQL scripts for GRB Review Type
var SystemIntakeGRBReviewType = systemIntakeGRBReviewTypeScripts{
	Update: updateSystemIntakeGrbReviewTypeByIntakeIDSQL,
}

type systemIntakeGRBReviewTypeScripts struct {
	Update string
}
