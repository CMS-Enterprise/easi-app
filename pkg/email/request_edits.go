package email

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
)

// SendRequestEditsNotification notifies user-selected recipients that a system intake form needs edits
func (c systemIntakeEmails) SendRequestEditsNotification(
	ctx context.Context,
	recipients []models.EmailAddress,
	copyITGovernanceMailbox bool,
	requestID uuid.UUID,
	requestName string,
	requesterName string,
	feedback models.HTML,
) error {

	//TODO: SW implement the struct and email
	return nil
}
