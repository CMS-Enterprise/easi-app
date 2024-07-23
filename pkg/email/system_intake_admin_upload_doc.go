package email

import "github.com/google/uuid"

type SendSystemIntakeAdminUploadDocEmailInput struct {
	SystemIntakeID   uuid.UUID
	SystemIntakeName string
	DocumentName     string
	UploadedAt       string
}

func (sie systemIntakeEmails) systemIntakeAdminUploadDocBody() (string, error) {}
