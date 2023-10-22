package email

import (
	"context"
	"fmt"
	"time"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestIntakeExpireLCIDNotification() {
	ctx := context.Background()
	lifecycleID := "123456"
	lifecycleScope := models.HTMLPointer("<em>things</em>")
	lifecycleCostBaseline := "100bux"
	expiresAt := time.Now().AddDate(1, 0, 0)
	ITGovInboxAddress := s.config.GRTEmail.String()
	reason := models.HTMLPointer("<strong>This LCID is TERRIBLE anyway</strong>")
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
	err = client.SystemIntake.SendExpireLCIDNotification(
		ctx,
		recipients,
		lifecycleID,
		&expiresAt,
		*lifecycleScope,
		lifecycleCostBaseline,
		*reason,
		decisionNextSteps,
		additionalInfo,
	)
	s.NoError(err)
	expectedSubject := fmt.Sprintf("A Life Cycle ID (%s) has expired", lifecycleID)
	s.Equal(expectedSubject, sender.subject)

	expectedEmail := fmt.Sprintf(`<h1 style="margin-bottom: 0.5rem;">EASi</h1>

<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>

<p>A previously-issued Life Cycle ID (LCID) has expired.</p>

<p>Reason: %s<br>
Next steps: %s</p>

If you have questions, please contact the Governance Team at <a href="mailto:%s">%s</a>.

<p><u>Summary of expired Life Cycle ID</u><br>
<strong>Lifecycle ID:</strong> %s<br>
<strong>Expiration date:</strong> %s<br>
<strong>Scope:</strong> %s<br>
<strong>Project Cost Baseline:</strong> %s<br>
<strong>Next steps:</strong> %s</p>

<hr><p><strong>Additional information from the Governance Team:</strong></p><p>%s</p>
<hr>

<p>Depending on the request, the Governance Team may follow up with this project team at a later date.</p>

`,
		*reason.StringPointer(),
		*decisionNextSteps.StringPointer(),
		ITGovInboxAddress,
		ITGovInboxAddress,
		lifecycleID,
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

	err = client.SystemIntake.SendExpireLCIDNotification(
		ctx,
		recipients,
		lifecycleID,
		&expiresAt,
		*lifecycleScope,
		lifecycleCostBaseline,
		*reason,
		decisionNextSteps,
		nil,
	)
	s.NoError(err)
	expectedEmail = fmt.Sprintf(`<h1 style="margin-bottom: 0.5rem;">EASi</h1>

<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>

<p>A previously-issued Life Cycle ID (LCID) has expired.</p>

<p>Reason: %s<br>
Next steps: %s</p>

If you have questions, please contact the Governance Team at <a href="mailto:%s">%s</a>.

<p><u>Summary of expired Life Cycle ID</u><br>
<strong>Lifecycle ID:</strong> %s<br>
<strong>Expiration date:</strong> %s<br>
<strong>Scope:</strong> %s<br>
<strong>Project Cost Baseline:</strong> %s<br>
<strong>Next steps:</strong> %s</p>


<hr>

<p>Depending on the request, the Governance Team may follow up with this project team at a later date.</p>

`,
		*reason.StringPointer(),
		*decisionNextSteps.StringPointer(),
		ITGovInboxAddress,
		ITGovInboxAddress,
		lifecycleID,
		expiresAt.Format("01/02/2006"),
		*lifecycleScope.StringPointer(),
		lifecycleCostBaseline,
		*decisionNextSteps.StringPointer(),
	)

	s.Run("Should omit additional info if absent", func() {
		s.Equal(expectedEmail, sender.body)
	})

	err = client.SystemIntake.SendExpireLCIDNotification(
		ctx,
		recipients,
		lifecycleID,
		&expiresAt,
		*lifecycleScope,
		lifecycleCostBaseline,
		*reason,
		nil,
		nil,
	)
	s.NoError(err)
	expectedEmail = fmt.Sprintf(`<h1 style="margin-bottom: 0.5rem;">EASi</h1>

<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>

<p>A previously-issued Life Cycle ID (LCID) has expired.</p>

<p>Reason: %s<br>
</p>

If you have questions, please contact the Governance Team at <a href="mailto:%s">%s</a>.

<p><u>Summary of expired Life Cycle ID</u><br>
<strong>Lifecycle ID:</strong> %s<br>
<strong>Expiration date:</strong> %s<br>
<strong>Scope:</strong> %s<br>
<strong>Project Cost Baseline:</strong> %s</p>


<hr>

<p>Depending on the request, the Governance Team may follow up with this project team at a later date.</p>

`,
		*reason.StringPointer(),
		ITGovInboxAddress,
		ITGovInboxAddress,
		lifecycleID,
		expiresAt.Format("01/02/2006"),
		*lifecycleScope.StringPointer(),
		lifecycleCostBaseline,
	)

	s.Run("Should omit next steps if absent", func() {
		s.Equal(expectedEmail, sender.body)
	})
}
