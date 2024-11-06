package email

import (
	"context"
	"fmt"
	"time"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestIntakeChangeLCIDRetirementDateNotification() {
	ctx := context.Background()
	lifecycleID := "123456"
	lifecycleScope := models.HTMLPointer("<p><em>things</em></p>")
	lifecycleCostBaseline := "100bux"
	issuedAt := time.Now()
	retiresAt := time.Now().AddDate(2, 0, 0)
	expiresAt := time.Now().AddDate(1, 0, 0)
	ITGovInboxAddress := s.config.GRTEmail.String()
	additionalInfo := models.HTMLPointer("<p>An apple a day keeps the doctor away.</p>")
	decisionNextSteps := models.HTMLPointer("<p>Decision: Make lunch</p><p>Steps:</p><ol><li><p>Decide what to eat</p></li><li><p>Eat</p></li></ol>")

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
		issuedAt *time.Time,
		scope *models.HTML,
		nextSteps *models.HTML,
		additionalInfo *models.HTML,
	) string {
		var additionalInfoStr string
		var issuedAtStr string
		if issuedAt != nil {
			issuedAtStr = fmt.Sprintf(
				`<p><strong>Original date issued:</strong> %s</p>`,
				issuedAt.Format("01/02/2006"),
			)
		}
		if additionalInfo != nil {
			additionalInfoStr = fmt.Sprintf(
				`<br><hr><p><strong>Additional information from the Governance Team:</strong></p><div class="no-margin">%s</div>`,
				*additionalInfo.StringPointer(),
			)
		}

		return fmt.Sprintf(`
			<h1 class="header-title">EASi</h1>
			<p class="header-subtitle">Easy Access to System Information</p>

			<p>The Governance Team has updated the retirement date for a previously-issued Life Cycle ID (LCID).</p>
			<br>
			<p class="no-margin"><strong>New retirement date:</strong> %s</p>
			<br>

		    <p>If you have questions, please contact the Governance Team at <a href="mailto:%s">%s</a>.</p>

			<br>
			<div class="no-margin">
				<p><u>Summary of retired Life Cycle ID</u></p>
				<p><strong>Life Cycle ID:</strong> %s</p>
				%s
				<p><strong>Expiration date:</strong> %s</p>
				<p><strong>Scope:</strong></p>%s
				<p><strong>Project Cost Baseline:</strong> %s</p>
				<p><strong>Next steps:</strong></p>%s
			</div>
			%s
			`,
			retiresAt.Format("01/02/2006"),
			ITGovInboxAddress,
			ITGovInboxAddress,
			lifecycleID,
			issuedAtStr,
			expiresAt.Format("01/02/2006"),
			scope.ToTemplate(),
			lifecycleCostBaseline,
			nextSteps.ToTemplate(),
			additionalInfoStr,
		)
	}

	err = client.SystemIntake.SendChangeLCIDRetirementDateNotification(
		ctx,
		recipients,
		lifecycleID,
		&retiresAt,
		&expiresAt,
		&issuedAt,
		lifecycleScope,
		lifecycleCostBaseline,
		decisionNextSteps,
		additionalInfo,
	)
	s.NoError(err)

	s.Run("Subject is correct", func() {
		expectedSubject := fmt.Sprintf("The retirement date for a Life Cycle ID (%s) has been changed", lifecycleID)
		s.Equal(expectedSubject, sender.subject)
	})

	s.Run("Recipient is correct", func() {
		allRecipients := []models.EmailAddress{
			recipient,
		}
		s.ElementsMatch(sender.toAddresses, allRecipients)
	})

	s.Run("Includes all info", func() {
		expectedEmail := getExpectedEmail(
			&issuedAt,
			lifecycleScope,
			decisionNextSteps,
			additionalInfo,
		)
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("Should omit additional info and issuedAt if absent", func() {
		err = client.SystemIntake.SendChangeLCIDRetirementDateNotification(
			ctx,
			recipients,
			lifecycleID,
			&retiresAt,
			&expiresAt,
			nil, //issuedAt
			lifecycleScope,
			lifecycleCostBaseline,
			decisionNextSteps,
			nil, // add'l info
		)
		s.NoError(err)
		expectedEmail := getExpectedEmail(
			nil, //issuedAt
			lifecycleScope,
			decisionNextSteps,
			nil, // add'l info
		)
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("Should omit scope and next steps if absent", func() {
		err = client.SystemIntake.SendChangeLCIDRetirementDateNotification(
			ctx,
			recipients,
			lifecycleID,
			&retiresAt,
			&expiresAt,
			nil, //issuedAt
			nil, // scope
			lifecycleCostBaseline,
			nil, // next steps
			nil, // add'l info
		)
		s.NoError(err)
		expectedEmail := getExpectedEmail(
			nil, //issuedAt
			nil, // scope
			nil, // next steps
			nil, // add'l info
		)
		s.EqualHTML(expectedEmail, sender.body)
	})
}
