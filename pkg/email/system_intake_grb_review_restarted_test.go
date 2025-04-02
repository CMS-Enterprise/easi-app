package email

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSystemIntakeGRBReviewRestarted() {
	ctx := context.Background()
	intakeID := uuid.New()
	projectTitle := "Cool Pilot Project"
	requesterName := "Alice"
	componentAcronym := "XYZ"
	grbReviewStart := time.Date(2026, 4, 5, 0, 0, 0, 0, time.UTC)
	grbReviewDeadline := time.Date(2026, 4, 10, 0, 0, 0, 0, time.UTC)
	grbReviewEndDate := time.Date(2026, 4, 10, 0, 0, 0, 0, time.UTC)

	recipient := models.NewEmailAddress("someone@fake.com")
	recipients := models.EmailNotificationRecipients{
		RegularRecipientEmails: []models.EmailAddress{recipient},
	}

	sender := mockSender{}
	client, err := NewClient(s.config, &sender)
	s.NoError(err)

	err = client.SystemIntake.SendSystemIntakeGRBReviewRestarted(
		ctx,
		recipients,
		intakeID,
		projectTitle,
		requesterName,
		componentAcronym,
		grbReviewStart,
		grbReviewDeadline,
		grbReviewEndDate,
	)
	s.NoError(err)

	expectedSubject := fmt.Sprintf("The GRB review for %s was restarted", projectTitle)
	s.Equal(expectedSubject, sender.subject)

	requestLink := fmt.Sprintf("%s://%s/governance-task-list/%s", s.config.URLScheme, s.config.URLHost, intakeID.String())
	expectedEmail := fmt.Sprintf(`
<h1 class="header-title">EASi</h1>
<p class="header-subtitle">Easy Access to System Information</p>

<p>The Governance Admin Team has restarted the review for %s. It will now end on %s at 5:00pm EST.</p>
<div class="no-margin">
  <p>Use the link below to:</p>
  <ul>
    <li>Re-review project materials and documentation.</li>
    <li>Ask additional questions or review ongoing discussions with other GRB members, the project team, and the Governance Admin Team.</li>
    <li>Change your vote.</li>
  </ul>
</div>
<br>
<p><a href="%s">View this request in EASi</a></p>
<p><b>Request Summary:</b>
  Project title: %s
  Requester: %s, %s
  GRB review dates: %s-%s
</p>
<hr>
<p>You may continue to receive email notifications about this request until a decision is issued and it is closed.</p>
`,
		projectTitle,
		grbReviewEndDate.Format("01/02/2006"),
		requestLink,
		projectTitle,
		requesterName,
		componentAcronym,
		grbReviewStart.Format("01/02/2006"),
		grbReviewDeadline.Format("01/02/2006"),
	)

	s.ElementsMatch(sender.toAddresses, []models.EmailAddress{recipient})
	s.EqualHTML(expectedEmail, sender.body)
}
