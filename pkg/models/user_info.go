package models

// UserInfo is the model for personal details of a user
type UserInfo struct { //TODO, this needs to be updated to allow for new fields from OKTA
	FirstName  string
	LastName   string
	CommonName string
	Email      EmailAddress
	EuaUserID  string
}

// type UserInfo struct {
// 	CommonName string
// 	Email      EmailAddress
// 	EuaUserID  string
// }
