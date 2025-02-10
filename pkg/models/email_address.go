package models

// EmailAddress represents an email address
type EmailAddress string

// String returns the email address as a string
func (e EmailAddress) String() string {
	return string(e)
}

// EmailAddressesToStrings converts a slice of EmailAddresses to a slice of string values
func EmailAddressesToStrings(addresses []EmailAddress) []string {
	if addresses == nil {
		return nil
	}

	strs := []string{}
	for _, address := range addresses {
		strs = append(strs, address.String())
	}
	return strs
}

// EmailAddressesToStringPtrs converts a slice of EmailAddresses to a slice of string pointers
func EmailAddressesToStringPtrs(addresses []EmailAddress) []*string {
	if addresses == nil {
		return nil
	}

	strPtrs := []*string{}
	for _, address := range addresses {
		str := address.String()
		strPtrs = append(strPtrs, &str)
	}
	return strPtrs
}

// NewEmailAddress creates a new email address
func NewEmailAddress(address string) EmailAddress {
	return EmailAddress(address)
}

// EmailNotificationRecipients contains info about who to notify when an action is taken on an Intake Request
type EmailNotificationRecipients struct {
	RegularRecipientEmails   []EmailAddress
	ShouldNotifyITGovernance bool
	ShouldNotifyITInvestment bool
}
