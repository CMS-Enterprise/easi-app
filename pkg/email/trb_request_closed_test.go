package email

import (
	"context"
	"fmt"
	"path"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
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

	trbInbox := s.config.TRBEmail.String()

	recipients := []models.EmailAddress{
		models.NewEmailAddress("abcd@local.fake"),
		models.NewEmailAddress("efgh@local.fake"),
	}

	allRecipients := append(recipients, s.config.TRBEmail)

	getExpectedEmail := func(
		requestName string,
		requesterName string,
		reason models.HTML,
	) string {
		var reasonStr string
		if reason.ToTemplate() != "" {
			reasonStr = fmt.Sprintf(
				`<br>
				<div class="no-margin">
				  <p><strong>Reason for closing:</strong></p>
				  %s
				</div>`,
				*reason.StringPointer(),
			)
		}
		return fmt.Sprintf(
			`<h1 class="header-title">EASi</h1>
			<p class="header-subtitle">Easy Access to System Information</p>

			<p>The Technical Review Board (TRB) has closed %s.</p>

			%s

			<br>
			<div class="no-margin">
				<p>View this request in EASi:</p>
				<ul>
					<li>If you are the initial requester, you may <a href="%s">click here</a> to view the advice letter and your request task list.</li>
					<li>TRB team members may <a href="%s">click here</a> to view the request details.</li>
					<li>Others should contact %s or the TRB for more information about this request.</li>
				</ul>
			</div>

			<br>
			<p>If you have questions or need to request a reschedule, please email the TRB at <a href="mailto:%s">%s</a>.</p>`,
			requestName,
			reasonStr,
			trbLink,
			trbAdminLink,
			requesterName,
			trbInbox,
			trbInbox,
		)
	}

	s.Run("successful call has the right content", func() {
		input := SendTRBRequestClosedEmailInput{
			TRBRequestID:   trbID,
			TRBRequestName: "Test TRB Request",
			RequesterName:  "Mc Lovin",
			Recipients:     recipients,
			ReasonClosed:   models.HTML("<p>Just felt like closing it.</p>"),
			CopyTRBMailbox: true,
		}
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		expectedBody := getExpectedEmail(
			input.TRBRequestName,
			input.RequesterName,
			input.ReasonClosed,
		)
		err = client.SendTRBRequestClosedEmail(ctx, input)
		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, allRecipients)
		s.EqualHTML(expectedBody, sender.body)
	})

	s.Run("omits reason if blank", func() {
		input := SendTRBRequestClosedEmailInput{
			TRBRequestID:   trbID,
			TRBRequestName: "Test TRB Request",
			RequesterName:  "Mc Lovin",
			Recipients:     recipients,
			ReasonClosed:   models.HTML(""),
			CopyTRBMailbox: true,
		}
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		expectedBody := getExpectedEmail(
			input.TRBRequestName,
			input.RequesterName,
			input.ReasonClosed,
		)
		err = client.SendTRBRequestClosedEmail(ctx, input)
		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, allRecipients)
		s.EqualHTML(expectedBody, sender.body)
	})
}
