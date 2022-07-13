package email

import (
	"bytes"
	"context"

	"github.com/cmsgov/easi-app/pkg/apperrors"
)

// SendCantFindSomethingEmailInput contains the data submitted by the user to the "can't find find
// what you're looking for" help form
type SendCantFindSomethingEmailInput struct {
	Name  string
	Email string
	Body  string
}

// SendCantFindSomethingEmail sends an email to the EASI team containing a user's request for help
func (c Client) SendCantFindSomethingEmail(ctx context.Context, input SendCantFindSomethingEmailInput) error {
	subject := "Feedback for EASi System"

	var b bytes.Buffer
	err := c.templates.helpCantFindSomething.Execute(&b, input)

	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	err = c.sender.Send(ctx, c.config.EASIHelpEmail, nil, subject, b.String())
	if err != nil {
		return &apperrors.NotificationError{Err: err, DestinationType: apperrors.DestinationTypeEmail}
	}

	return nil
}
