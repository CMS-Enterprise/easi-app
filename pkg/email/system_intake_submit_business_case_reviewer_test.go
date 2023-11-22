package email

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
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
		if isResubmitted {
			openingResubmittedText1 = "made changes to their"
			openingResubmittedText2 = "changes"
		} else {
			openingResubmittedText1 = "submitted a"
			openingResubmittedText2 = "Business Case"
		}
		if isDraft {
			draftText = "draft"
		} else {
			draftText = "final"
		}
		return fmt.Sprintf(`<h1 style="margin-bottom: 0.5rem;">EASi</h1>

<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>

<p>%s has %s %s Business Case for %s. Use the link below to review the %s in EASi. The lead for this request or another member of the Governance team should respond within two business days with any feedback about the Business Case or to move the request to the next step in the Governance Review process.</p>

<p><a href="%s">View this request in EASi</a></p>

<p>Next Steps:
  <ul>
    <li>review the %s Business Case and decide what (if any) next steps are needed</li>
    <li>Take the appropriate actions within EASi.</li>
  </ul>
</p>

`,
			requesterName,
			openingResubmittedText1,
			draftText,
			requestName,
			openingResubmittedText2,
			adminLink,
			draftText,
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
		s.Equal(expectedEmail, sender.body)
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
		s.Equal(expectedEmail, sender.body)
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
		s.Equal(expectedEmail, sender.body)
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
		s.Equal(expectedEmail, sender.body)
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
		s.IsType(err, &apperrors.NotificationError{})
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("submit business case reviewer template is nil", e.Err.Error())
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
		s.IsType(err, &apperrors.NotificationError{})
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("template caller had an error", e.Err.Error())
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
		s.IsType(&apperrors.NotificationError{}, err)
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("sender had an error", e.Err.Error())
	})
}
