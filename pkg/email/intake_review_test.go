package email

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendIntakeReviewEmail() {
	sender := mockSender{}
	ctx := context.Background()
	intakeID := uuid.MustParse("99ec6414-320a-4f04-a40c-416c0070cc5f")
	projectName := "Reviewable Request"
	requester := "Joe Schmoe"
	recipient := models.NewEmailAddress("sample@test.com")
	emailText := "Test Text\n\nTest"

	taskListPathOpeningTag := fmt.Sprintf(
		"<a href=\"%s://%s/governance-task-list/%s\">",
		s.config.URLScheme,
		s.config.URLHost,
		intakeID.String(),
	)

	s.Run("successful call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		expectedEmail := "<p><pre style=\"white-space: pre-wrap; word-break: keep-all;\">" +
			"You are receiving this email as a part of ongoing work for " + projectName + " in EASi.\n" +
			"If you have any questions, please contact the IT Governance team at " + string(s.config.GRTEmail) +
			" or contact this request's original author, " + requester + ".</pre></p>\n" +
			"<p><pre style=\"white-space: pre-wrap; word-break: keep-all;\">" + emailText + "</pre></p>\n" +
			"<p>If you are the original author of this request, you may use this link to " +
			taskListPathOpeningTag +
			"view the request in EASi.</a></p>"
		err = client.SendSystemIntakeReviewEmail(ctx, recipient, intakeID, projectName, requester, emailText)

		s.NoError(err)
		s.Equal("Feedback for request in EASi", sender.subject)
		s.ElementsMatch(sender.toAddresses, []models.EmailAddress{recipient})
		s.Equal(expectedEmail, sender.body)
	})

	s.Run("if the template is nil, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates = templates{}

		err = client.SendSystemIntakeReviewEmail(ctx, recipient, intakeID, projectName, requester, emailText)

		s.Error(err)
		s.IsType(err, &apperrors.NotificationError{})
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("system intake review template is nil", e.Err.Error())
	})

	s.Run("if the template fails to execute, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates.intakeReviewTemplate = mockFailedTemplateCaller{}

		err = client.SendSystemIntakeReviewEmail(ctx, recipient, intakeID, projectName, requester, emailText)

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

		err = client.SendSystemIntakeReviewEmail(ctx, recipient, intakeID, projectName, requester, emailText)

		s.Error(err)
		s.IsType(err, &apperrors.NotificationError{})
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("sender had an error", e.Err.Error())
	})
}

func (s *EmailTestSuite) TestSendIntakeReviewEmailToMultipleRecipients() {
	ctx := context.Background()
	intakeID := uuid.MustParse("accf1f18-5680-4454-8b0e-2d6275339967")
	projectName := "Reviewable Request"
	requester := "Joe Schmoe"
	emailText := "Test Text\n\nTest"

	s.Run("successful call sends to the correct recipients", func() {
		s.runMultipleRecipientsTestAgainstAllTestCases(func(client Client, recipients models.EmailNotificationRecipients) error {
			return client.SendSystemIntakeReviewEmailToMultipleRecipients(ctx, recipients, intakeID, projectName, requester, emailText)
		})
	})
}
