package sqlqueries

import _ "embed"

// getByUser holds the SQL query to get system intakes by user and archived state
//
//go:embed SQL/system_intake/get_by_user.sql
var getByUser string

// getRequesterUpdateEmailData holds the SQL query to get requester update email data
//
//go:embed SQL/system_intake/get_requester_update_email_data.sql
var getRequesterUpdateEmailData string

var SystemIntake = systemIntakeScripts{
	GetByUser:                   getByUser,
	GetRequesterUpdateEmailData: getRequesterUpdateEmailData,
}

type systemIntakeScripts struct {
	GetByUser                   string
	GetRequesterUpdateEmailData string
}
