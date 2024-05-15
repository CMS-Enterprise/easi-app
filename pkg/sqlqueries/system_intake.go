package sqlqueries

import _ "embed"

// systemIntakeSelectByCedarSystemID holds the SQL query to get System Intakes by their Cedar System ID
//
//go:embed SQL/system_intake/select_by_cedar_system_id.sql
var systemIntakeSelectByCedarSystemID string

// SystemIntake holds all relevant SQL scripts for a System Intake
var SystemIntake = systemIntakeScripts{
	SelectByCedarSystemID: systemIntakeSelectByCedarSystemID,
}

type systemIntakeScripts struct {
	SelectByCedarSystemID string
}
