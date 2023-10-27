package email

import (
	"context"
	"fmt"
	"time"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestIntakeUpdateLCIDNotification() {
	ctx := context.Background()
	lifecycleID := "123456"
	issuedAt := time.Now()
	expiresAtPrev := time.Now().AddDate(1, 0, 0)
	expiresAtNew := time.Now().AddDate(100, 0, 0)
	amendmentDate := time.Now().AddDate(0, 0, 1)
	lifecycleScopePrev := models.HTMLPointer("<em>previous things</em>")
	lifecycleScopeNew := models.HTMLPointer("<em>new things</em>")
	lifecycleCostBaselinePrev := "100bux"
	lifecycleCostBaselineNew := "500bux"
	decisionNextStepsPrev := models.HTMLPointer("<p>Decision: Make lunch</p><p>Steps:</p><ol><li>Decide what to eat</li><li>Eat</li></ol>")
	decisionNextStepsNew := models.HTMLPointer("<p>Decision: Make lunch</p><p>Steps:</p><ol><li>Decide what to eat</li><li>Eat</li></ol>")
	ITGovInboxAddress := s.config.GRTEmail.String()
	reason := models.HTMLPointer("<strong>I have some reasons, OK?</strong>")
	additionalInfo := models.HTMLPointer("An apple a day keeps the doctor away.")

	sender := mockSender{}
	recipient := models.NewEmailAddress("fake@fake.com")
	recipients := models.EmailNotificationRecipients{
		RegularRecipientEmails:   []models.EmailAddress{recipient},
		ShouldNotifyITGovernance: false,
		ShouldNotifyITInvestment: false,
	}
	client, err := NewClient(s.config, &sender)
	s.NoError(err)
	err = client.SystemIntake.SendUpdateLCIDNotification(
		ctx,
		recipients,
		lifecycleID,
		&issuedAt,
		&expiresAtPrev,
		&expiresAtNew,
		lifecycleScopePrev,
		lifecycleScopeNew,
		lifecycleCostBaselinePrev,
		lifecycleCostBaselineNew,
		decisionNextStepsPrev,
		decisionNextStepsNew,
		amendmentDate,
		reason,
		additionalInfo,
	)
	s.NoError(err)
	expectedSubject := fmt.Sprintf("A Life Cycle ID (%s) has been updated", lifecycleID)
	s.Equal(expectedSubject, sender.subject)

	expectedEmail := fmt.Sprintf(`<h1 style="margin-bottom: 0.5rem;">EASi</h1>

<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>

<p>The Governance Team has updated a previously-issued a Life Cycle ID (LCID).</p>

<p><u>Changes to this LCID</u><br>

<strong>New Expiration Date:</strong> %s<br>
<strong>Previous Expiration Date:</strong> %s<br><br>


<strong>New Scope:</strong> %s<br>
<strong>Previous Scope:</strong> %s<br><br>


<strong>New Project Cost Baseline:</strong> %s<br>
<strong>Previous Project Cost Baseline:</strong> %s<br><br>


<strong>New Next steps:</strong> %s<br>
<strong>Previous Next steps:</strong> %s<br><br>
</p>

<p>Reason: %s</p>

If you have questions, please contact the Governance Team at <a href="mailto:%s">%s</a>.

<p><u>Summary of updated Life Cycle ID</u><br>
<strong>Lifecycle ID:</strong> %s<br>
<strong>Original date issued:</strong> %s<br>
<strong>Amendment date:</strong> %s<br>
<strong>Expiration date:</strong> %s<br>
<strong>Scope:</strong> %s<br>
<strong>Project Cost Baseline:</strong> %s<br>
<strong>Next Steps:</strong> %s</p>

<hr><p><strong>Additional information from the Governance Team:</strong></p><p>%s</p>
<hr>

<p>Depending on the request, the Governance Team may follow up with this project team at a later date.</p>

`,
		expiresAtNew.Format("01/02/2006"),
		expiresAtPrev.Format("01/02/2006"),
		*lifecycleScopeNew.StringPointer(),
		*lifecycleScopePrev.StringPointer(),
		lifecycleCostBaselineNew,
		lifecycleCostBaselinePrev,
		*decisionNextStepsNew.StringPointer(),
		*decisionNextStepsPrev.StringPointer(),
		*reason.StringPointer(),
		ITGovInboxAddress,
		ITGovInboxAddress,
		lifecycleID,
		issuedAt.Format("01/02/2006"),
		amendmentDate.Format("01/02/2006"),
		expiresAtNew.Format("01/02/2006"),
		*lifecycleScopeNew.StringPointer(),
		lifecycleCostBaselineNew,
		*decisionNextStepsNew.StringPointer(),
		*additionalInfo.StringPointer(),
	)
	s.Equal(expectedEmail, sender.body)
	s.Run("Recipient is correct", func() {
		allRecipients := []models.EmailAddress{
			recipient,
		}
		s.ElementsMatch(sender.toAddresses, allRecipients)
	})

	err = client.SystemIntake.SendUpdateLCIDNotification(
		ctx,
		recipients,
		lifecycleID,
		&issuedAt,
		&expiresAtPrev,
		&expiresAtNew,
		lifecycleScopePrev,
		lifecycleScopeNew,
		lifecycleCostBaselinePrev,
		lifecycleCostBaselineNew,
		decisionNextStepsPrev,
		decisionNextStepsNew,
		amendmentDate,
		reason,
		nil,
	)
	s.NoError(err)
	expectedEmail = fmt.Sprintf(`<h1 style="margin-bottom: 0.5rem;">EASi</h1>

<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>

<p>The Governance Team has updated a previously-issued a Life Cycle ID (LCID).</p>

<p><u>Changes to this LCID</u><br>

<strong>New Expiration Date:</strong> %s<br>
<strong>Previous Expiration Date:</strong> %s<br><br>


<strong>New Scope:</strong> %s<br>
<strong>Previous Scope:</strong> %s<br><br>


<strong>New Project Cost Baseline:</strong> %s<br>
<strong>Previous Project Cost Baseline:</strong> %s<br><br>


<strong>New Next steps:</strong> %s<br>
<strong>Previous Next steps:</strong> %s<br><br>
</p>

<p>Reason: %s</p>

If you have questions, please contact the Governance Team at <a href="mailto:%s">%s</a>.

<p><u>Summary of updated Life Cycle ID</u><br>
<strong>Lifecycle ID:</strong> %s<br>
<strong>Original date issued:</strong> %s<br>
<strong>Amendment date:</strong> %s<br>
<strong>Expiration date:</strong> %s<br>
<strong>Scope:</strong> %s<br>
<strong>Project Cost Baseline:</strong> %s<br>
<strong>Next Steps:</strong> %s</p>


<hr>

<p>Depending on the request, the Governance Team may follow up with this project team at a later date.</p>

`,
		expiresAtNew.Format("01/02/2006"),
		expiresAtPrev.Format("01/02/2006"),
		*lifecycleScopeNew.StringPointer(),
		*lifecycleScopePrev.StringPointer(),
		lifecycleCostBaselineNew,
		lifecycleCostBaselinePrev,
		*decisionNextStepsNew.StringPointer(),
		*decisionNextStepsPrev.StringPointer(),
		*reason.StringPointer(),
		ITGovInboxAddress,
		ITGovInboxAddress,
		lifecycleID,
		issuedAt.Format("01/02/2006"),
		amendmentDate.Format("01/02/2006"),
		expiresAtNew.Format("01/02/2006"),
		*lifecycleScopeNew.StringPointer(),
		lifecycleCostBaselineNew,
		*decisionNextStepsNew.StringPointer(),
	)

	s.Run("Should omit additional info if absent", func() {
		s.Equal(expectedEmail, sender.body)
	})

	err = client.SystemIntake.SendUpdateLCIDNotification(
		ctx,
		recipients,
		lifecycleID,
		&issuedAt,
		&expiresAtPrev,
		nil,
		lifecycleScopePrev,
		lifecycleScopeNew,
		lifecycleCostBaselinePrev,
		lifecycleCostBaselineNew,
		decisionNextStepsPrev,
		decisionNextStepsNew,
		amendmentDate,
		reason,
		nil,
	)
	s.NoError(err)
	expectedEmail = fmt.Sprintf(`<h1 style="margin-bottom: 0.5rem;">EASi</h1>

<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>

<p>The Governance Team has updated a previously-issued a Life Cycle ID (LCID).</p>

<p><u>Changes to this LCID</u><br>


<strong>New Scope:</strong> %s<br>
<strong>Previous Scope:</strong> %s<br><br>


<strong>New Project Cost Baseline:</strong> %s<br>
<strong>Previous Project Cost Baseline:</strong> %s<br><br>


<strong>New Next steps:</strong> %s<br>
<strong>Previous Next steps:</strong> %s<br><br>
</p>

<p>Reason: %s</p>

If you have questions, please contact the Governance Team at <a href="mailto:%s">%s</a>.

<p><u>Summary of updated Life Cycle ID</u><br>
<strong>Lifecycle ID:</strong> %s<br>
<strong>Original date issued:</strong> %s<br>
<strong>Amendment date:</strong> %s<br>
<strong>Expiration date:</strong> %s<br>
<strong>Scope:</strong> %s<br>
<strong>Project Cost Baseline:</strong> %s<br>
<strong>Next Steps:</strong> %s</p>


<hr>

<p>Depending on the request, the Governance Team may follow up with this project team at a later date.</p>

`,
		*lifecycleScopeNew.StringPointer(),
		*lifecycleScopePrev.StringPointer(),
		lifecycleCostBaselineNew,
		lifecycleCostBaselinePrev,
		*decisionNextStepsNew.StringPointer(),
		*decisionNextStepsPrev.StringPointer(),
		*reason.StringPointer(),
		ITGovInboxAddress,
		ITGovInboxAddress,
		lifecycleID,
		issuedAt.Format("01/02/2006"),
		amendmentDate.Format("01/02/2006"),
		expiresAtPrev.Format("01/02/2006"),
		*lifecycleScopeNew.StringPointer(),
		lifecycleCostBaselineNew,
		*decisionNextStepsNew.StringPointer(),
	)

	s.Run("Should omit expiration date if absent and show old date", func() {
		s.Equal(expectedEmail, sender.body)
	})

	err = client.SystemIntake.SendUpdateLCIDNotification(
		ctx,
		recipients,
		lifecycleID,
		&issuedAt,
		&expiresAtPrev,
		&expiresAtNew,
		lifecycleScopePrev,
		nil,
		lifecycleCostBaselinePrev,
		lifecycleCostBaselineNew,
		decisionNextStepsPrev,
		decisionNextStepsNew,
		amendmentDate,
		reason,
		nil,
	)
	s.NoError(err)
	expectedEmail = fmt.Sprintf(`<h1 style="margin-bottom: 0.5rem;">EASi</h1>

<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>

<p>The Governance Team has updated a previously-issued a Life Cycle ID (LCID).</p>

<p><u>Changes to this LCID</u><br>

<strong>New Expiration Date:</strong> %s<br>
<strong>Previous Expiration Date:</strong> %s<br><br>



<strong>New Project Cost Baseline:</strong> %s<br>
<strong>Previous Project Cost Baseline:</strong> %s<br><br>


<strong>New Next steps:</strong> %s<br>
<strong>Previous Next steps:</strong> %s<br><br>
</p>

<p>Reason: %s</p>

If you have questions, please contact the Governance Team at <a href="mailto:%s">%s</a>.

<p><u>Summary of updated Life Cycle ID</u><br>
<strong>Lifecycle ID:</strong> %s<br>
<strong>Original date issued:</strong> %s<br>
<strong>Amendment date:</strong> %s<br>
<strong>Expiration date:</strong> %s<br>
<strong>Scope:</strong> %s<br>
<strong>Project Cost Baseline:</strong> %s<br>
<strong>Next Steps:</strong> %s</p>


<hr>

<p>Depending on the request, the Governance Team may follow up with this project team at a later date.</p>

`,
		expiresAtNew.Format("01/02/2006"),
		expiresAtPrev.Format("01/02/2006"),
		lifecycleCostBaselineNew,
		lifecycleCostBaselinePrev,
		*decisionNextStepsNew.StringPointer(),
		*decisionNextStepsPrev.StringPointer(),
		*reason.StringPointer(),
		ITGovInboxAddress,
		ITGovInboxAddress,
		lifecycleID,
		issuedAt.Format("01/02/2006"),
		amendmentDate.Format("01/02/2006"),
		expiresAtNew.Format("01/02/2006"),
		*lifecycleScopePrev.StringPointer(),
		lifecycleCostBaselineNew,
		*decisionNextStepsNew.StringPointer(),
	)

	s.Run("Should omit scope if absent and show old scope", func() {
		s.Equal(expectedEmail, sender.body)
	})

	err = client.SystemIntake.SendUpdateLCIDNotification(
		ctx,
		recipients,
		lifecycleID,
		&issuedAt,
		&expiresAtPrev,
		&expiresAtNew,
		lifecycleScopePrev,
		lifecycleScopeNew,
		lifecycleCostBaselinePrev,
		"",
		decisionNextStepsPrev,
		decisionNextStepsNew,
		amendmentDate,
		reason,
		nil,
	)
	s.NoError(err)
	expectedEmail = fmt.Sprintf(`<h1 style="margin-bottom: 0.5rem;">EASi</h1>

<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>

<p>The Governance Team has updated a previously-issued a Life Cycle ID (LCID).</p>

<p><u>Changes to this LCID</u><br>

<strong>New Expiration Date:</strong> %s<br>
<strong>Previous Expiration Date:</strong> %s<br><br>


<strong>New Scope:</strong> %s<br>
<strong>Previous Scope:</strong> %s<br><br>



<strong>New Next steps:</strong> %s<br>
<strong>Previous Next steps:</strong> %s<br><br>
</p>

<p>Reason: %s</p>

If you have questions, please contact the Governance Team at <a href="mailto:%s">%s</a>.

<p><u>Summary of updated Life Cycle ID</u><br>
<strong>Lifecycle ID:</strong> %s<br>
<strong>Original date issued:</strong> %s<br>
<strong>Amendment date:</strong> %s<br>
<strong>Expiration date:</strong> %s<br>
<strong>Scope:</strong> %s<br>
<strong>Project Cost Baseline:</strong> %s<br>
<strong>Next Steps:</strong> %s</p>


<hr>

<p>Depending on the request, the Governance Team may follow up with this project team at a later date.</p>

`,
		expiresAtNew.Format("01/02/2006"),
		expiresAtPrev.Format("01/02/2006"),
		*lifecycleScopeNew.StringPointer(),
		*lifecycleScopePrev.StringPointer(),
		*decisionNextStepsNew.StringPointer(),
		*decisionNextStepsPrev.StringPointer(),
		*reason.StringPointer(),
		ITGovInboxAddress,
		ITGovInboxAddress,
		lifecycleID,
		issuedAt.Format("01/02/2006"),
		amendmentDate.Format("01/02/2006"),
		expiresAtNew.Format("01/02/2006"),
		*lifecycleScopeNew.StringPointer(),
		lifecycleCostBaselinePrev,
		*decisionNextStepsNew.StringPointer(),
	)

	s.Run("Should omit cost baseline if absent and show previous baseline", func() {
		s.Equal(expectedEmail, sender.body)
	})

	err = client.SystemIntake.SendUpdateLCIDNotification(
		ctx,
		recipients,
		lifecycleID,
		&issuedAt,
		&expiresAtPrev,
		&expiresAtNew,
		lifecycleScopePrev,
		lifecycleScopeNew,
		lifecycleCostBaselinePrev,
		lifecycleCostBaselineNew,
		decisionNextStepsPrev,
		nil,
		amendmentDate,
		reason,
		nil,
	)
	s.NoError(err)
	expectedEmail = fmt.Sprintf(`<h1 style="margin-bottom: 0.5rem;">EASi</h1>

<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>

<p>The Governance Team has updated a previously-issued a Life Cycle ID (LCID).</p>

<p><u>Changes to this LCID</u><br>

<strong>New Expiration Date:</strong> %s<br>
<strong>Previous Expiration Date:</strong> %s<br><br>


<strong>New Scope:</strong> %s<br>
<strong>Previous Scope:</strong> %s<br><br>


<strong>New Project Cost Baseline:</strong> %s<br>
<strong>Previous Project Cost Baseline:</strong> %s<br><br>

</p>

<p>Reason: %s</p>

If you have questions, please contact the Governance Team at <a href="mailto:%s">%s</a>.

<p><u>Summary of updated Life Cycle ID</u><br>
<strong>Lifecycle ID:</strong> %s<br>
<strong>Original date issued:</strong> %s<br>
<strong>Amendment date:</strong> %s<br>
<strong>Expiration date:</strong> %s<br>
<strong>Scope:</strong> %s<br>
<strong>Project Cost Baseline:</strong> %s<br>
<strong>Next Steps:</strong> %s</p>


<hr>

<p>Depending on the request, the Governance Team may follow up with this project team at a later date.</p>

`,
		expiresAtNew.Format("01/02/2006"),
		expiresAtPrev.Format("01/02/2006"),
		*lifecycleScopeNew.StringPointer(),
		*lifecycleScopePrev.StringPointer(),
		lifecycleCostBaselineNew,
		lifecycleCostBaselinePrev,
		*reason.StringPointer(),
		ITGovInboxAddress,
		ITGovInboxAddress,
		lifecycleID,
		issuedAt.Format("01/02/2006"),
		amendmentDate.Format("01/02/2006"),
		expiresAtNew.Format("01/02/2006"),
		*lifecycleScopeNew.StringPointer(),
		lifecycleCostBaselineNew,
		*decisionNextStepsPrev.StringPointer(),
	)

	s.Run("Should omit next steps if absent and show previous steps", func() {
		s.Equal(expectedEmail, sender.body)
	})

	err = client.SystemIntake.SendUpdateLCIDNotification(
		ctx,
		recipients,
		lifecycleID,
		nil,
		&expiresAtPrev,
		&expiresAtNew,
		lifecycleScopePrev,
		lifecycleScopeNew,
		lifecycleCostBaselinePrev,
		lifecycleCostBaselineNew,
		decisionNextStepsPrev,
		decisionNextStepsNew,
		amendmentDate,
		nil,
		nil,
	)
	s.NoError(err)
	expectedEmail = fmt.Sprintf(`<h1 style="margin-bottom: 0.5rem;">EASi</h1>

<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>

<p>The Governance Team has updated a previously-issued a Life Cycle ID (LCID).</p>

<p><u>Changes to this LCID</u><br>

<strong>New Expiration Date:</strong> %s<br>
<strong>Previous Expiration Date:</strong> %s<br><br>


<strong>New Scope:</strong> %s<br>
<strong>Previous Scope:</strong> %s<br><br>


<strong>New Project Cost Baseline:</strong> %s<br>
<strong>Previous Project Cost Baseline:</strong> %s<br><br>


<strong>New Next steps:</strong> %s<br>
<strong>Previous Next steps:</strong> %s<br><br>
</p>



If you have questions, please contact the Governance Team at <a href="mailto:%s">%s</a>.

<p><u>Summary of updated Life Cycle ID</u><br>
<strong>Lifecycle ID:</strong> %s<br>
<strong>Amendment date:</strong> %s<br>
<strong>Expiration date:</strong> %s<br>
<strong>Scope:</strong> %s<br>
<strong>Project Cost Baseline:</strong> %s<br>
<strong>Next Steps:</strong> %s</p>


<hr>

<p>Depending on the request, the Governance Team may follow up with this project team at a later date.</p>

`,
		expiresAtNew.Format("01/02/2006"),
		expiresAtPrev.Format("01/02/2006"),
		*lifecycleScopeNew.StringPointer(),
		*lifecycleScopePrev.StringPointer(),
		lifecycleCostBaselineNew,
		lifecycleCostBaselinePrev,
		*decisionNextStepsNew.StringPointer(),
		*decisionNextStepsPrev.StringPointer(),
		ITGovInboxAddress,
		ITGovInboxAddress,
		lifecycleID,
		amendmentDate.Format("01/02/2006"),
		expiresAtNew.Format("01/02/2006"),
		*lifecycleScopeNew.StringPointer(),
		lifecycleCostBaselineNew,
		*decisionNextStepsNew.StringPointer(),
	)

	s.Run("Should omit reason and issuedAt if absent", func() {
		s.Equal(expectedEmail, sender.body)
	})

}
