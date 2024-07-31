package email

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendTRBReadyForConsultNotification() {
	sender := mockSender{}
	ctx := context.Background()

	requestID := uuid.MustParse("3306730d-a16a-407c-b73f-3b0bfffac6b5")
	requestName := "TestRequest"
	requesterName := "Test Requester"

	recipients := []models.EmailAddress{
		models.NewEmailAddress("abcd@local.fake"),
		models.NewEmailAddress("efgh@local.fake"),
	}

	getExpectedEmail := func(
		feedback models.HTML,
	) string {
		var feedbackStr string
		if *feedback.StringPointer() != "" {
			feedbackStr = fmt.Sprintf(
				`<br>
				<div class="no-margin">
				  <p><strong>Feedback:</strong></p>
				  %s
				</div>
				<br>`,
				*feedback.StringPointer(),
			)
		}
		taskListViewLink := fmt.Sprintf(
			`%s://%s/trb/task-list/%s`,
			s.config.URLScheme,
			s.config.URLHost,
			requestID,
		)

		adminViewLink := fmt.Sprintf(
			`%s://%s/trb/%s/request`,
			s.config.URLScheme,
			s.config.URLHost,
			requestID,
		)

		trbInbox := s.config.TRBEmail
		return fmt.Sprintf(`<h1 class="header-title">EASi</h1>
			<p class="header-subtitle">Easy Access to System Information</p>

			<p>The Technical Review Board (TRB) has reviewed the initial request form for %s and is now ready to schedule a consult session.</p>

			%s

			<br>
			<div class="no-margin">
			  <p>Next steps:</p>
			  <ul>
				<li>If they haven't already, the TRB will assign a TRB lead for this request to help process the request and facilitate the consult session.</li>
				<li>The TRB lead will work with %s and their project team to decide on a day and time for the TRB consult session.</li>
				<li>Then they will add the date in EASi and send a separate calendar invite with a remote video conferencing meeting link.</li>
			  </ul>
			</div>

			<br>
			<div class="no-margin">
			  <p>View this request in EASi:</p>
			  <ul>
				<li>If you are the initial requester, you may <a href="%s">click here</a> to view your request task list.</li>
				<li>TRB team members may <a href="%s">click here</a> to view the request details.</li>
				<li>Others should contact %s or the TRB for more information about this request.</li>
			  </ul>
			</div>

			<br>
			<br>
			<p class="no-margin-top">If you have questions, please email the TRB at <a href="mailto:%s">%s</a>.</p>

			<br>
			<hr>

			<p>Depending on the request, you may continue to receive email notifications about this request until it is closed.</p>`,
			requestName,
			feedbackStr,
			requesterName,
			taskListViewLink,
			adminViewLink,
			requesterName,
			trbInbox,
			trbInbox,
		)
	}

	s.Run("successful call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		feedback := models.HTML("<p>This is feedback</p>")
		expectedEmail := getExpectedEmail(feedback)
		err = client.SendTRBReadyForConsultNotification(
			ctx,
			recipients,
			false,
			requestID,
			requestName,
			requesterName,
			feedback,
		)
		s.NoError(err)
		s.Equal(fmt.Sprintf("%v is ready for a consult session", requestName), sender.subject)
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("successful call has the right content (no feedback)", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		feedback := models.HTML("")
		expectedEmail := getExpectedEmail(feedback)
		err = client.SendTRBReadyForConsultNotification(
			ctx,
			recipients,
			false,
			requestID,
			requestName,
			requesterName,
			feedback,
		)
		s.NoError(err)
		s.Equal(fmt.Sprintf("%v is ready for a consult session", requestName), sender.subject)
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("successful call copying the TRB mailbox sends to all recipients and the TRB mailbox", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		requestID := uuid.MustParse("fafa02b6-a992-43a2-9a0f-ff8980d35f81")
		requestName := "TestRequest"
		requesterName := "Test Requester"
		feedback := "Very good form"
		recipients := []models.EmailAddress{
			models.NewEmailAddress("abcd@local.fake"),
			models.NewEmailAddress("efgh@local.fake"),
		}
		allRecipients := append(recipients, s.config.TRBEmail)

		err = client.SendTRBReadyForConsultNotification(ctx, recipients, true, requestID, requestName, requesterName, models.HTML(feedback))
		s.NoError(err)

		s.ElementsMatch(sender.toAddresses, allRecipients)
	})

	s.Run("successful call *not* copying the TRB mailbox sends to all recipients, but not the TRB mailbox", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		requestID := uuid.MustParse("aaf51987-a11c-48ea-ac6c-697346b0dad4")
		requestName := "TestRequest"
		requesterName := "Test Requester"
		feedback := "Very good form"
		recipients := []models.EmailAddress{
			models.NewEmailAddress("abcd@local.fake"),
			models.NewEmailAddress("efgh@local.fake"),
		}

		err = client.SendTRBReadyForConsultNotification(ctx, recipients, false, requestID, requestName, requesterName, models.HTML(feedback))
		s.NoError(err)

		s.ElementsMatch(sender.toAddresses, recipients)
		s.NotContains(sender.toAddresses, s.config.TRBEmail)
	})

	s.Run("if the template is nil, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates = templates{}

		requestID := uuid.MustParse("2e11f773-5703-4d27-82a8-3924ecab4d5b")
		requestName := "TestRequest"
		requesterName := "Test Requester"
		feedback := "Very good form"
		recipients := []models.EmailAddress{
			models.NewEmailAddress("abcd@local.fake"),
			models.NewEmailAddress("efgh@local.fake"),
		}

		err = client.SendTRBReadyForConsultNotification(ctx, recipients, true, requestID, requestName, requesterName, models.HTML(feedback))

		s.Error(err)
		s.Equal("TRB Ready for Consult template is nil", err.Error())
	})

	s.Run("if the template fails to execute, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates.trbReadyForConsult = mockFailedTemplateCaller{}

		requestID := uuid.MustParse("ff44e66d-bd2c-4d2e-b7f2-0258f169dbdb")
		requestName := "TestRequest"
		requesterName := "Test Requester"
		feedback := "Very good form"
		recipients := []models.EmailAddress{
			models.NewEmailAddress("abcd@local.fake"),
			models.NewEmailAddress("efgh@local.fake"),
		}

		err = client.SendTRBReadyForConsultNotification(ctx, recipients, true, requestID, requestName, requesterName, models.HTML(feedback))

		s.Error(err)
		s.Equal("template caller had an error", err.Error())
	})

	s.Run("if the sender fails, we get the error from it", func() {
		sender := mockFailedSender{}

		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		requestID := uuid.MustParse("6dfc1479-73fe-461e-9471-ed9c81cdbda8")
		requestName := "TestRequest"
		requesterName := "Test Requester"
		feedback := "Very good form"
		recipients := []models.EmailAddress{
			models.NewEmailAddress("abcd@local.fake"),
			models.NewEmailAddress("efgh@local.fake"),
		}

		err = client.SendTRBReadyForConsultNotification(ctx, recipients, true, requestID, requestName, requesterName, models.HTML(feedback))

		s.Error(err)
		s.Equal("sender had an error", err.Error())
	})
}
