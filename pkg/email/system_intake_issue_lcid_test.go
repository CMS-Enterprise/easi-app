package email

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestIntakeIssueLCIDNotification() {
	ctx := context.Background()
	intakeID := uuid.MustParse("24dd7736-e4c2-4f67-8844-51187de49069")
	requestName := "Hotdog/Not Hotdog Program"
	requester := "Dr Fishopolis"
	lifecycleID := "123456"
	lifecycleIssuedAt := time.Now()
	lifecycleScope := models.HTMLPointer("<em>things</em>")
	lifecycleCostBaseline := "100bux"
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
		trbRecommendation models.SystemIntakeTRBFollowUp,
		additionalInfo *models.HTML,
	) string {
		var lifecycleCostBaselineStr string
		var additionalInfoStr string
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

<p>The Governance Team has issued a Life Cycle ID (LCID) for %s</p>

<p><strong>Lifecycle ID:</strong> %s<br>
<strong>Date issued:</strong> %s<br>
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
			lifecycleIssuedAt.Format("01/02/2006"),
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
	err = client.SystemIntake.SendIssueLCIDNotification(
		ctx,
		recipients,
		intakeID,
		requestName,
		lifecycleID,
		lifecycleIssuedAt,
		&expiresAt,
		*lifecycleScope,
		&lifecycleCostBaseline,
		*decisionNextSteps,
		models.TRBFRNotRecommended,
		requester,
		additionalInfo,
	)
	s.NoError(err)
	expectedSubject := fmt.Sprintf("A Life Cycle ID (%s) has been issued for %s", lifecycleID, requestName)
	s.Equal(expectedSubject, sender.subject)

	expectedEmail := getExpectedEmail(&lifecycleCostBaseline, models.TRBFRNotRecommended, additionalInfo)
	s.Equal(expectedEmail, sender.body)
	s.Run("Recipient is correct", func() {
		allRecipients := []models.EmailAddress{
			recipient,
		}
		s.ElementsMatch(sender.toAddresses, allRecipients)
	})

	err = client.SystemIntake.SendIssueLCIDNotification(
		ctx,
		recipients,
		intakeID,
		requestName,
		lifecycleID,
		lifecycleIssuedAt,
		&expiresAt,
		*lifecycleScope,
		&lifecycleCostBaseline,
		*decisionNextSteps,
		models.TRBFRNotRecommended,
		requester,
		nil,
	)
	s.NoError(err)
	expectedEmail = getExpectedEmail(&lifecycleCostBaseline, models.TRBFRNotRecommended, nil)

	s.Run("Should omit additional info if absent", func() {
		s.Equal(expectedEmail, sender.body)
	})

	err = client.SystemIntake.SendIssueLCIDNotification(
		ctx,
		recipients,
		intakeID,
		requestName,
		lifecycleID,
		lifecycleIssuedAt,
		&expiresAt,
		*lifecycleScope,
		nil,
		*decisionNextSteps,
		models.TRBFRNotRecommended,
		requester,
		additionalInfo,
	)
	s.NoError(err)
	expectedEmail = getExpectedEmail(nil, models.TRBFRNotRecommended, additionalInfo)

	s.Run("Should omit lifecycle cost baseline if absent", func() {
		s.Equal(expectedEmail, sender.body)
	})

	for modelEnum, emailText := range trbRecommendationMap {
		err = client.SystemIntake.SendIssueLCIDNotification(
			ctx,
			recipients,
			intakeID,
			requestName,
			lifecycleID,
			lifecycleIssuedAt,
			&expiresAt,
			*lifecycleScope,
			&lifecycleCostBaseline,
			*decisionNextSteps,
			modelEnum,
			requester,
			additionalInfo,
		)
		s.NoError(err)
		expectedEmail := getExpectedEmail(&lifecycleCostBaseline, modelEnum, additionalInfo)
		s.Run(fmt.Sprintf("%s should become %s in email body", modelEnum, emailText), func() {
			s.Equal(expectedEmail, sender.body)
		})
	}
}
