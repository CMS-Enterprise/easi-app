package email

import (
	"context"
	"fmt"
	"html/template"
	"path"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendGRBReviewDiscussionReplyRequesterEmail() {
	ctx := context.Background()

	intakeID := uuid.MustParse("ed83af5f-99e0-4d6e-ae61-5f8458528b27")
	requestName := "Reading Rainbow Modernization"
	replierName := "Jane Doe"
	votingRole := "Voting Member"
	grbRole := "GRB"
	discussionContent := template.HTML(`<p>Looks good to me!</p>`)
	recipient := models.NewEmailAddress("requester@example.com")

	sender := mockSender{}
	client, err := NewClient(s.config, &sender)
	s.NoError(err)

	err = client.SystemIntake.SendGRBReviewDiscussionReplyRequesterEmail(
		ctx,
		SendGRBReviewDiscussionReplyRequesterEmailInput{
			SystemIntakeID:    intakeID,
			RequestName:       requestName,
			ReplierName:       replierName,
			VotingRole:        votingRole,
			GRBRole:           grbRole,
			DiscussionContent: discussionContent,
			Recipient:         recipient,
		},
	)
	s.NoError(err)

	// -------- Subject ----------
	expectedSubject := fmt.Sprintf(
		"New reply to your discussion in the GRB review for %s",
		requestName,
	)
	s.Equal(expectedSubject, sender.subject)

	// -------- Expected HTML ----------
	discussionPath := path.Join("governance-review-board", intakeID.String(), "discussions")
	discussionLink := client.urlFromPath(discussionPath)
	replyLink := client.urlFromPath(discussionPath + "?reply")

	expectedEmail := fmt.Sprintf(`
<h1 class="header-title">EASi</h1>
<p class="header-subtitle">Easy Access to System Information</p>

<p>%[1]s replied to your discussion as a part of the Governance Review Board (GRB) review for %[2]s. Sign in to EASi to view the reply or add to this conversation.</p>

<p><a href="%[3]s">View this request in EASi</a></p>

<p>Governance Review Board members or Governance Admin Team members may use the asynchronous discussion board in EASi to ask you and your project team questions in order to better understand the nuances of your project.</p>

<hr>

<p><strong>Discussion</strong></p>

<p><strong>%[1]s</strong><br/>
  %[4]s, %[5]s</p>

<br/>
<div class="quote">%[6]s</div>

<br/>
<p><a href="%[7]s">Reply in EASi</a></p>

<hr/>
<p>If you have questions, please contact the Governance Team at <a href="mailto:%[8]s">%[8]s</a></p>
<p>You will continue to receive email notifications about this request until it is closed.</p>
`,
		replierName,                // 1
		requestName,                // 2
		discussionLink,             // 3
		votingRole,                 // 4
		grbRole,                    // 5
		discussionContent,          // 6
		replyLink,                  // 7
		s.config.GRTEmail.String(), // 8
	)

	s.ElementsMatch(sender.toAddresses, []models.EmailAddress{recipient})
	s.EqualHTML(expectedEmail, sender.body)
}
