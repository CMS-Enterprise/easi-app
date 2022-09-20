package email

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendRejectRequestEmail() {
	sender := mockSender{}
	ctx := context.Background()
	intakeID := uuid.MustParse("02823bd2-fcd5-4aa3-85c8-92ef16e1f451")
	projectName := "Impractical Request"
	requester := "Leeroy Jenkins"
	recipient := models.NewEmailAddress("fake@fake.com")
	reason := "reason"
	nextSteps := "nextSteps"
	feedback := "feedback"

	decisionPathOpeningTag := fmt.Sprintf(
		"<a href=\"%s://%s/governance-task-list/%s/request-decision\">",
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
			"<p>Reason: reason</p>\n" +
			"<p>Next Steps: <pre style=\"white-space: pre-wrap; word-break: keep-all;\">nextSteps</pre></p>\n\n" +
			"<p>Feedback: <pre style=\"white-space: pre-wrap; word-break: keep-all;\">feedback</pre></p>\n" +
			"<p>If you are the original author of this request, you may use this link to " +
			decisionPathOpeningTag +
			"view the request in EASi.</a></p>"
		err = client.SendRejectRequestEmail(ctx, recipient, intakeID, projectName, requester, reason, nextSteps, feedback)

		s.NoError(err)
		s.Equal("Request in EASi not approved", sender.subject)
		s.ElementsMatch(sender.toAddresses, []models.EmailAddress{recipient})
		s.Equal(expectedEmail, sender.body)
	})

	s.Run("successful call has the right content with no next steps", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		expectedEmail := "<p><pre style=\"white-space: pre-wrap; word-break: keep-all;\">" +
			"You are receiving this email as a part of ongoing work for " + projectName + " in EASi.\n" +
			"If you have any questions, please contact the IT Governance team at " + string(s.config.GRTEmail) +
			" or contact this request's original author, " + requester + ".</pre></p>\n" +
			"<p>Reason: reason</p>\n" +
			"\n" +
			"<p>Feedback: <pre style=\"white-space: pre-wrap; word-break: keep-all;\">feedback</pre></p>\n" +
			"<p>If you are the original author of this request, you may use this link to " +
			decisionPathOpeningTag +
			"view the request in EASi.</a></p>"
		err = client.SendRejectRequestEmail(ctx, recipient, intakeID, projectName, requester, reason, "", feedback)

		s.NoError(err)
		s.Equal("Request in EASi not approved", sender.subject)
		s.ElementsMatch(sender.toAddresses, []models.EmailAddress{recipient})
		s.Equal(expectedEmail, sender.body)
	})

	s.Run("if the template is nil, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates = templates{}

		err = client.SendRejectRequestEmail(ctx, recipient, intakeID, projectName, requester, reason, nextSteps, feedback)

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

		err = client.SendRejectRequestEmail(ctx, recipient, intakeID, projectName, requester, reason, nextSteps, feedback)

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

		err = client.SendRejectRequestEmail(ctx, recipient, intakeID, projectName, requester, reason, nextSteps, feedback)

		s.Error(err)
		s.IsType(err, &apperrors.NotificationError{})
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("sender had an error", e.Err.Error())
	})
}

func (s *EmailTestSuite) TestSendRejectRequestEmailToMultipleRecipients() {
	ctx := context.Background()
	intakeID := uuid.MustParse("27883155-46ad-4c30-b3b0-30e8d093756e")
	projectName := "Impractical Request"
	requester := "Leeroy Jenkins"
	reason := "reason"
	nextSteps := "nextSteps"
	feedback := "feedback"

	decisionPathOpeningTag := fmt.Sprintf(
		"<a href=\"%s://%s/governance-task-list/%s/request-decision\">",
		s.config.URLScheme,
		s.config.URLHost,
		intakeID.String(),
	)

	s.Run("successful call sends to the correct recipients", func() {
		s.runMultipleRecipientsTestAgainstAllTestCases(func(client Client, recipients models.EmailNotificationRecipients) error {
			return client.SendRejectRequestEmailToMultipleRecipients(ctx, recipients, intakeID, projectName, requester, reason, nextSteps, feedback)
		})
	})

	sender := mockSender{}
	recipient := models.NewEmailAddress("fake@fake.com")
	recipients := models.EmailNotificationRecipients{
		RegularRecipientEmails:   []models.EmailAddress{recipient},
		ShouldNotifyITGovernance: false,
		ShouldNotifyITInvestment: false,
	}

	s.Run("successful call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		expectedEmail := "<p><pre style=\"white-space: pre-wrap; word-break: keep-all;\">" +
			"You are receiving this email as a part of ongoing work for " + projectName + " in EASi.\n" +
			"If you have any questions, please contact the IT Governance team at " + string(s.config.GRTEmail) +
			" or contact this request's original author, " + requester + ".</pre></p>\n" +
			"<p>Reason: reason</p>\n" +
			"<p>Next Steps: <pre style=\"white-space: pre-wrap; word-break: keep-all;\">nextSteps</pre></p>\n\n" +
			"<p>Feedback: <pre style=\"white-space: pre-wrap; word-break: keep-all;\">feedback</pre></p>\n" +
			"<p>If you are the original author of this request, you may use this link to " +
			decisionPathOpeningTag +
			"view the request in EASi.</a></p>"
		err = client.SendRejectRequestEmailToMultipleRecipients(ctx, recipients, intakeID, projectName, requester, reason, nextSteps, feedback)

		s.NoError(err)
		s.Equal("Request in EASi not approved", sender.subject)
		s.Equal(expectedEmail, sender.body)
	})

	s.Run("successful call has the right content with no next steps", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		expectedEmail := "<p><pre style=\"white-space: pre-wrap; word-break: keep-all;\">" +
			"You are receiving this email as a part of ongoing work for " + projectName + " in EASi.\n" +
			"If you have any questions, please contact the IT Governance team at " + string(s.config.GRTEmail) +
			" or contact this request's original author, " + requester + ".</pre></p>\n" +
			"<p>Reason: reason</p>\n" +
			"\n" +
			"<p>Feedback: <pre style=\"white-space: pre-wrap; word-break: keep-all;\">feedback</pre></p>\n" +
			"<p>If you are the original author of this request, you may use this link to " +
			decisionPathOpeningTag +
			"view the request in EASi.</a></p>"
		err = client.SendRejectRequestEmailToMultipleRecipients(ctx, recipients, intakeID, projectName, requester, reason, "", feedback)

		s.NoError(err)
		s.Equal("Request in EASi not approved", sender.subject)
		s.Equal(expectedEmail, sender.body)
	})

	s.Run("if the template is nil, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates = templates{}

		err = client.SendRejectRequestEmailToMultipleRecipients(ctx, recipients, intakeID, projectName, requester, reason, nextSteps, feedback)

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

		err = client.SendRejectRequestEmailToMultipleRecipients(ctx, recipients, intakeID, projectName, requester, reason, nextSteps, feedback)

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

		err = client.SendRejectRequestEmailToMultipleRecipients(ctx, recipients, intakeID, projectName, requester, reason, nextSteps, feedback)

		s.Error(err)
		s.IsType(&apperrors.NotificationError{}, err)
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("sender had an error", e.Err.Error())
	})
}
