package email

import (
	"context"
	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendExtendLCIDEmailToMultipleRecipients() {
	ctx := context.Background()

	systemIntakeID := uuid.MustParse("313cce9a-88a3-45d9-b36f-a02db5954721")
	projectName := "TestProject"
	newExpiresAt, err := time.Parse(time.RFC3339, "2050-01-02T01:02:03Z")
	s.NoError(err)
	newScope := "new scope"
	newNextSteps := "new next steps"
	newCostBaseline := "new cost baseline"

	s.Run("successful call sends to the correct recipients", func() {
		s.runMultipleRecipientsTestAgainstAllTestCases(func(client Client, recipients models.EmailNotificationRecipients) error {
			return client.SendExtendLCIDEmailToMultipleRecipients(ctx, recipients, systemIntakeID, projectName, &newExpiresAt, newScope, newNextSteps, newCostBaseline)
		})
	})
}
