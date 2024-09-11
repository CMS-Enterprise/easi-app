package email

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSubmitInitialIntakeFormReviewer() {
	sender := mockSender{}
	ctx := context.Background()
	recipients := models.EmailNotificationRecipients{
		RegularRecipientEmails:   []models.EmailAddress{},
		ShouldNotifyITGovernance: true,
		ShouldNotifyITInvestment: false,
	}
	intakeID := uuid.MustParse("19b916b7-0d18-493d-b08d-c726cff6c3df")
	requestName := "Test Request"
	requesterName := "Danny Rand"
	requestComponent := "samophlange"
	requestType := models.SystemIntakeRequestTypeRECOMPETE
	processStage := "some kind of stage"
	adminLink := fmt.Sprintf(
		"%s://%s/it-governance/%s/intake-request",
		s.config.URLScheme,
		s.config.URLHost,
		intakeID.String(),
	)
	getExpectedEmail := func(isResubmitted bool) string {
		var openingResubmittedText1 string
		var openingResubmittedText2 string
		if isResubmitted {
			openingResubmittedText1 = "made changes to their"
			openingResubmittedText2 = "changes"
		} else {
			openingResubmittedText1 = "submitted a new"
			openingResubmittedText2 = "request"
		}
		return fmt.Sprintf(`
			<h1 class="header-title">EASi</h1>
			<p class="header-subtitle">Easy Access to System Information</p>

			<p>%s has %s Intake Request, %s. Use the link below to review the %s in EASi. A member of the Governance Team should respond within two business days with any feedback about the request or to move the request to the next step in the Governance Review process.</p>

			<br>
			<div class="no-margin">
			<p><u>Request Summary</u></p>
			<p><strong>Requester name:</strong> %s</p>
			<p><strong>Requester component:</strong> %s</p>
			<p><strong>Request name:</strong> %s</p>
			<p><strong>Request type:</strong> %s</p>
			<p><strong>Process stage:</strong> %s</p>
			</div>

			<br>
			<p><strong><a href="%s">View this request in EASi</a></strong></p>

			<br>
			<div class="no-margin">
			<p>Next steps:</p>
			  <ul>
				<li>Assign a lead if one is not already assigned.</li>
				<li>Review the Intake Request form and decide what (if any) next steps are needed.</li>
				<li>Determine if a small group meeting is needed.</li>
				<li>Take the appropriate actions within EASi.</li>
			  </ul>
			</div>`,
			requesterName,
			openingResubmittedText1,
			requestName,
			openingResubmittedText2,
			requesterName,
			requestComponent,
			requestName,
			HumanizeSnakeCase(string(requestType)),
			processStage,
			adminLink,
		)
	}

	s.Run("successful initial submit call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		isResubmitted := false
		expectedEmail := getExpectedEmail(isResubmitted)

		err = client.SystemIntake.SendSubmitInitialFormReviewerNotification(
			ctx,
			intakeID,
			requestName,
			requesterName,
			requestComponent,
			requestType,
			processStage,
			false,
		)

		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, client.listAllRecipients(recipients))
		s.Equal(fmt.Sprintf("A new Intake Request has been submitted (%s)", requestName), sender.subject)
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("successful resubmit call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		isResubmitted := true
		expectedEmail := getExpectedEmail(isResubmitted)

		err = client.SystemIntake.SendSubmitInitialFormReviewerNotification(
			ctx,
			intakeID,
			requestName,
			requesterName,
			requestComponent,
			requestType,
			processStage,
			true,
		)

		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, client.listAllRecipients(recipients))
		s.Equal(fmt.Sprintf("Changes made to Intake Request (%s)", requestName), sender.subject)
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("if the template is nil, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.SystemIntake.client.templates.systemIntakeSubmitInitialFormReviewerTemplate = nil

		err = client.SystemIntake.SendSubmitInitialFormReviewerNotification(
			ctx,
			intakeID,
			requestName,
			requesterName,
			requestComponent,
			requestType,
			processStage,
			true,
		)

		s.Error(err)
		s.Equal("system intake submission reviewer template is nil", err.Error())
	})

	s.Run("if the template fails to execute, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.SystemIntake.client.templates.systemIntakeSubmitInitialFormReviewerTemplate = mockFailedTemplateCaller{}

		err = client.SystemIntake.SendSubmitInitialFormReviewerNotification(
			ctx,
			intakeID,
			requestName,
			requesterName,
			requestComponent,
			requestType,
			processStage,
			true,
		)

		s.Error(err)
		s.Equal("template caller had an error", err.Error())
	})

	s.Run("if the sender fails, we get the error from it", func() {
		sender := mockFailedSender{}

		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		err = client.SystemIntake.SendSubmitInitialFormReviewerNotification(
			ctx,
			intakeID,
			requestName,
			requesterName,
			requestComponent,
			requestType,
			processStage,
			true,
		)

		s.Error(err)
		s.Equal("sender had an error", err.Error())
	})
}
