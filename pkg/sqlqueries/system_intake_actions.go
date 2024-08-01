package sqlqueries

import _ "embed"

// selectActionsBySystemIntakeIDSQL holds the SQL command to get linked Actions by System Intake ID
//
//go:embed SQL/system_intake_actions/get_by_intake_ID.sql
var selectActionsBySystemIntakeIDSQL string

// selectActionsBySystemIntakeIDsSQL holds the SQL command to get linked Actions by System Intake ID via dataloader
//
//go:embed SQL/system_intake_actions/get_by_intake_IDs.sql
var selectActionsBySystemIntakeIDsSQL string

// SystemIntakeActions holds all relevant SQL scripts for System Intake Actions
var SystemIntakeActions = systemIntakeActionScripts{
	SelectBySystemIntakeID:  selectActionsBySystemIntakeIDSQL,
	SelectBySystemIntakeIDs: selectActionsBySystemIntakeIDsSQL,
}

type systemIntakeActionScripts struct {
	SelectBySystemIntakeID  string
	SelectBySystemIntakeIDs string
}
