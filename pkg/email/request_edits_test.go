package email

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendRequestEditsNotification() {

	ctx := context.Background()
	intakeID := uuid.MustParse("27883155-46ad-4c30-b3b0-30e8d093756e")
	formName := "Cool Form Name"
	requestName := "Test Request"
	requester := "Sir Requester"
	additionalInfo := models.HTMLPointer("") // empty info is left out
	// additionalInfo := models.HTMLPointer("additional info")

	feedback := models.HTML("feedback")

	sender := mockSender{}
	recipient := models.NewEmailAddress("fake@fake.com")
	recipients := models.EmailNotificationRecipients{
		RegularRecipientEmails:   []models.EmailAddress{recipient},
		ShouldNotifyITGovernance: false,
		ShouldNotifyITInvestment: false,
	}
	client, err := NewClient(s.config, &sender)
	s.NoError(err)
	err = client.SystemIntake.SendRequestEditsNotification(ctx, recipients, intakeID, formName, requestName, requester, feedback, additionalInfo)
	s.NoError(err)
	expectedSubject := fmt.Sprintf("Updates requested for the %s for %s", formName, requestName)
	s.Equal(expectedSubject, sender.subject)

	expectedEmail := `<h1 style="margin-bottom: 0.5rem;">EASi</h1>` + "\n\n" +
		`<span style="font-size:15px; line-height: 18px; color: #71767A">Easy Access to System Information</span>` + "\n\n" +
		`<p>The GRT has requested updates to the ` + formName + ` for ` + requestName + ` before the request can proceed further in the Governance Review process.</p>` + "\n\n" +
		`<p>Updates needed: ` + feedback.ValueOrEmptyString() + `</p>` + "\n\n\n" +
		`<p>View this request in EASi:` + "\n" +
		`<ul>` + "\n" +
		`<li>The person who initially submitted this request, ` + requester + `, may <a href="http://localhost:3000/governance-task-list/` + intakeID.String() + `">click here</a> to view the request task list.</li>` + "\n" +
		`<li>Governance Team members may <a href="http://localhost:3000/governance-review-team/` + intakeID.String() + `/intake-request">click here</a> to view the request details.</li>` + "\n" +
		`<li>Others should contact ` + requester + ` or the Governance Team for more information about this request.</li>` + "\n" +
		`</ul>` +
		`</p>` + "\n\n" +
		`If you have questions about your request, please contact the Governance Team at <a href="mailto:` + s.config.GRTEmail.String() + `">` + s.config.GRTEmail.String() + `</a>.` + "\n\n\n\n" +
		`<hr>` + "\n\n" +
		`<p>Depending on the request, you may continue to receive email notifications about this request until it is closed.</p>`
	s.Equal(expectedEmail, sender.body)
	s.Run("Recipient is correct", func() {
		allRecipients := []models.EmailAddress{
			recipient,
		}
		s.ElementsMatch(sender.toAddresses, allRecipients)
	})

}
