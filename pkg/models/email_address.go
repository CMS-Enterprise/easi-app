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

// EmailNotificationRecipients contains info about who to notify when an action is taken on an intake request
type EmailNotificationRecipients struct {
	RegularRecipientEmails   []EmailAddress
	ShouldNotifyITGovernance bool
	ShouldNotifyITInvestment bool
}
