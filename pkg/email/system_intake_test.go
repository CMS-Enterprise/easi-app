package email

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/apperrors"
)

func (s *EmailTestSuite) TestSendSystemIntakeEmail() {
	sender := mockSender{}

	testName := "Test McTest"
	intakeID, _ := uuid.Parse("1abc2671-c5df-45a0-b2be-c30899b473bf")
	ctx := context.Background()

	s.Run("successful call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		expectedEmail := "<p>Hello,</p>\n\n" +
			"<p>\n  You have a new intake request pending in EASi.\n  " +
			"Please get back to the requester as soon as possible with your response.\n</p>\n\n" +
			fmt.Sprintf(
				"<a href=\"%s://%s/governance-review-team/%s/intake-request\" >",
				s.config.URLScheme,
				s.config.URLHost,
				intakeID.String(),
			) +
			"Open intake request for " + testName + " in EASi</a>\n"
		err = client.SendSystemIntakeSubmissionEmail(ctx, testName, intakeID)

		s.NoError(err)
		s.Equal(s.config.GRTEmail, sender.toAddress)
		s.Equal(fmt.Sprintf("New intake request: %s", testName), sender.subject)
		s.Equal(expectedEmail, sender.body)
	})

	s.Run("if the template is nil, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates = templates{}

		err = client.SendSystemIntakeSubmissionEmail(ctx, testName, intakeID)

		s.Error(err)
		s.IsType(err, &apperrors.NotificationError{})
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("system intake submission template is nil", e.Err.Error())
	})

	s.Run("if the template fails to execute, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates.systemIntakeSubmissionTemplate = mockFailedTemplateCaller{}

		err = client.SendSystemIntakeSubmissionEmail(ctx, testName, intakeID)

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

		err = client.SendSystemIntakeSubmissionEmail(ctx, testName, intakeID)

		s.Error(err)
		s.IsType(err, &apperrors.NotificationError{})
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("sender had an error", e.Err.Error())
	})
}
