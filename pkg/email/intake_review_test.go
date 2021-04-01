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
	recipientAddress := models.NewEmailAddress("sample@test.com")
	emailBody := "Test Text\n\nTest"
	intakeID := uuid.New()

	s.Run("successful call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		expectedEmail := "<p><pre style=\"white-space: pre-wrap; word-break: keep-all;\">Test Text\n\nTest</pre></p>\n<p>" +
			fmt.Sprintf(
				"<a href=\"%s://%s/governance-task-list/%s\">",
				s.config.URLScheme,
				s.config.URLHost,
				intakeID.String(),
			) +
			"See the most recent status of your request</a></p>\n"

		err = client.SendSystemIntakeReviewEmail(ctx, emailBody, recipientAddress, intakeID)

		s.NoError(err)
		s.Equal(recipientAddress, sender.toAddress)
		s.Equal("Feedback on your intake request", sender.subject)
		s.Equal(expectedEmail, sender.body)
	})

	s.Run("if the template is nil, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates = templates{}

		err = client.SendSystemIntakeReviewEmail(ctx, emailBody, recipientAddress, intakeID)

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

		err = client.SendSystemIntakeReviewEmail(ctx, emailBody, recipientAddress, intakeID)

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

		err = client.SendSystemIntakeReviewEmail(ctx, emailBody, recipientAddress, intakeID)

		s.Error(err)
		s.IsType(err, &apperrors.NotificationError{})
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("sender had an error", e.Err.Error())
	})
}
