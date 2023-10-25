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

	expectedEmail := fmt.Sprintf(`<h1 style="margin-bottom: 0.5rem;">EASi</h1>

<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>

<p>The Governance Team has retired a previously-issued Life Cycle ID (LCID).</p>

<p>Retirement date: %s<br>
Reason: %s</p>

If you have questions, please contact the Governance Team at <a href="mailto:%s">%s</a>.

<p><u>Summary of retired Life Cycle ID</u><br>
<strong>Lifecycle ID:</strong> %s<br>
<strong>Date Issued:</strong> %s<br>
<strong>Expiration date:</strong> %s<br>
<strong>Scope:</strong> %s<br>
<strong>Project Cost Baseline:</strong> %s<br>
<strong>Next steps:</strong> %s</p>

<hr><p><strong>Additional information from the Governance Team:</strong></p><p>%s</p>
`,
		retiresAt.Format("01/02/2006"),
		*reason.StringPointer(),
		ITGovInboxAddress,
		ITGovInboxAddress,
		lifecycleID,
		issuedAt.Format("01/02/2006"),
		expiresAt.Format("01/02/2006"),
		*lifecycleScope.StringPointer(),
		lifecycleCostBaseline,
		*decisionNextSteps.StringPointer(),
		*additionalInfo.StringPointer(),
	)
	s.Equal(expectedEmail, sender.body)
	s.Run("Recipient is correct", func() {
		allRecipients := []models.EmailAddress{
			recipient,
		}
		s.ElementsMatch(sender.toAddresses, allRecipients)
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
	expectedEmail = fmt.Sprintf(`<h1 style="margin-bottom: 0.5rem;">EASi</h1>

<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>

<p>The Governance Team has retired a previously-issued Life Cycle ID (LCID).</p>

<p>Retirement date: %s<br>
Reason: %s</p>

If you have questions, please contact the Governance Team at <a href="mailto:%s">%s</a>.

<p><u>Summary of retired Life Cycle ID</u><br>
<strong>Lifecycle ID:</strong> %s<br>
<strong>Date Issued:</strong> %s<br>
<strong>Expiration date:</strong> %s<br>
<strong>Scope:</strong> %s<br>
<strong>Project Cost Baseline:</strong> %s<br>
<strong>Next steps:</strong> %s</p>


`,
		retiresAt.Format("01/02/2006"),
		*reason.StringPointer(),
		ITGovInboxAddress,
		ITGovInboxAddress,
		lifecycleID,
		issuedAt.Format("01/02/2006"),
		expiresAt.Format("01/02/2006"),
		*lifecycleScope.StringPointer(),
		lifecycleCostBaseline,
		*decisionNextSteps.StringPointer(),
	)

	s.Run("Should omit additional info if absent", func() {
		s.Equal(expectedEmail, sender.body)
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
		nil,
	)
	s.NoError(err)
	expectedEmail = fmt.Sprintf(`<h1 style="margin-bottom: 0.5rem;">EASi</h1>

<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>

<p>The Governance Team has retired a previously-issued Life Cycle ID (LCID).</p>

<p>Retirement date: %s</p>

If you have questions, please contact the Governance Team at <a href="mailto:%s">%s</a>.

<p><u>Summary of retired Life Cycle ID</u><br>
<strong>Lifecycle ID:</strong> %s<br>
<strong>Expiration date:</strong> %s<br>
<strong>Scope:</strong> %s<br>
<strong>Project Cost Baseline:</strong> %s<br>
<strong>Next steps:</strong> %s</p>


`,
		retiresAt.Format("01/02/2006"),
		ITGovInboxAddress,
		ITGovInboxAddress,
		lifecycleID,
		expiresAt.Format("01/02/2006"),
		*lifecycleScope.StringPointer(),
		lifecycleCostBaseline,
		*decisionNextSteps.StringPointer(),
	)

	s.Run("Should omit reason and issuedAt if absent", func() {
		s.Equal(expectedEmail, sender.body)
	})

}
