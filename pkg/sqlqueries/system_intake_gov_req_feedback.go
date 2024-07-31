package sqlqueries

import _ "embed"

// getSystemIntakeGovReqFeedbackByIntakeIDSQL holds the SQL command to get all linked Feedbacks by Intake ID
//
//go:embed SQL/system_intake_gov_req_feedback/get_by_intake_ID.sql
var getSystemIntakeGovReqFeedbackByIntakeIDSQL string

// getSystemIntakeGovReqFeedbackByIntakeIDsSQL holds the SQL command to get all linked Feedbacks by Intake IDs
//
//go:embed SQL/system_intake_gov_req_feedback/get_by_intake_IDs.sql
var getSystemIntakeGovReqFeedbackByIntakeIDsSQL string

// SystemIntakeGovReqFeedback holds all relevant SQL scripts for a System Intake Governance Request Feedback
var SystemIntakeGovReqFeedback = SystemIntakeGovReqFeedbackScripts{
	GetBySystemIntakeID:  getSystemIntakeGovReqFeedbackByIntakeIDSQL,
	GetBySystemIntakeIDs: getSystemIntakeGovReqFeedbackByIntakeIDsSQL,
}

type SystemIntakeGovReqFeedbackScripts struct {
	GetBySystemIntakeIDs string
	GetBySystemIntakeID  string
}
