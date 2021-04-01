package email

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendRejectRequestEmail() {
	sender := mockSender{}
	ctx := context.Background()
	recipient := models.NewEmailAddress("fake@fake.com")
	reason := "reason"
	nextSteps := "nextSteps"
	feedback := "feedback"

	s.Run("successful call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		expectedEmail := "<p>Reason: reason</p>\n<p>Next Steps: <pre style=\"white-space: pre-wrap; word-break: keep-all;\">nextSteps</pre></p>\n\n<p>Feedback: <pre style=\"white-space: pre-wrap; word-break: keep-all;\">feedback</pre></p>"
		err = client.SendRejectRequestEmail(ctx, recipient, reason, nextSteps, feedback)

		s.NoError(err)
		s.Equal(recipient, sender.toAddress)
		s.Equal("Your request has not been approved", sender.subject)
		s.Equal(expectedEmail, sender.body)
	})

	s.Run("successful call has the right content with no next steps", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		expectedEmail := "<p>Reason: reason</p>\n\n<p>Feedback: <pre style=\"white-space: pre-wrap; word-break: keep-all;\">feedback</pre></p>"
		err = client.SendRejectRequestEmail(ctx, recipient, reason, "", feedback)

		s.NoError(err)
		s.Equal(recipient, sender.toAddress)
		s.Equal("Your request has not been approved", sender.subject)
		s.Equal(expectedEmail, sender.body)
	})

	s.Run("if the template is nil, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates = templates{}

		err = client.SendRejectRequestEmail(ctx, recipient, reason, nextSteps, feedback)

		s.Error(err)
		s.IsType(err, &apperrors.NotificationError{})
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("reject request template is nil", e.Err.Error())
	})

	s.Run("if the template fails to execute, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates.rejectRequestTemplate = mockFailedTemplateCaller{}

		err = client.SendRejectRequestEmail(ctx, recipient, reason, nextSteps, feedback)

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

		err = client.SendRejectRequestEmail(ctx, recipient, reason, nextSteps, feedback)

		s.Error(err)
		s.IsType(err, &apperrors.NotificationError{})
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("sender had an error", e.Err.Error())
	})
}
