package email

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestCloseIntakeRequestNotification() {
	ctx := context.Background()
	intakeID := uuid.MustParse("24dd7736-e4c2-4f67-8844-51187de49069")
	requestName := "Hotdog/Not Hotdog Program"
	requester := "Dr Fishopolis"
	submittedAt := time.Now()
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
	additionalInfo := models.HTMLPointer("An apple a day keeps the doctor away.")

	reason := models.HTMLPointer("reasons")

	sender := mockSender{}
	recipient := models.NewEmailAddress("fake@fake.com")
	recipients := models.EmailNotificationRecipients{
		RegularRecipientEmails:   []models.EmailAddress{recipient},
		ShouldNotifyITGovernance: false,
		ShouldNotifyITInvestment: false,
	}
	client, err := NewClient(s.config, &sender)
	s.NoError(err)
	err = client.SystemIntake.SendCloseRequestNotification(ctx, recipients, intakeID, requestName, requester, reason, &submittedAt, additionalInfo)
	s.NoError(err)
	expectedSubject := fmt.Sprintf("The Governance Team has closed %s in EASi", requestName)
	s.Equal(expectedSubject, sender.subject)
	getExpectedEmail := func(
		reason *models.HTML,
		additionalInfo *models.HTML,
	) string {
		var reasonStr string
		var additionalInfoStr string
		if reason != nil {
			reasonStr = fmt.Sprintf(
				`<br>
				<div class="no-margin">
				  <p><strong>Reason:</strong></p>
				  %s
				</div>`,
				*reason.StringPointer(),
			)
		}
		if additionalInfo != nil {
			additionalInfoStr = fmt.Sprintf(
				`<br>
				<hr>
				<br>
				<p class="no-margin"><strong>Additional information from the Governance Team:</strong></p>
				<br>
				<div class="no-margin">%s</div>`,
				*additionalInfo.StringPointer(),
			)
		}
		return fmt.Sprintf(`
			<h1 class="header-title">EASi</h1>
			<p class="header-subtitle">Easy Access to System Information</p>

			<p>The IT Governance Request titled %s, submitted on %s, has been closed in EASi.</p>
			%s
			<br>
			<p class="no-margin-bottom">View this closed request in EASi:</p>
			<ul class="no-margin">
				<li>
					The person who initially submitted this request, %s, may <a href="%s">click here</a> to view the request task list.
				</li>
				<li>
					Governance Team members may <a href="%s">click here</a> to view the request details.
				</li>
				<li>Others should contact %s or the Governance Team for more information about this request.</li>
			</ul>

			<br>
			<p class="no-margin">If you have questions about your request, please contact the Governance Team at <a href="mailto:%s">%s</a>.</p>
			%s
			<br>
			<hr>

			<p>Depending on the request, the Governance Team may follow up with this project team at a later date.</p>`,
			requestName,
			submittedAt.Format("01/02/2006"),
			reasonStr,
			requester,
			requestLink,
			adminLink,
			requester,
			ITGovInboxAddress,
			ITGovInboxAddress,
			additionalInfoStr,
		)
	}
	expectedEmail := getExpectedEmail(reason, additionalInfo)
	s.Run("Recipient is correct", func() {
		allRecipients := []models.EmailAddress{
			recipient,
		}
		s.ElementsMatch(sender.toAddresses, allRecipients)
	})
	s.Run("all info is included", func() {
		s.EqualHTML(expectedEmail, sender.body)
	})
	err = client.SystemIntake.SendCloseRequestNotification(ctx, recipients, intakeID, requestName, requester, nil, &submittedAt, additionalInfo)
	s.NoError(err)

	expectedEmail = getExpectedEmail(nil, additionalInfo)
	s.Run("Should omit reason if absent", func() {
		s.EqualHTML(expectedEmail, sender.body)
	})
	err = client.SystemIntake.SendCloseRequestNotification(ctx, recipients, intakeID, requestName, requester, reason, &submittedAt, nil)
	s.NoError(err)

	expectedEmail = getExpectedEmail(reason, nil)
	s.Run("Should omit additional info if absent", func() {
		s.EqualHTML(expectedEmail, sender.body)
	})

}
