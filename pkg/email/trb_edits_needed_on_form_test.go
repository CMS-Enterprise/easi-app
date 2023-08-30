package email

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (s *EmailTestSuite) TestSendTRBEditsNeededOnFormNotification() {
	sender := mockSender{}
	ctx := context.Background()

	s.Run("successful call has the right content", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		requestID := uuid.MustParse("43b41d91-3105-4a74-b4be-f9459df382b6")
		requestName := "TestRequest"
		requesterName := "Test Requester"
		feedback := "MEDIOCRE!"
		recipients := []models.EmailAddress{
			models.NewEmailAddress("abcd@local.fake"),
			models.NewEmailAddress("efgh@local.fake"),
		}

		taskListViewOpeningTag := fmt.Sprintf(
			"<a href=\"%s://%s/trb/task-list/%s\">",
			s.config.URLScheme,
			s.config.URLHost,
			requestID,
		)

		adminViewOpeningTag := fmt.Sprintf(
			"<a href=\"%s://%s/trb/%s/request\">",
			s.config.URLScheme,
			s.config.URLHost,
			requestID,
		)

		mailToTRBInboxElement := fmt.Sprintf(
			"<a href=\"mailto:%s\">%s</a>",
			s.config.TRBEmail,
			s.config.TRBEmail,
		)

		expectedEmail := "<h1 style=\"margin-bottom: 0.5rem;\">EASi</h1>\n\n" +
			"<span style=\"font-size:15px; line-height: 18px; color: #71767A\">Easy Access to System Information</span>\n\n" +
			"<p>The Technical Review Board (TRB) has reviewed the initial request form for " + requestName + " and has requested edits.</p>\n\n" +
			"<p>Edits requested: " + feedback + "</p>\n\n" +
			"Next steps:\n" +
			"<ul>\n" +
			"<li>" + requesterName + " and their project team should review the feedback provided by the TRB and make any required changes to the initial request form.</li>\n" +
			"</ul>\n\n" +
			"View this request in EASi:\n" +
			"<ul>\n" +
			"<li>If you are the initial requester, you may " + taskListViewOpeningTag + "click here</a> to view your request task list.</li>\n" +
			"<li>TRB team members may " + adminViewOpeningTag + "click here</a> to view the request details.</li>\n" +
			"<li>Others should contact " + requesterName + " or the TRB for more information about this request.</li>\n" +
			"</ul>\n\n" +
			"<p>If you have questions, please email the TRB at " + mailToTRBInboxElement + ".</p>\n\n" +
			"<hr>\n\n" +
			"<p>Depending on the request, you may continue to receive email notifications about this request until it is closed.</p>\n"

		err = client.SendTRBEditsNeededOnFormNotification(ctx, recipients, false, requestID, requestName, requesterName, models.HTML(feedback))
		s.NoError(err)
		s.Equal(fmt.Sprintf("The TRB has requested edits for %v", requestName), sender.subject)
		s.Equal(expectedEmail, sender.body)
	})

	s.Run("successful call copying the TRB mailbox sends to all recipients and the TRB mailbox", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		requestID := uuid.MustParse("b6fd27ec-7617-4a10-8354-658bb6489da6")
		requestName := "TestRequest"
		requesterName := "Test Requester"
		feedback := "MEDIOCRE!"
		recipients := []models.EmailAddress{
			models.NewEmailAddress("abcd@local.fake"),
			models.NewEmailAddress("efgh@local.fake"),
		}
		allRecipients := append(recipients, s.config.TRBEmail)

		err = client.SendTRBEditsNeededOnFormNotification(ctx, recipients, true, requestID, requestName, requesterName, models.HTML(feedback))
		s.NoError(err)

		s.ElementsMatch(sender.toAddresses, allRecipients)
	})

	s.Run("successful call *not* copying the TRB mailbox sends to all recipients, but not the TRB mailbox", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)

		requestID := uuid.MustParse("43fab7ff-8b23-4339-9538-f5fd4308eb20")
		requestName := "TestRequest"
		requesterName := "Test Requester"
		feedback := "MEDIOCRE!"
		recipients := []models.EmailAddress{
			models.NewEmailAddress("abcd@local.fake"),
			models.NewEmailAddress("efgh@local.fake"),
		}

		err = client.SendTRBEditsNeededOnFormNotification(ctx, recipients, false, requestID, requestName, requesterName, models.HTML(feedback))
		s.NoError(err)

		s.ElementsMatch(sender.toAddresses, recipients)
		s.NotContains(sender.toAddresses, s.config.TRBEmail)
	})

	s.Run("if the template is nil, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates = templates{}

		requestID := uuid.MustParse("2b5ec749-9bdf-4a54-b6cc-82f38fc19749")
		requestName := "TestRequest"
		requesterName := "Test Requester"
		feedback := "MEDIOCRE!"
		recipients := []models.EmailAddress{
			models.NewEmailAddress("abcd@local.fake"),
			models.NewEmailAddress("efgh@local.fake"),
		}

		err = client.SendTRBEditsNeededOnFormNotification(ctx, recipients, false, requestID, requestName, requesterName, models.HTML(feedback))

		s.Error(err)
		s.IsType(err, &apperrors.NotificationError{})
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("TRB Edits Needed on Form template is nil", e.Err.Error())
	})

	s.Run("if the template fails to execute, we get the error from it", func() {
		client, err := NewClient(s.config, &sender)
		s.NoError(err)
		client.templates.trbEditsNeededOnForm = mockFailedTemplateCaller{}

		requestID := uuid.MustParse("5c8317bd-c1c2-4264-902c-1a592f988860")
		requestName := "TestRequest"
		requesterName := "Test Requester"
		feedback := "MEDIOCRE!"
		recipients := []models.EmailAddress{
			models.NewEmailAddress("abcd@local.fake"),
			models.NewEmailAddress("efgh@local.fake"),
		}

		err = client.SendTRBEditsNeededOnFormNotification(ctx, recipients, false, requestID, requestName, requesterName, models.HTML(feedback))

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

		requestID := uuid.MustParse("7c97afa8-9737-4f35-aa7e-83849b184564")
		requestName := "TestRequest"
		requesterName := "Test Requester"
		feedback := "MEDIOCRE!"
		recipients := []models.EmailAddress{
			models.NewEmailAddress("abcd@local.fake"),
			models.NewEmailAddress("efgh@local.fake"),
		}

		err = client.SendTRBEditsNeededOnFormNotification(ctx, recipients, false, requestID, requestName, requesterName, models.HTML(feedback))

		s.Error(err)
		s.IsType(err, &apperrors.NotificationError{})
		e := err.(*apperrors.NotificationError)
		s.Equal(apperrors.DestinationTypeEmail, e.DestinationType)
		s.Equal("sender had an error", e.Err.Error())
	})
}
