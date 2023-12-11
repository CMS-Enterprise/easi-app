package email

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestIntakeConfirmLCIDNotification() {
	ctx := context.Background()
	intakeID := uuid.MustParse("24dd7736-e4c2-4f67-8844-51187de49069")
	requestName := "Hotdog/Not Hotdog Program"
	requester := "Dr Fishopolis"
	lifecycleID := "123456"
	lifecycleScope := models.HTMLPointer("<em>things</em>")
	lifecycleCostBaseline := "100bux"
	issuedAt := time.Now()
	expiresAt := time.Now().AddDate(1, 0, 0)
	requestLink := fmt.Sprintf(
		"%s://%s/governance-task-list/%s",
		s.config.URLScheme,
		s.config.URLHost,
		intakeID.String(),
	)
	adminLink := fmt.Sprintf(
		"%s://%s/governance-review-team/%s/intake-request",
		s.config.URLScheme,
		s.config.URLHost,
		intakeID.String(),
	)
	ITGovInboxAddress := s.config.GRTEmail.String()
	additionalInfo := models.HTMLPointer("An apple a day keeps the doctor away.")
	decisionNextSteps := models.HTMLPointer("<p>Decision: Make lunch</p><p>Steps:</p><ol><li>Decide what to eat</li><li>Eat</li></ol>")
	trbRecommendationMap := map[models.SystemIntakeTRBFollowUp]string{
		models.TRBFRStronglyRecommended:       "strongly recommends a TRB consult session",
		models.TRBFRRecommendedButNotCritical: "recommends a TRB consult session",
		models.TRBFRNotRecommended:            "does not think a TRB consult is necessary",
	}

	sender := mockSender{}
	recipient := models.NewEmailAddress("fake@fake.com")
	recipients := models.EmailNotificationRecipients{
		RegularRecipientEmails:   []models.EmailAddress{recipient},
		ShouldNotifyITGovernance: false,
		ShouldNotifyITInvestment: false,
	}
	getExpectedEmail := func(
		lifecycleCostBaseline *string,
		issuedAt *time.Time,
		trbRecommendation models.SystemIntakeTRBFollowUp,
		additionalInfo *models.HTML,
	) string {
		var lifecycleCostBaselineStr string
		var additionalInfoStr string
		var issuedAtStr string
		if issuedAt != nil {
			issuedAtStr = fmt.Sprintf("\n<strong>Original date issued:</strong> %s<br>", issuedAt.Format("01/02/2006"))
		}
		if lifecycleCostBaseline != nil {
			lifecycleCostBaselineStr = fmt.Sprintf("\n<strong>Project Cost Baseline:</strong> %s<br>", *lifecycleCostBaseline)
		}
		if additionalInfo != nil {
			additionalInfoStr = fmt.Sprintf(
				"<hr><p><strong>Additional information from the Governance Team:</strong></p><p>%s</p>",
				additionalInfo.ToTemplate(),
			)
		}
		return fmt.Sprintf(`<h1 style="margin-bottom: 0.5rem;">EASi</h1>

<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>

<p>The Governance Team has confirmed a Life Cycle ID (LCID) for %s</p>

<p><strong>Lifecycle ID:</strong> %s<br>%s
<strong>Expiration date:</strong> %s<br>
<strong>Scope:</strong> %s<br>%s
<strong>Next steps:</strong> %s</p>

<p>Technical Review Board (TRB) Consultation:<br>
As a part of your next steps, the Governance Team %s.</p>

<p>View this closed request in EASi:
<ul>
<li>The person who initially submitted this request, %s, may <a href="%s">click here</a> to view the request task list.</li>
<li>Governance Team members may <a href="%s">click here</a> to view the request details.</li>
<li>Others should contact %s or the Governance Team for more information about this request.</li>
</ul></p>

If you have questions, please contact the Governance Team at <a href="mailto:%s">%s</a>.

%s
<hr>

<p>Depending on the request, the Governance Team may follow up with this project team at a later date.</p>
`,
			requestName,
			lifecycleID,
			issuedAtStr,
			expiresAt.Format("01/02/2006"),
			*lifecycleScope.StringPointer(),
			lifecycleCostBaselineStr,
			*decisionNextSteps.StringPointer(),
			trbRecommendationMap[trbRecommendation],
			requester,
			requestLink,
			adminLink,
			requester,
			ITGovInboxAddress,
			ITGovInboxAddress,
			additionalInfoStr,
		)

	}
	client, err := NewClient(s.config, &sender)
	s.NoError(err)
	err = client.SystemIntake.SendConfirmLCIDNotification(
		ctx,
		recipients,
		intakeID,
		requestName,
		lifecycleID,
		&expiresAt,
		&issuedAt,
		*lifecycleScope,
		&lifecycleCostBaseline,
		*decisionNextSteps,
		models.TRBFRNotRecommended,
		requester,
		additionalInfo,
	)
	s.NoError(err)
	expectedSubject := fmt.Sprintf("A Life Cycle ID (%s) has been confirmed for %s", lifecycleID, requestName)
	s.Equal(expectedSubject, sender.subject)

	expectedEmail := getExpectedEmail(&lifecycleCostBaseline, &issuedAt, models.TRBFRNotRecommended, additionalInfo)

	s.Equal(expectedEmail, sender.body)
	s.Run("Recipient is correct", func() {
		allRecipients := []models.EmailAddress{
			recipient,
		}
		s.ElementsMatch(sender.toAddresses, allRecipients)
	})

	err = client.SystemIntake.SendConfirmLCIDNotification(
		ctx,
		recipients,
		intakeID,
		requestName,
		lifecycleID,
		&expiresAt,
		nil,
		*lifecycleScope,
		&lifecycleCostBaseline,
		*decisionNextSteps,
		models.TRBFRNotRecommended,
		requester,
		nil,
	)
	s.NoError(err)
	expectedEmail = getExpectedEmail(&lifecycleCostBaseline, nil, models.TRBFRNotRecommended, nil)

	s.Run("Should omit additional info and issuedAt if absent", func() {
		s.Equal(expectedEmail, sender.body)
	})

	for modelEnum, emailText := range trbRecommendationMap {
		err = client.SystemIntake.SendConfirmLCIDNotification(
			ctx,
			recipients,
			intakeID,
			requestName,
			lifecycleID,
			&expiresAt,
			&issuedAt,
			*lifecycleScope,
			&lifecycleCostBaseline,
			*decisionNextSteps,
			modelEnum,
			requester,
			additionalInfo,
		)
		s.NoError(err)
		expectedEmail := getExpectedEmail(&lifecycleCostBaseline, &issuedAt, modelEnum, additionalInfo)
		s.Run(fmt.Sprintf("%s should become %s in email body", modelEnum, emailText), func() {
			s.Equal(expectedEmail, sender.body)
		})

	}
}
