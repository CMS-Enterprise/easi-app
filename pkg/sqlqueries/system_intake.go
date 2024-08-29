package sqlqueries

import _ "embed"

// getByUser holds the SQL query to get system intakes by user and archived state
//
//go:embed SQL/system_intake/get_by_user.sql
var getByUser string

var SystemIntake = systemIntakeScripts{
	GetByUser: getByUser,
}

type systemIntakeScripts struct {
	GetByUser string
}
