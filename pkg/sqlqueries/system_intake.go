package sqlqueries

import _ "embed"

// getByUser holds the SQL query to get non-archived system intakes by EUA
//
//go:embed SQL/system_intake/get_by_user.sql
var getByUser string

var SystemIntake = systemIntakeScripts{
	GetByUser: getByUser,
}

type systemIntakeScripts struct {
	GetByUser string
}
