package email

import (
	"context"
	"fmt"
	"time"

	"github.com/cmsgov/easi-app/pkg/models"
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
		*lifecycleScope,
		lifecycleCostBaseline,
		reason,
		*decisionNextSteps,
		additionalInfo,
	)
	s.NoError(err)
	expectedSubject := fmt.Sprintf("A Life Cycle ID (%s) has been retired", lifecycleID)
	s.Equal(expectedSubject, sender.subject)

	getExpectedEmail := func(
		issuedAt *time.Time,
		reason *models.HTML,
		additionalInfo *models.HTML,
	) string {
		var reasonStr string
		var additionalInfoStr string
		var issuedAtStr string
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
		if issuedAt != nil {
			issuedAtStr = fmt.Sprintf(`<p><strong>Original date issued:</strong> %s</p>`, issuedAt.Format("01/02/2006"))
		}
		return fmt.Sprintf(`<h1 style="margin-bottom: 0">EASi</h1>
			<p style="font-size:15px; color: #71767A; margin: 0.5rem 0 2rem;">Easy Access to System Information</p>


			<p class="no-margin-bottom">The Governance Team has retired a previously-issued Life Cycle ID (LCID).</p>
			<br>
			<p class="no-margin"><strong>Retirement date:</strong> %s</p>
			<br>%s
			<p>If you have questions, please contact the Governance Team at <a href="mailto:%s">%s</a>.</p>

			<br>
			<div class="no-margin">
				<p><u>Summary of retired Life Cycle ID</u></p>
				<p><strong>Lifecycle ID:</strong> %s</p>%s
				<p><strong>Expiration date:</strong> %s</p>
				<p><strong>Scope:</strong></p>%s
				<p><strong>Project Cost Baseline:</strong> %s</p>
				<p><strong>Next steps:</strong></p>%s
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
			*lifecycleScope.StringPointer(),
			lifecycleCostBaseline,
			*decisionNextSteps.StringPointer(),
			additionalInfoStr,
		)

	}

	expectedEmail := getExpectedEmail(&issuedAt, reason, additionalInfo)
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
		*lifecycleScope,
		lifecycleCostBaseline,
		reason,
		*decisionNextSteps,
		nil,
	)
	s.NoError(err)
	expectedEmail = getExpectedEmail(&issuedAt, reason, nil)
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
		*lifecycleScope,
		lifecycleCostBaseline,
		nil,
		*decisionNextSteps,
		additionalInfo,
	)
	s.NoError(err)
	expectedEmail = getExpectedEmail(nil, nil, additionalInfo)
	s.Run("Should omit reason and issuedAt if absent", func() {
		s.EqualHTML(expectedEmail, sender.body)
	})

}
