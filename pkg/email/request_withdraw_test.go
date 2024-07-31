package email

import (
	"context"
	"fmt"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendWithdrawRequestEmail() {
	sender := mockSender{}
	ctx := context.Background()
	requestName := "Request Name"

	s.Run("successful call with request name has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		expectedEmail := "<p>Hello,</p>\n\n" +
			"<p>\n  The " + requestName + " request has been withdrawn by the requester.\n  " +
			"No further action is required for the withdrawal.\n" +
			"</p>\n"

		err = client.SendWithdrawRequestEmail(ctx, requestName)

		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, []models.EmailAddress{s.config.GRTEmail})
		s.Equal(fmt.Sprintf("Request Withdrawn: %s", requestName), sender.subject)
		s.Equal(expectedEmail, sender.body)
	})

	s.Run("successful call without request name has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		expectedEmail := "<p>Hello,</p>\n\n" +
			"<p>\n  A request has been withdrawn by the requester.\n  " +
			"No further action is required for the withdrawal.\n" +
			"</p>\n"

		err = client.SendWithdrawRequestEmail(ctx, "")

		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, []models.EmailAddress{s.config.GRTEmail})
		s.Equal("Request Withdrawn", sender.subject)
		s.Equal(expectedEmail, sender.body)
	})

	s.Run("if the named request template is nil, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates = templates{}

		err = client.SendWithdrawRequestEmail(ctx, requestName)

		s.Error(err)
		s.Equal("withdraw named request template is nil", err.Error())
	})

	s.Run("if the unnamed request template is nil, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates = templates{}

		err = client.SendWithdrawRequestEmail(ctx, "")

		s.Error(err)
		s.Equal("withdraw unnamed request template is nil", err.Error())
	})

	s.Run("if the template fails to execute, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates.namedRequestWithdrawTemplate = mockFailedTemplateCaller{}

		err = client.SendWithdrawRequestEmail(ctx, requestName)

		s.Error(err)
		s.Equal("template caller had an error", err.Error())
	})

	s.Run("if the sender fails, we get the error from it", func() {
		sender := mockFailedSender{}

		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		err = client.SendWithdrawRequestEmail(ctx, requestName)

		s.Error(err)
		s.Equal("sender had an error", err.Error())
	})
}
