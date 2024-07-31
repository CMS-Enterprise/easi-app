package email

import (
	"bytes"
	"context"
	"path"

	"github.com/google/uuid"
	"golang.org/x/sync/errgroup"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

// SendTRBRequestTRBLeadEmailInput contains the data needed to send an email to the TRB team
// indicating that a TRB lead has been assigned
type SendTRBRequestTRBLeadEmailInput struct {
	TRBRequestID   uuid.UUID
	TRBRequestName string
	RequesterName  string
	TRBLeadName    string
	Component      string
	TRBLeadEmail   models.EmailAddress
}

// trbLeadAdminEmailTemplateParams contains the data needed for interpolation in the TRB lead admin email template
type trbLeadAdminEmailTemplateParams struct {
	TRBLeadName    string
	TRBRequestName string
	TRBRequestLink string
	RequesterName  string
}

// trbLeadAssigneeEmailTemplateParams contains the data needed for interpolation in the TRB lead
// assignee email template
type trbLeadAssigneeEmailTemplateParams struct {
	TRBLeadName    string
	TRBRequestName string
	TRBRequestLink string
	RequesterName  string
	Component      string
}

// SendTRBRequestTRBLeadAssignedEmails sends emails to the TRB team and the TRB lead when the lead
// is assigned to a TRB request
func (c Client) SendTRBRequestTRBLeadAssignedEmails(ctx context.Context, input SendTRBRequestTRBLeadEmailInput) error {
	g := new(errgroup.Group)

	g.Go(func() error {
		return c.sendTRBRequestTRBLeadAdminEmail(ctx, input)
	})

	g.Go(func() error {
		return c.sendTRBRequestTRBLeadAssigneeEmail(ctx, input)
	})

	return g.Wait()
}

// sendTRBRequestTRBLeadAdminEmail sends an email to the TRB team indicating that a TRB lead has been assigned
func (c Client) sendTRBRequestTRBLeadAdminEmail(ctx context.Context, input SendTRBRequestTRBLeadEmailInput) error {
	subject := input.TRBRequestName + " is assigned to " + input.TRBLeadName

	templateParams := trbLeadAdminEmailTemplateParams{
		TRBLeadName:    input.TRBLeadName,
		TRBRequestName: input.TRBRequestName,
		TRBRequestLink: c.urlFromPath(path.Join("trb", input.TRBRequestID.String(), "request")),
		RequesterName:  input.RequesterName,
	}

	var b bytes.Buffer
	err := c.templates.trbRequestTRBLeadAdmin.Execute(&b, templateParams)

	if err != nil {
		return err
	}

	return c.sender.Send(ctx,
		NewEmail().
			WithToAddresses([]models.EmailAddress{c.config.TRBEmail}).
			WithSubject(subject).
			WithBody(b.String()),
	)
}

// sendTRBRequestTRBLeadAssigneeEmail sends an email to a user indicating that they have been assigned
// as the TRB lead for a TRB request
func (c Client) sendTRBRequestTRBLeadAssigneeEmail(ctx context.Context, input SendTRBRequestTRBLeadEmailInput) error {
	subject := "You have been assigned as the TRB lead for " + input.TRBRequestName

	templateParams := trbLeadAssigneeEmailTemplateParams{
		TRBLeadName:    input.TRBLeadName,
		TRBRequestName: input.TRBRequestName,
		TRBRequestLink: c.urlFromPath(path.Join("trb", input.TRBRequestID.String(), "request")),
		RequesterName:  input.RequesterName,
		Component:      input.Component,
	}

	var b bytes.Buffer
	err := c.templates.trbRequestTRBLeadAssignee.Execute(&b, templateParams)

	if err != nil {
		return err
	}

	return c.sender.Send(ctx,
		NewEmail().
			WithToAddresses([]models.EmailAddress{input.TRBLeadEmail}).
			WithSubject(subject).
			WithBody(b.String()),
	)
}
