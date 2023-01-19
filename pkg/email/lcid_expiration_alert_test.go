package email

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendLCIDExpirationAlertEmail() {
	sender := mockSender{}
	ctx := context.Background()
	intakeID := uuid.MustParse("19b916b7-0d18-493d-b08d-c726cff6c3df")
	projectName := "Test Request"
	lcidExpiresAt, _ := time.Parse("2006-01-02", "2021-12-25")
	decisionPath := fmt.Sprintf(
		"<a href=\"governance-review-team/%s/decision\">view the LCID information in EASi.</a>",
		intakeID.String(),
	)

	s.Run("successful call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		expectedEmail := "<p>Lifecycle ID issued for " + projectName + " is set to expire on " + lcidExpiresAt.Format("January 02, 2006") + ".</p>\n" +
			"<p>You may use this link to " + decisionPath + "</p>\n" +
			"<p>Please take necessary action to review the project with the project team</p>"

		err = client.SendLCIDExpirationAlertEmail(ctx, projectName, &lcidExpiresAt, intakeID)

		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, []models.EmailAddress{s.config.GRTEmail})
		s.Equal("Lifecycle ID about to expire", sender.subject)
		s.Equal(expectedEmail, sender.body)
	})

	s.Run("if the template is nil, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates = templates{}

		err = client.SendLCIDExpirationAlertEmail(ctx, projectName, &lcidExpiresAt, intakeID)

		s.Error(err)
		s.IsType(err, &apperrors.NotificationError{})
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("LCID expiration alert template is nil", e.Err.Error())
	})

	s.Run("if the template fails to execute, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates.lcidExpirationAlertTemplate = mockFailedTemplateCaller{}

		err = client.SendLCIDExpirationAlertEmail(ctx, projectName, &lcidExpiresAt, intakeID)

		s.Error(err)
		s.IsType(err, &apperrors.NotificationError{})
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("template caller had an error", e.Err.Error())
	})

	s.Run("if the sender fails, we get the error from it", func() {
		sender := mockFailedSender{}

		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		err = client.SendLCIDExpirationAlertEmail(ctx, projectName, &lcidExpiresAt, intakeID)
		s.Error(err)
		s.IsType(&apperrors.NotificationError{}, err)
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("sender had an error", e.Err.Error())
	})
}
