package email

import (
	"fmt"

	"github.com/google/uuid"
	"golang.org/x/net/context"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendRequestEditsNotification() {

	ctx := context.Background()
	intakeID := uuid.MustParse("27883155-46ad-4c30-b3b0-30e8d093756e")
	formName := "Cool Form Name"
	requestName := "Test Request"
	requester := "`+ requester +`"
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
	// expectedEmail :=
	err = client.SystemIntake.SendRequestEditsNotification(ctx, recipients, intakeID, formName, requestName, requester, feedback, additionalInfo)
	s.NoError(err)
	expectedSubject := fmt.Sprintf("Updates requested for the %s for %s", formName, requestName)
	s.Equal(expectedSubject, sender.subject)

	expectedEmail := `<h1 style=\"margin-bottom: 0.5rem;\">EASi</h1>
	
	<span style=\"font-size:15px; line-height: 18px; color: #71767A\">Easy Access to System Information</span>
	
	<p>The GRT has requested updates to the ` + formName + ` for ` + requestName + ` before the request can proceed further in the Governance Review process.</p>
	
	<p>Updates needed: ` + feedback.ValueOrEmptyString() + `</p>

	
	
	<p>View this request in EASi:
	
<ul>
<li>The person who initially submitted this request, ` + requester + `, may <a
            href=\"governance-task-list/27883155-46ad-4c30-b3b0-30e8d093756e\">click here</a> to view the request task
        list.</li>
		<li>Governance Team members may <a
            href=\"governance-review-team/27883155-46ad-4c30-b3b0-30e8d093756e/intake-request\">click here</a> to view
        the request details.</li>
		<li>Others should contact ` + requester + ` or the Governance Team for more information
        about this request.</li>
		</ul>
</p>

If you have questions about your request, please contact the Governance Team at <a href=\"mailto:` + s.config.GRTEmail.String() + `\">` + s.config.GRTEmail.String() + `</a>.
	
	
	
	
<hr>

<p>Depending on the request, you may continue to receive email notifications about this request until it is closed.</p>`
	s.Equal(expectedEmail, sender.body)

}
