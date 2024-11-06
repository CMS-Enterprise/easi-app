package sqlqueries

import _ "embed"

// Holds the SQL query to return a user account by a given username
//
//go:embed SQL/user_account/get_by_username.sql
var userAccountGetByUsername string

// Holds the SQL query to return user accounts by usernames
//
//go:embed SQL/user_account/get_by_usernames.sql
var userAccountGetByUsernames string

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
//go:embed SQL/user_account/get_by_ids.sql
var userAccountGetByIDs string

// Holds the SQL to create a new user account record
//
//go:embed SQL/user_account/create.sql
var userAccountCreate string

// Holds the SQL to update a user account record
//
//go:embed SQL/user_account/update.sql
var userAccountUpdate string

// Holds the SQL to update user account records
//
//go:embed SQL/user_account/bulk_update.sql
var userAccountBulkUpdate string

// UserAccount holds all relevant SQL queries related to a user account
var UserAccount = userAccount{
	GetByUsername:   userAccountGetByUsername,
	GetByUsernames:  userAccountGetByUsernames,
	GetByCommonName: userAccountGetByCommonName,
	GetByID:         userAccountGetByID,
	GetByIDs:        userAccountGetByIDs,
	Create:          userAccountCreate,
	Update:          userAccountUpdate,
	BulkUpdate:      userAccountBulkUpdate,
}

type userAccount struct {
	// Holds the SQL query to return a user account by a given username
	GetByUsername string
	// Holds the SQL query to return user accounts by usernames
	GetByUsernames string
	// Holds the SQL query to return a user account by a common name
	GetByCommonName string
	// Holds the SQL to return a user account for a given internal UUID
	GetByID string
	// Holds the SQL to return a collection of user accounts for a collection of internal UUIDs
	GetByIDs string
	// Holds the SQL to create a new user account record(s)
	Create string
	//  Holds the SQL to update a user account record
	Update string
	//  Holds the SQL to update multiple user account records
	BulkUpdate string
}
