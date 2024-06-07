package sqlqueries

import _ "embed"

// Holds the SQL query to return a user account by a given username
//
//go:embed SQL/user_account/get_by_username.sql
var userAccountGetByUsername string

// Holds the SQL query to return a user account by a common name
//
//go:embed SQL/user_account/get_by_common_name.sql
var userAccountGetByCommonName string

// Holds the SQL to return a user account for a given internal UUID
//
//go:embed SQL/user_account/get_by_id.sql
var userAccountGetByID string

// Holds the SQL to return a collection of user accounts for a collection of internal UUIDs
// this is meant to be used primarily by a data loader
//
//go:embed SQL/user_account/get_by_id_LOADER.sql
var userAccountGetByIDLOADER string

// Holds the SQL to create a new user account record
//
//go:embed SQL/user_account/create.sql
var userAccountCreate string

// Holds the SQL to update a user account record for a matching username
//
//go:embed SQL/user_account/update_by_username.sql
var userAccountUpdateByUsername string

// UserAccount holds all relevant SQL queries related to a user account
var UserAccount = userAccount{
	GetByUsername:    userAccountGetByUsername,
	GetByCommonName:  userAccountGetByCommonName,
	GetByID:          userAccountGetByID,
	GetByIDLOADER:    userAccountGetByIDLOADER,
	Create:           userAccountCreate,
	UpdateByUsername: userAccountUpdateByUsername,
}

type userAccount struct {
	// Holds the SQL query to return a user account by a given username
	GetByUsername string
	// Holds the SQL query to return a user account by a common name
	GetByCommonName string
	// Holds the SQL to return a user account for a given internal UUID
	GetByID string
	// Holds the SQL to return a collection of user accounts for a collection of internal UUIDs
	// this is meant to be used primarily by a data loader
	GetByIDLOADER string
	// Holds the SQL to create a new user account record
	Create string
	//  Holds the SQL to update a user account record for a matching username
	UpdateByUsername string
}
