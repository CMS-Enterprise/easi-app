package email

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
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
		var outcomesSubmittedText string
		if isResubmitted {
			openingResubmittedText1 = "made changes to"
			openingResubmittedText2 = "your changes"
		} else {
			openingResubmittedText1 = "completed"
			openingResubmittedText2 = "it"
			outcomesSubmittedText = "<li>decide that the IT Governance process is not applicable and close your request.</li>"
		}
		return fmt.Sprintf(`<h1 style="margin-bottom: 0.5rem;">EASi</h1>

<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>

<p>You have %s the Intake Request form for your IT Governance request %s. The Governance Review Team (GRT) will review %s and get back to you within two business days.</p>

<p>
  The Governance Team will inform you if any next steps need to be taken with your request. They will communicate one of these possible outcomes. They will:
  <ul>
    <li>process your request and issue a Life Cycle ID without any additional work on your part</li>
    <li>direct you to go through additional steps in the Governance Review process such as drafting a Business Case, meeting with the full GRT, or meeting with the Governance Review Board (GRB)</li>
    %s
  </ul>
</p>

<p><a href="%s">View your request in EASi</a></p>

<p>If you have questions, please contact the Governance Team at <a href="mailto:%s">%s</a>.</p>
<hr>
<p>You will continue to receive email notifications about your request until it is closed.</p>
`,
			openingResubmittedText1,
			requestName,
			openingResubmittedText2,
			outcomesSubmittedText,
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
		s.Equal(expectedEmail, sender.body)
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
		s.Equal(expectedEmail, sender.body)
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
		s.IsType(err, &apperrors.NotificationError{})
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("system intake submission requester template is nil", e.Err.Error())
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
		s.IsType(err, &apperrors.NotificationError{})
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("template caller had an error", e.Err.Error())
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
		s.IsType(&apperrors.NotificationError{}, err)
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("sender had an error", e.Err.Error())
	})
}
