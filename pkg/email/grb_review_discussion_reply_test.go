package email

import (
	"context"
	"fmt"
	"html/template"
	"path"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestCreateGRBReviewDiscussionReplyNotification() {
	ctx := context.Background()
	intakeID := uuid.MustParse("24dd7736-e4c2-4f67-8844-51187de49069")
	postID := uuid.MustParse("24dd7736-e4c2-4f67-8844-51187de49069")
	userName := "Rock Lee"
	requestName := "Salad/Sandwich Program"
	discussionBoardType := "Internal GRB Discussion Board"
	role := "Consumer"
	discussionContent := template.HTML(`<p>banana apple carburetor Let me look into it, ok? <span data-type="mention" tag-type="USER_ACCOUNT" class="mention" data-id-db="8dc55eda-be23-4822-aa69-a3f67de6078b">@Audrey Abrams</span>!</p>`)

	sender := mockSender{}
	client, err := NewClient(s.config, &sender)
	s.NoError(err)

	intakePath := path.Join("it-governance", intakeID.String(), "grb-review")

	grbReviewLink := client.urlFromPath(intakePath)

	discussionLink := client.urlFromPathAndQuery(intakePath, fmt.Sprintf("discussionMode=reply&amp;discussionId=%s", postID.String()))

	ITGovInboxAddress := s.config.GRTEmail.String()

	recipient := models.NewEmailAddress("fake@fake.com")

	input := SendGRBReviewDiscussionReplyEmailInput{
		SystemIntakeID:    intakeID,
		UserName:          userName,
		RequestName:       requestName,
		Role:              role,
		DiscussionID:      postID,
		DiscussionContent: discussionContent,
		Recipient:         recipient,
	}

	err = client.SystemIntake.SendGRBReviewDiscussionReplyEmail(ctx, input)
	s.NoError(err)

	expectedEmail := fmt.Sprintf(`
			<h1 class="header-title">EASi</h1>
			<p class="header-subtitle">Easy Access to System Information</p>

			<p>%s replied to your discussion on the %s for %s.</p>

			<p><strong><a href="%s">View this request in EASi</a></strong></p>
			<hr>

			<p><strong>Discussion Reply</strong></p>
			<br>
			<p class="no-margin"><strong>%s</strong></p>
			<p class="subtitle no-margin-top"> %s</p>
			<br>
			<div class="quote">%s</div>
			<br>
			<p style="font-weight: normal">
  				<a href="%s">
     				Reply in EASi
  				</a>
			</p>

			<hr>
		    <p>If you have questions, please contact the Governance Team at <a href="mailto:%s">%s</a>.</p>
			<p>You will continue to receive email notifications about this request until it is closed.</p>
			`,
		userName,
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

	expectedSubject := fmt.Sprintf("New reply to your discussion in the GRB Review for %s", requestName)

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

func (s *EmailTestSuite) TestCreateGRBReviewDiscussionReplyNotificationAdmin() {
	ctx := context.Background()
	intakeID := uuid.MustParse("24dd7736-e4c2-4f67-8844-51187de49069")
	postID := uuid.MustParse("24dd7736-e4c2-4f67-8844-51187de49069")
	userName := "Rock Lee"
	requestName := "Salad/Sandwich Program"
	discussionBoardType := "Internal GRB Discussion Board"
	role := "Governance Admin Team"
	discussionContent := template.HTML(`<p>banana apple carburetor Let me look into it, ok? <span data-type="mention" tag-type="USER_ACCOUNT" class="mention" data-id-db="8dc55eda-be23-4822-aa69-a3f67de6078b">@Audrey Abrams</span>!</p>`)

	sender := mockSender{}
	client, err := NewClient(s.config, &sender)
	s.NoError(err)

	intakePath := path.Join("it-governance", intakeID.String(), "grb-review")

	grbReviewLink := client.urlFromPath(intakePath)

	discussionLink := client.urlFromPathAndQuery(intakePath, fmt.Sprintf("discussionMode=reply&amp;discussionId=%s", postID.String()))

	recipient := models.NewEmailAddress("fake@fake.com")

	input := SendGRBReviewDiscussionReplyEmailInput{
		SystemIntakeID:    intakeID,
		UserName:          userName,
		RequestName:       requestName,
		Role:              role,
		DiscussionID:      postID,
		DiscussionContent: discussionContent,
		Recipient:         recipient,
	}

	err = client.SystemIntake.SendGRBReviewDiscussionReplyEmail(ctx, input)
	s.NoError(err)

	expectedEmail := fmt.Sprintf(`
			<h1 class="header-title">EASi</h1>
			<p class="header-subtitle">Easy Access to System Information</p>

			<p>%s replied to your discussion on the %s for %s.</p>

			<p><strong><a href="%s">View this request in EASi</a></strong></p>
			<hr>

			<p><strong>Discussion Reply</strong></p>
			<br>
			<p class="no-margin"><strong>%s</strong></p>
			<p class="subtitle no-margin-top"> Governance Admin Team</p>
			<br>
			<div class="quote">%s</div>
			<br>
			<p style="font-weight: normal">
  				<a href="%s">
     				Reply in EASi
  				</a>
			</p>

			<hr>
			<p>You will continue to receive email notifications about this request until it is closed.</p>
			`,
		userName,
		discussionBoardType,
		requestName,
		grbReviewLink,
		userName,
		discussionContent,
		discussionLink,
	)

	expectedSubject := fmt.Sprintf("New reply to your discussion in the GRB Review for %s", requestName)

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
