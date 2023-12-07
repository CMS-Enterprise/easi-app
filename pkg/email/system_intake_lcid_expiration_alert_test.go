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
	GRTEmailAddress := s.config.GRTEmail.String()
	intakeID := uuid.MustParse("19b916b7-0d18-493d-b08d-c726cff6c3df")
	requestName := "Test Request"
	requesterName := "Test Requester"
	lifecycleID := "123456"
	scope := models.HTML("scope")
	costBaseline := "costBaseline"
	nextSteps := models.HTML("nextSteps")
	expireDate, _ := time.Parse("01/02/2006", "12/25/2021")
	issueDate, _ := time.Parse("01/02/2006", "12/25/2023")
	requesterTaskLink := fmt.Sprintf(
		"%s://%s/governance-task-list/%s",
		s.config.URLScheme,
		s.config.URLHost,
		intakeID.String(),
	)
	adminLink := fmt.Sprintf(
		"%s://%s/governance-review-team/%s/lcid",
		s.config.URLScheme,
		s.config.URLHost,
		intakeID.String(),
	)
	getExpectedEmail := func(
		requestName string,
		issueDate string,
		expireDate string,
		GRTEmailAddress string,
		requesterTaskLink string,
		adminLink string,
		lifecycleID string,
		scope string,
		costBaseline string,
		nextSteps string,
	) string {
		var openingIssuedText string
		var summaryIssuedText string
		var summaryScope string
		var summaryCostBaseline string
		var summaryNextSteps string
		if issueDate != "" {
			openingIssuedText = " on " + issueDate
			summaryIssuedText = fmt.Sprintf("\n  <strong>Date issued:</strong> %s<br>", issueDate)
		}
		if scope != "" {
			summaryScope = fmt.Sprintf("<br><strong>Scope:</strong> %s", scope)
		}
		if costBaseline != "" {
			summaryCostBaseline = fmt.Sprintf("<br><strong>Project Cost Baseline:</strong> %s", costBaseline)
		}
		if nextSteps != "" {
			summaryNextSteps = fmt.Sprintf("<br><strong>Next Steps:</strong> %s", nextSteps)
		}
		return fmt.Sprintf(`<h1 style="margin-bottom: 0.5rem;">EASi</h1>

<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>

<p>The Life Cycle ID that was issued for %s%s is set to expire on %s. If your Lifecycle ID expires, your project will be operating under an expired Lifecycle ID and will be added to the Capital Planning Investment Control (CPIC) risk register.</p>
<p>To avoid this, please email the Governance Team at <a href="mailto:%s">%s</a> within one week to update them with the current status of your project.</p>
<p>
  For new IT development projects, please include (if applicable):
  <ul>
    <li>if the project is in production and if so, the date it was released into production</li>
    <li>if development of the project is still underway and if so, the target production release date</li>
    <li>the date the final contract option year expires</li>
    <li>if the development effort has encountered difficulties and would like technical assistance (please also include the target production date)</li>
    <li>if the project has been cancelled</li>
    <li>if the project is on hold</li>
  </ul>
</p>
<p>
  For O&M projects or services contracts, please include (if applicable):
  <ul>
    <li>if the current contract is not being extended, include the end date of the period of performance</li>
    <li>if a new contract or re-compete is being planned, include the target date for release of solicitation and the target award date</li>
    <li>if an extension of the current contract is planned, include the new contract expiration date</li>
    <li>describe any new development or planned changes to service requirements, if any</li>
    <li>if you anticipate a cost increase, please indicate how much of an increase you anticipate over what you are currently spending</li>
    <li>if contract support is no longer needed</li>
  </ul>
</p>
<p>
  View this request in EASi:
  <ul>
    <li>The person who initially submitted this request, %s, may <a href="%s" style="font-weight: bold">click here</a> to view the request task list.</li>
    <li>Governance Team members may <a href="%s" style="font-weight: bold">click here</a> to view the decision and LCID information.</li>
    <li>Others should contact %s or the Governance Team for more information on the request.</li>
  </ul>
</p>
<p>If you have questions please contact the Governance Team at <a href="mailto:%s">%s</a>.</p>
<p>
  <u>Current Life Cycle ID Summary</u><br>
  <strong>Lifecycle ID:</strong> %s<br>%s
  <strong>Expiration Date:</strong> %s
  %s
  %s
  %s
</p>
<hr>
<p>Depending on the project, the Governance Team may continue to follow up with you about this Life Cycle ID.</p>
`,
			requestName,
			openingIssuedText,
			expireDate,
			GRTEmailAddress,
			GRTEmailAddress,
			requesterName,
			requesterTaskLink,
			adminLink,
			requesterName,
			GRTEmailAddress,
			GRTEmailAddress,
			lifecycleID,
			summaryIssuedText,
			expireDate,
			summaryScope,
			summaryCostBaseline,
			summaryNextSteps,
		)
	}

	s.Run("successful call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		expectedEmail := getExpectedEmail(
			requestName,
			issueDate.Format("01/02/2006"),
			expireDate.Format("01/02/2006"),
			GRTEmailAddress,
			requesterTaskLink,
			adminLink,
			lifecycleID,
			scope.ValueOrEmptyString(),
			costBaseline,
			nextSteps.ValueOrEmptyString(),
		)

		err = client.SendLCIDExpirationAlertEmail(
			ctx,
			recipients,
			intakeID,
			requestName,
			requesterName,
			lifecycleID,
			&issueDate,
			&expireDate,
			scope,
			costBaseline,
			nextSteps,
		)

		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, client.listAllRecipients(recipients))
		s.Equal(fmt.Sprintf("Warning: Your Lifecycle ID (%s) for %s is about to expire", lifecycleID, requestName), sender.subject)
		s.Equal(expectedEmail, sender.body)
	})

	s.Run("successful call has the right content with no scope, cost baseline, or next steps", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		expectedEmail := getExpectedEmail(
			requestName,
			issueDate.Format("01/02/2006"),
			expireDate.Format("01/02/2006"),
			GRTEmailAddress,
			requesterTaskLink,
			adminLink,
			lifecycleID,
			"",
			"",
			"",
		)

		err = client.SendLCIDExpirationAlertEmail(
			ctx,
			recipients,
			intakeID,
			requestName,
			requesterName,
			lifecycleID,
			&issueDate,
			&expireDate,
			"", // scope
			"", // costBaseline
			"", // nextSteps
		)

		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, client.listAllRecipients(recipients))
		s.Equal(fmt.Sprintf("Warning: Your Lifecycle ID (%s) for %s is about to expire", lifecycleID, requestName), sender.subject)
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
			requestName,
			requesterName,
			lifecycleID,
			&issueDate,
			&expireDate,
			scope,
			costBaseline,
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
			requestName,
			requesterName,
			lifecycleID,
			&issueDate,
			&expireDate,
			scope,
			costBaseline,
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
			requestName,
			requesterName,
			lifecycleID,
			&issueDate,
			&expireDate,
			scope,
			costBaseline,
			nextSteps,
		)

		s.Error(err)
		s.IsType(&apperrors.NotificationError{}, err)
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("sender had an error", e.Err.Error())
	})
}
