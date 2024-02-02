package sqlqueries

import _ "embed"

// deleteSystemIntakeContractNumbersSQL holds the SQL command to remove all linked Contract Numbers from a System Intake
//
//go:embed SQL/system_intake_contract_number/delete.sql
var deleteSystemIntakeContractNumbersSQL string

// createSystemIntakeContractNumbersSQL holds the SQL command to link Contract Numbers to a System Intake
//
//go:embed SQL/system_intake_contract_number/create.sql
var createSystemIntakeContractNumbersSQL string

// SystemIntakeContractNumberForm holds all relevant SQL scripts for a TRB request form
var SystemIntakeContractNumberForm = systemIntakeContractNumberScripts{
	Create: createSystemIntakeContractNumbersSQL,
	Delete: deleteSystemIntakeContractNumbersSQL,
}

type systemIntakeContractNumberScripts struct {
	Create string
	Delete string
}
