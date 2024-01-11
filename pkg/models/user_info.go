package models

// UserInfo is the model for personal details of a user
type UserInfo struct { //TODO, this needs to be updated to allow for new fields from OKTA
	FirstName   string
	LastName    string
	DisplayName string
	Email       EmailAddress
	Username    string
}

// type UserInfo struct {
// 	CommonName string
// 	Email      EmailAddress
// 	EuaUserID  string
// }
