package email

import (
	"context"
	"fmt"
	"time"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestIntakeRetireLCIDNotification() {
	ctx := context.Background()
	lifecycleID := "123456"
	lifecycleScope := models.HTMLPointer("<em>things</em>")
	lifecycleCostBaseline := "100bux"
	retiresAt := time.Now().AddDate(2, 0, 0)
	expiresAt := time.Now().AddDate(1, 0, 0)
	issuedAt := time.Now()
	ITGovInboxAddress := s.config.GRTEmail.String()
	reason := models.HTMLPointer("This is a terrible LCID")
	additionalInfo := models.HTMLPointer("An apple a day keeps the doctor away.")

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
	err = client.SystemIntake.SendRetireLCIDNotification(
		ctx,
		recipients,
		lifecycleID,
		&retiresAt,
		&expiresAt,
		&issuedAt,
		lifecycleScope,
		lifecycleCostBaseline,
		reason,
		decisionNextSteps,
		additionalInfo,
	)
	s.NoError(err)
	expectedSubject := fmt.Sprintf("A Life Cycle ID (%s) has been retired", lifecycleID)
	s.Equal(expectedSubject, sender.subject)

	getExpectedEmail := func(
		issuedAt *time.Time,
		reason *models.HTML,
		scope *models.HTML,
		nextSteps *models.HTML,
		additionalInfo *models.HTML,
	) string {
		var reasonStr string
		var additionalInfoStr string
		var issuedAtStr string
		var scopeStr string
		var nextStepsStr string
		if reason != nil {
			reasonStr = fmt.Sprintf(
				`<p class="no-margin"><strong>Reason:</strong></p>
				<div class="no-margin">%s</div>
				<br>`,
				*reason.StringPointer(),
			)
		}
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

			<p class="no-margin-bottom">The Governance Team has retired a previously-issued Life Cycle ID (LCID).</p>
			<br>
			<p class="no-margin"><strong>Retirement date:</strong> %s</p>
			<br>%s
			<p>If you have questions, please contact the Governance Team at <a href="mailto:%s">%s</a>.</p>

			<br>
			<div class="no-margin">
				<p><u>Summary of retired Life Cycle ID</u></p>
				<p><strong>Life Cycle ID:</strong> %s</p>%s
				<p><strong>Expiration date:</strong> %s</p>
				%s
				<p><strong>Project Cost Baseline:</strong> %s</p>
				%s
			</div>
			%s
			`,
			retiresAt.Format("01/02/2006"),
			reasonStr,
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

	expectedEmail := getExpectedEmail(&issuedAt, reason, lifecycleScope, decisionNextSteps, additionalInfo)
	s.Run("Recipient is correct", func() {
		allRecipients := []models.EmailAddress{
			recipient,
		}
		s.ElementsMatch(sender.toAddresses, allRecipients)
	})

	s.Run("all info is included", func() {
		s.EqualHTML(expectedEmail, sender.body)
	})

	err = client.SystemIntake.SendRetireLCIDNotification(
		ctx,
		recipients,
		lifecycleID,
		&retiresAt,
		&expiresAt,
		&issuedAt,
		lifecycleScope,
		lifecycleCostBaseline,
		reason,
		decisionNextSteps,
		nil,
	)
	s.NoError(err)
	expectedEmail = getExpectedEmail(&issuedAt, reason, lifecycleScope, decisionNextSteps, nil)
	s.Run("Should omit additional info if absent", func() {
		s.EqualHTML(expectedEmail, sender.body)
	})

	err = client.SystemIntake.SendRetireLCIDNotification(
		ctx,
		recipients,
		lifecycleID,
		&retiresAt,
		&expiresAt,
		nil,
		lifecycleScope,
		lifecycleCostBaseline,
		nil,
		decisionNextSteps,
		additionalInfo,
	)
	s.NoError(err)
	expectedEmail = getExpectedEmail(nil, nil, lifecycleScope, decisionNextSteps, additionalInfo)
	s.Run("Should omit reason and issuedAt if absent", func() {
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("Should omit scope if absent", func() {
		err = client.SystemIntake.SendRetireLCIDNotification(
			ctx,
			recipients,
			lifecycleID,
			&retiresAt,
			&expiresAt,
			nil,
			nil, // scope is nil
			lifecycleCostBaseline,
			nil,
			decisionNextSteps,
			additionalInfo,
		)
		s.NoError(err)

		expectedEmail = getExpectedEmail(nil, nil, nil, decisionNextSteps, additionalInfo)
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("Should omit next steps if absent", func() {
		err = client.SystemIntake.SendRetireLCIDNotification(
			ctx,
			recipients,
			lifecycleID,
			&retiresAt,
			&expiresAt,
			nil,
			lifecycleScope,
			lifecycleCostBaseline,
			nil,
			nil, //next steps is nil
			additionalInfo,
		)
		s.NoError(err)

		expectedEmail = getExpectedEmail(nil, nil, lifecycleScope, nil, additionalInfo)
		s.EqualHTML(expectedEmail, sender.body)
	})
}
