package email

import (
	"context"
	"fmt"
	"path"
	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestTRBAdviceLetterSubmittedEmail() {
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

	adviceLetterLink := fmt.Sprintf(
		"%s://%s/%s",
		s.config.URLScheme,
		s.config.URLHost,
		path.Join("trb", "advice-letter", trbID.String()),
	)

	submissionDate, err := time.Parse(time.RFC3339, "2022-02-01T13:30:00+00:00")
	s.NoError(err)
	consultDate, err := time.Parse(time.RFC3339, "2022-01-01T13:30:00+00:00")
	s.NoError(err)

	recipients := []models.EmailAddress{
		models.NewEmailAddress("abcd@local.fake"),
		models.NewEmailAddress("efgh@local.fake"),
	}

	s.Run("successful call has the right content (copying TRB mailbox)", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		input := SendTRBAdviceLetterSubmittedEmailInput{
			TRBRequestID:   trbID,
			RequestName:    "Test TRB Request",
			RequestType:    "NEED_HELP",
			RequesterName:  "Mc Lovin",
			Component:      "Center for Clinical Standards and Quality",
			SubmissionDate: &submissionDate,
			ConsultDate:    &consultDate,
			CopyTRBMailbox: true,
			Recipients:     recipients,
		}
		allRecipients := append(recipients, s.config.TRBEmail)

		expectedBody := `<h1 style="margin-bottom: 0.5rem;">EASi</h1>

<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>

<p>The Technical Review Board (TRB) has compiled an advice letter for Test TRB Request. Use the link below to view recommendations from the TRB as well as a summary of the initial support request.</p>

<p><a href="` + adviceLetterLink + `" style="font-weight: bold">View the Advice Letter</a></p>

<p>Any further communication or follow-up sessions may be organized via email with the TRB or via a new request in EASi.</p>

<p><strong>Request summary</strong></p>
<ul style="padding-left: 0;">
<li style="list-style-type: none;">Submission date: ` + submissionDate.Format("January 2, 2006") + `</li>
<li style="list-style-type: none;">Requester: ` + input.RequesterName + `</li>
<li style="list-style-type: none;">Component: CCSQ</li>
<li style="list-style-type: none;">Request type: I’m having a problem with my system</li>
<li style="list-style-type: none;">Date of TRB Consult: ` + consultDate.Format("January 2, 2006") + `</li>
</ul>

<p>View this request in EASi:</p>
<ul>
<li>If you are the initial requester, you may <a href="` + trbLink + `">click here</a> to view the advice letter and your request task list.</li>
<li>TRB team members may <a href="` + trbAdminLink + `">click here</a> to view the request details.</li>
<li>Others should contact Mc Lovin or the TRB for more information about this request.</li>
</ul>

<p>If you have questions or need to request a reschedule, please email the TRB at <a href="mailto:` + s.config.TRBEmail.String() + `">` + s.config.TRBEmail.String() + `</a>.</p>
`
		err = client.SendTRBAdviceLetterSubmittedEmail(ctx, input)
		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, allRecipients)
		s.Equal(expectedBody, sender.body)
	})

	s.Run("successful call has the right content (not copying TRB mailbox)", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		input := SendTRBAdviceLetterSubmittedEmailInput{
			TRBRequestID:   trbID,
			RequestName:    "Test TRB Request",
			RequestType:    "NEED_HELP",
			RequesterName:  "Mc Lovin",
			Component:      "Center for Clinical Standards and Quality",
			SubmissionDate: &submissionDate,
			ConsultDate:    &consultDate,
			CopyTRBMailbox: false,
			Recipients:     recipients,
		}

		expectedBody := `<h1 style="margin-bottom: 0.5rem;">EASi</h1>

<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>

<p>The Technical Review Board (TRB) has compiled an advice letter for Test TRB Request. Use the link below to view recommendations from the TRB as well as a summary of the initial support request.</p>

<p><a href="` + adviceLetterLink + `" style="font-weight: bold">View the Advice Letter</a></p>

<p>Any further communication or follow-up sessions may be organized via email with the TRB or via a new request in EASi.</p>

<p><strong>Request summary</strong></p>
<ul style="padding-left: 0;">
<li style="list-style-type: none;">Submission date: ` + submissionDate.Format("January 2, 2006") + `</li>
<li style="list-style-type: none;">Requester: ` + input.RequesterName + `</li>
<li style="list-style-type: none;">Component: CCSQ</li>
<li style="list-style-type: none;">Request type: I’m having a problem with my system</li>
<li style="list-style-type: none;">Date of TRB Consult: ` + consultDate.Format("January 2, 2006") + `</li>
</ul>

<p>View this request in EASi:</p>
<ul>
<li>If you are the initial requester, you may <a href="` + trbLink + `">click here</a> to view the advice letter and your request task list.</li>
<li>TRB team members may <a href="` + trbAdminLink + `">click here</a> to view the request details.</li>
<li>Others should contact Mc Lovin or the TRB for more information about this request.</li>
</ul>

<p>If you have questions or need to request a reschedule, please email the TRB at <a href="mailto:` + s.config.TRBEmail.String() + `">` + s.config.TRBEmail.String() + `</a>.</p>
`

		err = client.SendTRBAdviceLetterSubmittedEmail(ctx, input)
		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, recipients)
		s.Equal(expectedBody, sender.body)
	})
}
