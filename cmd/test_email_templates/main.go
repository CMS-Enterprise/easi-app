package main

// Prerequisites: MailCatcher container running (use scripts/dev up:backend to start)

// This script tests various email methods.
// To view emails, visit the MailCatcher web UI at http://127.0.0.1:1080/.

import (
	"context"
	"fmt"
	"os"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/email"
	"github.com/cmsgov/easi-app/pkg/local"
	"github.com/cmsgov/easi-app/pkg/models"

	"github.com/google/uuid"
	"go.uber.org/zap"
)

func noErr(err error) {
	if err != nil {
		fmt.Println("Error!")
		fmt.Println(err)
		panic("Aborting")
	}
}

func createEmailClient() email.Client {
	emailConfig := email.Config{
		GRTEmail:               models.NewEmailAddress("grt_email@cms.gov"),
		ITInvestmentEmail:      models.NewEmailAddress("it_investment_email@cms.gov"),
		AccessibilityTeamEmail: models.NewEmailAddress("508_team@cms.gov"),
		TRBEmail:               models.NewEmailAddress("trb@cms.gov"),
		EASIHelpEmail:          models.NewEmailAddress(os.Getenv("EASI_HELP_EMAIL")),
		TRBEmail:               models.NewEmailAddress(os.Getenv("TRB_EMAIL")),
		URLHost:                os.Getenv("CLIENT_HOSTNAME"),
		URLScheme:              os.Getenv("CLIENT_PROTOCOL"),
		TemplateDirectory:      os.Getenv("EMAIL_TEMPLATE_DIR"),
	}

	sender := local.NewSMTPSender("localhost:1025")
	emailClient, err := email.NewClient(emailConfig, sender)
	noErr(err)
	return emailClient
}

func sendInvalidEUAIDEmails(ctx context.Context, client *email.Client) {
	err := client.SendIntakeInvalidEUAIDEmail(ctx, "Some Project With An Invalid EUA ID", "ABCD", uuid.New())
	noErr(err)

	err = client.SendIntakeNoEUAIDEmail(ctx, "Some Project With No EUA ID", uuid.New())
	noErr(err)
}

func sendTRBEmails(ctx context.Context, client *email.Client) {
	requestID := uuid.New()
	requestName := "Example Request"
	requesterName := "Requesting User"
	requesterEmail := models.NewEmailAddress("TEST@local.fake")
	component := "Test Component"

	err := client.SendTRBFormSubmissionNotificationToRequester(ctx, requestID, requestName, requesterEmail, requesterName)
	noErr(err)

	err = client.SendTRBFormSubmissionNotificationToAdmins(ctx, requestName, requesterName, component)
	noErr(err)

	adminEmail := models.NewEmailAddress("admin@local.fake")
	feedbackRecipients := []models.EmailAddress{requesterEmail, adminEmail}

	readyForConsultFeedback := "You're good to go for the consult meeting!"
	err = client.SendTRBReadyForConsultNotification(ctx, feedbackRecipients, true, requestID, requestName, requesterName, readyForConsultFeedback)
	noErr(err)

	editsRequestedFeedback := "Please provide a better form."
	err = client.SendTRBEditsNeededOnFormNotification(ctx, feedbackRecipients, true, requestID, requestName, requesterName, editsRequestedFeedback)
	noErr(err)

	attendeeEmail := models.NewEmailAddress("subject_matter_expert@local.fake")

	err = client.SendTRBAttendeeAddedNotification(ctx, attendeeEmail, requestName, requesterName)
	noErr(err)
}

func main() {
	zapLogger, err := zap.NewDevelopment()
	noErr(err)
	ctx := appcontext.WithLogger(context.Background(), zapLogger)

	client := createEmailClient()

	sendInvalidEUAIDEmails(ctx, &client)
	sendTRBEmails(ctx, &client)
}
