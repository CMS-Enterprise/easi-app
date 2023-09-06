package email

import (
	"context"
	"fmt"
	"path"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestTRBRequestClosedEmail() {
	sender := mockSender{}
	ctx := context.Background()

	trbID := uuid.New()
	trbLink := fmt.Sprintf(
		"%s://%s/%s",
		s.config.URLScheme,
		s.config.URLHost,
		path.Join("trb", "task-list", trbID.String()),
	)

	trbAdminLink := fmt.Sprintf(
		"%s://%s/%s",
		s.config.URLScheme,
		s.config.URLHost,
		path.Join("trb", trbID.String(), "request"),
	)

	recipients := []models.EmailAddress{
		models.NewEmailAddress("abcd@local.fake"),
		models.NewEmailAddress("efgh@local.fake"),
	}

	input := SendTRBRequestClosedEmailInput{
		TRBRequestID:   trbID,
		TRBRequestName: "Test TRB Request",
		RequesterName:  "Mc Lovin",
		Recipients:     recipients,
		ReasonClosed:   "Just felt like it",
		CopyTRBMailbox: true,
	}
	allRecipients := append(recipients, s.config.TRBEmail)

	s.Run("successful call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		expectedBody := `<h1 style="margin-bottom: 0.5rem;">EASi</h1>

<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>

<p>The Technical Review Board (TRB) has closed ` + input.TRBRequestName + `.</p>

<p>Reason for closing: ` + string(input.ReasonClosed) + `</p>

<p>View this request in EASi:</p>
<ul>
<li>If you are the initial requester, you may <a href="` + trbLink + `">click here</a> to view the advice letter and your request task list.</li>
<li>TRB team members may <a href="` + trbAdminLink + `">click here</a> to view the request details.</li>
<li>Others should contact Mc Lovin or the TRB for more information about this request.</li>
</ul>

<p>If you have questions or need to request a reschedule, please email the TRB at <a href="mailto:` + s.config.TRBEmail.String() + `">` + s.config.TRBEmail.String() + `</a>.</p>
`
		err = client.SendTRBRequestClosedEmail(ctx, input)
		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, allRecipients)
		s.Equal(expectedBody, sender.body)
	})
}

func (s *EmailTestSuite) TestTRBRequestClosedEmailNoReason() {
	sender := mockSender{}
	ctx := context.Background()

	trbID := uuid.New()
	trbLink := fmt.Sprintf(
		"%s://%s/%s",
		s.config.URLScheme,
		s.config.URLHost,
		path.Join("trb", "task-list", trbID.String()),
	)

	trbAdminLink := fmt.Sprintf(
		"%s://%s/%s",
		s.config.URLScheme,
		s.config.URLHost,
		path.Join("trb", trbID.String(), "request"),
	)

	recipients := []models.EmailAddress{
		models.NewEmailAddress("abcd@local.fake"),
		models.NewEmailAddress("efgh@local.fake"),
	}

	input := SendTRBRequestClosedEmailInput{
		TRBRequestID:   trbID,
		TRBRequestName: "Test TRB Request",
		RequesterName:  "Mc Lovin",
		Recipients:     recipients,
		// ReasonClosed not provided!
		CopyTRBMailbox: true,
	}
	allRecipients := append(recipients, s.config.TRBEmail)

	s.Run("successful call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		expectedBody := `<h1 style="margin-bottom: 0.5rem;">EASi</h1>

<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>

<p>The Technical Review Board (TRB) has closed ` + input.TRBRequestName + `.</p>



<p>View this request in EASi:</p>
<ul>
<li>If you are the initial requester, you may <a href="` + trbLink + `">click here</a> to view the advice letter and your request task list.</li>
<li>TRB team members may <a href="` + trbAdminLink + `">click here</a> to view the request details.</li>
<li>Others should contact Mc Lovin or the TRB for more information about this request.</li>
</ul>

<p>If you have questions or need to request a reschedule, please email the TRB at <a href="mailto:` + s.config.TRBEmail.String() + `">` + s.config.TRBEmail.String() + `</a>.</p>
`
		err = client.SendTRBRequestClosedEmail(ctx, input)
		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, allRecipients)
		s.Equal(expectedBody, sender.body)
	})
}
