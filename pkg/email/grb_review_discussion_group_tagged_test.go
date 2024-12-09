package email

import (
	"context"
	"fmt"
	"html/template"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestCreateGRBReviewDiscussionGroupTaggedNotification() {
	ctx := context.Background()
	intakeID := uuid.MustParse("24dd7736-e4c2-4f67-8844-51187de49069")
	postID := uuid.MustParse("24dd7736-e4c2-4f67-8844-51187de49069")
	userName := "Rock Lee"
	groupName := "Governance Review Board"
	requestName := "Salad/Sandwich Program"
	discussionBoardType := "Internal GRB Discussion Board"
	role := "Consumer"
	discussionContent := template.HTML(`<p>banana apple carburetor Let me look into it, ok? <span data-type="mention" tag-type="USER_ACCOUNT" class="mention" data-id-db="8dc55eda-be23-4822-aa69-a3f67de6078b">@Audrey Abrams</span>!"</p>`)

	grbReviewLink := fmt.Sprintf(
		"%s://%s/it-governance/%s/grb-review",
		s.config.URLScheme,
		s.config.URLHost,
		intakeID.String(),
	)

	discussionLink := fmt.Sprintf(
		"%s?discussionMode=reply&discussionId=%s",
		grbReviewLink,
		postID.String(),
	)
	ITGovInboxAddress := s.config.GRTEmail.String()

	sender := mockSender{}
	recipient := models.NewEmailAddress("fake@fake.com")
	recipients := models.EmailNotificationRecipients{
		RegularRecipientEmails:   []models.EmailAddress{recipient},
		ShouldNotifyITGovernance: false,
		ShouldNotifyITInvestment: false,
	}

	input := SendGRBReviewDiscussionGroupTaggedEmailInput{
		SystemIntakeID:    intakeID,
		UserName:          userName,
		GroupName:         groupName,
		RequestName:       requestName,
		Role:              role,
		DiscussionID:      postID,
		DiscussionContent: discussionContent,
		Recipients:        recipients,
	}

	client, err := NewClient(s.config, &sender)
	s.NoError(err)

	err = client.SystemIntake.SendGRBReviewDiscussionGroupTaggedEmail(ctx, input)
	s.NoError(err)

	expectedEmail := fmt.Sprintf(`
			<h1 class="header-title">EASi</h1>
			<p class="header-subtitle">Easy Access to System Information</p>

			<p>%s tagged the %s in the %s for %s.</p>

			<p><strong><a href="%s">View this request in EASi</a></strong></p>
			<br>

			<h2>Discussion</h2>
			<br>
			<p>%s</p>
			<p class="subtitle"> %s</p>
			<p>%s</p>
			<p style="font-weight: normal">
  				<a href="%s">
     				Reply in EASi
  				</a>
			</p>

			<hr>
			<br>
		    <p>If you have questions, please contact the Governance Team at <a href="mailto:%s">%s</a>.</p>
			<br>
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

	expectedSubject := fmt.Sprintf("The %[1]s was tagged in a GRB Review discussion for %[2]s", groupName, requestName)

	s.Run("Subject is correct", func() {
		s.Equal(expectedSubject, sender.subject)

	})

	s.Run("Recipient is correct", func() {
		s.ElementsMatch(sender.bccAddresses, recipients.RegularRecipientEmails)
		s.Empty(sender.ccAddresses)
		s.Empty(sender.toAddresses)
	})

	s.Run("all info is included", func() {
		s.EqualHTML(expectedEmail, sender.body)
	})
}

func (s *EmailTestSuite) TestCreateGRBReviewDiscussionGroupTaggedNotificationAdmin() {
	ctx := context.Background()
	intakeID := uuid.MustParse("24dd7736-e4c2-4f67-8844-51187de49069")
	postID := uuid.MustParse("24dd7736-e4c2-4f67-8844-51187de49069")
	userName := "Rock Lee"
	groupName := "Governance Review Board"
	requestName := "Salad/Sandwich Program"
	discussionBoardType := "Internal GRB Discussion Board"
	role := "" // empty to signify admin
	discussionContent := template.HTML(`<p>banana apple carburetor Let me look into it, ok? <span data-type="mention" tag-type="USER_ACCOUNT" class="mention" data-id-db="8dc55eda-be23-4822-aa69-a3f67de6078b">@Audrey Abrams</span>!"</p>`)

	grbReviewLink := fmt.Sprintf(
		"%s://%s/it-governance/%s/grb-review",
		s.config.URLScheme,
		s.config.URLHost,
		intakeID.String(),
	)

	discussionLink := fmt.Sprintf(
		"%s?discussionMode=reply&discussionId=%s",
		grbReviewLink,
		postID.String(),
	)

	sender := mockSender{}
	recipient := models.NewEmailAddress("fake@fake.com")
	recipients := models.EmailNotificationRecipients{
		RegularRecipientEmails:   []models.EmailAddress{recipient},
		ShouldNotifyITGovernance: false,
		ShouldNotifyITInvestment: false,
	}

	input := SendGRBReviewDiscussionGroupTaggedEmailInput{
		SystemIntakeID:    intakeID,
		UserName:          userName,
		GroupName:         groupName,
		RequestName:       requestName,
		Role:              role,
		DiscussionID:      postID,
		DiscussionContent: discussionContent,
		Recipients:        recipients,
	}

	client, err := NewClient(s.config, &sender)
	s.NoError(err)

	err = client.SystemIntake.SendGRBReviewDiscussionGroupTaggedEmail(ctx, input)
	s.NoError(err)

	expectedEmail := fmt.Sprintf(`
			<h1 class="header-title">EASi</h1>
			<p class="header-subtitle">Easy Access to System Information</p>

			<p>%s tagged the %s in the %s for %s.</p>

			<p><strong><a href="%s">View this request in EASi</a></strong></p>
			<br>

			<h2>Discussion</h2>
			<br>
			<p>%s</p>
			<p class="subtitle"> Governance Admin Team</p>
			<p>%s</p>
			<p style="font-weight: normal">
  				<a href="%s">
     				Reply in EASi
  				</a>
			</p>

			<hr>
			<br>
			<p>You will continue to receive email notifications about this request until it is closed.</p>
			`,
		userName,
		groupName,
		discussionBoardType,
		requestName,
		grbReviewLink,
		userName,
		discussionContent,
		discussionLink,
	)

	expectedSubject := fmt.Sprintf("The %[1]s was tagged in a GRB Review discussion for %[2]s", groupName, requestName)

	s.Run("Subject is correct", func() {
		s.Equal(expectedSubject, sender.subject)

	})

	s.Run("Recipient is correct", func() {
		allRecipients := []models.EmailAddress{
			recipient,
		}
		s.ElementsMatch(sender.bccAddresses, allRecipients)
		s.Empty(sender.toAddresses)
		s.Empty(sender.ccAddresses)
	})

	s.Run("all info is included", func() {
		s.EqualHTML(expectedEmail, sender.body)
	})
}
