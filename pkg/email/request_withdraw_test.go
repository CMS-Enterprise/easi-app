package email

import (
	"fmt"

	"github.com/cmsgov/easi-app/pkg/apperrors"
)

func (s *EmailTestSuite) TestSendWithdrawRequestEmail() {
	sender := mockSender{}

	requestName := "Request Name"

	s.Run("successful call with request name has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		expectedEmail := "<p>Hello,</p>\n\n" +
			"<p>\n  The " + requestName + " request has been withdrawn by the requester.\n  " +
			"No further action is required for the withdrawal.\n" +
			"</p>\n"

		err = client.SendWithdrawRequestEmail(requestName)

		s.NoError(err)
		s.Equal(s.config.GRTEmail, sender.toAddress)
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

		err = client.SendWithdrawRequestEmail("")

		s.NoError(err)
		s.Equal(s.config.GRTEmail, sender.toAddress)
		s.Equal("Request Withdrawn", sender.subject)
		s.Equal(expectedEmail, sender.body)
	})

	s.Run("if the named request template is nil, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates = templates{}

		err = client.SendWithdrawRequestEmail(requestName)

		s.Error(err)
		s.IsType(err, &apperrors.NotificationError{})
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("withdraw named request template is nil", e.Err.Error())
	})

	s.Run("if the unnamed request template is nil, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates = templates{}

		err = client.SendWithdrawRequestEmail("")

		s.Error(err)
		s.IsType(err, &apperrors.NotificationError{})
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("withdraw unnamed request template is nil", e.Err.Error())
	})

	s.Run("if the template fails to execute, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates.namedRequestWithdrawTemplate = mockFailedTemplateCaller{}

		err = client.SendWithdrawRequestEmail(requestName)

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

		err = client.SendWithdrawRequestEmail(requestName)

		s.Error(err)
		s.IsType(err, &apperrors.NotificationError{})
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("sender had an error", e.Err.Error())
	})
}
