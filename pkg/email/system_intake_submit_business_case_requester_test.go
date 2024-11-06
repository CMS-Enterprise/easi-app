package email

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSubmitBizCaseRequester() {
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
	preparingForGRBLink := fmt.Sprintf(
		"%s://%s/help/it-governance/prepare-for-grb",
		s.config.URLScheme,
		s.config.URLHost,
	)
	requesterTaskLink := fmt.Sprintf(
		"%s://%s/governance-task-list/%s",
		s.config.URLScheme,
		s.config.URLHost,
		intakeID.String(),
	)
	getExpectedEmail := func(isResubmitted bool, isDraft bool) string {
		var openingResubmittedText1 string
		var openingResubmittedText2 string
		var openingDraftText1 string
		var openingDraftText2 string
		var nextStepsDraftText string
		if isResubmitted {
			openingResubmittedText1 = "made changes to the"
			openingResubmittedText2 = "your changes"
		} else {
			openingResubmittedText1 = "completed a"
			openingResubmittedText2 = "it"
		}
		if isDraft {
			openingDraftText1 = "draft"
			openingDraftText2 = "will either get back to you within two business days or share feedback at your scheduled GRT meeting"
			nextStepsDraftText = `<li>additional steps in the Governance Review process are needed such as a meeting with the full GRT or a meeting with the Governance Review Board (GRB), or</li>`
		} else {
			openingDraftText1 = "final"
			openingDraftText2 = fmt.Sprintf(`get back to you within two business days. In the meantime, you may review guidance in EASi about <a href="%s">preparing for the GRB</a>`, preparingForGRBLink)
			nextStepsDraftText = `<li>you are ready for a meeting with the Governance Review Board (GRB),</li>
			<li>your Business Case needs further edits before presenting to the GRB, or</li>`
		}
		return fmt.Sprintf(`<h1 class="header-title">EASi</h1>
			<p class="header-subtitle">Easy Access to System Information</p>

			<p>You have %s %s Business Case for your IT Governance request (%s). The Governance Review Team (GRT) will review %s and %s.</p>

			<br>
			<div class="no-margin">
			  <p>The Governance Team will determine one of the following possible outcomes for your request:</p>
			  <ul>
				%s
				<li>no further steps are necessary and a decision will be issued or the request will be closed.</li>
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
			openingDraftText1,
			requestName,
			openingResubmittedText2,
			openingDraftText2,
			nextStepsDraftText,
			requesterTaskLink,
			GRTEmailAddress,
			GRTEmailAddress,
		)
	}

	s.Run("successful initial draft submit call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		isResubmitted := false
		isDraft := true
		expectedEmail := getExpectedEmail(isResubmitted, isDraft)

		err = client.SystemIntake.SendSubmitBizCaseRequesterNotification(
			ctx,
			recipient,
			requestName,
			intakeID,
			isResubmitted,
			isDraft,
		)

		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, client.listAllRecipients(recipients))
		s.Equal(fmt.Sprintf("Your draft Business Case has been submitted (%s)", requestName), sender.subject)
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("successful resubmit draft call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		isResubmitted := true
		isDraft := true
		expectedEmail := getExpectedEmail(isResubmitted, isDraft)

		err = client.SystemIntake.SendSubmitBizCaseRequesterNotification(
			ctx,
			recipient,
			requestName,
			intakeID,
			isResubmitted,
			isDraft,
		)

		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, client.listAllRecipients(recipients))
		s.Equal(fmt.Sprintf("Your draft Business Case has been resubmitted with changes (%s)", requestName), sender.subject)
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("successful initial final submit call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		isResubmitted := false
		isDraft := false
		expectedEmail := getExpectedEmail(isResubmitted, isDraft)

		err = client.SystemIntake.SendSubmitBizCaseRequesterNotification(
			ctx,
			recipient,
			requestName,
			intakeID,
			isResubmitted,
			isDraft,
		)

		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, client.listAllRecipients(recipients))
		s.Equal(fmt.Sprintf("Your final Business Case has been submitted (%s)", requestName), sender.subject)
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("successful resubmit final call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		isResubmitted := true
		isDraft := false
		expectedEmail := getExpectedEmail(isResubmitted, isDraft)

		err = client.SystemIntake.SendSubmitBizCaseRequesterNotification(
			ctx,
			recipient,
			requestName,
			intakeID,
			isResubmitted,
			isDraft,
		)

		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, client.listAllRecipients(recipients))
		s.Equal(fmt.Sprintf("Your final Business Case has been resubmitted with changes (%s)", requestName), sender.subject)
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("if the template is nil, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.SystemIntake.client.templates.systemIntakeSubmitBusinessCaseRequesterTemplate = nil

		err = client.SystemIntake.SendSubmitBizCaseRequesterNotification(
			ctx,
			recipient,
			requestName,
			intakeID,
			false,
			false,
		)

		s.Error(err)
		s.Equal("submit business case requester template is nil", err.Error())
	})

	s.Run("if the template fails to execute, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.SystemIntake.client.templates.systemIntakeSubmitBusinessCaseRequesterTemplate = mockFailedTemplateCaller{}

		err = client.SystemIntake.SendSubmitBizCaseRequesterNotification(
			ctx,
			recipient,
			requestName,
			intakeID,
			false,
			false,
		)

		s.Error(err)
		s.Equal("template caller had an error", err.Error())
	})

	s.Run("if the sender fails, we get the error from it", func() {
		sender := mockFailedSender{}

		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		err = client.SystemIntake.SendSubmitBizCaseRequesterNotification(
			ctx,
			recipient,
			requestName,
			intakeID,
			false,
			false,
		)

		s.Error(err)
		s.Equal("sender had an error", err.Error())
	})
}
