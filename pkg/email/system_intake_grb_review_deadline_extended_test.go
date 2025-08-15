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
	requestLink := fmt.Sprintf("%[1]s://%[2]s/governance-task-list/%[3]s", s.config.URLScheme, s.config.URLHost, intakeID.String())

	expectedEmail := fmt.Sprintf(`
<h1 class="header-title">EASi</h1>
<p class="header-subtitle">Easy Access to System Information</p>

<p>The Governance Admin Team has extended the deadline for this asynchronous review. The new deadline is now %[1]s at 5pm Eastern Time. You may cast your vote or change your existing vote using the link below.</p>
<p><strong><a href="%[2]s">View this request in EASi</a></strong></p>
<div class="no-margin">
<p><strong>Request Summary:</strong></p>
  <p>Project title: %[3]s</p>
  <p>Requester: %[4]s, %[5]s</p>
  <p>GRB review dates: %[6]s-%[1]s</p>
</div>
<p>If you have questions, please contact the Governance Team at  <a href="mailto:%[7]s">%[7]s</a>.</p>
<hr>
<p>You may continue to receive email notifications about this request until a decision is issued and it is closed.</p>`,
		deadline.Format("01/02/2006"),
		requestLink,
		projectTitle,
		requesterName,
		componentAcronym,
		grbReviewStart.Format("01/02/2006"),
		s.config.GRTEmail.String(),
	)

	s.ElementsMatch(sender.toAddresses, []models.EmailAddress{recipient})
	s.EqualHTML(expectedEmail, sender.body)
}
