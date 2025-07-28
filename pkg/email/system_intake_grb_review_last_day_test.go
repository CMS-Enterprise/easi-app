package email

import (
	"context"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSystemIntakeGRBReviewLastDay() {
	ctx := context.Background()
	intakeID := uuid.New()
	start := time.Date(2026, 3, 10, 0, 0, 0, 0, time.UTC)
	end := time.Date(2026, 3, 11, 0, 0, 0, 0, time.UTC)

	recipient := models.NewEmailAddress("reviewer@example.com")
	sender := mockSender{}
	client, _ := NewClient(s.config, &sender)

	err := client.SystemIntake.SendSystemIntakeGRBReviewLastDay(ctx,
		SendSystemIntakeGRBReviewLastDayInput{
			Recipient:          recipient,
			SystemIntakeID:     intakeID,
			ProjectName:        "Widget Refresh",
			RequesterName:      "Bob",
			RequesterComponent: "Center for Medicare",
			GRBReviewStart:     start,
			GRBReviewDeadline:  end,
		})
	s.NoError(err)

	expectedSubject := "One day left in GRB review (Widget Refresh)"
	s.Equal(expectedSubject, sender.subject)
	s.ElementsMatch(sender.toAddresses, []models.EmailAddress{recipient})
	s.Contains(sender.body, "There is only 1 day left")
	s.Contains(sender.body, "Widget Refresh")
	s.Contains(sender.body, "Bob, CM") // acronym rendered
}
