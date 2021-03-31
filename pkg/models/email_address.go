package models

// EmailAddress represents an email address
type EmailAddress string

// String returns the email address as a string
func (e EmailAddress) String() string {
	return string(e)
}

// NewEmailAddress creates a new email address
func NewEmailAddress(address string) EmailAddress {
	return EmailAddress(address)
}
