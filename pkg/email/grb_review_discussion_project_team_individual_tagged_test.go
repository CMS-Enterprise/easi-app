package email

import (
	"context"
	"fmt"
	"html/template"
	"path"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendGRBReviewDiscussionProjectTeamIndividualTaggedEmail() {
	ctx := context.Background()
	intakeID := uuid.MustParse("24dd7736-e4c2-4f67-8844-51187de49069")
	postID := uuid.MustParse("24dd7736-e4c2-4f67-8844-51187de49069")
	userName := "GRB Member"
	requestName := "Project Team request"
	role := "Professional"
	discussionContent := template.HTML(`<p>banana apple carburetor Let me look into it, ok? <span data-type="mention" tag-type="USER_ACCOUNT" class="mention" data-id-db="8dc55eda-be23-4822-aa69-a3f67de6078b">@Audrey Abrams</span>!"</p>`)
	recipient := models.NewEmailAddress("fake@fake.com")

	input := SendGRBReviewDiscussionProjectTeamIndividualTaggedInput{
		SystemIntakeID:    intakeID,
		UserName:          userName,
		RequestName:       requestName,
		Role:              role,
		DiscussionID:      postID,
		DiscussionContent: discussionContent,
		Recipient:         recipient,
	}

	sender := mockSender{}
	client, err := NewClient(s.config, &sender)
	s.NoError(err)

	err = client.SystemIntake.SendGRBReviewDiscussionProjectTeamIndividualTaggedEmail(ctx, input)
	s.NoError(err)

	intakePath := path.Join("it-governance", intakeID.String(), "grb-review")

	grbReviewLink := client.urlFromPath(intakePath)

	discussionLink := client.urlFromPathAndQuery(intakePath, fmt.Sprintf("discussionMode=reply&amp;discussionId=%s", postID.String()))

	expectedEmail := fmt.Sprintf(`
		<h1 class="header-title">EASi</h1>
		<p class="header-subtitle">Easy Access to System Information</p>

		<p>Governance Review Board (GRB) members or Governance Admin Team members may use the asynchronous discussion board in
		  EASi to ask you and your project team questions in order to better understand the nuances of our project. You were
		  tagged in a discussion for %[1]s. Sign in to EASi to reply to this conversation.</p>

		<p><strong><a href="%[2]s">View this request in EASi</a></strong></p>

		<hr>

		<p><strong>Discussion</strong></p>

		<br>
		<p class="no-margin"><strong>%[3]s</strong></p>
		<p class="subtitle no-margin-top">%[4]s</p>

		<br>
		<div class="quote">%[5]s</div>

		<p><strong><a href="%[6]s">Reply in EASi</a></strong></p>

		<hr>

		<p>If you have questions, please contact the Governance Team at <a href="mailto:%[7]s">%[7]s</a>.</p>

		<p>You will continue to receive email notifications about this request until it is closed.</p>`,
		requestName,
		grbReviewLink,
		userName,
		role,
		discussionContent,
		discussionLink,
		s.config.GRTEmail,
	)

	expectedSubject := fmt.Sprintf("You were tagged in a GRB Review discussion for %s", requestName)
	s.Equal(expectedSubject, sender.subject)

	s.ElementsMatch([]models.EmailAddress{recipient}, sender.toAddresses)
	s.EqualHTML(expectedEmail, sender.body)

}
