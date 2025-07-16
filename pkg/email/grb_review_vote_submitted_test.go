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

func (s *EmailTestSuite) TestSendGRBReviewVoteSubmitted() {
	ctx := context.Background()
	recipient := models.EmailAddress("local@fake.com")
	intakeID := uuid.MustParse("24dd7736-e4c2-4f67-8844-51187de49069")
	projectTitle := "Vote Submitted GRB"
	requester := "Vote Submitter"
	requesterComponent := "Office of Minority Health"
	vote := models.SystemIntakeAsyncGRBVotingOptionNoObjection

	startDate := time.Now().AddDate(0, 0, -3)
	endDate := time.Now().AddDate(0, 0, 2)

	sender := mockSender{}
	client, err := NewClient(s.config, &sender)
	s.NoError(err)

	err = client.SystemIntake.SendGRBReviewVoteSubmitted(
		ctx,
		SendGRBReviewVoteSubmittedInput{
			Recipient:          recipient,
			SystemIntakeID:     intakeID,
			ProjectTitle:       projectTitle,
			RequesterName:      requester,
			RequesterComponent: requesterComponent,
			StartDate:          startDate,
			EndDate:            endDate,
			Vote:               vote,
		},
	)
	s.NoError(err)

	expectedSubject := fmt.Sprintf("GRB Confirmation: Thank you for your input (%s)", projectTitle)
	s.Equal(expectedSubject, sender.subject)

	s.ElementsMatch(sender.toAddresses, []models.EmailAddress{recipient})

	intakePath := path.Join("it-governance", intakeID.String(), "grb-review")
	grbReviewLink := client.urlFromPath(intakePath)

	formattedStart := startDate.Format("01/02/2006")
	formattedEnd := endDate.Format("01/02/2006")

	dateInfo := fmt.Sprintf("%[1]s-%[2]s", formattedStart, formattedEnd)

	expectedEmail := fmt.Sprintf(`
		<h1 class="header-title">EASi</h1>
		<p class="header-subtitle">Easy Access to System Information</p>

		<p>Thank you for submitting your vote for %[1]s. If you would like to change your vote, you may use the link
		  below to do so before the review is over.</p>

		<p><strong>Your vote:</strong> No Objection</p>

		<p><strong><a href="%[2]s">View this request in EASi</a></strong></p>

		<div class="no-margin">
		  <p><strong>Request summary:</strong></p>
		  <p>Project title: %[1]s</p>
		  <p>Requester: %[3]s, %[4]s</p>
		  <p>GRB review dates: %[5]s</p>
		</div>

		<p>If you have questions, please contact the Governance Team at <a
		    href="mailto:%[6]s">%[6]s</a>.</p>
		<hr>
		<p>You may continue to receive email notifications about this request until a decision is issued and it is closed.</p>`,
		projectTitle,
		grbReviewLink,
		requester,
		translation.GetComponentAcronym(requesterComponent),
		dateInfo,
		s.config.GRTEmail,
	)

	s.EqualHTML(expectedEmail, sender.body)
}
