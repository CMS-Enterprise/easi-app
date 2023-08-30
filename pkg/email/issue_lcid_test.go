package email

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendIssueLCIDEmails() {
	sender := mockSender{}
	ctx := context.Background()
	intakeID := uuid.MustParse("19b916b7-0d18-493d-b08d-c726cff6c3df")
	projectName := "Test Request"
	requester := "Jane Doe"
	recipient := models.NewEmailAddress("fake@fake.com")
	recipients := models.EmailNotificationRecipients{
		RegularRecipientEmails:   []models.EmailAddress{recipient},
		ShouldNotifyITGovernance: false,
		ShouldNotifyITInvestment: false,
	}
	lcid := "123456"
	expiresAt, _ := time.Parse("2006-01-02", "2021-12-25")
	scope := models.HTML("scope")
	lifecycleCostBaseline := "lifecycleCostBaseline"
	nextSteps := models.HTML("nextSteps")
	feedback := models.HTML("feedback")

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
			"<p>Lifecycle ID: " + lcid + "</p>\n" +
			"<p>Expiration Date: " + expiresAt.Format("January 02, 2006") + "</p>\n" +
			"<p>Scope: <pre style=\"white-space: pre-wrap; word-break: keep-all;\">" + string(scope) + "</pre></p>\n" +
			"<p>Project Cost Baseline: <pre style=\"white-space: pre-wrap; word-break: keep-all;\">" + lifecycleCostBaseline + "</pre></p>\n" +
			"<p>Next Steps: <pre style=\"white-space: pre-wrap; word-break: keep-all;\">" + string(nextSteps) + "</pre></p>\n" +
			"<p>Feedback: <pre style=\"white-space: pre-wrap; word-break: keep-all;\">" + string(feedback) + "</pre></p>\n" +
			"<p>If you are the original author of this request, you may use this link to " +
			decisionPathOpeningTag +
			"view the request in EASi.</a></p>"
		err = client.SendIssueLCIDEmails(ctx, recipients, intakeID, projectName, requester, lcid, &expiresAt, scope, lifecycleCostBaseline, nextSteps, feedback)

		s.NoError(err)
		s.Equal("Lifecycle ID request approved", sender.subject)
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
			"<p>Lifecycle ID: " + string(lcid) + "</p>\n" +
			"<p>Expiration Date: " + expiresAt.Format("January 02, 2006") + "</p>\n" +
			"<p>Scope: <pre style=\"white-space: pre-wrap; word-break: keep-all;\">" + string(scope) + "</pre></p>\n" +
			"<p>Project Cost Baseline: <pre style=\"white-space: pre-wrap; word-break: keep-all;\">" + lifecycleCostBaseline + "</pre></p>\n" +
			"\n" +
			"<p>Feedback: <pre style=\"white-space: pre-wrap; word-break: keep-all;\">" + string(feedback) + "</pre></p>\n" +
			"<p>If you are the original author of this request, you may use this link to " +
			decisionPathOpeningTag +
			"view the request in EASi.</a></p>"
		err = client.SendIssueLCIDEmails(ctx, recipients, intakeID, projectName, requester, lcid, &expiresAt, scope, lifecycleCostBaseline, "", feedback)

		s.NoError(err)
		s.Equal("Lifecycle ID request approved", sender.subject)
		s.ElementsMatch(sender.toAddresses, []models.EmailAddress{recipient})
		s.Equal(expectedEmail, sender.body)
	})

	s.Run("if the template is nil, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates = templates{}

		err = client.SendIssueLCIDEmails(ctx, recipients, intakeID, projectName, requester, lcid, &expiresAt, scope, lifecycleCostBaseline, nextSteps, feedback)

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

		err = client.SendIssueLCIDEmails(ctx, recipients, intakeID, projectName, requester, lcid, &expiresAt, scope, lifecycleCostBaseline, nextSteps, feedback)

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

		err = client.SendIssueLCIDEmails(ctx, recipients, intakeID, projectName, requester, lcid, &expiresAt, scope, lifecycleCostBaseline, nextSteps, feedback)
		s.Error(err)
		s.IsType(&apperrors.NotificationError{}, err)
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("sender had an error", e.Err.Error())
	})

	s.Run("successful call sends to the correct recipients", func() {
		s.runMultipleRecipientsTestAgainstAllTestCases(func(client Client, recipients models.EmailNotificationRecipients) error {
			return client.SendIssueLCIDEmails(ctx, recipients, intakeID, projectName, requester, lcid, &expiresAt, scope, lifecycleCostBaseline, nextSteps, feedback)
		})
	})
}
