package sqlqueries

import _ "embed"

// getSystemIntakeElaInfoByIntakeIDSQL holds the SQL command to get all linked ELA Information by an Intake ID
//
//go:embed SQL/system_intake_gov_req_feedback/get_by_intake_ID.sql
var getSystemIntakeElaInfoByIntakeIDSQL string

// getSystemIntakeElaInfoByIntakeIDsSQL holds the SQL command to get all linked ELA Information by multiple Intake IDs
//
//go:embed SQL/system_intake_gov_req_feedback/get_by_intake_IDs.sql
var getSystemIntakeElaInfoByIntakeIDsSQL string

// SystemIntakeElaInfo holds all relevant SQL scripts for System Intake ELA Information
var SystemIntakeElaInfo = SystemIntakeElaInfoScripts{
	GetBySystemIntakeID:  getSystemIntakeElaInfoByIntakeIDSQL,
	GetBySystemIntakeIDs: getSystemIntakeElaInfoByIntakeIDsSQL,
}

type SystemIntakeElaInfoScripts struct {
	GetBySystemIntakeIDs string
	GetBySystemIntakeID  string
}
