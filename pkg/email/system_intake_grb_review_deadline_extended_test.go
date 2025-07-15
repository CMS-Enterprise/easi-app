package email

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSystemIntakeGRBReviewDeadlineExtended() {
	ctx := context.Background()
	intakeID := uuid.New()
	projectTitle := "My Great Project"
	requesterName := "Jane Doe"
	componentAcronym := "ABC"
	grbReviewStart := time.Date(2025, 1, 10, 0, 0, 0, 0, time.UTC)
	deadline := time.Date(2026, 5, 10, 0, 0, 0, 0, time.UTC)

	recipient := models.NewEmailAddress("fake@fake.com")
	recipients := models.EmailNotificationRecipients{
		RegularRecipientEmails: []models.EmailAddress{recipient},
	}

	sender := mockSender{}
	client, err := NewClient(s.config, &sender)
	s.NoError(err)

	// Here we assume your code has been updated to accept requesterName/componentAcronym
	// If not, adjust your method signature as needed.
	err = client.SystemIntake.SendSystemIntakeGRBReviewDeadlineExtended(
		ctx,
		recipients,
		intakeID,
		projectTitle,
		requesterName,
		componentAcronym,
		grbReviewStart,
		deadline,
	)
	s.NoError(err)

	expectedSubject := fmt.Sprintf("The Governance Admin Team has extended the deadline for this GRB review (%s)", projectTitle)
	s.Equal(expectedSubject, sender.subject)

	// Adjust link to match your urlFromPath() logic
	requestLink := fmt.Sprintf("%s://%s/governance-task-list/%s", s.config.URLScheme, s.config.URLHost, intakeID.String())

	// In your template, GRB review dates: if GRBReviewStart is empty, it just displays the .GRBReviewDeadline,
	// or if it’s set, it displays “start-deadline”. We’ll illustrate the "no start date" scenario here.
	expectedEmail := fmt.Sprintf(`
<h1 class="header-title">EASi</h1>
<p class="header-subtitle">Easy Access to System Information</p>

<p>The Governance Admin Team has extended the deadline for this asynchronous review. The new deadline is now %s at 5pm Eastern Time. You may cast your vote or change your existing vote using the link below.</p>
<p><a href="%s">View this request in EASi</a></p>
<p><b>Request Summary:</b>
  Project title: %s
  Requester: %s, %s
  GRB review dates: %s-%s
</p>
<p>If you have questions, please contact the Governance Team at  <a href="mailto:%s">%s</a>.</p>
<hr>
<p>You may continue to receive email notifications about this request until a decision is issued and it is closed.</p>
`,
		deadline.Format("01/02/2006"),
		requestLink,
		projectTitle,
		requesterName,
		componentAcronym,
		grbReviewStart.Format("01/02/2006"),
		deadline.Format("01/02/2006"),
		s.config.GRTEmail.String(),
		s.config.GRTEmail.String(),
	)

	s.ElementsMatch(sender.toAddresses, []models.EmailAddress{recipient})
	s.EqualHTML(expectedEmail, sender.body)
}
