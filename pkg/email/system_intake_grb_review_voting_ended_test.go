package email

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSystemIntakeGRBReviewVotingEnded() {
	ctx := context.Background()
	intakeID := uuid.New()
	projectName := "Project Voting Closed"
	requesterName := "Alice Example"
	component := "Center for Medicare"
	componentAcronym := "CM"
	startDate := time.Date(2026, 1, 10, 0, 0, 0, 0, time.UTC)
	endDate := time.Date(2026, 1, 15, 0, 0, 0, 0, time.UTC)
	recipient := models.NewEmailAddress("requester@example.com")

	sender := mockSender{}
	client, err := NewClient(s.config, &sender)
	s.NoError(err)

	err = client.SystemIntake.SendSystemIntakeGRBReviewEnded(ctx, SendSystemIntakeGRBReviewEndedInput{
		Recipient:          recipient,
		SystemIntakeID:     intakeID,
		ProjectName:        projectName,
		RequesterName:      requesterName,
		RequesterComponent: component,
		GRBReviewStart:     startDate,
		GRBReviewDeadline:  endDate,
	})
	s.NoError(err)

	expectedSubject := fmt.Sprintf("A GRB review is now closed (%s)", projectName)
	s.Equal(expectedSubject, sender.subject)

	expectedEmail := fmt.Sprintf(`
<h1 class="header-title">EASi</h1>
<p class="header-subtitle">Easy Access to System Information</p>

<p>The review period for the GRB review for %s is now over. You are no longer able to submit a vote or change an existing one.</p>

<div class="no-margin">
  <p><strong>Request summary:</strong></p>
  <p>Project title: %s</p>
  <p>Requester: %s, %s</p>
  <p>GRB review dates: %s-%s</p>
</div>
<br/>
<div class="no-margin">
  <p>Next steps:</p>
  <list>
    <li>The Governance Admin Team and the GRB will issue an official decision based on the results of the asynchronous review.</li>
  </list>
</div>

<p>If you have questions, please contact the Governance Team at <a href="mailto:%s">%s</a>.</p>

<hr>

<p>You may continue to receive email notifications about this request until a decision is issued and it is closed.</p>
`,
		projectName,
		projectName,
		requesterName,
		componentAcronym,
		startDate.Format("01/02/2006"),
		endDate.Format("01/02/2006"),
		s.config.GRTEmail.String(),
		s.config.GRTEmail.String(),
	)

	s.ElementsMatch(sender.toAddresses, []models.EmailAddress{recipient})
	s.EqualHTML(expectedEmail, sender.body)
}
