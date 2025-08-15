package email

import (
	"context"
	"fmt"
	"path"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/email/translation"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendGRBReviewPastDueNoQuorum() {
	ctx := context.Background()
	intakeID := uuid.MustParse("24dd7736-e4c2-4f67-8844-51187de49069")
	projectTitle := "Past Due No Quorum GRB"
	requester := "Past Due No Quorum Requester"
	requesterComponent := "Office of Human Capital"

	startDate := time.Now().AddDate(0, 0, -4)
	endDate := time.Now().AddDate(0, 0, 10)

	noObjectionVotes := 1
	objectionVotes := 1
	notYetVoted := 7

	sender := mockSender{}
	client, err := NewClient(s.config, &sender)
	s.NoError(err)

	err = client.SystemIntake.SendGRBReviewPastDueNoQuorum(
		ctx,
		SendGRBReviewPastDueNoQuorumInput{
			SystemIntakeID:     intakeID,
			ProjectTitle:       projectTitle,
			RequesterName:      requester,
			RequesterComponent: requesterComponent,
			StartDate:          startDate,
			EndDate:            endDate,
			NoObjectionVotes:   noObjectionVotes,
			ObjectionVotes:     objectionVotes,
			NotYetVoted:        notYetVoted,
		},
	)
	s.NoError(err)

	expectedSubject := fmt.Sprintf("The GRB review for %s is past due", projectTitle)
	s.Equal(expectedSubject, sender.subject)

	s.ElementsMatch(sender.toAddresses, []models.EmailAddress{s.config.GRTEmail})

	intakePath := path.Join("it-governance", intakeID.String(), "grb-review")
	grbReviewLink := client.urlFromPath(intakePath)

	formattedStart := startDate.Format("01/02/2006")
	formattedEnd := endDate.Format("01/02/2006")

	dateInfo := fmt.Sprintf("%[1]s-%[2]s", formattedStart, formattedEnd)
	voteInfo := fmt.Sprintf("%[1]d objection, %[2]d no objection, %[3]d no vote", objectionVotes, noObjectionVotes, notYetVoted)

	expectedEmail := fmt.Sprintf(`
		<h1 class="header-title">EASi</h1>
		<p class="header-subtitle">Easy Access to System Information</p>

		<p>The review timeframe for %[1]s has passed, but not enough GRB members have entered a vote to reach a
		  quorum. The GRB review is now in a past due state. GRB members may continue to vote until a quorum is reached. You may
		  want to send a reminder to GRB members in order to reach a quorum of votes.</p>

		<p><strong><a href="%[2]s">View this request in EASi</a></strong></p>

		<div class="no-margin">
		  <p><strong>Request summary:</strong></p>
		  <p>Project title: %[1]s</p>
		  <p>Requester: %[3]s, %[4]s</p>
		  <p>GRB review dates: %[5]s</p>
		  <p>Votes: %[6]s</p>
		</div>
		<br>
		<div class="no-margin">
		  <p>Next steps:</p>
		  <ul>
		    <li>Send a reminder to GRB review members.</li>
		    <li>End the review without a quorum.</li>
		    <li>Issue a decision in EASi.</li>
		  </ul>
		</div>
		<br>
		<hr>

		<p>You will continue to receive email notifications about this request until it is closed.</p>`,
		projectTitle,
		grbReviewLink,
		requester,
		translation.GetComponentAcronym(requesterComponent),
		dateInfo,
		voteInfo,
	)

	s.EqualHTML(expectedEmail, sender.body)
}
