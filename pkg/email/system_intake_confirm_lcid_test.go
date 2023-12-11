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

	expectedEmail := fmt.Sprintf(`<h1 style="margin-bottom: 0.5rem;">EASi</h1>

<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>

<p>The Governance Team has confirmed a Life Cycle ID (LCID) for %s</p>

<p><strong>Lifecycle ID:</strong> %s<br>
<strong>Original date issued:</strong> %s<br>
<strong>Expiration date:</strong> %s<br>
<strong>Scope:</strong> %s<br>
<strong>Project Cost Baseline:</strong> %s<br>
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

<hr><p><strong>Additional information from the Governance Team:</strong></p><p>%s</p>
<hr>

<p>Depending on the request, the Governance Team may follow up with this project team at a later date.</p>
`,
		requestName,
		lifecycleID,
		issuedAt.Format("01/02/2006"),
		expiresAt.Format("01/02/2006"),
		*lifecycleScope.StringPointer(),
		lifecycleCostBaseline,
		*decisionNextSteps.StringPointer(),
		"does not think a TRB consult is necessary",
		requester,
		requestLink,
		adminLink,
		requester,
		ITGovInboxAddress,
		ITGovInboxAddress,
		*additionalInfo.StringPointer(),
	)
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
	expectedEmail = fmt.Sprintf(`<h1 style="margin-bottom: 0.5rem;">EASi</h1>

<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>

<p>The Governance Team has confirmed a Life Cycle ID (LCID) for %s</p>

<p><strong>Lifecycle ID:</strong> %s<br>
<strong>Expiration date:</strong> %s<br>
<strong>Scope:</strong> %s<br>
<strong>Project Cost Baseline:</strong> %s<br>
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


<hr>

<p>Depending on the request, the Governance Team may follow up with this project team at a later date.</p>
`,
		requestName,
		lifecycleID,
		expiresAt.Format("01/02/2006"),
		*lifecycleScope.StringPointer(),
		lifecycleCostBaseline,
		*decisionNextSteps.StringPointer(),
		"does not think a TRB consult is necessary",
		requester,
		requestLink,
		adminLink,
		requester,
		ITGovInboxAddress,
		ITGovInboxAddress,
	)

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
		expectedEmail := fmt.Sprintf(`<h1 style="margin-bottom: 0.5rem;">EASi</h1>

<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>

<p>The Governance Team has confirmed a Life Cycle ID (LCID) for %s</p>

<p><strong>Lifecycle ID:</strong> %s<br>
<strong>Original date issued:</strong> %s<br>
<strong>Expiration date:</strong> %s<br>
<strong>Scope:</strong> %s<br>
<strong>Project Cost Baseline:</strong> %s<br>
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

<hr><p><strong>Additional information from the Governance Team:</strong></p><p>%s</p>
<hr>

<p>Depending on the request, the Governance Team may follow up with this project team at a later date.</p>
`,
			requestName,
			lifecycleID,
			issuedAt.Format("01/02/2006"),
			expiresAt.Format("01/02/2006"),
			*lifecycleScope.StringPointer(),
			lifecycleCostBaseline,
			*decisionNextSteps.StringPointer(),
			emailText,
			requester,
			requestLink,
			adminLink,
			requester,
			ITGovInboxAddress,
			ITGovInboxAddress,
			*additionalInfo.StringPointer(),
		)
		s.Equal(expectedEmail, sender.body)
		s.Run(fmt.Sprintf("%s should become %s in email body", modelEnum, emailText), func() {
			allRecipients := []models.EmailAddress{
				recipient,
			}
			s.ElementsMatch(sender.toAddresses, allRecipients)
		})

	}
}
