package email

import (
	"context"
	"fmt"
	"time"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestIntakeUnretireLCIDNotification() {
	ctx := context.Background()
	lifecycleID := "123456"
	lifecycleScope := models.HTMLPointer("<em>things and stuff</em>")
	lifecycleCostBaseline := "$3.50"
	expiresAt := time.Now().AddDate(1, 0, 0)
	issuedAt := time.Now()
	ITGovInboxAddress := s.config.GRTEmail.String()
	additionalInfo := models.HTMLPointer("Wanna get away?")

	decisionNextSteps := models.HTMLPointer("<p>Decision: Make dinner</p><p>Steps:</p><ol><li>Decide what to eat</li><li>Eat</li></ol>")

	sender := mockSender{}
	recipient := models.NewEmailAddress("fake@fake.com")
	recipients := models.EmailNotificationRecipients{
		RegularRecipientEmails:   []models.EmailAddress{recipient},
		ShouldNotifyITGovernance: false,
		ShouldNotifyITInvestment: false,
	}
	client, err := NewClient(s.config, &sender)
	s.NoError(err)
	err = client.SystemIntake.SendUnretireLCIDNotification(
		ctx,
		recipients,
		lifecycleID,
		&expiresAt,
		&issuedAt,
		lifecycleScope,
		lifecycleCostBaseline,
		decisionNextSteps,
		additionalInfo,
	)
	s.NoError(err)
	expectedSubject := fmt.Sprintf("The retirement date for a Life Cycle ID (%s) has been removed", lifecycleID)
	s.Equal(expectedSubject, sender.subject)

	getExpectedEmail := func(
		issuedAt *time.Time,
		scope *models.HTML,
		nextSteps *models.HTML,
		additionalInfo *models.HTML,
	) string {
		var additionalInfoStr string
		var issuedAtStr string
		var scopeStr string
		var nextStepsStr string

		if additionalInfo != nil {
			additionalInfoStr = fmt.Sprintf(
				`<br>
				<hr>
				<br>
				<p><strong>Additional information from the Governance Team:</strong></p><div class="no-margin">%s</div>`,
				*additionalInfo.StringPointer(),
			)
		}
		if scope != nil {
			scopeStr = fmt.Sprintf(`<p><strong>Scope:</strong></p>%s`,
				*scope.StringPointer(),
			)
		}
		if nextSteps != nil {
			nextStepsStr = fmt.Sprintf(`<p><strong>Next steps:</strong></p>%s`,
				*nextSteps.StringPointer(),
			)
		}
		if issuedAt != nil {
			issuedAtStr = fmt.Sprintf(`<p><strong>Original date issued:</strong> %s</p>`, issuedAt.Format("01/02/2006"))
		}
		return fmt.Sprintf(`
			<h1 class="header-title">EASi</h1>
			<p class="header-subtitle">Easy Access to System Information</p>

			<p class="no-margin-bottom">The Governance Team has removed the existing retirement date for a previously-issued Life Cycle ID (LCID). All previously set expiration dates or other details about this LCID are still valid.</p>
			<br>
			<p>If you have questions, please contact the Governance Team at <a href="mailto:%s">%s</a>.</p>

			<br>
			<div class="no-margin">
				<p><u>Summary of Life Cycle ID</u></p>
				<p><strong>Life Cycle ID:</strong> %s</p>%s
				<p><strong>Expiration date:</strong> %s</p>
				%s
				<p><strong>Project Cost Baseline:</strong> %s</p>
				%s
			</div>
			%s
			`,
			ITGovInboxAddress,
			ITGovInboxAddress,
			lifecycleID,
			issuedAtStr,
			expiresAt.Format("01/02/2006"),
			scopeStr,
			lifecycleCostBaseline,
			nextStepsStr,
			additionalInfoStr,
		)

	}

	expectedEmail := getExpectedEmail(&issuedAt, lifecycleScope, decisionNextSteps, additionalInfo)
	s.Run("Recipient is correct", func() {
		allRecipients := []models.EmailAddress{
			recipient,
		}
		s.ElementsMatch(sender.toAddresses, allRecipients)
	})

	s.Run("all info is included", func() {
		s.EqualHTML(expectedEmail, sender.body)
	})

	err = client.SystemIntake.SendUnretireLCIDNotification(
		ctx,
		recipients,
		lifecycleID,
		&expiresAt,
		&issuedAt,
		lifecycleScope,
		lifecycleCostBaseline,
		decisionNextSteps,
		nil,
	)
	s.NoError(err)
	expectedEmail = getExpectedEmail(&issuedAt, lifecycleScope, decisionNextSteps, nil)
	s.Run("Should omit additional info if absent", func() {
		s.EqualHTML(expectedEmail, sender.body)
	})

	err = client.SystemIntake.SendUnretireLCIDNotification(
		ctx,
		recipients,
		lifecycleID,
		&expiresAt,
		nil,
		lifecycleScope,
		lifecycleCostBaseline,
		decisionNextSteps,
		additionalInfo,
	)
	s.NoError(err)
	expectedEmail = getExpectedEmail(nil, lifecycleScope, decisionNextSteps, additionalInfo)
	s.Run("Should omit reason and issuedAt if absent", func() {
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("Should omit scope if absent", func() {
		err = client.SystemIntake.SendUnretireLCIDNotification(
			ctx,
			recipients,
			lifecycleID,
			&expiresAt,
			nil,
			nil, // scope is nil
			lifecycleCostBaseline,
			decisionNextSteps,
			additionalInfo,
		)
		s.NoError(err)

		expectedEmail = getExpectedEmail(nil, nil, decisionNextSteps, additionalInfo)
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("Should omit next steps if absent", func() {
		err = client.SystemIntake.SendUnretireLCIDNotification(
			ctx,
			recipients,
			lifecycleID,
			&expiresAt,
			nil,
			lifecycleScope,
			lifecycleCostBaseline,
			nil, //next steps is nil
			additionalInfo,
		)
		s.NoError(err)

		expectedEmail = getExpectedEmail(nil, lifecycleScope, nil, additionalInfo)
		s.EqualHTML(expectedEmail, sender.body)
	})
}
