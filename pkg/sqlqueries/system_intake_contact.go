package sqlqueries

import _ "embed"

// systemIntakeContactCreateSQL holds the SQL command to create a System Intake Contact
//
//go:embed SQL/system_intake_contact/create.sql
var systemIntakeContactCreateSQL string

// systemIntakeContactDeleteSQL holds the SQL command to delete a System Intake Contact
//
//go:embed SQL/system_intake_contact/delete.sql
var systemIntakeContactDeleteSQL string

// systemIntakeContactGetByIDSQL holds the SQL command to get a System Intake Contact by ID
//
//go:embed SQL/system_intake_contact/get_by_id.sql
var systemIntakeContactGetByIDSQL string

// systemIntakeContactGetByIDsLoaderSQL holds the SQL command to get System Intake Contacts by their IDs
//
//go:embed SQL/system_intake_contact/get_by_ids_loader.sql
var systemIntakeContactGetByIDsLoaderSQL string

// systemIntakeContactsGetBySystemIntakeIDSQL holds the SQL command to get System Intake Contacts by System Intake ID
//
//go:embed SQL/system_intake_contact/get_by_system_intake_id.sql
var systemIntakeContactsGetBySystemIntakeIDSQL string

// systemIntakeContactUpdateSQL holds the SQL to update a contact
//
//go:embed SQL/system_intake_contact/update.sql
var systemIntakeContactUpdateSQL string

type SystemIntakeContactScripts struct {
	Create              string
	Delete              string
	GetByID             string
	GetByIDsLoader      string
	GetBySystemIntakeID string
	Update              string
}

var SystemIntakeContact = SystemIntakeContactScripts{
	Create:              systemIntakeContactCreateSQL,
	Delete:              systemIntakeContactDeleteSQL,
	GetByID:             systemIntakeContactGetByIDSQL,
	GetByIDsLoader:      systemIntakeContactGetByIDsLoaderSQL,
	GetBySystemIntakeID: systemIntakeContactsGetBySystemIntakeIDSQL,
	Update:              systemIntakeContactUpdateSQL,
}
