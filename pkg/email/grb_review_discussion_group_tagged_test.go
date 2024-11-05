package email

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestCreateGRBReviewDiscussionGroupTaggedNotification() {
	ctx := context.Background()
	intakeID := uuid.MustParse("24dd7736-e4c2-4f67-8844-51187de49069")
	userName := "Rock Lee"
	groupName := "Governance Rreview Board"
	requestName := "Salad/Sandwich Program"
	discussionBoardType := "Internal GRB Discussion Board"
	role := "Consumer"
	discussionContent := "Discussion Goes Here" // *models.HTML?

	grbReviewLink := fmt.Sprintf(
		"%s://%s/it-governance/%s/grb-review",
		s.config.URLScheme,
		s.config.URLHost,
		intakeID.String(),
	)

	discussionLink := fmt.Sprintf(
		"%s://%s/it-governance/%s/grb-review/discussionID=BLAH",
		s.config.URLScheme,
		s.config.URLHost,
		intakeID.String(),
	)
	ITGovInboxAddress := s.config.GRTEmail.String()

	sender := mockSender{}
	recipient := models.NewEmailAddress("fake@fake.com")
	recipients := []models.EmailAddress{recipient}

	input := SendGRBReviewDiscussionGroupTaggedEmailInput{
		SystemIntakeID:           intakeID,
		UserName:                 userName,
		GroupName:                groupName,
		RequestName:              requestName,
		DiscussionBoardType:      discussionBoardType,
		GRBReviewLink:            grbReviewLink,
		Role:                     role,
		DiscussionContent:        discussionContent,
		DiscussionLink:           discussionLink,
		ITGovernanceInboxAddress: ITGovInboxAddress,
		Recipients:               recipients,
	}

	client, err := NewClient(s.config, &sender)
	s.NoError(err)

	err = client.SystemIntake.SendGRBReviewDiscussionGroupTaggedEmail(ctx, input)
	s.NoError(err)

	getExpectedEmail := func() string {
		return fmt.Sprintf(`
			<h1 class="header-title">EASi</h1>
			<p class="header-subtitle">Easy Access to System Information</p>

			<p>%s tagged the %s in the %s for %s.</p>

			<p><strong><a href="%s">View this request in EASi</a></strong></p>
			<br>

			<h2>Discussion</h2>
			<br/>
			<p><b>%s</b></p>
			<p class="subtitle"> %s</p>
			<p>%s</p>
			<p style="font-weight: normal">
  				<a href="%s">
     				Reply in EASi
  				</a>
			</p>

			<br>
		    <p>If you have questions, please contact the Governance Team at <a href="mailto:%s">%s</a>.</p>
			<br>
			<hr>
			<p>You will continue to receive email notifications about this request until it is closed.</p>
			`,
			userName,
			groupName,
			discussionBoardType,
			requestName,
			grbReviewLink,
			userName,
			role,
			discussionContent,
			discussionLink,
			ITGovInboxAddress,
			ITGovInboxAddress,
		)
	}

	expectedEmail := getExpectedEmail()
	expectedSubject := "The " + groupName + "was tagged in a GRB Review discussion for " + requestName

	s.Run("Subject is correct", func() {
		s.Equal(expectedSubject, sender.subject)

	})

	s.Run("Recipient is correct", func() {
		allRecipients := []models.EmailAddress{
			recipient,
		}
		s.ElementsMatch(sender.toAddresses, allRecipients)
		s.Empty(sender.ccAddresses)
		s.Empty(sender.bccAddresses)
	})

	s.Run("all info is included", func() {
		s.EqualHTML(expectedEmail, sender.body)
	})
}
