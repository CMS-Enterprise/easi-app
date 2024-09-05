package email

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendNotITGovRequestNotification() {
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
		reason *models.HTML,
		additionalInfo *models.HTML,
	) string {
		var reasonStr string
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

			<p>The Governance Review Team has determined that this request, %s, is not an IT Governance request. This request is now closed.</p>

			%s

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

	err = client.SystemIntake.SendNotITGovRequestNotification(ctx,
		recipients,
		intakeID,
		requestName,
		requester,
		&reason,
		additionalInfo,
	)
	s.NoError(err)

	s.Run("Subject is correct", func() {
		expectedSubject := fmt.Sprintf("%s is not an IT Governance request", requestName)
		s.Equal(expectedSubject, sender.subject)
	})

	s.Run("Included info is correct", func() {
		expectedEmail := getExpectedEmail(
			&reason,
			additionalInfo,
		)
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("Recipient is correct", func() {
		allRecipients := []models.EmailAddress{
			recipient,
		}
		s.ElementsMatch(sender.toAddresses, allRecipients)
	})

	s.Run("Should omit reason if absent", func() {
		err = client.SystemIntake.SendNotITGovRequestNotification(ctx,
			recipients,
			intakeID,
			requestName,
			requester,
			nil,
			additionalInfo,
		)
		s.NoError(err)
		expectedEmail := getExpectedEmail(
			nil, // reason
			additionalInfo,
		)
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("Should omit additional info if absent", func() {
		err = client.SystemIntake.SendNotITGovRequestNotification(ctx,
			recipients,
			intakeID,
			requestName,
			requester,
			&reason,
			nil,
		)
		s.NoError(err)
		expectedEmail := getExpectedEmail(
			&reason,
			nil, // additionalInfo
		)
		s.EqualHTML(expectedEmail, sender.body)
	})
}
