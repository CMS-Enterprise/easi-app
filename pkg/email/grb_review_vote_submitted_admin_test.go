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

func (s *EmailTestSuite) TestSendGRBReviewVoteSubmittedAdmin() {
	ctx := context.Background()
	intakeID := uuid.MustParse("24dd7736-e4c2-4f67-8844-51187de49069")
	projectTitle := "Vote Submitted Admin GRB"
	requester := "Vote Submitter"
	requesterComponent := "Office of Minority Health"
	vote := models.SystemIntakeAsyncGRBVotingOptionNoObjection
	additionalComments := "I fully agree"

	startDate := time.Now().AddDate(0, 0, -3)
	endDate := time.Now().AddDate(0, 0, 2)

	grbMemberName := "Joe Voter"

	noObjectionVotes := 3
	objectionVotes := 4
	notYetVoted := 1

	sender := mockSender{}
	client, err := NewClient(s.config, &sender)
	s.NoError(err)

	err = client.SystemIntake.SendGRBReviewVoteSubmittedAdmin(
		ctx,
		SendGRBReviewVoteSubmittedAdminInput{
			SystemIntakeID:     intakeID,
			GRBMemberName:      grbMemberName,
			ProjectTitle:       projectTitle,
			RequesterName:      requester,
			RequesterComponent: requesterComponent,
			StartDate:          startDate,
			EndDate:            endDate,
			Vote:               vote,
			AdditionalComments: additionalComments,
			NoObjectionVotes:   noObjectionVotes,
			ObjectionVotes:     objectionVotes,
			NotYetVoted:        notYetVoted,
		})
	s.NoError(err)

	expectedSubject := fmt.Sprintf("GRB vote submitted for %s", projectTitle)
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

		<p>%[1]s has submitted a vote in the GRB review for %[2]s.</p>

		<p><strong>Vote:</strong> No Objection</p>

		<p><strong>Additional comments:</strong></p>

		<p>%[3]s</p>

		<p>If you would like to send a reminder to the remaining voting members you may do so from the link below.</p>

		<p><strong><a href="%[4]s">View this request in EASi</a></strong></p>

		<div class="no-margin">
		  <p><strong>Request summary:</strong></p>
		  <p>Project title: %[2]s</p>
		  <p>Requester: %[5]s, %[6]s</p>
		  <p>GRB review dates: %[7]s</p>
		  <p>Current votes: %[8]s</p>
		</div>

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
		grbMemberName,
		projectTitle,
		additionalComments,
		grbReviewLink,
		requester,
		translation.GetComponentAcronym(requesterComponent),
		dateInfo,
		voteInfo,
	)

	s.EqualHTML(expectedEmail, sender.body)
}
