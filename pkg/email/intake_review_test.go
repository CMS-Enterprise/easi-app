package email

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendIntakeReviewEmails() {
	ctx := context.Background()
	intakeID := uuid.MustParse("accf1f18-5680-4454-8b0e-2d6275339967")
	projectName := "Reviewable Request"
	requester := "Joe Schmoe"
	emailText := models.HTML("Test Text\n\nTest")

	s.Run("successful call sends to the correct recipients", func() {
		s.runMultipleRecipientsTestAgainstAllTestCases(func(client Client, recipients models.EmailNotificationRecipients) error {
			return client.SendSystemIntakeReviewEmails(ctx, recipients, intakeID, projectName, requester, emailText)
		})
	})
}
