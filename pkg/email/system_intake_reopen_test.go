package email

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestReopenIntakeRequestNotification() {
	ctx := context.Background()
	intakeID := uuid.MustParse("57b75927-4939-4d70-b42f-b59e28ba3e77")
	requestName := "Pizza for lunch everyday program"
	requester := "Richard Simmons"
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
	additionalInfo := models.HTMLPointer("Pepperoni is preferable.")

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

	getExpectedEmail := func(
		reason *models.HTML,
		submittedAt *time.Time,
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
		var submittedAtStr string
		if submittedAt != nil {
			submittedAtStr = fmt.Sprintf(
				`, submitted on %s,`,
				submittedAt.Format("01/02/2006"),
			)
		}
		var additionalInfoStr string
		if additionalInfo != nil {
			additionalInfoStr = fmt.Sprintf(
				`<hr>
				<br>
				<p><strong>Additional information from the Governance Team:</strong></p>
				<div class="no-margin">%s</div>`,
				*additionalInfo.StringPointer(),
			)
		}
		return fmt.Sprintf(`
			<h1 class="header-title">EASi</h1>
			<p class="header-subtitle">Easy Access to System Information</p>

			<p>The IT Governance Request titled %s%s has been re-opened in EASi.</p>

			%s

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
			submittedAtStr,
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

	err = client.SystemIntake.SendReopenRequestNotification(
		ctx,
		recipients,
		intakeID,
		requestName,
		requester,
		reason,
		&submittedAt,
		additionalInfo,
	)
	s.NoError(err)

	s.Run("Subject is correct", func() {
		expectedSubject := fmt.Sprintf("The Governance Team has re-opened %s in EASi", requestName)
		s.Equal(expectedSubject, sender.subject)
	})

	s.Run("Included info is correct", func() {
		expectedEmail := getExpectedEmail(
			reason,
			&submittedAt,
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
		err = client.SystemIntake.SendReopenRequestNotification(
			ctx,
			recipients,
			intakeID,
			requestName,
			requester,
			nil, //reason
			&submittedAt,
			additionalInfo,
		)
		s.NoError(err)
		expectedEmail := getExpectedEmail(
			nil, //reason
			&submittedAt,
			additionalInfo,
		)
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("Should omit submitted time if absent", func() {
		err = client.SystemIntake.SendReopenRequestNotification(
			ctx,
			recipients,
			intakeID,
			requestName,
			requester,
			reason,
			nil, //submittedAt
			additionalInfo,
		)
		s.NoError(err)
		expectedEmail := getExpectedEmail(
			reason,
			nil, //submittedAt
			additionalInfo,
		)
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("Should omit additional info if absent", func() {
		err = client.SystemIntake.SendReopenRequestNotification(
			ctx,
			recipients,
			intakeID,
			requestName,
			requester,
			reason,
			&submittedAt,
			nil, //additionalInfo
		)
		s.NoError(err)
		expectedEmail := getExpectedEmail(
			reason,
			&submittedAt,
			nil, //additionalInfo
		)
		s.EqualHTML(expectedEmail, sender.body)
	})

}
