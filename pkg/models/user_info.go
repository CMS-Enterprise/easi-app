package models

// UserInfo is the model for personal details of a user
type UserInfo struct {
	FirstName   string
	LastName    string
	DisplayName string
	Email       EmailAddress
	Username    string
}

func (ui UserInfo) GetMappingKey() string {
	return ui.Username
}
func (ui UserInfo) GetMappingVal() *UserInfo {
	return &ui
}
