package email

import (
	"bytes"
	"context"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

// SendReportAProblemEmailInput contains the data submitted by the user to the "report a problem" help form
type SendReportAProblemEmailInput struct {
	IsAnonymous            bool
	ReporterName           string
	ReporterEmail          string
	CanBeContacted         bool
	EasiService            string
	WhatWereYouDoing       string
	WhatWentWrong          string
	HowSevereWasTheProblem string
}

// SendReportAProblemEmail sends an email to the EASI team containing a user's request for help
func (c Client) SendReportAProblemEmail(ctx context.Context, input SendReportAProblemEmailInput) error {
	subject := "EASi Problem Report"

	var b bytes.Buffer
	err := c.templates.helpReportAProblem.Execute(&b, input)

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
