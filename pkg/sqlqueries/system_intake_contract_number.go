package sqlqueries

import _ "embed"

// deleteSystemIntakeContractNumbersSQL holds the SQL command to remove all linked Contract Numbers from a System Intake
//
//go:embed SQL/system_intake_contract_number/delete.sql
var deleteSystemIntakeContractNumbersSQL string

// setSystemIntakeContractNumbersSQL holds the SQL command to link Contract Numbers to a System Intake
//
//go:embed SQL/system_intake_contract_number/set.sql
var setSystemIntakeContractNumbersSQL string

// selectContractNumbersBySystemIntakeIDLOADERSQL holds the SQL command to get linked Contract Numbers by System Intake ID via dataloader
//
//go:embed SQL/system_intake_contract_number/get_by_system_intake_id_LOADER.sql
var selectContractNumbersBySystemIntakeIDLOADERSQL string

// SystemIntakeContractNumberForm holds all relevant SQL scripts for a System Intake Contract Number
var SystemIntakeContractNumberForm = systemIntakeContractNumberScripts{
	Set:                          setSystemIntakeContractNumbersSQL,
	Delete:                       deleteSystemIntakeContractNumbersSQL,
	SelectBySystemIntakeIDLOADER: selectContractNumbersBySystemIntakeIDLOADERSQL,
}

type systemIntakeContractNumberScripts struct {
	Set                          string
	Delete                       string
	SelectBySystemIntakeIDLOADER string
}
