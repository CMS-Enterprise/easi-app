package email

// import (
// 	"context"
// 	"fmt"

// 	"github.com/cmsgov/easi-app/pkg/apperrors"
// 	"github.com/cmsgov/easi-app/pkg/models"
// )

// func (s *EmailTestSuite) TestSendTRBAttendeeAddedNotification() {
// 	sender := mockSender{}
// 	ctx := context.Background()

// 	s.Run("successful call has the right content", func() {
// 		client, err := NewClient(s.config, &sender)
// 		s.NoError(err)

// 		attendeeEmail := models.NewEmailAddress("test.attendee@test.com")
// 		requestName := "TestRequest"
// 		requesterName := "Test Requester"

// 		mailToTRBInboxElement := fmt.Sprintf(
// 			"<a href=\"mailto:%s\">%s</a>",
// 			s.config.TRBEmail,
// 			s.config.TRBEmail,
// 		)

// 		expectedEmail := "<h1 style=\"margin-bottom: 0.5rem;\">EASi</h1>\n\n" +
// 			"<span style=\"font-size:15px; line-height: 18px; color: #71767A\">Easy Access to System Information</span>\n\n" +
// 			"<p>" + requesterName + " has added you to the attendee list for the Technical Review Board (TRB) consult session for " + requestName + ".</p>\n\n" +
// 			"<p>When a date has been set for this consult session, you will receive an email from EASi as well as a calendar invite from the TRB.</p>\n\n" +
// 			"<p>If you have questions or you believe this to be an error, please contact " + requesterName + " or email the TRB at " + mailToTRBInboxElement + ".</p>\n\n" +
// 			"<hr>\n\n" +
// 			"<p>You will continue to receive emails from EASi related to the scheduling and outcome of this consult session.</p>\n"

// 		err = client.SendTRBAttendeeAddedNotification(ctx, attendeeEmail, requestName, requesterName)

// 		s.NoError(err)
// 		s.ElementsMatch(sender.toAddresses, []models.EmailAddress{attendeeEmail})
// 		s.Equal(fmt.Sprintf("You are invited to the TRB consult for (%s)", requestName), sender.subject)
// 		s.Equal(expectedEmail, sender.body)
// 	})

// 	s.Run("if the template is nil, we get the error from it", func() {
// 		client, err := NewClient(s.config, &sender)
// 		s.NoError(err)
// 		client.templates = templates{}

// 		attendeeEmail := models.NewEmailAddress("test.attendee@test.com")
// 		requestName := "TestRequest"
// 		requesterName := "Test Requester"

// 		err = client.SendTRBAttendeeAddedNotification(ctx, attendeeEmail, requestName, requesterName)

// 		s.Error(err)
// 		s.IsType(err, &apperrors.NotificationError{})
// 		e := err.(*apperrors.NotificationError)
// 		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
// 		s.Equal("TRB Attendee Added template is nil", e.Err.Error())
// 	})

// 	s.Run("if the template fails to execute, we get the error from it", func() {
// 		client, err := NewClient(s.config, &sender)
// 		s.NoError(err)
// 		client.templates.trbAttendeeAdded = mockFailedTemplateCaller{}

// 		attendeeEmail := models.NewEmailAddress("test.attendee@test.com")
// 		requestName := "TestRequest"
// 		requesterName := "Test Requester"

// 		err = client.SendTRBAttendeeAddedNotification(ctx, attendeeEmail, requestName, requesterName)

// 		s.Error(err)
// 		s.IsType(err, &apperrors.NotificationError{})
// 		e := err.(*apperrors.NotificationError)
// 		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
// 		s.Equal("template caller had an error", e.Err.Error())
// 	})

// 	s.Run("if the sender fails, we get the error from it", func() {
// 		sender := mockFailedSender{}

// 		client, err := NewClient(s.config, &sender)
// 		s.NoError(err)

// 		attendeeEmail := models.NewEmailAddress("test.attendee@test.com")
// 		requestName := "TestRequest"
// 		requesterName := "Test Requester"

// 		err = client.SendTRBAttendeeAddedNotification(ctx, attendeeEmail, requestName, requesterName)

// 		s.Error(err)
// 		s.IsType(err, &apperrors.NotificationError{})
// 		e := err.(*apperrors.NotificationError)
// 		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
// 		s.Equal("sender had an error", e.Err.Error())
// 	})
// }
