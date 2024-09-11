package email

import (
	"context"
	"fmt"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendTRBAttendeeAddedNotification() {
	sender := mockSender{}
	ctx := context.Background()

	s.Run("successful call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		attendeeEmail := models.NewEmailAddress("test.attendee@test.com")
		requestName := "TestRequest"
		requesterName := "Test Requester"

		getExpectedEmail := func() string {
			mailToTRBInboxElement := fmt.Sprintf(
				`<a href="mailto:%s">%s</a>`,
				s.config.TRBEmail,
				s.config.TRBEmail,
			)
			return fmt.Sprintf(
				`<h1 class="header-title">EASi</h1>
				<p class="header-subtitle">Easy Access to System Information</p>

				<p>%s has added you to the attendee list for the Technical Review Board (TRB) consult session for %s.</p>

				<p>When a date has been set for this consult session, you will receive an email from EASi as well as a calendar invite from the TRB.</p>

				<p>If you have questions or you believe this to be an error, please contact %s or email the TRB at %s.</p>

				<br>
				<hr>

				<p>You will continue to receive emails from EASi related to the scheduling and outcome of this consult session.</p>`,
				requesterName,
				requestName,
				requesterName,
				mailToTRBInboxElement,
			)
		}
		expectedEmail := getExpectedEmail()
		err = client.SendTRBAttendeeAddedNotification(ctx, attendeeEmail, requestName, requesterName)

		s.NoError(err)
		s.ElementsMatch(sender.toAddresses, []models.EmailAddress{attendeeEmail})
		s.Equal(fmt.Sprintf("You are invited to the TRB consult for (%s)", requestName), sender.subject)
		s.EqualHTML(expectedEmail, sender.body)
	})

	s.Run("if the template is nil, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates = templates{}

		attendeeEmail := models.NewEmailAddress("test.attendee@test.com")
		requestName := "TestRequest"
		requesterName := "Test Requester"

		err = client.SendTRBAttendeeAddedNotification(ctx, attendeeEmail, requestName, requesterName)

		s.Error(err)
		s.Equal("TRB Attendee Added template is nil", err.Error())
	})

	s.Run("if the template fails to execute, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates.trbAttendeeAdded = mockFailedTemplateCaller{}

		attendeeEmail := models.NewEmailAddress("test.attendee@test.com")
		requestName := "TestRequest"
		requesterName := "Test Requester"

		err = client.SendTRBAttendeeAddedNotification(ctx, attendeeEmail, requestName, requesterName)

		s.Error(err)
		s.Equal("template caller had an error", err.Error())
	})

	s.Run("if the sender fails, we get the error from it", func() {
		sender := mockFailedSender{}

		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		attendeeEmail := models.NewEmailAddress("test.attendee@test.com")
		requestName := "TestRequest"
		requesterName := "Test Requester"

		err = client.SendTRBAttendeeAddedNotification(ctx, attendeeEmail, requestName, requesterName)

		s.Error(err)
		s.Equal("sender had an error", err.Error())
	})
}
