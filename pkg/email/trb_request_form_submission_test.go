package email

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendTRBFormSubmissionTemplateToAdmins() {
	sender := mockSender{}
	ctx := context.Background()

	s.Run("successful call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		requestName := "TestRequest"
		requesterName := "Test Requester"
		component := "TestComponent"

		// TODO - EASI-2488 - put correct path here
		adminViewOpeningTag := fmt.Sprintf(
			"<a href=\"%s://%s/TODO/admin-view\" style=\"font-weight: bold\">",
			s.config.URLScheme,
			s.config.URLHost,
		)

		expectedEmail := "<h1 style=\"margin-bottom: 0.5rem;\">EASi</h1>\n\n" +
			"<span style=\"font-size:15px; line-height: 18px; color: #71767A\">Easy Access to System Information</span>\n\n" +
			"<p>" + requesterName + " has submitted a new TRB Request, " + requestName + ", for " + component + ". " +
			"Use the link below to review the request in EASi and assign a TRB lead. " +
			"A member of the TRB should respond within two business days with feedback about the request.</p>\n\n" +
			"<p>" + adminViewOpeningTag + "View the request in EASi</a></p>\n\n" +
			"Next steps:\n<ul>\n" +
			"<li>Review the request and assign a TRB lead.</li>\n" +
			"<li>Work with " + requesterName + " and the project team to decide on a day and time for the TRB consult session, and add the date in EASi.</li>\n" +
			"<li>Send a separate calendar invite with a remote video conferencing meeting link.</li>\n" +
			"</ul>\n"

		err = client.SendTRBFormSubmissionNotificationToAdmins(ctx, requestName, requesterName, component)

		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, []models.EmailAddress{s.config.TRBEmail})
		s.Equal(fmt.Sprintf("A new TRB Request has been submitted (%s)", requestName), sender.subject)
		s.Equal(expectedEmail, sender.body)
	})

	s.Run("if the template is nil, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates = templates{}

		err = client.SendTRBFormSubmissionNotificationToAdmins(ctx, "testRequest", "testRequester", "testComponent")

		s.Error(err)
		s.IsType(err, &apperrors.NotificationError{})
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("TRB Form Submission Admin template is nil", e.Err.Error())
	})

	s.Run("if the template fails to execute, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates.trbFormSubmittedAdmin = mockFailedTemplateCaller{}

		err = client.SendTRBFormSubmissionNotificationToAdmins(ctx, "testRequest", "testRequester", "testComponent")

		s.Error(err)
		s.IsType(err, &apperrors.NotificationError{})
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("template caller had an error", e.Err.Error())
	})

	s.Run("if the sender fails, we get the error from it", func() {
		sender := mockFailedSender{}

		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		err = client.SendTRBFormSubmissionNotificationToAdmins(ctx, "testRequest", "testRequester", "testComponent")

		s.Error(err)
		s.IsType(err, &apperrors.NotificationError{})
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("sender had an error", e.Err.Error())
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

		requesterViewOpeningTag := fmt.Sprintf(
			"<a href=\"%s://%s/trb/task-list/%s\" style=\"font-weight: bold\">",
			s.config.URLScheme,
			s.config.URLHost,
			requestID,
		)

		mailToTRBInboxElement := fmt.Sprintf(
			"<a href=\"mailto:%s\">%s</a>",
			s.config.TRBEmail,
			s.config.TRBEmail,
		)

		expectedEmail := "<h1 style=\"margin-bottom: 0.5rem;\">EASi</h1>\n\n" +
			"<span style=\"font-size:15px; line-height: 18px; color: #71767A\">Easy Access to System Information</span>\n\n" +
			"<p>You have completed the initial request form for your TRB Request (" + requestName + "). " +
			"The TRB will review it and get back to you within two business days with feedback about your request. They will then work with you to schedule a time for your TRB consult session.</p>\n\n" +
			requesterViewOpeningTag + "View your request in EASi</a>\n\n" +
			"<p>If you have questions, please contact the Technical Review Board (TRB) at " + mailToTRBInboxElement + ".</p>\n\n" +
			"<hr>\n\n" +
			"<p>You will continue to receive email notifications about your request until it is closed.</p>\n"

		err = client.SendTRBFormSubmissionNotificationToRequester(ctx, requestID, requestName, requesterEmail, requesterName)

		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, []models.EmailAddress{requesterEmail})
		s.Equal(fmt.Sprintf("Your TRB Request form has been submitted (%s)", requestName), sender.subject)
		s.Equal(expectedEmail, sender.body)
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
		s.IsType(err, &apperrors.NotificationError{})
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("TRB Form Submission Requester template is nil", e.Err.Error())
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
		s.IsType(err, &apperrors.NotificationError{})
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("template caller had an error", e.Err.Error())
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
		s.IsType(err, &apperrors.NotificationError{})
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("sender had an error", e.Err.Error())
	})
}
