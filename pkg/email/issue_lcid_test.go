package email

import (
	"context"
	"time"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendIssueLCIDEmail() {
	sender := mockSender{}
	ctx := context.Background()
	recipient := models.NewEmailAddress("fake@fake.com")
	lcid := "123456"
	expiresAt, _ := time.Parse("2006-01-02", "2021-12-25")
	scope := "scope"
	nextSteps := "nextSteps"
	feedback := "feedback"

	s.Run("successful call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		expectedEmail := "<p>Lifecycle ID: 123456</p>\n<p>Expiration Date: January 1, 0001</p>\n<p>Scope: <pre style=\"white-space: pre-wrap; word-break: keep-all;\">scope</pre></p>\n" +
			"<p>Next Steps: <pre style=\"white-space: pre-wrap; word-break: keep-all;\">nextSteps</pre></p>\n\n<p>Feedback: <pre style=\"white-space: pre-wrap; word-break: keep-all;\">feedback</pre></p>"
		err = client.SendIssueLCIDEmail(ctx, recipient, lcid, &expiresAt, scope, nextSteps, feedback)

		s.NoError(err)
		s.Equal(recipient, sender.toAddress)
		s.Equal("Your request has been approved", sender.subject)
		s.Equal(expectedEmail, sender.body)
	})

	s.Run("successful call has the right content with no next steps", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		expectedEmail := "<p>Lifecycle ID: 123456</p>\n<p>Expiration Date: January 1, 0001</p>\n<p>Scope: <pre style=\"white-space: pre-wrap; word-break: keep-all;\">scope</pre></p>" +
			"\n\n<p>Feedback: <pre style=\"white-space: pre-wrap; word-break: keep-all;\">feedback</pre></p>"
		err = client.SendIssueLCIDEmail(ctx, recipient, lcid, &expiresAt, scope, "", feedback)

		s.NoError(err)
		s.Equal(recipient, sender.toAddress)
		s.Equal("Your request has been approved", sender.subject)
		s.Equal(expectedEmail, sender.body)
	})

	s.Run("if the template is nil, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates = templates{}

		err = client.SendIssueLCIDEmail(ctx, recipient, lcid, &expiresAt, scope, nextSteps, feedback)

		s.Error(err)
		s.IsType(err, &apperrors.NotificationError{})
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("issue LCID template is nil", e.Err.Error())
	})

	s.Run("if the template fails to execute, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates.issueLCIDTemplate = mockFailedTemplateCaller{}

		err = client.SendIssueLCIDEmail(ctx, recipient, lcid, &expiresAt, scope, nextSteps, feedback)

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

		err = client.SendIssueLCIDEmail(ctx, recipient, lcid, &expiresAt, scope, nextSteps, feedback)

		s.Error(err)
		s.IsType(err, &apperrors.NotificationError{})
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("sender had an error", e.Err.Error())
	})
}
