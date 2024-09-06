package email

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendNotApprovedNotification() {

	ctx := context.Background()
	intakeID := uuid.MustParse("27883155-46ad-4c30-b3b0-30e8d093756e")
	requestName := "Test Request"
	requester := "Sir Requester"
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

	reason := models.HTML("inumerable reasons, literally so many reasons")
	nextSteps := models.HTML("first we waltz, then we cha-cha")

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
		additionalInfo *models.HTML,
	) string {
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

			<p>The Governance Review Board (GRB) did not approve %s.</p>

			<br>
			<div class="no-margin">
				<p><strong>Reason:</strong></p>
				%s
			</div>
			<br>
			<div class="no-margin">
				<p><strong>Next Steps:</strong></p>
				%s
			</div>

			<br>
			<div class="no-margin">
				<p>View this closed request in EASi:</p>
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

			<p>Depending on the request, the Governance Team may follow up with this project at a later date.</p>`,
			requestName,
			reason,
			nextSteps,
			requester,
			requestLink,
			adminLink,
			requester,
			ITGovInboxAddress,
			ITGovInboxAddress,
			additionalInfoStr,
		)
	}

	err = client.SystemIntake.SendNotApprovedNotification(
		ctx,
		recipients,
		intakeID,
		requestName,
		requester,
		reason,
		nextSteps,
		additionalInfo,
	)
	s.NoError(err)

	s.Run("Subject is correct", func() {
		expectedSubject := fmt.Sprintf("%s was not approved by the GRB", requestName)
		s.Equal(expectedSubject, sender.subject)
	})

	s.Run("Included info is correct", func() {
		expectedEmail := getExpectedEmail(additionalInfo)
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("Recipient is correct", func() {
		allRecipients := []models.EmailAddress{
			recipient,
		}
		s.ElementsMatch(sender.toAddresses, allRecipients)
	})

	s.Run("Should omit additional info if absent", func() {
		err = client.SystemIntake.SendNotApprovedNotification(
			ctx,
			recipients,
			intakeID,
			requestName,
			requester,
			reason,
			nextSteps,
			nil, // additionalInfo
		)
		s.NoError(err)
		expectedEmail := getExpectedEmail(nil)
		s.EqualHTML(expectedEmail, sender.body)
	})
}
