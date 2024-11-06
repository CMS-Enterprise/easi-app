package email

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendTRBFormSubmissionTemplateToAdmins() {
	sender := mockSender{}
	ctx := context.Background()
	requestID := uuid.New()

	requestName := "TestRequest"
	requesterName := "Test Requester"
	component := "TestComponent"

	adminViewLink := fmt.Sprintf(
		`%s://%s/trb/%s/request`,
		s.config.URLScheme,
		s.config.URLHost,
		requestID,
	)

	getExpectedEmail := func() string {
		return fmt.Sprintf(
			`<h1 class="header-title">EASi</h1>
			<p class="header-subtitle">Easy Access to System Information</p>

			<p>%s has submitted a new TRB Request, %s, for %s. Use the link below to review the request in EASi and assign a TRB lead. A member of the TRB should respond within two business days with feedback about the request.</p>

			<br>
			<p class="no-margin"><strong><a href="%s">View the request in EASi</a></strong><p>

			<br>
			<div class="no-margin">
			  <p>Next steps:</p>
			  <ul>
				<li>Review the request and assign a TRB lead.</li>
				<li>Work with %s and the project team to decide on a day and time for the TRB consult session, and add the date in EASi.</li>
				<li>Send a separate calendar invite with a remote video conferencing meeting link.</li>
			  </ul>
			</div>`,
			requesterName,
			requestName,
			component,
			adminViewLink,
			requesterName,
		)
	}
	s.Run("successful call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		expectedEmail := getExpectedEmail()
		err = client.SendTRBFormSubmissionNotificationToAdmins(ctx, requestID, requestName, requesterName, component)

		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, []models.EmailAddress{s.config.TRBEmail})
		s.Equal(fmt.Sprintf("A new TRB Request has been submitted (%s)", requestName), sender.subject)
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("if the template is nil, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates = templates{}

		err = client.SendTRBFormSubmissionNotificationToAdmins(ctx, requestID, "testRequest", "testRequester", "testComponent")

		s.Error(err)
		s.Equal("TRB Form Submission Admin template is nil", err.Error())
	})

	s.Run("if the template fails to execute, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates.trbFormSubmittedAdmin = mockFailedTemplateCaller{}

		err = client.SendTRBFormSubmissionNotificationToAdmins(ctx, requestID, "testRequest", "testRequester", "testComponent")

		s.Error(err)
		s.Equal("template caller had an error", err.Error())
	})

	s.Run("if the sender fails, we get the error from it", func() {
		sender := mockFailedSender{}

		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		err = client.SendTRBFormSubmissionNotificationToAdmins(ctx, requestID, "testRequest", "testRequester", "testComponent")

		s.Error(err)
		s.Equal("sender had an error", err.Error())
	})
}

func (s *EmailTestSuite) TestSendTRBFormSubmissionTemplateToRequester() {
	sender := mockSender{}
	ctx := context.Background()

	s.Run("successful call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		requestID := uuid.MustParse("1b53e333-fc2e-4b59-9ba2-7bcd3f32ce55")
		requestName := "TestRequest"
		requesterEmail := models.NewEmailAddress("test.requester@test.com")
		requesterName := "Test Requester"

		taskListViewLink := fmt.Sprintf(
			`%s://%s/trb/task-list/%s`,
			s.config.URLScheme,
			s.config.URLHost,
			requestID,
		)

		mailToTRBInboxLink := s.config.TRBEmail.String()

		getExpectedEmail := func() string {
			return fmt.Sprintf(
				`<h1 class="header-title">EASi</h1>
				<p class="header-subtitle">Easy Access to System Information</p>

				<p>You have completed the initial request form for your TRB Request (%s). The TRB will review it and get back to you within two business days with feedback about your request. They will then work with you to schedule a time for your TRB consult session.</p>

				<br>
				<p class="no-margin-top"><strong><a href="%s">View your request in EASi</a></strong><p>

				<br>
				<p>If you have questions, please contact the Technical Review Board (TRB) at <a href="mailto:%s">%s</a>.</p>

				<br>
				<hr>

				<p>You will continue to receive email notifications about your request until it is closed.</p>`,
				requestName,
				taskListViewLink,
				mailToTRBInboxLink,
				mailToTRBInboxLink,
			)

		}

		expectedEmail := getExpectedEmail()

		err = client.SendTRBFormSubmissionNotificationToRequester(ctx, requestID, requestName, requesterEmail, requesterName)

		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, []models.EmailAddress{requesterEmail})
		s.Equal(fmt.Sprintf("Your TRB Request form has been submitted (%s)", requestName), sender.subject)
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("if the template is nil, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates = templates{}

		err = client.SendTRBFormSubmissionNotificationToRequester(
			ctx,
			uuid.New(),
			"testRequest",
			models.NewEmailAddress("test@fake.email"),
			"testRequester",
		)

		s.Error(err)
		s.Equal("TRB Form Submission Requester template is nil", err.Error())
	})

	s.Run("if the template fails to execute, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates.trbFormSubmittedRequester = mockFailedTemplateCaller{}

		err = client.SendTRBFormSubmissionNotificationToRequester(
			ctx,
			uuid.New(),
			"testRequest",
			models.NewEmailAddress("test@fake.email"),
			"testRequester",
		)

		s.Error(err)
		s.Equal("template caller had an error", err.Error())
	})

	s.Run("if the sender fails, we get the error from it", func() {
		sender := mockFailedSender{}

		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		err = client.SendTRBFormSubmissionNotificationToRequester(
			ctx,
			uuid.New(),
			"testRequest",
			models.NewEmailAddress("test@fake.email"),
			"testRequester",
		)

		s.Error(err)
		s.Equal("sender had an error", err.Error())
	})
}
