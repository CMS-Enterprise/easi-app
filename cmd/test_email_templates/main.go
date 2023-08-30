package main

// Prerequisites: MailCatcher container running (use scripts/dev up:backend to start)

// This script tests various email methods.
// To view emails, visit the MailCatcher web UI at http://127.0.0.1:1080/.

import (
	"context"
	"fmt"
	"os"
	"time"

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
		CEDARTeamEmail:         models.NewEmailAddress("cedar@cedar.gov"),
		URLHost:                os.Getenv("CLIENT_HOSTNAME"),
		URLScheme:              os.Getenv("CLIENT_PROTOCOL"),
		TemplateDirectory:      os.Getenv("EMAIL_TEMPLATE_DIR"),
	}

	sender := local.NewSMTPSender("localhost:1025")
	emailClient, err := email.NewClient(emailConfig, sender)
	noErr(err)
	return emailClient
}

func sendTRBEmails(ctx context.Context, client *email.Client) {
	requestID := uuid.New()
	requestName := "Example Request"
	requesterName := "Requesting User"
	requesterEmail := models.NewEmailAddress("TEST@local.fake")
	component := "Test Component"
	adminEmail := models.NewEmailAddress("admin@local.fake")
	emailRecipients := []models.EmailAddress{requesterEmail, adminEmail}
	leadEmail := models.NewEmailAddress("TEST_LEAD@local.fake")

	err := client.SendTRBFormSubmissionNotificationToRequester(ctx, requestID, requestName, requesterEmail, requesterName)
	noErr(err)

	err = client.SendTRBFormSubmissionNotificationToAdmins(ctx, requestID, requestName, requesterName, component)
	noErr(err)

	// Ready for Consult (Feedback and No Feedback)
	err = client.SendTRBReadyForConsultNotification(ctx, emailRecipients, true, requestID, requestName, requesterName, "You're good to go for the consult meeting!")
	noErr(err)
	err = client.SendTRBReadyForConsultNotification(ctx, emailRecipients, true, requestID, requestName, requesterName, "")
	noErr(err)

	editsRequestedFeedback := "Please provide a better form."
	err = client.SendTRBEditsNeededOnFormNotification(ctx, emailRecipients, true, requestID, requestName, requesterName, models.HTML(editsRequestedFeedback))
	noErr(err)

	attendeeEmail := models.NewEmailAddress("subject_matter_expert@local.fake")
	err = client.SendTRBAttendeeAddedNotification(ctx, attendeeEmail, requestName, requesterName)
	noErr(err)

	leadName := "The Leader"
	err = client.SendTRBRequestTRBLeadAssignedEmails(ctx, email.SendTRBRequestTRBLeadEmailInput{
		TRBRequestID:   requestID,
		TRBRequestName: requestName,
		RequesterName:  requesterName,
		TRBLeadName:    leadName,
		Component:      component,
		TRBLeadEmail:   leadEmail,
	})
	noErr(err)

	consultMeetingTime := time.Now().AddDate(0, 0, 10)
	err = client.SendTRBRequestConsultMeetingEmail(ctx, email.SendTRBRequestConsultMeetingEmailInput{
		TRBRequestID:       requestID,
		ConsultMeetingTime: consultMeetingTime,
		CopyTRBMailbox:     true,
		NotifyEmails:       emailRecipients,
		TRBRequestName:     requestName,
		Notes:              "Have a good time at the consult meeting!",
		RequesterName:      requesterName,
	})
	noErr(err)

	err = client.SendTRBRequestClosedEmail(ctx, email.SendTRBRequestClosedEmailInput{
		TRBRequestID:   requestID,
		TRBRequestName: requestName,
		RequesterName:  requesterName,
		CopyTRBMailbox: true,
		ReasonClosed:   "This is a reason",
		Recipients:     emailRecipients,
	})
	noErr(err)

	err = client.SendTRBRequestReopenedEmail(ctx, email.SendTRBRequestReopenedEmailInput{
		TRBRequestID:   requestID,
		TRBRequestName: requestName,
		RequesterName:  requesterName,
		CopyTRBMailbox: true,
		ReasonReopened: "This is a reason to reopen",
		Recipients:     emailRecipients,
	})
	noErr(err)

	err = client.SendTRBRequestClosedEmail(ctx, email.SendTRBRequestClosedEmailInput{
		TRBRequestID:   requestID,
		TRBRequestName: requestName,
		RequesterName:  requesterName,
		CopyTRBMailbox: false,
		ReasonClosed:   "",
		Recipients:     emailRecipients,
	})
	noErr(err)

	err = client.SendTRBRequestReopenedEmail(ctx, email.SendTRBRequestReopenedEmailInput{
		TRBRequestID:   requestID,
		TRBRequestName: requestName,
		RequesterName:  requesterName,
		CopyTRBMailbox: false,
		ReasonReopened: "",
		Recipients:     emailRecipients,
	})
	noErr(err)

	err = client.SendCedarRolesChangedEmail(ctx, "Requester Jones", "Johnothan Roleadd", true, false, []string{}, []string{"System API Contact"}, "CMSGovNetSystem", time.Now())
	noErr(err)

	err = client.SendCedarRolesChangedEmail(ctx, "Requester Jones", "Johnothan Roledelete", false, true, []string{"System API Contact", "System Manager"}, []string{"System API Contact"}, "CMSGovNetSystem", time.Now())
	noErr(err)
}

func main() {
	zapLogger, err := zap.NewDevelopment()
	noErr(err)
	ctx := appcontext.WithLogger(context.Background(), zapLogger)

	client := createEmailClient()

	sendTRBEmails(ctx, &client)
}
