package email

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendLCIDExpirationAlertEmail() {
	sender := mockSender{}
	ctx := context.Background()
	recipient := models.NewEmailAddress("fake@fake.com")
	recipients := models.EmailNotificationRecipients{
		RegularRecipientEmails:   []models.EmailAddress{recipient},
		ShouldNotifyITGovernance: true,
		ShouldNotifyITInvestment: false,
	}
	// allRecipients := append(recipients, s.config.TRBEmail)
	intakeID := uuid.MustParse("19b916b7-0d18-493d-b08d-c726cff6c3df")
	projectName := "Test Request"
	lcid := "123456"
	scope := "scope"
	lifecycleCostBaseline := "lifecycleCostBaseline"
	nextSteps := "nextSteps"
	lcidExpiresAt, _ := time.Parse("2006-01-02", "2021-12-25")
	decisionPath := fmt.Sprintf(
		"<a href=\"governance-task-list/%s/request-decision\" style=\"font-weight: bold\">View the request in EASi</a>",
		intakeID.String(),
	)

	s.Run("successful call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		expectedEmail := "<p><pre style=\"white-space: pre-wrap; word-break: keep-all;\">Lifecycle ID issued for " +
			projectName +
			" is set to expire on " +
			lcidExpiresAt.Format("January 02, 2006") + ".\n" +
			"If your Lifecycle ID expires, your project will be operating under an expired Lifecycle ID and will be added to the CIO risk register</p>\n\n" +
			"<p>To avoid this please email the Governance Team at " +
			string(s.config.GRTEmail) +
			" within one week to update them with the current status of your project</p>\n\n" +
			"For IT system projects, please include (if applicable):\n" +
			"<ul>\n" +
			"<li>if the project is in production and if so, the date it was released into production</li>\n" +
			"<li>if development of the project is still underway and if so, the target production release date</li>\n" +
			"<li>the date the final contract option year expires</li>\n" +
			"<li>if the development effort has encountered difficulties and would like technical assistance (please also include the target production date)</li>\n" +
			"<li>if the project has been cancelled</li>\n" +
			"<li>if the project is on hold</li>\n" +
			"</ul>\n\n" +
			"Fir O&M projects or services contracts, please include (if applicable):\n" +
			"<ul>\n" +
			"<li>if the current contract is not being extended, include the end date of the period of performance</li>\n" +
			"<li>if a new contract or re-compete is being planned, include the target date for release of solicitation and the target award date</li>\n" +
			"<li>if an extension of the current contract is planned, include the new contract expiration date</li>\n" +
			"<li>describe any planned changes to service requirements, if any</li>\n" +
			"<li>if you anticipate a cost increase, please indicate how much of an increase you anticipate over what you are currently spending</li>\n" +
			"<li>if contract support is no longer needed</li>\n" +
			"</ul>\n\n" +
			"<p>" + decisionPath + "</p>\n\n" +
			"<p>If you have questions please contact the Governance Team at " + string(s.config.GRTEmail) + "</p>\n\n" +
			"<p><u>Current Lifecycle ID Summary</u><p>\n" +
			"<p>Lifecycle ID: " + lcid + "</p>\n" +
			"<p>Expiration Date: " + lcidExpiresAt.Format("January 02, 2006") + "</p>\n" +
			"<p>Scope: <pre style=\"white-space: pre-wrap; word-break: keep-all;\">" + scope + "</pre></p>\n" +
			"<p>Project Cost Baseline: <pre style=\"white-space: pre-wrap; word-break: keep-all;\">" + lifecycleCostBaseline + "</pre></p>\n" +
			"<p>Next Steps: <pre style=\"white-space: pre-wrap; word-break: keep-all;\">" + nextSteps + "</pre></p>\n"

		err = client.SendLCIDExpirationAlertEmail(
			ctx,
			recipients,
			intakeID,
			projectName,
			lcid,
			&lcidExpiresAt,
			scope,
			lifecycleCostBaseline,
			nextSteps,
		)

		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, client.listAllRecipients(recipients))
		s.Equal(fmt.Sprintf("Warning: Your Lifecycle ID (%s) for %s is about to expire", lcid, projectName), sender.subject)
		s.Equal(expectedEmail, sender.body)
	})

	s.Run("successful call has the right content with no cost baseline or next steps", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		expectedEmail := "<p><pre style=\"white-space: pre-wrap; word-break: keep-all;\">Lifecycle ID issued for " +
			projectName +
			" is set to expire on " +
			lcidExpiresAt.Format("January 02, 2006") + ".\n" +
			"If your Lifecycle ID expires, your project will be operating under an expired Lifecycle ID and will be added to the CIO risk register</p>\n\n" +
			"<p>To avoid this please email the Governance Team at " +
			string(s.config.GRTEmail) +
			" within one week to update them with the current status of your project</p>\n\n" +
			"For IT system projects, please include (if applicable):\n" +
			"<ul>\n" +
			"<li>if the project is in production and if so, the date it was released into production</li>\n" +
			"<li>if development of the project is still underway and if so, the target production release date</li>\n" +
			"<li>the date the final contract option year expires</li>\n" +
			"<li>if the development effort has encountered difficulties and would like technical assistance (please also include the target production date)</li>\n" +
			"<li>if the project has been cancelled</li>\n" +
			"<li>if the project is on hold</li>\n" +
			"</ul>\n\n" +
			"Fir O&M projects or services contracts, please include (if applicable):\n" +
			"<ul>\n" +
			"<li>if the current contract is not being extended, include the end date of the period of performance</li>\n" +
			"<li>if a new contract or re-compete is being planned, include the target date for release of solicitation and the target award date</li>\n" +
			"<li>if an extension of the current contract is planned, include the new contract expiration date</li>\n" +
			"<li>describe any planned changes to service requirements, if any</li>\n" +
			"<li>if you anticipate a cost increase, please indicate how much of an increase you anticipate over what you are currently spending</li>\n" +
			"<li>if contract support is no longer needed</li>\n" +
			"</ul>\n\n" +
			"<p>" + decisionPath + "</p>\n\n" +
			"<p>If you have questions please contact the Governance Team at " + string(s.config.GRTEmail) + "</p>\n\n" +
			"<p><u>Current Lifecycle ID Summary</u><p>\n" +
			"<p>Lifecycle ID: " + lcid + "</p>\n" +
			"<p>Expiration Date: " + lcidExpiresAt.Format("January 02, 2006") + "</p>\n" +
			"<p>Scope: <pre style=\"white-space: pre-wrap; word-break: keep-all;\">" + scope + "</pre></p>\n\n\n"

		err = client.SendLCIDExpirationAlertEmail(
			ctx,
			recipients,
			intakeID,
			projectName,
			lcid,
			&lcidExpiresAt,
			scope,
			"", // lifecycleCostBaseline
			"", // nextSteps
		)

		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, client.listAllRecipients(recipients))
		s.Equal(fmt.Sprintf("Warning: Your Lifecycle ID (%s) for %s is about to expire", lcid, projectName), sender.subject)
		s.Equal(expectedEmail, sender.body)
	})

	s.Run("if the template is nil, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates = templates{}

		err = client.SendLCIDExpirationAlertEmail(
			ctx,
			recipients,
			intakeID,
			projectName,
			lcid,
			&lcidExpiresAt,
			scope,
			lifecycleCostBaseline,
			nextSteps,
		)

		s.Error(err)
		s.IsType(err, &apperrors.NotificationError{})
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("LCID expiration alert template is nil", e.Err.Error())
	})

	s.Run("if the template fails to execute, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates.lcidExpirationAlertTemplate = mockFailedTemplateCaller{}

		err = client.SendLCIDExpirationAlertEmail(
			ctx,
			recipients,
			intakeID,
			projectName,
			lcid,
			&lcidExpiresAt,
			scope,
			lifecycleCostBaseline,
			nextSteps,
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

		err = client.SendLCIDExpirationAlertEmail(
			ctx,
			recipients,
			intakeID,
			projectName,
			lcid,
			&lcidExpiresAt,
			scope,
			lifecycleCostBaseline,
			nextSteps,
		)

		s.Error(err)
		s.IsType(&apperrors.NotificationError{}, err)
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("sender had an error", e.Err.Error())
	})
}
