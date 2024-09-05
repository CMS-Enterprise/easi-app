package sqlqueries

import _ "embed"

// getSystemIntakeSoftwareAcquisitionByIntakeIDSQL holds the SQL command to get all linked Software Acquisition Information by an Intake ID
//
//go:embed SQL/system_intake_gov_req_feedback/get_by_intake_ID.sql
var getSystemIntakeSoftwareAcquisitionByIntakeIDSQL string

// getSystemIntakeSoftwareAcquisitionByIntakeIDsSQL holds the SQL command to get all linked Software Acquisition Information by multiple Intake IDs
//
//go:embed SQL/system_intake_gov_req_feedback/get_by_intake_IDs.sql
var getSystemIntakeSoftwareAcquisitionByIntakeIDsSQL string

// SystemIntakeSoftwareAcquisition holds all relevant SQL scripts for System Intake Software Acquisition Information
var SystemIntakeSoftwareAcquisition = SystemIntakeSoftwareAcquisitionScripts{
	GetBySystemIntakeID:  getSystemIntakeSoftwareAcquisitionByIntakeIDSQL,
	GetBySystemIntakeIDs: getSystemIntakeSoftwareAcquisitionByIntakeIDsSQL,
}

type SystemIntakeSoftwareAcquisitionScripts struct {
	GetBySystemIntakeIDs string
	GetBySystemIntakeID  string
}
