package email

import (
	"context"
	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendExtendLCIDEmails() {
	ctx := context.Background()

	systemIntakeID := uuid.MustParse("313cce9a-88a3-45d9-b36f-a02db5954721")
	requester := "Julius Caesar"
	projectName := "TestProject"
	newExpiresAt, err := time.Parse(time.RFC3339, "2050-01-02T01:02:03Z")
	s.NoError(err)
	newScope := models.HTML("new scope")
	newNextSteps := models.HTML("new next steps")
	newCostBaseline := "new cost baseline"

	s.Run("successful call sends to the correct recipients", func() {
		s.runMultipleRecipientsTestAgainstAllTestCases(func(client Client, recipients models.EmailNotificationRecipients) error {
			return client.SendExtendLCIDEmails(ctx, recipients, systemIntakeID, projectName, requester, &newExpiresAt, newScope, newNextSteps, newCostBaseline)
		})
	})
}
