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

// selectSystemIntakeContractNumbersBySystemIntakeIDSQL holds the SQL command to get Contract Numbers related to a given System Intake
//
//go:embed SQL/system_intake_contract_number/get_by_system_intake_id.sql
var selectSystemIntakeContractNumbersBySystemIntakeIDSQL string

// selectSystemIntakeContractNumberByIDSQL holds the SQL command to get a linked Contract Number by ID
//
//go:embed SQL/system_intake_contract_number/get_by_id.sql
var selectSystemIntakeContractNumberByIDSQL string

// deleteLinkedSystemIntakeContractNumbersByIDsSQL holds the SQL command to delete linked Contract Numbers by their IDs
//
//go:embed SQL/system_intake_contract_number/delete_by_ids.sql
var deleteLinkedSystemIntakeContractNumbersByIDsSQL string

// selectContractNumbersBySystemIntakeIDLOADERSQL holds the SQL command to get linked Contract Numbers by System Intake ID

// SystemIntakeContractNumberForm holds all relevant SQL scripts for a System Intake Contract Number
var SystemIntakeContractNumberForm = systemIntakeContractNumberScripts{
	Create:                 createSystemIntakeContractNumbersSQL,
	Delete:                 deleteSystemIntakeContractNumbersSQL,
	DeleteByIDs:            deleteLinkedSystemIntakeContractNumbersByIDsSQL,
	SelectByID:             selectSystemIntakeContractNumberByIDSQL,
	SelectBySystemIntakeID: selectSystemIntakeContractNumbersBySystemIntakeIDSQL,
}

type systemIntakeContractNumberScripts struct {
	Create                 string
	Delete                 string
	DeleteByIDs            string
	SelectByID             string
	SelectBySystemIntakeID string
}
