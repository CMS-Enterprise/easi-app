package main

// Prerequisites: MailCatcher container running (use scripts/dev up:backend to start)

// This script tests various email methods.
// To view emails, visit the MailCatcher web UI at http://127.0.0.1:1080/.

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/cms-enterprise/easi-app/pkg/appconfig"
	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/local"
	"github.com/cms-enterprise/easi-app/pkg/local/cedarcoremock"
	"github.com/cms-enterprise/easi-app/pkg/models"

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
		GRTEmail:                    models.NewEmailAddress("grt_email@cms.gov"),
		ITInvestmentEmail:           models.NewEmailAddress("it_investment_email@cms.gov"),
		TRBEmail:                    models.NewEmailAddress("trb@cms.gov"),
		EASIHelpEmail:               models.NewEmailAddress(os.Getenv("EASI_HELP_EMAIL")),
		CEDARTeamEmail:              models.NewEmailAddress("cedar@cedar.gov"),
		OITFeedbackChannelSlackLink: "https://oddball.slack.com/archives/C059N01AYGM",
		URLHost:                     os.Getenv("CLIENT_HOSTNAME"),
		URLScheme:                   os.Getenv("CLIENT_PROTOCOL"),
		TemplateDirectory:           os.Getenv("EMAIL_TEMPLATE_DIR"),
	}

	env, _ := appconfig.NewEnvironment("local") // hardcoded as "local" as it's easier than fetching from envs since we only ever use this locally
	sender := local.NewSMTPSender("localhost:1025", env)
	emailClient, err := email.NewClient(emailConfig, sender)
	noErr(err)
	return emailClient
}

func sendTRBEmails(ctx context.Context, client *email.Client) {
	requestID := uuid.New()
	requestName := "Example Request"
	requesterName := "Requesting User"
	requesterEmail := models.NewEmailAddress("TEST@local.fake")
	cedarSystemID := "{11AB1A00-1234-5678-ABC1-1A001B00CC4E}"
	component := "Test Component"
	adminEmail := models.NewEmailAddress("admin@local.fake")
	emailRecipients := []models.EmailAddress{requesterEmail, adminEmail}
	leadEmail := models.NewEmailAddress("TEST_LEAD@local.fake")
	leadName := "Bob"
	submissionDate := time.Now()
	consultDate := time.Now().AddDate(0, 2, 0)

	err := client.SendTRBGuidanceLetterSubmittedEmail(ctx,
		email.SendTRBGuidanceLetterSubmittedEmailInput{
			TRBRequestID:   requestID,
			RequestName:    requestName,
			RequestType:    string(models.TRBTBrainstorm),
			RequesterName:  requesterName,
			Component:      component,
			SubmissionDate: &submissionDate,
			ConsultDate:    &consultDate,
			CopyTRBMailbox: true,
			Recipients:     emailRecipients,
		},
	)
	noErr(err)

	err = client.SendTRBGuidanceLetterInternalReviewEmail(ctx,
		email.SendTRBGuidanceLetterInternalReviewEmailInput{
			TRBRequestID:   requestID,
			TRBRequestName: requestName,
			TRBLeadName:    "",
		},
	)
	noErr(err)

	err = client.SendTRBGuidanceLetterInternalReviewEmail(ctx,
		email.SendTRBGuidanceLetterInternalReviewEmailInput{
			TRBRequestID:   requestID,
			TRBRequestName: requestName,
			TRBLeadName:    leadName,
		},
	)
	noErr(err)

	err = client.SendTRBFormSubmissionNotificationToRequester(
		ctx,
		requestID,
		requestName,
		requesterEmail,
		requesterName,
	)
	noErr(err)

	err = client.SendTRBFormSubmissionNotificationToAdmins(
		ctx,
		requestID,
		requestName,
		requesterName,
		component,
	)
	noErr(err)

	// Ready for Consult (Feedback and No Feedback)
	err = client.SendTRBReadyForConsultNotification(
		ctx,
		emailRecipients,
		true,
		requestID,
		requestName,
		requesterName,
		models.HTML("<p>You're good to go for the consult meeting!</p>"),
	)
	noErr(err)

	err = client.SendTRBReadyForConsultNotification(
		ctx,
		emailRecipients,
		true,
		requestID,
		requestName,
		requesterName,
		models.HTML(""),
	)
	noErr(err)

	err = client.SendTRBEditsNeededOnFormNotification(
		ctx,
		emailRecipients,
		true,
		requestID,
		requestName,
		requesterName,
		models.HTML("<p>Please provide a better form.</p>"),
	)
	noErr(err)

	attendeeEmail := models.NewEmailAddress("subject_matter_expert@local.fake")
	err = client.SendTRBAttendeeAddedNotification(
		ctx,
		attendeeEmail,
		requestName,
		requesterName,
	)
	noErr(err)

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
		ReasonClosed:   models.HTML("<p>This is a reason to close</p>"),
		Recipients:     emailRecipients,
	})
	noErr(err)

	err = client.SendTRBRequestReopenedEmail(ctx, email.SendTRBRequestReopenedEmailInput{
		TRBRequestID:   requestID,
		TRBRequestName: requestName,
		RequesterName:  requesterName,
		CopyTRBMailbox: true,
		ReasonReopened: models.HTML("<p>This is a reason to reopen</p>"),
		Recipients:     emailRecipients,
	})
	noErr(err)

	err = client.SendTRBRequestClosedEmail(ctx, email.SendTRBRequestClosedEmailInput{
		TRBRequestID:   requestID,
		TRBRequestName: requestName,
		RequesterName:  requesterName,
		CopyTRBMailbox: false,
		ReasonClosed:   models.HTML(""),
		Recipients:     emailRecipients,
	})
	noErr(err)

	err = client.SendTRBRequestReopenedEmail(ctx, email.SendTRBRequestReopenedEmailInput{
		TRBRequestID:   requestID,
		TRBRequestName: requestName,
		RequesterName:  requesterName,
		CopyTRBMailbox: false,
		ReasonReopened: models.HTML(""),
		Recipients:     emailRecipients,
	})
	noErr(err)

	err = client.SendCedarRolesChangedEmail(
		ctx,
		"Requester Jones",
		"Johnothan Roleadd",
		true,
		false,
		[]string{},
		[]string{"System API Contact"},
		"CMSGovNetSystem",
		time.Now(),
	)
	noErr(err)

	err = client.SendCedarRolesChangedEmail(
		ctx,
		"Requester Jones",
		"Johnothan Roledelete",
		false,
		true,
		[]string{"System API Contact",
			"System Manager"},
		[]string{"System API Contact"},
		"CMSGovNetSystem",
		time.Now(),
	)
	noErr(err)

	err = client.SendCedarNewTeamMemberEmail(
		ctx,
		"Oliver Queen",
		"green.arrow@queencityquivers.org",
		"CMSGovNetSystem",
		cedarSystemID,
		[]string{"System API Contact"},
		cedarcoremock.GetSystemRoles(cedarSystemID, nil),
	)
	noErr(err)

	err = client.SendCedarYouHaveBeenAddedEmail(
		ctx,
		"CMSGovNetSystem",
		cedarSystemID,
		[]string{"System API Contact"},
		requesterEmail,
	)
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
	loremSentence1 := "<p>Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia.</p>"
	loremSentence2 := "<ul><li><p>Nostrud officia pariatur ut officia.</p></li><li><p>Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate.</p></li></ul><p>Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod.</p>"
	loremSentence3 := "<p>Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.</p>"
	loremParagraphs := loremSentence1 + loremSentence2 + loremSentence3
	intakeID := uuid.New()
	lifecycleID := "123456"
	lifecycleExpiresAt := time.Now().AddDate(30, 0, 0)
	lifecycleIssuedAt := time.Now()
	lifecycleRetiresAt := time.Now().AddDate(3, 0, 0)
	lifecycleScope := models.HTMLPointer(loremSentence2)
	lifecycleCostBaseline := "a baseline"
	submittedAt := time.Now()
	requesterEmail := models.NewEmailAddress("TEST@local.fake")
	emailNotificationRecipients := models.EmailNotificationRecipients{
		RegularRecipientEmails:   []models.EmailAddress{requesterEmail},
		ShouldNotifyITGovernance: false,
		ShouldNotifyITInvestment: false,
	}
	reason := models.HTMLPointer(loremParagraphs)
	feedback := models.HTMLPointer(loremParagraphs)
	nextSteps := models.HTMLPointer(loremParagraphs)
	additionalInfo := models.HTMLPointer(loremParagraphs)

	for _, targetForm := range []models.GovernanceRequestFeedbackTargetForm{
		models.GRFTFinalBusinessCase,
		models.GRFTFDraftBusinessCase,
		models.GRFTFIntakeRequest,
	} {
		err := client.SystemIntake.SendRequestEditsNotification(
			ctx,
			emailNotificationRecipients,
			intakeID,
			targetForm,
			"Awesome Candy Request",
			"Mr. Good Bar",
			*feedback,
			additionalInfo,
		)
		noErr(err)
	}

	err := client.SystemIntake.SendCloseRequestNotification(
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

	for _, step := range models.AllSystemIntakeStepToProgressTo {
		err = client.SystemIntake.SendProgressToNewStepNotification(
			ctx,
			emailNotificationRecipients,
			intakeID,
			step,
			"Super Secret Bonus Form",
			"Whatchamacallit",
			feedback,
			additionalInfo,
		)
		noErr(err)
	}

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
		&lifecycleCostBaseline,
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
		&lifecycleCostBaseline,
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
		lifecycleScope,
		lifecycleCostBaseline,
		reason,
		nextSteps,
		additionalInfo,
	)
	noErr(err)

	err = client.SystemIntake.SendUnretireLCIDNotification(
		ctx,
		emailNotificationRecipients,
		lifecycleID,
		&lifecycleExpiresAt,
		&lifecycleIssuedAt,
		lifecycleScope,
		lifecycleCostBaseline,
		nextSteps,
		additionalInfo,
	)
	noErr(err)

	err = client.SystemIntake.SendExpireLCIDNotification(
		ctx,
		emailNotificationRecipients,
		lifecycleID,
		&lifecycleExpiresAt,
		&lifecycleIssuedAt,
		lifecycleScope,
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
		nil,                   // prev expire
		&lifecycleExpiresAt,   // new expire
		lifecycleScope,        // prev
		lifecycleScope,        // new
		lifecycleCostBaseline, // prev
		lifecycleCostBaseline, // new
		nextSteps,             // prev
		nextSteps,             // new
		time.Now(),            // amendment date
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
		lifecycleScope,
		lifecycleCostBaseline,
		nextSteps,
		additionalInfo,
	)
	noErr(err)
	// initial form first submit
	err = client.SystemIntake.SendSubmitInitialFormRequesterNotification(
		ctx,
		requesterEmail,
		intakeID,
		"Almond M&Ms",
		false, // isResubmitted
	)
	noErr(err)
	err = client.SystemIntake.SendSubmitInitialFormReviewerNotification(
		ctx,
		intakeID,
		"Almond M&Ms",
		"Johnny Bravo",
		"some component",
		models.SystemIntakeRequestTypeMAJORCHANGES,
		"some stage",
		false, // isResubmitted
	)
	noErr(err)
	// initial form first resubmitted
	err = client.SystemIntake.SendSubmitInitialFormRequesterNotification(
		ctx,
		requesterEmail,
		intakeID,
		"Almond M&Ms",
		true, // isResubmitted
	)
	noErr(err)
	err = client.SystemIntake.SendSubmitInitialFormReviewerNotification(
		ctx,
		intakeID,
		"Almond M&Ms",
		"Johnny Bravo",
		"some component",
		models.SystemIntakeRequestTypeMAJORCHANGES,
		"some stage",
		true, // isResubmitted
	)
	noErr(err)
	// initial biz case draft
	err = client.SystemIntake.SendSubmitBizCaseRequesterNotification(
		ctx,
		requesterEmail,
		"Candy Corn",
		intakeID,
		false, // isResubmitted
		true,  // isDraft
	)
	noErr(err)
	err = client.SystemIntake.SendSubmitBizCaseReviewerNotification(
		ctx,
		intakeID,
		"Dexter",
		"Candy Corn",
		false, // isResubmitted
		true,  // isDraft
	)
	noErr(err)
	// resubmitted biz case draft
	err = client.SystemIntake.SendSubmitBizCaseRequesterNotification(
		ctx,
		requesterEmail,
		"Candy Corn",
		intakeID,
		true, // isResubmitted
		true, // isDraft
	)
	noErr(err)
	err = client.SystemIntake.SendSubmitBizCaseReviewerNotification(
		ctx,
		intakeID,
		"Dexter",
		"Candy Corn",
		true, // isResubmitted
		true, // isDraft
	)
	noErr(err)
	// initial biz case final
	err = client.SystemIntake.SendSubmitBizCaseRequesterNotification(
		ctx,
		requesterEmail,
		"Bit o Honey",
		intakeID,
		false, // isResubmitted
		false, // isDraft
	)
	noErr(err)
	err = client.SystemIntake.SendSubmitBizCaseReviewerNotification(
		ctx,
		intakeID,
		"Dexter",
		"Bit o Honey",
		false, // isResubmitted
		false, // isDraft
	)
	noErr(err)
	// resubmitted biz case final
	err = client.SystemIntake.SendSubmitBizCaseRequesterNotification(
		ctx,
		requesterEmail,
		"Bit o Honey",
		intakeID,
		true,  // isResubmitted
		false, // isDraft
	)
	noErr(err)
	err = client.SystemIntake.SendSubmitBizCaseReviewerNotification(
		ctx,
		intakeID,
		"Dexter",
		"Bit o Honey",
		true,  // isResubmitted
		false, // isDraft
	)
	noErr(err)
	err = client.SendLCIDExpirationAlertEmail(
		ctx,
		emailNotificationRecipients,
		intakeID,
		"Pop Rocks",
		"Samurai Jack",
		"123456",
		&lifecycleIssuedAt,
		&lifecycleExpiresAt,
		*lifecycleScope,
		lifecycleCostBaseline,
		*nextSteps,
	)
	noErr(err)
	err = client.SystemIntake.SendCreateGRBReviewerNotification(
		ctx,
		emailNotificationRecipients.RegularRecipientEmails,
		intakeID,
		"Raisinets",
		"Courage the Cowardly Dog",
	)
	noErr(err)

	err = client.SystemIntake.SendGRBReviewDiscussionReplyEmail(
		ctx,
		email.SendGRBReviewDiscussionReplyEmailInput{
			SystemIntakeID:    intakeID,
			UserName:          "Discussion Tester #1",
			RequestName:       "GRB Review Discussion Test",
			Role:              "Voting Member",
			DiscussionContent: `<p>banana apple carburetor Let me look into it, ok? <span data-type="mention" tag-type="USER_ACCOUNT" class="mention" data-id-db="8dc55eda-be23-4822-aa69-a3f67de6078b">@Audrey Abrams</span>!"</p>`,
			Recipient:         requesterEmail,
		},
	)
	noErr(err)

	err = client.SystemIntake.SendGRBReviewDiscussionIndividualTaggedEmail(
		ctx,
		email.SendGRBReviewDiscussionIndividualTaggedEmailInput{
			SystemIntakeID:    intakeID,
			UserName:          "Discussion Tester #1",
			RequestName:       "GRB Review Discussion Test",
			Role:              "Voting Member",
			DiscussionContent: `<p>banana apple carburetor Let me look into it, ok? <span data-type="mention" tag-type="USER_ACCOUNT" class="mention" data-id-db="8dc55eda-be23-4822-aa69-a3f67de6078b">@Audrey Abrams</span>!"</p>`,
			Recipients:        []models.EmailAddress{requesterEmail},
		},
	)
	noErr(err)

	// admin version
	err = client.SystemIntake.SendGRBReviewDiscussionIndividualTaggedEmail(
		ctx,
		email.SendGRBReviewDiscussionIndividualTaggedEmailInput{
			SystemIntakeID:    intakeID,
			UserName:          "Discussion Tester #1",
			RequestName:       "GRB Review Discussion Test",
			Role:              "Governance Admin Team",
			DiscussionContent: `<p>banana apple carburetor Let me look into it, ok? <span data-type="mention" tag-type="USER_ACCOUNT" class="mention" data-id-db="8dc55eda-be23-4822-aa69-a3f67de6078b">@Audrey Abrams</span>!"</p>`,
			Recipients:        []models.EmailAddress{requesterEmail},
		},
	)
	noErr(err)

	// admin version
	err = client.SystemIntake.SendGRBReviewDiscussionIndividualTaggedEmail(
		ctx,
		email.SendGRBReviewDiscussionIndividualTaggedEmailInput{
			SystemIntakeID:    intakeID,
			UserName:          "Discussion Tester #1",
			RequestName:       "GRB Review Discussion Test",
			Role:              "Governance Admin Team",
			DiscussionContent: `<p>banana apple carburetor Let me look into it, ok? <span data-type="mention" tag-type="USER_ACCOUNT" class="mention" data-id-db="8dc55eda-be23-4822-aa69-a3f67de6078b">@Audrey Abrams</span>!"</p>`,
			Recipients:        []models.EmailAddress{requesterEmail},
		},
	)
	noErr(err)

	err = client.SystemIntake.SendGRBReviewDiscussionGroupTaggedEmail(
		ctx,
		email.SendGRBReviewDiscussionGroupTaggedEmailInput{
			SystemIntakeID:    intakeID,
			UserName:          "Discussion Tester #1",
			RequestName:       "GRB Review Discussion Test",
			Role:              "Voting Member, CIO",
			GroupName:         "Governance Admin Team",
			DiscussionContent: `<p>banana apple carburetor Let me look into it, ok? <span data-type="mention" tag-type="USER_ACCOUNT" class="mention" data-id-db="8dc55eda-be23-4822-aa69-a3f67de6078b">@Audrey Abrams</span>!"</p>`,
			Recipients:        emailNotificationRecipients,
		},
	)
	noErr(err)

	// admin version
	err = client.SystemIntake.SendGRBReviewDiscussionGroupTaggedEmail(
		ctx,
		email.SendGRBReviewDiscussionGroupTaggedEmailInput{
			SystemIntakeID:    intakeID,
			UserName:          "Discussion Tester #1",
			RequestName:       "GRB Review Discussion Test",
			Role:              "Governance Admin Team",
			GroupName:         "GRB",
			DiscussionContent: `<p>banana apple carburetor Let me look into it, ok? <span data-type="mention" tag-type="USER_ACCOUNT" class="mention" data-id-db="8dc55eda-be23-4822-aa69-a3f67de6078b">@Audrey Abrams</span>!"</p>`,
			Recipients:        emailNotificationRecipients,
		},
	)
	noErr(err)

	err = client.SystemIntake.SendSystemIntakeAdminUploadDocEmail(
		ctx,
		email.SendSystemIntakeAdminUploadDocEmailInput{
			SystemIntakeID:     intakeID,
			RequestName:        "Doc Upload",
			RequesterName:      "Wouldn't you like to know",
			RequesterComponent: "OFW",
			Recipients:         emailNotificationRecipients.RegularRecipientEmails,
		},
	)
	noErr(err)

	err = client.SystemIntake.SendGRBReviewPresentationLinksUpdatedEmail(
		ctx,
		email.SendGRBReviewPresentationLinksUpdatedEmailInput{
			SystemIntakeID:     intakeID,
			ProjectName:        "Project with Presentation",
			RequesterName:      "Nobody",
			RequesterComponent: "Office of Strategy, Performance, and Results",
			Recipients:         emailNotificationRecipients.RegularRecipientEmails,
		},
	)
	noErr(err)
}
