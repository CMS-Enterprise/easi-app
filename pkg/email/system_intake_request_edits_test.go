package email

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendRequestEditsNotification() {

	ctx := context.Background()
	intakeID := uuid.MustParse("27883155-46ad-4c30-b3b0-30e8d093756e")
	formName := models.GRFTFinalBusinessCase
	requestName := "Test Request"
	requester := "Sir Requester"
	additionalInfo := models.HTMLPointer("<p>additional info</p>")
	requestLink := fmt.Sprintf(
		"%s://%s/governance-task-list/%s",
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
		formName models.GovernanceRequestFeedbackTargetForm,
		additionalInfo *models.HTML,
	) string {
		var additionalInfoStr string
		if additionalInfo != nil {
			additionalInfoStr = fmt.Sprintf(`<br>
					<hr>
					<br>
					<p><strong>Additional information from the Governance Team:</strong></p><div class="no-margin">%s</div>`,
				*additionalInfo.StringPointer(),
			)
		}
		adminLink := fmt.Sprintf(
			"%s://%s/it-governance/%s/",
			s.config.URLScheme,
			s.config.URLHost,
			intakeID.String(),
		)
		switch formName {
		case models.GRFTFIntakeRequest:
			adminLink += "intake-request"
		case models.GRFTFinalBusinessCase:
			fallthrough
		case models.GRFTFDraftBusinessCase:
			adminLink += "business-case"
		case models.GRFTFNoTargetProvided:
			fallthrough
		default:
			panic("no target form")
		}

		return fmt.Sprintf(`
			<h1 class="header-title">EASi</h1>
			<p class="header-subtitle">Easy Access to System Information</p>

			<p>The GRT has requested updates to the %s for %s before the request can proceed further in the Governance Review process.</p>

			<br>
			<div class="no-margin">
			  <p><strong>Updates needed:</strong></p>%s
			</div>

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
			<hr>

			<p>Depending on the request, you may continue to receive email notifications about this request until it is closed.</p>`,
			formName.Humanize(),
			requestName,
			feedback,
			requester,
			requestLink,
			adminLink,
			requester,
			ITGovInboxAddress,
			ITGovInboxAddress,
			additionalInfoStr,
		)
	}

	s.Run("Recipient is correct", func() {
		err = client.SystemIntake.SendRequestEditsNotification(ctx, recipients, intakeID, formName, requestName, requester, feedback, additionalInfo)
		allRecipients := []models.EmailAddress{
			recipient,
		}
		s.ElementsMatch(sender.toAddresses, allRecipients)
	})

	for _, targetedForm := range []models.GovernanceRequestFeedbackTargetForm{
		models.GRFTFIntakeRequest,
		models.GRFTFDraftBusinessCase,
		models.GRFTFinalBusinessCase,
	} {
		err = client.SystemIntake.SendRequestEditsNotification(ctx, recipients, intakeID, targetedForm, requestName, requester, feedback, additionalInfo)
		s.NoError(err)
		expectedSubject := fmt.Sprintf("Updates requested for the %s for %s", targetedForm.Humanize(), requestName)
		s.Run("subject is correct for "+targetedForm.Humanize(), func() {
			s.Equal(expectedSubject, sender.subject)
		})

		expectedEmail := getExpectedEmail(targetedForm, additionalInfo)
		s.Run("all info is included for "+targetedForm.Humanize(), func() {
			s.EqualHTML(expectedEmail, sender.body)
		})
	}

	err = client.SystemIntake.SendRequestEditsNotification(ctx, recipients, intakeID, formName, requestName, requester, feedback, nil)
	s.NoError(err)
	expectedEmail := getExpectedEmail(formName, nil)

	s.Run("Should omit additional info if absent", func() {
		s.EqualHTML(expectedEmail, sender.body)
	})

}
