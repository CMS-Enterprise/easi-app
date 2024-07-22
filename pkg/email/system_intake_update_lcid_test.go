package email

import (
	"context"
	"fmt"
	"time"

	"github.com/cms-enterprise/easi-app/pkg/models"
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

	getExpectedEmail := func(
		issuedAt *time.Time,
		expiresAtNew *time.Time,
		expiresAtOld *time.Time,
		scopeNew *models.HTML,
		scopeOld *models.HTML,
		costNew *string,
		costOld *string,
		nextStepsNew *models.HTML,
		nextStepsOld *models.HTML,
		reason *models.HTML,
		additionalInfo *models.HTML,
	) string {
		var additionalInfoStr string
		if additionalInfo != nil {
			additionalInfoStr = fmt.Sprintf(
				`<br>
				<br>
				<hr>
				<br>
				<p class="no-margin-top">
					<strong>Additional information from the Governance Team:</strong>
				</p>
				<div class="no-margin">%s</div>`,
				*additionalInfo.StringPointer(),
			)
		}
		var issuedAtStr string
		if issuedAt != nil {
			issuedAtStr = fmt.Sprintf(
				`<p><strong>Original date issued:</strong> %s</p>`,
				issuedAt.Format("01/02/2006"),
			)
		}
		var expiresNewAndOldStr string
		var expiresAtStr string
		if expiresAtNew != nil {
			var expiresOldFormatted string
			if expiresAtOld != nil {
				// shows a blank string for prev date
				expiresOldFormatted = expiresAtOld.Format("01/02/2006")
			}
			expiresNewAndOldStr = fmt.Sprintf(
				`<p><strong>New Expiration Date:</strong> %s</p>
				<p><strong>Previous Expiration Date:</strong> %s</p>
				<br>`,
				expiresAtNew.Format("01/02/2006"),
				expiresOldFormatted,
			)
			expiresAtStr = fmt.Sprintf(
				`<p><strong>Expiration date:</strong> %s</p>`,
				expiresAtNew.Format("01/02/2006"),
			)
		} else if expiresAtOld != nil {
			expiresAtStr = fmt.Sprintf(
				`<p><strong>Expiration date:</strong> %s</p>`,
				expiresAtOld.Format("01/02/2006"),
			)
		}
		var scopeNewAndOldStr string
		var scopeStr string
		if scopeNew != nil {
			var scopeOldStr string
			if scopeOld != nil {
				// shows a blank string for prev scope
				scopeOldStr = *scopeOld.StringPointer()
			}
			scopeNewAndOldStr = fmt.Sprintf(
				`<p class="inline-this-and-next">
					<strong>New Scope:</strong>
				</p>
				%s
				<p class="inline-this-and-next">
					<strong>Previous Scope:</strong>
				</p>
				%s
				<br>`,
				*scopeNew.StringPointer(),
				scopeOldStr,
			)
			scopeStr = fmt.Sprintf(
				`<p class="inline-this-and-next"><strong>Scope:</strong></p>%s`,
				*scopeNew.StringPointer(),
			)
		} else if scopeOld != nil {
			scopeStr = fmt.Sprintf(
				`<p class="inline-this-and-next"><strong>Scope:</strong></p>%s`,
				*scopeOld.StringPointer(),
			)
		}
		var costNewAndOldStr string
		var costStr string
		if costNew != nil {
			var costOldStr string
			if costOld != nil {
				costOldStr = *costOld
			}
			costNewAndOldStr = fmt.Sprintf(
				`<p><strong>New Project Cost Baseline:</strong> %s</p>
				<p><strong>Previous Project Cost Baseline:</strong> %s</p>
				<br>`,
				*costNew,
				costOldStr,
			)
			costStr = fmt.Sprintf(
				`<p><strong>Project Cost Baseline:</strong> %s</p>`,
				*costNew,
			)
		} else if costOld != nil {
			costStr = fmt.Sprintf(
				`<p><strong>Project Cost Baseline:</strong> %s</p>`,
				*costOld,
			)
		}
		var nextStepsNewAndOldStr string
		var nextStepsStr string
		if nextStepsNew != nil {
			var nextStepsOldStr string
			if nextStepsOld != nil {
				nextStepsOldStr = *nextStepsOld.StringPointer()
			}
			nextStepsNewAndOldStr = fmt.Sprintf(
				`<p class="inline-this-and-next">
					<strong>New Next steps:</strong>
				</p>
				%s
				<p class="inline-this-and-next">
					<strong>Previous Next steps:</strong>
				</p>
				%s
				<br>`,
				*nextStepsNew.StringPointer(),
				nextStepsOldStr,
			)
			nextStepsStr = fmt.Sprintf(
				`<p class="inline-this-and-next"><strong>Next Steps:</strong></p>%s`,
				*nextStepsNew.StringPointer(),
			)
		} else if nextStepsOld != nil {
			nextStepsStr = fmt.Sprintf(
				`<p class="inline-this-and-next"><strong>Next Steps:</strong></p>%s`,
				*nextStepsOld.StringPointer(),
			)
		}
		var reasonStr string
		if reason != nil {
			reasonStr = fmt.Sprintf(
				`<p class="inline-this-and-next"><strong>Reason:</strong></p>%s`,
				*reason.StringPointer(),
			)
		}

		return fmt.Sprintf(`
			<h1 class="header-title">EASi</h1>
			<p class="header-subtitle">Easy Access to System Information</p>

			<p>The Governance Team has updated a previously-issued a Life Cycle ID (LCID).</p>

			<br>
			<div class="no-margin">
				<p><u>Changes to this LCID</u></p>
				%s
				%s
				%s
				%s
				%s
			</div>

			<br>
			<p>If you have questions, please contact the Governance Team at <a href="mailto:%s">%s</a>.</p>

			<br>
			<div class="no-margin">
				<p><u>Summary of updated Life Cycle ID</u></p>
				<p><strong>Life Cycle ID:</strong> %s</p>
				%s
				<p><strong>Amendment date:</strong> %s</p>
				%s
				%s
				%s
				%s
			</div>

			%s
			<br>
			<br>
			<hr>

			<p>Depending on the request, the Governance Team may follow up with this project team at a later date.</p>`,
			expiresNewAndOldStr,
			scopeNewAndOldStr,
			costNewAndOldStr,
			nextStepsNewAndOldStr,
			reasonStr,
			ITGovInboxAddress,
			ITGovInboxAddress,
			lifecycleID,
			issuedAtStr,
			amendmentDate.Format("01/02/2006"),
			expiresAtStr,
			scopeStr,
			costStr,
			nextStepsStr,
			additionalInfoStr,
		)

	}

	expectedEmail := getExpectedEmail(
		&issuedAt,
		&expiresAtNew,
		&expiresAtPrev,
		lifecycleScopeNew,
		lifecycleScopePrev,
		&lifecycleCostBaselineNew,
		&lifecycleCostBaselinePrev,
		decisionNextStepsNew,
		decisionNextStepsPrev,
		reason,
		additionalInfo,
	)

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
	s.Run("Recipient is correct", func() {
		allRecipients := []models.EmailAddress{
			recipient,
		}
		s.ElementsMatch(sender.toAddresses, allRecipients)
	})
	s.Run("included info is correct", func() {
		expectedSubject := fmt.Sprintf("A Life Cycle ID (%s) has been updated", lifecycleID)
		s.Equal(expectedSubject, sender.subject)
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("Should omit additional info if absent", func() {
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

		expectedEmail = getExpectedEmail(
			&issuedAt,
			&expiresAtNew,
			&expiresAtPrev,
			lifecycleScopeNew,
			lifecycleScopePrev,
			&lifecycleCostBaselineNew,
			&lifecycleCostBaselinePrev,
			decisionNextStepsNew,
			decisionNextStepsPrev,
			reason,
			nil,
		)
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("Should omit expiration date if absent and show old date", func() {
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

		expectedEmail = getExpectedEmail(
			&issuedAt,
			nil,
			&expiresAtPrev,
			lifecycleScopeNew,
			lifecycleScopePrev,
			&lifecycleCostBaselineNew,
			&lifecycleCostBaselinePrev,
			decisionNextStepsNew,
			decisionNextStepsPrev,
			reason,
			nil,
		)
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("Should omit scope if absent and show old scope", func() {
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
		expectedEmail = getExpectedEmail(
			&issuedAt,
			&expiresAtNew,
			&expiresAtPrev,
			nil,
			lifecycleScopePrev,
			&lifecycleCostBaselineNew,
			&lifecycleCostBaselinePrev,
			decisionNextStepsNew,
			decisionNextStepsPrev,
			reason,
			nil,
		)
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("Should omit cost baseline if absent and show previous baseline", func() {
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
		expectedEmail = getExpectedEmail(
			&issuedAt,
			&expiresAtNew,
			&expiresAtPrev,
			lifecycleScopeNew,
			lifecycleScopePrev,
			nil,
			&lifecycleCostBaselinePrev,
			decisionNextStepsNew,
			decisionNextStepsPrev,
			reason,
			nil,
		)
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("Should omit next steps if absent and show previous steps", func() {
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
		expectedEmail = getExpectedEmail(
			&issuedAt,
			&expiresAtNew,
			&expiresAtPrev,
			lifecycleScopeNew,
			lifecycleScopePrev,
			&lifecycleCostBaselineNew,
			&lifecycleCostBaselinePrev,
			nil,
			decisionNextStepsPrev,
			reason,
			nil,
		)

		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("Should omit reason and issuedAt if absent", func() {
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
		expectedEmail = getExpectedEmail(
			nil,
			&expiresAtNew,
			&expiresAtPrev,
			lifecycleScopeNew,
			lifecycleScopePrev,
			&lifecycleCostBaselineNew,
			&lifecycleCostBaselinePrev,
			decisionNextStepsNew,
			decisionNextStepsPrev,
			nil,
			nil,
		)
		s.EqualHTML(expectedEmail, sender.body)
	})
	s.Run("Should show blank previous expiration date, scope, steps, cost", func() {
		err = client.SystemIntake.SendUpdateLCIDNotification(
			ctx,
			recipients,
			lifecycleID,
			&issuedAt,
			nil,
			&expiresAtNew,
			nil,
			lifecycleScopeNew,
			"",
			lifecycleCostBaselineNew,
			nil,
			decisionNextStepsNew,
			amendmentDate,
			reason,
			additionalInfo,
		)
		s.NoError(err)
		expectedEmail = getExpectedEmail(
			&issuedAt,
			&expiresAtNew,
			nil,
			lifecycleScopeNew,
			nil,
			&lifecycleCostBaselineNew,
			nil,
			decisionNextStepsNew,
			nil,
			reason,
			additionalInfo,
		)
		s.EqualHTML(expectedEmail, sender.body)
	})
}
