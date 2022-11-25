package email

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendTRBFormSubmissionTemplateToAdmins() {
	sender := mockSender{}
	ctx := context.Background()

	s.Run("successful call has the right content", func() {
		// TODO
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
		// TODO
	})

	s.Run("if the template is nil, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates = templates{}

		err = client.SendTRBFormSubmissionNotificationToRequester(ctx, models.NewEmailAddress("test@fake.email"), "testRequest", "testRequester")

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

		err = client.SendTRBFormSubmissionNotificationToRequester(ctx, models.NewEmailAddress("test@fake.email"), "testRequest", "testRequester")

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

		err = client.SendTRBFormSubmissionNotificationToRequester(ctx, models.NewEmailAddress("test@fake.email"), "testRequest", "testRequester")

		s.Error(err)
		s.IsType(err, &apperrors.NotificationError{})
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("sender had an error", e.Err.Error())
	})
}
