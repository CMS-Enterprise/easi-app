package email

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestCreateSystemIntakeGRBReviewerNotification() {
	ctx := context.Background()
	intakeID := uuid.MustParse("24dd7736-e4c2-4f67-8844-51187de49069")
	requestName := "Hotdog/Not Hotdog Program"
	requester := "Dr Fishopolis"
	adminLink := fmt.Sprintf(
		"%s://%s/it-governance/%s/grb-review",
		s.config.URLScheme,
		s.config.URLHost,
		intakeID.String(),
	)
	ITGovInboxAddress := s.config.GRTEmail.String()

	sender := mockSender{}
	recipient := models.NewEmailAddress("fake@fake.com")
	recipients := []models.EmailAddress{recipient}
	client, err := NewClient(s.config, &sender)
	s.NoError(err)

	err = client.SystemIntake.SendCreateGRBReviewerNotification(ctx, recipients, intakeID, requestName, requester)
	s.NoError(err)

	getExpectedEmail := func() string {
		return fmt.Sprintf(`
			<h1 class="header-title">EASi</h1>
			<p class="header-subtitle">Easy Access to System Information</p>

			<p>The IT Governance admin team has invited you to review documentation for an IT Governance request in EASi.</p>

			<br>
			<div class="no-margin">
			  <p>Project name: %s</p>
			  <p>Requester: %s</p>
			</div>

			<br>
			<p><strong><a href="%s">View this request in EASi</a></strong></p>

			<br>
			<p class="no-margin">If you have questions about the request or project, or if you are unable to participate in this review, please contact the IT Governance admin team at <a href="mailto:%s">%s</a>.</p>
			`,
			requestName,
			requester,
			adminLink,
			ITGovInboxAddress,
			ITGovInboxAddress,
		)
	}

	expectedEmail := getExpectedEmail()
	expectedSubject := "GRB Review: You are invited to review documentation in EASi"

	s.Run("Subject is correct", func() {
		s.Equal(expectedSubject, sender.subject)

	})

	s.Run("Recipient is correct", func() {
		allRecipients := []models.EmailAddress{
			recipient,
		}
		s.Empty(sender.toAddresses)
		s.Empty(sender.ccAddresses)
		s.ElementsMatch(sender.bccAddresses, allRecipients)
	})

	s.Run("all info is included", func() {
		s.EqualHTML(expectedEmail, sender.body)
	})
}
