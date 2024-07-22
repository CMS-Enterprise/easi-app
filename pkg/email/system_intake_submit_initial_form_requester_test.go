package email

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSubmitInitialIntakeFormRequester() {
	sender := mockSender{}
	ctx := context.Background()
	recipient := models.NewEmailAddress("fake@fake.com")
	recipients := models.EmailNotificationRecipients{
		RegularRecipientEmails:   []models.EmailAddress{recipient},
		ShouldNotifyITGovernance: false,
		ShouldNotifyITInvestment: false,
	}
	GRTEmailAddress := s.config.GRTEmail.String()
	intakeID := uuid.MustParse("19b916b7-0d18-493d-b08d-c726cff6c3df")
	requestName := "Test Request"
	requesterTaskLink := fmt.Sprintf(
		"%s://%s/governance-task-list/%s",
		s.config.URLScheme,
		s.config.URLHost,
		intakeID.String(),
	)
	getExpectedEmail := func(isResubmitted bool) string {
		var openingResubmittedText1 string
		var openingResubmittedText2 string
		var outcomesSubmittedText1 string
		var outcomesSubmittedText2 string
		if isResubmitted {
			openingResubmittedText1 = "made changes to"
			openingResubmittedText2 = "your changes"
			outcomesSubmittedText1 = ", or"
			outcomesSubmittedText2 = ".</li>"
		} else {
			openingResubmittedText1 = "completed"
			openingResubmittedText2 = "it"
			outcomesSubmittedText1 = ","
			outcomesSubmittedText2 = `, or</li>
    <li>decide that the IT Governance process is not applicable and close your request.</li>`
		}
		return fmt.Sprintf(`
			<h1 class="header-title">EASi</h1>
			<p class="header-subtitle">Easy Access to System Information</p>

			<p>You have %s the Intake Request form for your IT Governance request (%s). The Governance Review Team (GRT) will review %s and get back to you within two business days.</p>

			<br>
			<div class="no-margin">
				<p>The Governance Team will inform you if any next steps need to be taken with your request when they communicate one of the following possible outcomes. They will either:</p>
				<ul>
					<li>process your request and issue a Life Cycle ID without any additional work on your part%s</li>
					<li>direct you to go through additional steps in the Governance Review process such as drafting a Business Case, meeting with the full GRT, or meeting with the Governance Review Board (GRB)%s
				</ul>
			</div>

			<br>
			<p><strong><a href="%s">View your request in EASi</a></strong></p>

			<br>
			<p>If you have questions, please contact the Governance Team at <a href="mailto:%s">%s</a>.</p>
			<br>
			<hr>
			<p>You will continue to receive email notifications about your request until it is closed.</p>`,
			openingResubmittedText1,
			requestName,
			openingResubmittedText2,
			outcomesSubmittedText1,
			outcomesSubmittedText2,
			requesterTaskLink,
			GRTEmailAddress,
			GRTEmailAddress,
		)
	}

	s.Run("successful initial submit call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		isResubmitted := false
		expectedEmail := getExpectedEmail(isResubmitted)

		err = client.SystemIntake.SendSubmitInitialFormRequesterNotification(
			ctx,
			recipient,
			intakeID,
			requestName,
			false,
		)

		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, client.listAllRecipients(recipients))
		s.Equal(fmt.Sprintf("Your Intake Request form has been submitted (%s)", requestName), sender.subject)
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("successful resubmit call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		isResubmitted := true
		expectedEmail := getExpectedEmail(isResubmitted)

		err = client.SystemIntake.SendSubmitInitialFormRequesterNotification(
			ctx,
			recipient,
			intakeID,
			requestName,
			true,
		)

		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, client.listAllRecipients(recipients))
		s.Equal(fmt.Sprintf("Your Intake Request form has been resubmitted with changes (%s)", requestName), sender.subject)
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("if the template is nil, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.SystemIntake.client.templates.systemIntakeSubmitInitialFormRequesterTemplate = nil

		err = client.SystemIntake.SendSubmitInitialFormRequesterNotification(
			ctx,
			recipient,
			intakeID,
			requestName,
			false,
		)

		s.Error(err)
		s.Equal("system intake submission requester template is nil", err.Error())
	})

	s.Run("if the template fails to execute, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.SystemIntake.client.templates.systemIntakeSubmitInitialFormRequesterTemplate = mockFailedTemplateCaller{}

		err = client.SystemIntake.SendSubmitInitialFormRequesterNotification(
			ctx,
			recipient,
			intakeID,
			requestName,
			false,
		)

		s.Error(err)
		s.Equal("template caller had an error", err.Error())
	})

	s.Run("if the sender fails, we get the error from it", func() {
		sender := mockFailedSender{}

		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		err = client.SystemIntake.SendSubmitInitialFormRequesterNotification(
			ctx,
			recipient,
			intakeID,
			requestName,
			false,
		)

		s.Error(err)
		s.Equal("sender had an error", err.Error())
	})
}
