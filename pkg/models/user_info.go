package models

// UserInfo is the model for personal details of a user
type UserInfo struct {
	CommonName string
	Email      EmailAddress
	EuaUserID  string
}
