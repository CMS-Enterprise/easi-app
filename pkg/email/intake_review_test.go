package email

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/apperrors"
)

func (s *EmailTestSuite) TestSendIntakeReviewEmail() {
	sender := mockSender{}
	ctx := context.Background()
	recipientAddress := "sample@test.com"
	emailBody := "Test Text\n\nTest"

	s.Run("successful call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		expectedEmail := "<p>Test Text\n\nTest</p>\n"

		err = client.SendSystemIntakeReviewEmail(ctx, emailBody, recipientAddress)

		s.NoError(err)
		s.Equal(recipientAddress, sender.toAddress)
		s.Equal("Feedback on your intake request", sender.subject)
		s.Equal(expectedEmail, sender.body)
	})

	s.Run("if the template is nil, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates = templates{}

		err = client.SendSystemIntakeReviewEmail(ctx, emailBody, recipientAddress)

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

		err = client.SendSystemIntakeReviewEmail(ctx, emailBody, recipientAddress)

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

		err = client.SendSystemIntakeReviewEmail(ctx, emailBody, recipientAddress)

		s.Error(err)
		s.IsType(err, &apperrors.NotificationError{})
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("sender had an error", e.Err.Error())
	})
}
