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

func (s *EmailTestSuite) TestSendGRBReviewHalfwayThrough() {
	ctx := context.Background()
	intakeID := uuid.MustParse("24dd7736-e4c2-4f67-8844-51187de49069")
	projectTitle := "Halfway Through GRB"
	requester := "Halfway Requester"
	requesterComponent := "Office of Minority Health"

	startDate := time.Now().AddDate(0, 0, -3)
	endDate := time.Now().AddDate(0, 0, 2)

	noObjectionVotes := 3
	objectionVotes := 2
	notYetVoted := 2

	sender := mockSender{}
	client, err := NewClient(s.config, &sender)
	s.NoError(err)

	err = client.SystemIntake.SendGRBReviewHalfwayThrough(
		ctx,
		SendGRBReviewHalfwayThroughInput{
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

	expectedSubject := fmt.Sprintf("The GRB review for %s is halfway complete", projectTitle)
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

		<p>There are %[1]s left in the GRB review period for %[2]s. At any time during the review period
		  you may add additional time to the review, end it early, or send a reminder to the GRB reviewers who have not voted. Use
		  the link below to do any of those in EASi. GRB reviewers will also receive some automatic reminders to vote.</p>

		<p><strong><a href="%[3]s">View this request in EASi</a></strong></p>

		<div class="no-margin">
		  <p><strong>Request summary:</strong></p>
		  <p>Project title: %[2]s</p>
		  <p>Requester: %[4]s, %[5]s</p>
		  <p>GRB review dates: %[6]s</p>
		  <p>Current votes: %[7]s</p>
		</div>

		<br>
		<div class="no-margin">
		  <p>Next steps:</p>
		  <ul>
		    <li>Wait for the end of the review timeframe, end the voting early, or add additional time to the voting period.
		    </li>
		    <li>Once the voting is over and a quorum of votes has been cast, issue a decision in EASi.</li>
		  </ul>
		</div>
		<br>
		<hr>

		<p>You will continue to receive email notifications about this request until it is closed.</p>`,
		buildRemainingTime(endDate),
		projectTitle,
		grbReviewLink,
		requester,
		translation.GetComponentAcronym(requesterComponent),
		dateInfo,
		voteInfo,
	)

	s.EqualHTML(expectedEmail, sender.body)
}
