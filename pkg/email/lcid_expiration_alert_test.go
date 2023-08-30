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
	requesterName := "Test Requester"
	lcid := "123456"
	scope := models.HTML("scope")
	lifecycleCostBaseline := "lifecycleCostBaseline"
	nextSteps := models.HTML("nextSteps")
	lcidExpiresAt, _ := time.Parse("2006-01-02", "2021-12-25")
	requesterTaskListLink := fmt.Sprintf(
		"<a href=\"%s://%s/governance-task-list/%s\" style=\"font-weight: bold\">click here</a>",
		s.config.URLScheme,
		s.config.URLHost,
		intakeID.String(),
	)
	requesterDecisionLink := fmt.Sprintf(
		"<a href=\"%s://%s/governance-task-list/%s/request-decision\" style=\"font-weight: bold\">here</a>",
		s.config.URLScheme,
		s.config.URLHost,
		intakeID.String(),
	)
	grtDecisionLink := fmt.Sprintf(
		"<a href=\"%s://%s/governance-review-team/%s/lcid\" style=\"font-weight: bold\">click here</a>",
		s.config.URLScheme,
		s.config.URLHost,
		intakeID.String(),
	)

	s.Run("successful call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		expectedEmail := "<h1 style=\"margin-bottom: 0.5rem;\">EASi</h1>\n\n" +
			"<span style=\"font-size:15px; line-height: 18px; color: #71767A\">Easy Access to System Information</span>\n\n" +
			"<p><pre style=\"white-space: pre-wrap; word-break: keep-all;\">Lifecycle ID issued for " +
			projectName +
			" is set to expire on " +
			lcidExpiresAt.Format("January 02, 2006") + ". " +
			"If your Lifecycle ID expires, your project will be operating under an expired Lifecycle ID and will be added to the Capital Planning Investment Control (CPIC) risk register.</p>\n" +
			"To avoid this please email the Governance Team at " +
			string(s.config.GRTEmail) +
			" within one week to update them with the current status of your project.\n\n" +
			"For New IT development projects, please include (if applicable):\n" +
			"<ul>\n" +
			"<li>if the project is in production and if so, the date it was released into production</li>\n" +
			"<li>if development of the project is still underway and if so, the target production release date</li>\n" +
			"<li>the date the final contract option year expires</li>\n" +
			"<li>if the development effort has encountered difficulties and would like technical assistance (please also include the target production date)</li>\n" +
			"<li>if the project has been cancelled</li>\n" +
			"<li>if the project is on hold</li>\n" +
			"</ul>\n" +
			"For O&M projects or services contracts, please include (if applicable):\n" +
			"<ul>\n" +
			"<li>if the current contract is not being extended, include the end date of the period of performance</li>\n" +
			"<li>if a new contract or re-compete is being planned, include the target date for release of solicitation and the target award date</li>\n" +
			"<li>if an extension of the current contract is planned, include the new contract expiration date</li>\n" +
			"<li>describe any new development or planned changes to service requirements, if any</li>\n" +
			"<li>if you anticipate a cost increase, please indicate how much of an increase you anticipate over what you are currently spending</li>\n" +
			"<li>if contract support is no longer needed</li>\n" +
			"</ul>\n" +
			"View this request in EASi:\n" +
			"<ul>\n" +
			"<li>The person who initially submitted this request, " + requesterName + ", may " + requesterTaskListLink +
			" to view the request task list and " + requesterDecisionLink + " to view the decision and LCID information</li>\n" +
			"<li>Governance Team members may " + grtDecisionLink + " to view the decision and LCID information</li>\n" +
			"<li>Others should contact " + requesterName + " or the Governance Team for more information on the request</li>\n" +
			"</ul>\n" +
			"If you have questions please contact the Governance Team at " + string(s.config.GRTEmail) + "\n\n\n" +
			"<u>Current Lifecycle ID Summary</u>\n" +
			"<p>Lifecycle ID: " + lcid + "</p>\n" +
			"<p>Expiration Date: " + lcidExpiresAt.Format("January 02, 2006") + "</p>\n" +
			"<p>Scope: <pre style=\"white-space: pre-wrap; word-break: keep-all;\">" + string(scope) + "</pre></p>\n" +
			"<p>Project Cost Baseline: <pre style=\"white-space: pre-wrap; word-break: keep-all;\">" + lifecycleCostBaseline + "</pre></p>\n" +
			"<p>Next Steps: <pre style=\"white-space: pre-wrap; word-break: keep-all;\">" + string(nextSteps) + "</pre></p>\n"

		err = client.SendLCIDExpirationAlertEmail(
			ctx,
			recipients,
			intakeID,
			projectName,
			requesterName,
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

		expectedEmail := "<h1 style=\"margin-bottom: 0.5rem;\">EASi</h1>\n\n" +
			"<span style=\"font-size:15px; line-height: 18px; color: #71767A\">Easy Access to System Information</span>\n\n" +
			"<p><pre style=\"white-space: pre-wrap; word-break: keep-all;\">Lifecycle ID issued for " +
			projectName +
			" is set to expire on " +
			lcidExpiresAt.Format("January 02, 2006") + ". " +
			"If your Lifecycle ID expires, your project will be operating under an expired Lifecycle ID and will be added to the Capital Planning Investment Control (CPIC) risk register.</p>\n" +
			"To avoid this please email the Governance Team at " +
			string(s.config.GRTEmail) +
			" within one week to update them with the current status of your project.\n\n" +
			"For New IT development projects, please include (if applicable):\n" +
			"<ul>\n" +
			"<li>if the project is in production and if so, the date it was released into production</li>\n" +
			"<li>if development of the project is still underway and if so, the target production release date</li>\n" +
			"<li>the date the final contract option year expires</li>\n" +
			"<li>if the development effort has encountered difficulties and would like technical assistance (please also include the target production date)</li>\n" +
			"<li>if the project has been cancelled</li>\n" +
			"<li>if the project is on hold</li>\n" +
			"</ul>\n" +
			"For O&M projects or services contracts, please include (if applicable):\n" +
			"<ul>\n" +
			"<li>if the current contract is not being extended, include the end date of the period of performance</li>\n" +
			"<li>if a new contract or re-compete is being planned, include the target date for release of solicitation and the target award date</li>\n" +
			"<li>if an extension of the current contract is planned, include the new contract expiration date</li>\n" +
			"<li>describe any new development or planned changes to service requirements, if any</li>\n" +
			"<li>if you anticipate a cost increase, please indicate how much of an increase you anticipate over what you are currently spending</li>\n" +
			"<li>if contract support is no longer needed</li>\n" +
			"</ul>\n" +
			"View this request in EASi:\n" +
			"<ul>\n" +
			"<li>The person who initially submitted this request, " + requesterName + ", may " + requesterTaskListLink +
			" to view the request task list and " + requesterDecisionLink + " to view the decision and LCID information</li>\n" +
			"<li>Governance Team members may " + grtDecisionLink + " to view the decision and LCID information</li>\n" +
			"<li>Others should contact " + requesterName + " or the Governance Team for more information on the request</li>\n" +
			"</ul>\n" +
			"If you have questions please contact the Governance Team at " + string(s.config.GRTEmail) + "\n\n\n" +
			"<u>Current Lifecycle ID Summary</u>\n" +
			"<p>Lifecycle ID: " + lcid + "</p>\n" +
			"<p>Expiration Date: " + lcidExpiresAt.Format("January 02, 2006") + "</p>\n" +
			"<p>Scope: <pre style=\"white-space: pre-wrap; word-break: keep-all;\">" + string(scope) + "</pre></p>\n\n\n"

		err = client.SendLCIDExpirationAlertEmail(
			ctx,
			recipients,
			intakeID,
			projectName,
			requesterName,
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
			requesterName,
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
			requesterName,
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
			requesterName,
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
