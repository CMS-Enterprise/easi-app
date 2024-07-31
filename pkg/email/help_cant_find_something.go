package email

import (
	"bytes"
	"context"

	"github.com/cms-enterprise/easi-app/pkg/models"
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
	subject := "EASi Help Required"

	var b bytes.Buffer
	err := c.templates.helpCantFindSomething.Execute(&b, input)

	if err != nil {
		return err
	}

	return c.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses([]models.EmailAddress{c.config.EASIHelpEmail}).
			WithSubject(subject).
			WithBody(b.String()),
	)
}
