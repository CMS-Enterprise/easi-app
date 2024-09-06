package email

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendProgressToNewStepNotification() {

	ctx := context.Background()
	intakeID := uuid.MustParse("27883155-46ad-4c30-b3b0-30e8d093756e")
	requestName := "Test Request"
	requester := "Sir Requester"
	newStep := models.SystemIntakeStepToProgressToGrbMeeting
	additionalInfo := models.HTMLPointer("additional info") // empty info is left out
	requestLink := fmt.Sprintf(
		"%s://%s/governance-task-list/%s",
		s.config.URLScheme,
		s.config.URLHost,
		intakeID.String(),
	)
	adminLink := fmt.Sprintf(
		"%s://%s/it-governance/%s/intake-request",
		s.config.URLScheme,
		s.config.URLHost,
		intakeID.String(),
	)
	ITGovInboxAddress := s.config.GRTEmail.String()

	feedback := models.HTML("feedback")

	sender := mockSender{}
	recipient := models.NewEmailAddress("fake@fake.com")
	recipients := models.EmailNotificationRecipients{
		RegularRecipientEmails:   []models.EmailAddress{recipient},
		ShouldNotifyITGovernance: false,
		ShouldNotifyITInvestment: false,
	}
	client, err := NewClient(s.config, &sender)
	s.NoError(err)

	getExpectedEmail := func(
		nextStep models.SystemIntakeStepToProgressTo,
		feedback *models.HTML,
		additionalInfo *models.HTML,
	) string {
		var feedbackStr string
		if feedback != nil {
			feedbackStr = fmt.Sprintf(
				`<br>
				<div class="no-margin">
				  <p><strong>Feedback about your request:</strong></p>
				  %s
				</div>`,
				*feedback.StringPointer(),
			)
		}
		var additionalInfoStr string
		if additionalInfo != nil {
			additionalInfoStr = fmt.Sprintf(
				`<br>
				<br>
				<hr>
				<p><strong>Additional information from the Governance Team:</strong></p><div class="no-margin">%s</div>`,
				*additionalInfo.StringPointer(),
			)
		}
		return fmt.Sprintf(`
			<h1 class="header-title">EASi</h1>
			<p class="header-subtitle">Easy Access to System Information</p>

			<p>The Governance Team has decided that %s is ready to move to the next step in the IT Governance process.</p>

			<br>
			<p class="no-margin-top"><strong>Next step:</strong> %s</p>

			%s

			<br>
			<br>
			<div class="no-margin">
			  <p>View this request in EASi:</p>
			  <ul>
				<li>The person who initially submitted this request, %s, may <a href="%s">click here</a> to view the request task list.</li>
				<li>Governance Team members may <a href="%s">click here</a> to view the request details.</li>
				<li>Others should contact %s or the Governance Team for more information about this request.</li>
			  </ul>
			</div>

			<br>
			<p>If you have questions about your request, please contact the Governance Team at <a href="mailto:%s">%s</a>.</p>

			%s
			<br>
			<br>
			<hr>

			<p>Depending on the request, you may continue to receive email notifications about this request until it is closed.</p>
			`,
			requestName,
			HumanizeSnakeCase(string(nextStep)),
			feedbackStr,
			requester,
			requestLink,
			adminLink,
			requester,
			ITGovInboxAddress,
			ITGovInboxAddress,
			additionalInfoStr,
		)
	}

	for _, step := range models.AllSystemIntakeStepToProgressTo {
		err = client.SystemIntake.SendProgressToNewStepNotification(
			ctx,
			recipients,
			intakeID,
			step,
			requestName,
			requester,
			&feedback,
			additionalInfo,
		)
		s.NoError(err)

		s.Run("Subject is correct", func() {
			expectedSubject := fmt.Sprintf("%s is ready for a %s", requestName, HumanizeSnakeCase(string(step)))
			s.Equal(expectedSubject, sender.subject)
		})

		s.Run("Included info is correct", func() {
			expectedEmail := getExpectedEmail(
				step,
				&feedback,
				additionalInfo,
			)
			s.EqualHTML(expectedEmail, sender.body)
		})
	}

	s.Run("Recipient is correct", func() {
		allRecipients := []models.EmailAddress{
			recipient,
		}
		s.ElementsMatch(sender.toAddresses, allRecipients)
	})

	s.Run("Should omit feedback if absent", func() {
		err = client.SystemIntake.SendProgressToNewStepNotification(ctx,
			recipients,
			intakeID,
			newStep,
			requestName,
			requester,
			nil,
			additionalInfo,
		)
		s.NoError(err)
		expectedEmail := getExpectedEmail(
			newStep,
			nil, //feedback
			additionalInfo,
		)
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("Should omit additional info if absent", func() {
		err = client.SystemIntake.SendProgressToNewStepNotification(ctx,
			recipients,
			intakeID,
			newStep,
			requestName,
			requester,
			&feedback,
			nil,
		)
		s.NoError(err)
		expectedEmail := getExpectedEmail(
			newStep,
			&feedback,
			nil, //additionalInfo
		)

		s.EqualHTML(expectedEmail, sender.body)
	})

}
