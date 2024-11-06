package sqlqueries

import _ "embed"

// deleteSystemIntakeSystemsSQL holds the SQL command to remove all linked systems from a System Intake
//
//go:embed SQL/system_intake_system/delete.sql
var deleteSystemIntakeSystemsSQL string

// setSystemIntakeSystemsSQL holds the SQL command to link systems to a System Intake
//
//go:embed SQL/system_intake_system/set.sql
var setSystemIntakeSystemsSQL string

// selectSystemsBySystemIntakeIDsSQL holds the SQL command to get linked systems by System Intake ID via dataloader
//
//go:embed SQL/system_intake_system/get_by_system_intake_ids.sql
var selectSystemsBySystemIntakeIDsSQL string

// systemIntakeSelectByCedarSystemID holds the SQL query to get System Intakes by their Cedar System IDs
//
//go:embed SQL/system_intake_system/select_by_cedar_system_ids.sql
var systemIntakeSelectByCedarSystemIDs string

// SystemIntakeSystemForm holds all relevant SQL scripts for a System Intake system
var SystemIntakeSystemForm = systemIntakeSystemScripts{
	Set:                     setSystemIntakeSystemsSQL,
	Delete:                  deleteSystemIntakeSystemsSQL,
	SelectByCedarSystemIDs:  systemIntakeSelectByCedarSystemIDs,
	SelectBySystemIntakeIDs: selectSystemsBySystemIntakeIDsSQL,
}

type systemIntakeSystemScripts struct {
	Set                     string
	Delete                  string
	SelectByCedarSystemIDs  string
	SelectBySystemIntakeIDs string
}
