package sqlqueries

import _ "embed"

// getByUser holds the SQL query to get system intakes by user and archived state
var getByUser string

var SystemIntake = systemIntakeScripts{
	GetByUser: getByUser,
}

type systemIntakeScripts struct {
	GetByUser string
}
