package email

import (
	"context"
	"fmt"
	"time"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestIntakeExpireLCIDNotification() {
	ctx := context.Background()
	lifecycleID := "123456"
	lifecycleScope := models.HTMLPointer("<p><em>things</em></p>")
	lifecycleCostBaseline := "100bux"
	expiresAt := time.Now().AddDate(1, 0, 0)
	issuedAt := time.Now()
	ITGovInboxAddress := s.config.GRTEmail.String()
	reason := models.HTML("<p><strong>This LCID is TERRIBLE anyway</strong></p>")
	additionalInfo := models.HTMLPointer("<p>An apple a day keeps the doctor away.</p>")

	decisionNextSteps := models.HTMLPointer("<p>Decision: Make lunch</p><p>Steps:</p><ol><li>Decide what to eat</li><li>Eat</li></ol>")

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
		nextSteps *models.HTML,
		issuedAt *time.Time,
		scope *models.HTML,
		costBaseline string,
		additionalInfo *models.HTML,
	) string {
		var nextStepsStr string
		var additionalInfoStr string
		var issuedAtStr string
		if nextSteps != nil {
			nextStepsStr = fmt.Sprintf(`
				<br>
				<p><strong>Next steps:</strong></p>%s`,
				*nextSteps.StringPointer(),
			)
		}
		if issuedAt != nil {
			issuedAtStr = fmt.Sprintf(
				`<p><strong>Original date issued:</strong> %s</p>`,
				issuedAt.Format("01/02/2006"),
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

			<p>A previously-issued Life Cycle ID (LCID) has expired.</p>

			<br>
			<div class="no-margin">
				<p><strong>Reason:</strong></p>%s
				%s
			</div>

			<br>
			<p>If you have questions, please contact the Governance Team at <a href="mailto:%s">%s</a>.</p>

			<br>
			<div class="no-margin">
				<p><u>Summary of expired Life Cycle ID</u></p>
				<p><strong>Life Cycle ID:</strong> %s</p>
				%s
				<p><strong>Expiration date:</strong> %s</p>
				<p><strong>Scope:</strong></p>%s
				<p><strong>Project Cost Baseline:</strong> %s</p>
			</div>

			%s
			<br>
			<hr>

			<p>Depending on the request, the Governance Team may follow up with this project team at a later date.</p>
			`,
			*reason.StringPointer(),
			nextStepsStr,
			ITGovInboxAddress,
			ITGovInboxAddress,
			lifecycleID,
			issuedAtStr,
			expiresAt.Format("01/02/2006"),
			scope.ToTemplate(),
			costBaseline,
			additionalInfoStr,
		)

	}

	err = client.SystemIntake.SendExpireLCIDNotification(
		ctx,
		recipients,
		lifecycleID,
		&expiresAt,
		&issuedAt,
		lifecycleScope,
		lifecycleCostBaseline,
		reason,
		decisionNextSteps,
		additionalInfo,
	)
	s.NoError(err)

	s.Run("Subject is correct", func() {
		expectedSubject := fmt.Sprintf("A Life Cycle ID (%s) has expired", lifecycleID)
		s.Equal(expectedSubject, sender.subject)
	})

	s.Run("included info is correct", func() {
		expectedEmail := getExpectedEmail(
			decisionNextSteps,
			&issuedAt,
			lifecycleScope,
			lifecycleCostBaseline,
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

	s.Run("Should omit additional info if absent", func() {
		err = client.SystemIntake.SendExpireLCIDNotification(
			ctx,
			recipients,
			lifecycleID,
			&expiresAt,
			&issuedAt,
			lifecycleScope,
			lifecycleCostBaseline,
			reason,
			decisionNextSteps,
			nil,
		)
		s.NoError(err)
		expectedEmail := getExpectedEmail(
			decisionNextSteps,
			&issuedAt,
			lifecycleScope,
			lifecycleCostBaseline,
			nil,
		)

		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("Should omit next steps and issuedAt if absent", func() {
		err = client.SystemIntake.SendExpireLCIDNotification(
			ctx,
			recipients,
			lifecycleID,
			&expiresAt,
			nil,
			lifecycleScope,
			lifecycleCostBaseline,
			reason,
			nil,
			nil,
		)
		s.NoError(err)
		expectedEmail := getExpectedEmail(
			nil,
			nil,
			lifecycleScope,
			lifecycleCostBaseline,
			nil,
		)

		s.EqualHTML(expectedEmail, sender.body)
	})
	s.Run("Should omit scope and cost baseline if absent", func() {
		err = client.SystemIntake.SendExpireLCIDNotification(
			ctx,
			recipients,
			lifecycleID,
			&expiresAt,
			nil, // issuedAt
			nil, // scope
			"",  // cost baseline
			reason,
			nil, // next steps
			nil, // add'l info
		)
		s.NoError(err)
		expectedEmail := getExpectedEmail(
			nil, // next steps
			nil, // issued at
			nil, // scope
			"",  // cost baseline
			nil, // add'l info
		)

		s.EqualHTML(expectedEmail, sender.body)
	})
}
