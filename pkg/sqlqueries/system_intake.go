package sqlqueries

import _ "embed"

// selectSystemIntakesSQL holds the SQL command to get System Intakes
//
//go:embed SQL/system_intake/get_system_intakes.sql
var selectSystemIntakesSQL string

// selectSystemIntakeByIDSQL holds the SQL command to get a System Intake by its ID
//
//go:embed SQL/system_intake/get_system_intake_by_id.sql
var selectSystemIntakeByIDSQL string

// selectSystemIntakeByLifecycleIDSQL holds the SQL command to get a System Intake by its Lifecycle ID
//
//go:embed SQL/system_intake/get_system_intake_by_lifecycle_id.sql
var selectSystemIntakeByLifecycleIDSQL string

// selectSystemIntakeByEuaIDSQL holds the SQL command to get a System Intake by its EUA ID
//
//go:embed SQL/system_intake/get_system_intake_by_eua_id.sql
var selectSystemIntakeByEuaIDSQL string

// selectSystemIntakesWithLCIDSQL holds the SQL command to get system intakes with LCIDs that are in use
//
//go:embed SQL/system_intake/get_system_intakes_with_lcid.sql
var selectSystemIntakesWithLCIDSQL string

// SystemIntakeForm holds all relevant SQL scripts for a System Intake
var SystemIntakeForm = systemIntakeScripts{
	Select:              selectSystemIntakesSQL,
	SelectByID:          selectSystemIntakeByIDSQL,
	SelectByLifecycleID: selectSystemIntakeByLifecycleIDSQL,
	SelectByEuaID:       selectSystemIntakeByEuaIDSQL,
	SelectWithLCID:      selectSystemIntakesWithLCIDSQL,
}

type systemIntakeScripts struct {
	Select              string
	SelectByID          string
	SelectByLifecycleID string
	SelectByEuaID       string
	SelectWithLCID      string
}
