package email

import (
	"fmt"

	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendNotApprovedNotification() {

	ctx := context.Background()
	intakeID := uuid.MustParse("27883155-46ad-4c30-b3b0-30e8d093756e")
	requestName := "Test Request"
	requester := "Sir Requester"
	additionalInfo := models.HTMLPointer("additional info") // empty info is left out
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

	reason := models.HTML("inumerable reasons, literally so many reasons")
	nextSteps := models.HTML("first we waltz, then we cha-cha")

	sender := mockSender{}
	recipient := models.NewEmailAddress("fake@fake.com")
	recipients := models.EmailNotificationRecipients{
		RegularRecipientEmails:   []models.EmailAddress{recipient},
		ShouldNotifyITGovernance: false,
		ShouldNotifyITInvestment: false,
	}
	client, err := NewClient(s.config, &sender)
	s.NoError(err)
	err = client.SystemIntake.SendNotApprovedNotification(ctx, recipients, intakeID, requestName, requester, reason, nextSteps, additionalInfo)
	s.NoError(err)
	expectedSubject := fmt.Sprintf("%s was not approved by the GRB", requestName)
	s.Equal(expectedSubject, sender.subject)

	expectedEmail := fmt.Sprintf(
		`<h1 style="margin-bottom: 0.5rem;">EASi</h1>

<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>

<p>The Governance Review Board (GRB) did not approve %s.</p>

<p><strong>Reason: </strong>%s</p>

<p><strong>Next Steps: </strong>%s</p>

<p>View this closed request in EASi:
<ul>
<li>The person who initially submitted this request, %s, may <a href="%s">click here</a> to view the request task list.</li>
<li>Governance Team members may <a href="%s">click here</a> to view the request details.</li>
<li>Others should contact %s or the Governance Team for more information about this request.</li>
</ul></p>

If you have questions about your request, please contact the Governance Team at <a href="mailto:%s">%s</a>.

<hr><p><strong>Additional information from the Governance Team:</strong> %s </p>
<hr>

<p>Depending on the request, the Governance Team may follow up with this project at a later date.</p>
`,
		requestName,
		reason,
		nextSteps,
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
	err = client.SystemIntake.SendNotApprovedNotification(ctx, recipients, intakeID, requestName, requester, reason, nextSteps, nil)
	s.NoError(err)
	expectedEmail = fmt.Sprintf(
		`<h1 style="margin-bottom: 0.5rem;">EASi</h1>

<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>

<p>The Governance Review Board (GRB) did not approve %s.</p>

<p><strong>Reason: </strong>%s</p>

<p><strong>Next Steps: </strong>%s</p>

<p>View this closed request in EASi:
<ul>
<li>The person who initially submitted this request, %s, may <a href="%s">click here</a> to view the request task list.</li>
<li>Governance Team members may <a href="%s">click here</a> to view the request details.</li>
<li>Others should contact %s or the Governance Team for more information about this request.</li>
</ul></p>

If you have questions about your request, please contact the Governance Team at <a href="mailto:%s">%s</a>.


<hr>

<p>Depending on the request, the Governance Team may follow up with this project at a later date.</p>
`,
		requestName,
		*reason.StringPointer(),
		*nextSteps.StringPointer(),
		requester,
		requestLink,
		adminLink,
		requester,
		ITGovInboxAddress,
		ITGovInboxAddress,
	)

	s.Run("Should omit additional info if absent", func() {
		s.Equal(expectedEmail, sender.body)
	})
}
