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
	"github.com/cmsgov/easi-app/pkg/graph/model"
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

	sendITGovEmails(ctx, &client)
}

func sendITGovEmails(ctx context.Context, client *email.Client) {
	intakeID := uuid.New()
	lifecycleID := "123456"
	lifecycleExpiresAt := time.Now().AddDate(30, 0, 0)
	lifecycleIssuedAt := time.Now()
	lifecycleRetiresAt := time.Now().AddDate(3, 0, 0)
	lifecycleScope := models.HTMLPointer("<em>This is a scope</em>")
	lifecycleCostBaseline := "a baseline"
	submittedAt := time.Now()
	requesterEmail := models.NewEmailAddress("TEST@local.fake")
	emailNotificationRecipients := models.EmailNotificationRecipients{
		RegularRecipientEmails:   []models.EmailAddress{requesterEmail},
		ShouldNotifyITGovernance: false,
		ShouldNotifyITInvestment: false,
	}
	reason := models.HTMLPointer("<strong>Reasons</strong>")
	feedback := models.HTMLPointer("<strong>Feedback goes here</strong>")
	newStep := model.SystemIntakeStepToProgressToDraftBusinessCase
	nextSteps := models.HTMLPointer("<ul><li>Do this,</li><li>then that!</li></ul>")
	additionalInfo := models.HTMLPointer("Here is additional info <ul><li>fill out the form again</li><li>fill it out better than the first time</li></ul>")

	err := client.SystemIntake.SendRequestEditsNotification(
		ctx,
		emailNotificationRecipients,
		intakeID,
		"Super Secret Bonus Form",
		"Form Update Initiative",
		"Mr. Good Bar",
		" <strong> Great Job! </strong>",
		additionalInfo,
	)
	noErr(err)

	err = client.SystemIntake.SendCloseRequestNotification(
		ctx,
		emailNotificationRecipients,
		intakeID,
		"Super Secret Bonus Form",
		"Snickers",
		reason,
		&submittedAt,
		additionalInfo,
	)
	noErr(err)

	err = client.SystemIntake.SendReopenRequestNotification(
		ctx,
		emailNotificationRecipients,
		intakeID,
		"Super Secret Bonus Form",
		"Heath Bar",
		reason,
		&submittedAt,
		additionalInfo,
	)
	noErr(err)

	err = client.SystemIntake.SendProgressToNewStepNotification(
		ctx,
		emailNotificationRecipients,
		intakeID,
		newStep,
		"Super Secret Bonus Form",
		"Whatchamacallit",
		feedback,
		additionalInfo,
	)
	noErr(err)

	err = client.SystemIntake.SendNotApprovedNotification(
		ctx,
		emailNotificationRecipients,
		intakeID,
		"Super Secret Bonus Form",
		"Zero Bar",
		*reason,
		*nextSteps,
		additionalInfo,
	)
	noErr(err)

	err = client.SystemIntake.SendNotITGovRequestNotification(
		ctx,
		emailNotificationRecipients,
		intakeID,
		"Super Secret Bonus Form",
		"Heath Bar",
		reason,
		additionalInfo,
	)
	noErr(err)

	err = client.SystemIntake.SendIssueLCIDNotification(
		ctx,
		emailNotificationRecipients,
		intakeID,
		"Mounds",
		lifecycleID,
		lifecycleIssuedAt,
		&lifecycleExpiresAt,
		*lifecycleScope,
		lifecycleCostBaseline,
		*nextSteps,
		models.TRBFRNotRecommended,
		"George of the Jungle",
		additionalInfo,
	)
	noErr(err)

	err = client.SystemIntake.SendConfirmLCIDNotification(
		ctx,
		emailNotificationRecipients,
		intakeID,
		"Butterfinger",
		lifecycleID,
		&lifecycleExpiresAt,
		&lifecycleIssuedAt,
		*lifecycleScope,
		lifecycleCostBaseline,
		*nextSteps,
		models.TRBFRStronglyRecommended,
		"Marvin the Martian",
		additionalInfo,
	)
	noErr(err)

	err = client.SystemIntake.SendRetireLCIDNotification(
		ctx,
		emailNotificationRecipients,
		lifecycleID,
		&lifecycleRetiresAt,
		&lifecycleExpiresAt,
		&lifecycleIssuedAt,
		*lifecycleScope,
		lifecycleCostBaseline,
		reason,
		*nextSteps,
		additionalInfo,
	)
	noErr(err)

	err = client.SystemIntake.SendExpireLCIDNotification(
		ctx,
		emailNotificationRecipients,
		lifecycleID,
		&lifecycleExpiresAt,
		&lifecycleIssuedAt,
		*lifecycleScope,
		lifecycleCostBaseline,
		*reason,
		nextSteps,
		additionalInfo,
	)
	noErr(err)

	err = client.SystemIntake.SendUpdateLCIDNotification(
		ctx,
		emailNotificationRecipients,
		lifecycleID,
		&lifecycleIssuedAt,
		&lifecycleExpiresAt,
		&lifecycleExpiresAt,
		lifecycleScope,
		lifecycleScope,
		lifecycleCostBaseline,
		lifecycleCostBaseline,
		nextSteps,
		nextSteps,
		time.Now(),
		reason,
		additionalInfo,
	)
	noErr(err)
	err = client.SystemIntake.SendChangeLCIDRetirementDateNotification(
		ctx,
		emailNotificationRecipients,
		lifecycleID,
		&lifecycleRetiresAt,
		&lifecycleExpiresAt,
		&lifecycleIssuedAt,
		*lifecycleScope,
		lifecycleCostBaseline,
		*nextSteps,
		additionalInfo,
	)
	noErr(err)
	panic("Add the submit emails!")

}
