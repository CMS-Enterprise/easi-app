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

func (s *EmailTestSuite) TestSendGRBReviewCompleteQuorumMet() {
	ctx := context.Background()
	intakeID := uuid.MustParse("24dd7736-e4c2-4f67-8844-51187de49069")
	projectTitle := "Complete Quorum GRB"
	requester := "Complete Quorum Requester"
	requesterComponent := "Office of Enterprise Data and Analytics"

	startDate := time.Now().AddDate(0, 0, -6)
	endDate := time.Now().AddDate(0, 0, -1)

	noObjectionVotes := 6
	objectionVotes := 2
	notYetVoted := 1

	sender := mockSender{}
	client, err := NewClient(s.config, &sender)
	s.NoError(err)

	err = client.SystemIntake.SendGRBReviewCompleteQuorumMet(
		ctx,
		SendGRBReviewCompleteQuorumMetInput{
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

	expectedSubject := fmt.Sprintf("The GRB review for %s is complete", projectTitle)
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

		<p>The review timeframe for %[1]s is ended. You may view the results of the review and issue a decision on
		  behalf of the GRB.</p>

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
		    <li>Issue a decision in EASi.</li>
		    <li>If there is not a consensus or the review needs more time, you may restart the GRB review or add more time from
		      EASi.
		    </li>
		    <li>If there is not a consensus or there are objection votes, you may attempt to address the lack of consensus by
		      working with the project team to resolve GRB concerns.
		    </li>
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
