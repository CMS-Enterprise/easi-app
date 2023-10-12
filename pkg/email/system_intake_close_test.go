package email

import (
	"context"
	"fmt"
	"time"

	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestCloseIntakeRequestNotification() {
	ctx := context.Background()
	intakeID := uuid.MustParse("24dd7736-e4c2-4f67-8844-51187de49069")
	requestName := "Hotdog/Not Hotdog Program"
	requester := "Dr Fishopolis"
	submittedAt := time.Now()
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

	reason := models.HTMLPointer("reasons")

	sender := mockSender{}
	recipient := models.NewEmailAddress("fake@fake.com")
	recipients := models.EmailNotificationRecipients{
		RegularRecipientEmails:   []models.EmailAddress{recipient},
		ShouldNotifyITGovernance: false,
		ShouldNotifyITInvestment: false,
	}
	client, err := NewClient(s.config, &sender)
	s.NoError(err)
	err = client.SystemIntake.SendCloseRequestNotification(ctx, recipients, intakeID, requestName, requester, reason, &submittedAt, additionalInfo)
	s.NoError(err)
	expectedSubject := fmt.Sprintf("The Governance Team has closed %s in EASi", requestName)
	s.Equal(expectedSubject, sender.subject)

	expectedEmail := fmt.Sprintf(
		`<h1 style="margin-bottom: 0.5rem;">EASi</h1>

<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>

<p>The IT Governance Request titled %s, submitted on %s, has been closed in EASi.</p>

<p>Reason: %s</p>

<p>View this closed request in EASi:
<ul>
<li>The person who initially submitted this request, %s, may <a href="%s">click here</a> to view the request task list.</li>
<li>Governance Team members may <a href="%s">click here</a> to view the request details.</li>
<li>Others should contact %s or the Governance Team for more information about this request.</li>
</ul></p>

If you have questions about your request, please contact the Governance Team at <a href="mailto:%s">%s</a>.

<hr><p><strong>Additional information from the Governance Team:</strong> %s </p>
<hr>

<p>Depending on the request, the Governance Team may follow up with this project team at a later date.</p>
`,
		requestName,
		submittedAt.Format("01/02/2006"),
		*reason.StringPointer(),
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
	err = client.SystemIntake.SendCloseRequestNotification(ctx, recipients, intakeID, requestName, requester, nil, &submittedAt, additionalInfo)
	s.NoError(err)
	expectedEmail = fmt.Sprintf(
		`<h1 style="margin-bottom: 0.5rem;">EASi</h1>

<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>

<p>The IT Governance Request titled %s, submitted on %s, has been closed in EASi.</p>



<p>View this closed request in EASi:
<ul>
<li>The person who initially submitted this request, %s, may <a href="%s">click here</a> to view the request task list.</li>
<li>Governance Team members may <a href="%s">click here</a> to view the request details.</li>
<li>Others should contact %s or the Governance Team for more information about this request.</li>
</ul></p>

If you have questions about your request, please contact the Governance Team at <a href="mailto:%s">%s</a>.

<hr><p><strong>Additional information from the Governance Team:</strong> %s </p>
<hr>

<p>Depending on the request, the Governance Team may follow up with this project team at a later date.</p>
`,
		requestName,
		submittedAt.Format("01/02/2006"),
		requester,
		requestLink,
		adminLink,
		requester,
		ITGovInboxAddress,
		ITGovInboxAddress,
		*additionalInfo.StringPointer(),
	)

	s.Run("Should omit reason if absent", func() {
		s.Equal(expectedEmail, sender.body)
	})
	err = client.SystemIntake.SendCloseRequestNotification(ctx, recipients, intakeID, requestName, requester, reason, &submittedAt, nil)
	s.NoError(err)
	expectedEmail = fmt.Sprintf(
		`<h1 style="margin-bottom: 0.5rem;">EASi</h1>

<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>

<p>The IT Governance Request titled %s, submitted on %s, has been closed in EASi.</p>

<p>Reason: %s</p>

<p>View this closed request in EASi:
<ul>
<li>The person who initially submitted this request, %s, may <a href="%s">click here</a> to view the request task list.</li>
<li>Governance Team members may <a href="%s">click here</a> to view the request details.</li>
<li>Others should contact %s or the Governance Team for more information about this request.</li>
</ul></p>

If you have questions about your request, please contact the Governance Team at <a href="mailto:%s">%s</a>.


<hr>

<p>Depending on the request, the Governance Team may follow up with this project team at a later date.</p>
`,
		requestName,
		submittedAt.Format("01/02/2006"),
		*reason.StringPointer(),
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
