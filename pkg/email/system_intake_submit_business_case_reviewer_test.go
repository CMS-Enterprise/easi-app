package email

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSubmitBizCaseReviewer() {
	sender := mockSender{}
	ctx := context.Background()
	recipients := models.EmailNotificationRecipients{
		RegularRecipientEmails:   []models.EmailAddress{},
		ShouldNotifyITGovernance: true,
		ShouldNotifyITInvestment: false,
	}
	intakeID := uuid.MustParse("19b916b7-0d18-493d-b08d-c726cff6c3df")
	requestName := "Test Request"
	requesterName := "John Adams"
	adminLink := fmt.Sprintf(
		"%s://%s/governance-review-team/%s/business-case",
		s.config.URLScheme,
		s.config.URLHost,
		intakeID.String(),
	)
	getExpectedEmail := func(isResubmitted bool, isDraft bool) string {
		var openingResubmittedText1 string
		var openingResubmittedText2 string
		var draftText string
		var nextSteps string
		if isResubmitted {
			openingResubmittedText1 = "made changes to the"
			openingResubmittedText2 = "changes"
		} else {
			openingResubmittedText1 = "submitted a"
			openingResubmittedText2 = "Business Case"
		}
		if isDraft {
			draftText = "draft"
			nextSteps = "what (if any) next steps are needed."
		} else {
			draftText = "final"
			nextSteps = "if this Business Case is ready to present to the GRB."
		}
		return fmt.Sprintf(`
			<h1 class="header-title">EASi</h1>
			<p class="header-subtitle">Easy Access to System Information</p>

			<p>%s has %s %s Business Case for %s. Use the link below to review the %s in EASi. The lead for this request or another member of the Governance Team should respond within two business days with any feedback about the Business Case or to move the request to the next step in the Governance Review process.</p>

			<br>
			<p class="no-margin-top"><strong><a href="%s">View this request in EASi</a></strong></p>

			<br>
			<div class="no-margin">
				<p>Next steps:</p>
				<ul>
					<li>Review the %s Business Case and decide %s</li>
					<li>Take the appropriate actions within EASi.</li>
				</ul>
			</div>`,
			requesterName,
			openingResubmittedText1,
			draftText,
			requestName,
			openingResubmittedText2,
			adminLink,
			draftText,
			nextSteps,
		)
	}

	s.Run("successful initial draft submit call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		isResubmitted := false
		isDraft := true
		expectedEmail := getExpectedEmail(isResubmitted, isDraft)

		err = client.SystemIntake.SendSubmitBizCaseReviewerNotification(
			ctx,
			intakeID,
			requesterName,
			requestName,
			isResubmitted,
			isDraft,
		)

		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, client.listAllRecipients(recipients))
		s.Equal(fmt.Sprintf("A draft Business Case has been submitted (%s)", requestName), sender.subject)
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("successful resubmit draft call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		isResubmitted := true
		isDraft := true
		expectedEmail := getExpectedEmail(isResubmitted, isDraft)

		err = client.SystemIntake.SendSubmitBizCaseReviewerNotification(
			ctx,
			intakeID,
			requesterName,
			requestName,
			isResubmitted,
			isDraft,
		)

		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, client.listAllRecipients(recipients))
		s.Equal(fmt.Sprintf("Changes made to draft Business Case (%s)", requestName), sender.subject)
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("successful initial final submit call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		isResubmitted := false
		isDraft := false
		expectedEmail := getExpectedEmail(isResubmitted, isDraft)

		err = client.SystemIntake.SendSubmitBizCaseReviewerNotification(
			ctx,
			intakeID,
			requesterName,
			requestName,
			isResubmitted,
			isDraft,
		)

		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, client.listAllRecipients(recipients))
		s.Equal(fmt.Sprintf("A final Business Case has been submitted (%s)", requestName), sender.subject)
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("successful resubmit final call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		isResubmitted := true
		isDraft := false
		expectedEmail := getExpectedEmail(isResubmitted, isDraft)

		err = client.SystemIntake.SendSubmitBizCaseReviewerNotification(
			ctx,
			intakeID,
			requesterName,
			requestName,
			isResubmitted,
			isDraft,
		)

		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, client.listAllRecipients(recipients))
		s.Equal(fmt.Sprintf("Changes made to final Business Case (%s)", requestName), sender.subject)
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("if the template is nil, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.SystemIntake.client.templates.systemIntakeSubmitBusinessCaseReviewerTemplate = nil

		err = client.SystemIntake.SendSubmitBizCaseReviewerNotification(
			ctx,
			intakeID,
			requesterName,
			requestName,
			false,
			false,
		)

		s.Error(err)
		s.Equal("submit business case reviewer template is nil", err.Error())
	})

	s.Run("if the template fails to execute, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.SystemIntake.client.templates.systemIntakeSubmitBusinessCaseReviewerTemplate = mockFailedTemplateCaller{}

		err = client.SystemIntake.SendSubmitBizCaseReviewerNotification(
			ctx,
			intakeID,
			requesterName,
			requestName,
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

		err = client.SystemIntake.SendSubmitBizCaseReviewerNotification(
			ctx,
			intakeID,
			requesterName,
			requestName,
			false,
			false,
		)

		s.Error(err)
		s.Equal("sender had an error", err.Error())
	})
}
