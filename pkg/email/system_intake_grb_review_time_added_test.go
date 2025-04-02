package email

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSystemIntakeGRBReviewTimeAdded() {
	ctx := context.Background()
	intakeID := uuid.New()
	adminName := "Governance Admin"
	timeAdded := "2 days"
	projectTitle := "Project Rebuild"
	requesterName := "Debbie"
	componentAcronym := "HHS"
	grbReviewStart := time.Date(2026, 7, 1, 0, 0, 0, 0, time.UTC)
	grbReviewDeadline := time.Date(2026, 7, 3, 0, 0, 0, 0, time.UTC)
	grbReviewEndDate := time.Date(2026, 7, 5, 0, 0, 0, 0, time.UTC)
	voteTally := 5

	recipient := models.NewEmailAddress("reviewer@fake.com")
	recipients := models.EmailNotificationRecipients{
		RegularRecipientEmails: []models.EmailAddress{recipient},
	}

	sender := mockSender{}
	client, err := NewClient(s.config, &sender)
	s.NoError(err)

	err = client.SystemIntake.SendSystemIntakeGRBReviewTimeAdded(
		ctx,
		recipients,
		intakeID,
		adminName,
		timeAdded,
		projectTitle,
		requesterName,
		componentAcronym,
		grbReviewStart,
		grbReviewDeadline,
		grbReviewEndDate,
		voteTally,
	)
	s.NoError(err)

	expectedSubject := fmt.Sprintf("Time was added to the GRB review for %s", projectTitle)
	s.Equal(expectedSubject, sender.subject)

	requestLink := fmt.Sprintf("%s://%s/governance-task-list/%s", s.config.URLScheme, s.config.URLHost, intakeID.String())
	expectedEmail := fmt.Sprintf(`
<h1 class="header-title">EASi</h1>
<p class="header-subtitle">Easy Access to System Information</p>

<p>%s added %s to the review for %s. It will now end on %s at 5:00pm EST.</p>
<p><a href="%s">View this request in EASi</a></p>
<br>
<p><b>Request Summary:</b>
  Project title: %s
  Requester: %s, %s
  GRB review dates: %s-%s
  Current Votes: %d
</p>
<div class="no-margin">
  <p>Next steps:</p>
  <ul>
    <li>Wait for the end of the review timeframe, end the voting early, or add additional time to the voting period.</li>
    <li>Once the voting is over and a quorum of votes has been cast, issue a decision in EASi.</li>
  </ul>
</div>
<hr>
<p>You will continue to receive email notifications about this request until it is closed.</p>
`,
		adminName,
		timeAdded,
		projectTitle,
		grbReviewEndDate.Format("01/02/2006"),
		requestLink,
		projectTitle,
		requesterName,
		componentAcronym,
		grbReviewStart.Format("01/02/2006"),
		grbReviewDeadline.Format("01/02/2006"),
		voteTally,
	)

	s.ElementsMatch(sender.toAddresses, []models.EmailAddress{recipient})
	s.EqualHTML(expectedEmail, sender.body)
}
