package email

import (
	"context"
	"fmt"
	"path"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/email/translation"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestTRBGuidanceLetterSubmittedEmail() {
	sender := mockSender{}
	ctx := context.Background()

	trbID := uuid.New()

	submissionDate, err := time.Parse(time.RFC3339, "2022-02-01T13:30:00+00:00")
	s.NoError(err)
	consultDate, err := time.Parse(time.RFC3339, "2022-01-01T13:30:00+00:00")
	s.NoError(err)

	recipients := []models.EmailAddress{
		models.NewEmailAddress("abcd@local.fake"),
		models.NewEmailAddress("efgh@local.fake"),
	}

	getExpectedEmail := func(
		requestName string,
		requesterName string,
		component string,
		submissionDate *time.Time,
		consultDate *time.Time,
		requestType models.TRBRequestType,
	) string {
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

		guidanceLetterLink := fmt.Sprintf(
			"%s://%s/%s",
			s.config.URLScheme,
			s.config.URLHost,
			path.Join("trb", "guidance-letter", trbID.String()),
		)

		trbInbox := s.config.TRBEmail.String()

		if component == "" {
			component = "None Selected"
		}

		return fmt.Sprintf(
			`<h1 class="header-title">EASi</h1>
			<p class="header-subtitle">Easy Access to System Information</p>

			<p>The Technical Review Board (TRB) has compiled a guidance letter for %s. Use the link below to view recommendations from the TRB as well as a summary of the initial support request.</p>

			<br>
			<p class="no-margin-top"><strong><a href="%s">View the Guidance Letter</a></strong></p>

			<br>
			<p class="no-margin-top">Any further communication or follow-up sessions may be organized via email with the TRB or via a new request in EASi.</p>

			<br>
			<div class="no-margin">
			  <p><u>Request summary</u></p>
			  <p><strong>Submission date:</strong> %s</p>
			  <p><strong>Requester:</strong> %s</p>
			  <p><strong>Component:</strong> %s</p>
			  <p><strong>Request type:</strong> %s</p>
			  <p><strong>Date of TRB Consult:</strong> %s</p>
			</div>

			<br>
			<br>
			<div class="no-margin">
			<p>View this request in EASi:</p>
			  <ul>
				<li>If you are the initial requester, you may <a href="%s">click here</a> to view the guidance letter and your request task list.</li>
				<li>TRB team members may <a href="%s">click here</a> to view the request details.</li>
				<li>Others should contact %s or the TRB for more information about this request.</li>
			  </ul>
			</div>

			<br>
			<p>If you have questions or need to request a reschedule, please email the TRB at <a href="mailto:%s">%s</a>.</p>`,
			requestName,
			guidanceLetterLink,
			submissionDate.Format("January 2, 2006"),
			requesterName,
			translation.GetComponentAcronym(component),
			translation.GetTRBResponseType(string(requestType)),
			consultDate.Format("January 2, 2006"),
			trbLink,
			trbAdminLink,
			requesterName,
			trbInbox,
			trbInbox,
		)
	}

	s.Run("successful call has the right content (copying TRB mailbox)", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		requestType := models.TRBTNeedHelp
		input := SendTRBGuidanceLetterSubmittedEmailInput{
			TRBRequestID:   trbID,
			RequestName:    "Test TRB Request",
			RequestType:    string(requestType),
			RequesterName:  "Mc Lovin",
			Component:      "Center for Clinical Standards and Quality",
			SubmissionDate: &submissionDate,
			ConsultDate:    &consultDate,
			CopyTRBMailbox: true,
			Recipients:     recipients,
		}
		allRecipients := append(recipients, s.config.TRBEmail)

		expectedBody := getExpectedEmail(
			input.RequestName,
			input.RequesterName,
			input.Component,
			input.SubmissionDate,
			input.ConsultDate,
			requestType,
		)
		err = client.SendTRBGuidanceLetterSubmittedEmail(ctx, input)
		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, allRecipients)
		s.EqualHTML(expectedBody, sender.body)
	})

	s.Run("successful call has the right content (not copying TRB mailbox)", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		requestType := models.TRBTNeedHelp
		input := SendTRBGuidanceLetterSubmittedEmailInput{
			TRBRequestID:   trbID,
			RequestName:    "Test TRB Request",
			RequestType:    string(requestType),
			RequesterName:  "Mc Lovin",
			Component:      "Center for Clinical Standards and Quality",
			SubmissionDate: &submissionDate,
			ConsultDate:    &consultDate,
			CopyTRBMailbox: false,
			Recipients:     recipients,
		}

		expectedBody := getExpectedEmail(
			input.RequestName,
			input.RequesterName,
			input.Component,
			input.SubmissionDate,
			input.ConsultDate,
			requestType,
		)
		err = client.SendTRBGuidanceLetterSubmittedEmail(ctx, input)
		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, recipients)
		s.EqualHTML(expectedBody, sender.body)
	})
}
