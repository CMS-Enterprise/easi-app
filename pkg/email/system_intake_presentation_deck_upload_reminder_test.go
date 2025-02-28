package email

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendPresentationDeckUploadReminder() {
	ctx := context.Background()
	intakeID := uuid.MustParse("27883155-46ad-4c30-b3b0-30e8d093756e")
	projectTitle := "Test Project"
	ITGovInboxAddress := s.config.GRTEmail.String()

	requestLink := fmt.Sprintf(
		"%s://%s/governance-task-list/%s",
		s.config.URLScheme,
		s.config.URLHost,
		intakeID.String(),
	)

	grbHelpLink := fmt.Sprintf(
		"%s://%s/help/it-governance/prepare-for-grb",
		s.config.URLScheme,
		s.config.URLHost,
	)

	sender := mockSender{}
	recipient := models.NewEmailAddress("fake@fake.com")
	recipients := models.EmailNotificationRecipients{
		RegularRecipientEmails:   []models.EmailAddress{recipient},
		ShouldNotifyITGovernance: false,
		ShouldNotifyITInvestment: false,
	}
	client, err := NewClient(s.config, &sender)
	s.NoError(err)

	getExpectedEmail := func() string {
		return fmt.Sprintf(`
			<h1 class="header-title">EASi</h1>
			<p class="header-subtitle">Easy Access to System Information</p>

			<p>Reminder: Upload your GRB presentation deck for %s. The Governance Review Board (GRB) may reference your presentation deck as they review your project materials. Use the link below to go to EASi and upload your presentation.</p>
			<p><a href="%s">View this request in EASi</a></p>
			<div class="no-margin">
			  <p>What to expect:</p>
			  <ul>
				<li>The GRB will review all materials related to your project, such as your presentation deck and Business Case.</li>
				<li>GRB members and Governance Admin Team members may ask questions of you and your project team to better understand the nuances of your project.</li>
			  </ul>
			</div>
			<p>If you need additional guidance about the GRB review process, please visit the help article in EASi using the link below.</p>
			<p><a href="%s">Prepare for the GRB review</a></p>
			<hr>
			<p>If you have questions about your request, please contact the Governance Team at <a href="mailto:%s">%s</a>.</p>
			<p>You will continue to receive email notifications about this request until it is closed.</p>`,
			projectTitle,
			requestLink,
			grbHelpLink,
			ITGovInboxAddress,
			ITGovInboxAddress,
		)
	}

	err = client.SystemIntake.SendPresentationDeckUploadReminder(
		ctx,
		recipients,
		intakeID,
		projectTitle,
	)
	s.NoError(err)

	s.Run("Subject is correct", func() {
		expectedSubject := fmt.Sprintf("GRB reminder: upload presentation for %s", projectTitle)
		s.Equal(expectedSubject, sender.subject)
	})

	s.Run("Included info is correct", func() {
		expectedEmail := getExpectedEmail()
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("Recipient is correct", func() {
		allRecipients := []models.EmailAddress{
			recipient,
		}
		s.ElementsMatch(sender.toAddresses, allRecipients)
	})
}
