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
		"Office of Information Technology",
	)
	noErr(err)

	err = client.SystemIntake.SendGRBReviewDiscussionReplyEmail(
		ctx,
		email.SendGRBReviewDiscussionReplyEmailInput{
			SystemIntakeID:    intakeID,
			UserName:          "Discussion Tester #1",
			RequestName:       "GRB Review Discussion Test",
			Role:              "Voting Member",
			DiscussionContent: `<p>banana apple carburetor Let me look into it, ok? <span data-type="mention" tag-type="USER_ACCOUNT" class="mention" data-id-db="8dc55eda-be23-4822-aa69-a3f67de6078b">@Audrey Abrams</span>!</p>`,
			Recipient:         requesterEmail,
		},
	)
	noErr(err)

	err = client.SystemIntake.SendGRBReviewDiscussionReplyRequesterEmail(
		ctx,
		email.SendGRBReviewDiscussionReplyRequesterEmailInput{
			SystemIntakeID:    intakeID,
			RequestName:       "GRB Review Discussion Test",
			ReplierName:       "Discussion Tester #1",
			VotingRole:        "Voting Member",
			GRBRole:           "Governance Admin Team",
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
			DiscussionContent: `<p>banana apple carburetor Let me look into it, ok? <span data-type="mention" tag-type="USER_ACCOUNT" class="mention" data-id-db="8dc55eda-be23-4822-aa69-a3f67de6078b">@Audrey Abrams</span>!</p>`,
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
			DiscussionContent: `<p>banana apple carburetor Let me look into it, ok? <span data-type="mention" tag-type="USER_ACCOUNT" class="mention" data-id-db="8dc55eda-be23-4822-aa69-a3f67de6078b">@Audrey Abrams</span>!</p>`,
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
			DiscussionContent: `<p>banana apple carburetor Let me look into it, ok? <span data-type="mention" tag-type="USER_ACCOUNT" class="mention" data-id-db="8dc55eda-be23-4822-aa69-a3f67de6078b">@Audrey Abrams</span>!</p>`,
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
			DiscussionContent: `<p>banana apple carburetor Let me look into it, ok? <span data-type="mention" tag-type="USER_ACCOUNT" class="mention" data-id-db="8dc55eda-be23-4822-aa69-a3f67de6078b">@Audrey Abrams</span>!</p>`,
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
			DiscussionContent: `<p>banana apple carburetor Let me look into it, ok? <span data-type="mention" tag-type="USER_ACCOUNT" class="mention" data-id-db="8dc55eda-be23-4822-aa69-a3f67de6078b">@Audrey Abrams</span>!</p>`,
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
			RequesterComponent: "ABCD",
			Recipients:         emailNotificationRecipients.RegularRecipientEmails,
		},
	)
	noErr(err)

	err = client.SystemIntake.SendPresentationDeckUploadReminder(
		ctx,
		emailNotificationRecipients,
		intakeID,
		"Project with Presentation",
	)
	noErr(err)

	err = client.SystemIntake.SendSystemIntakeGRBReviewDeadlineExtended(
		ctx,
		emailNotificationRecipients,
		intakeID,
		"Supreme Taco Project",
		"Taco King",
		"STP",
		time.Date(2025, 1, 10, 0, 0, 0, 0, time.UTC),
		time.Date(2026, 5, 10, 0, 0, 0, 0, time.UTC),
	)
	noErr(err)

	err = client.SystemIntake.SendSystemIntakeGRBReviewEnded(
		ctx,
		email.SendSystemIntakeGRBReviewEndedInput{
			Recipient:          requesterEmail,
			SystemIntakeID:     intakeID,
			ProjectName:        "Project Ended Email Test",
			RequesterName:      "Ended Email - Name",
			RequesterComponent: "Center for Medicare",
			GRBReviewStart:     time.Now().AddDate(0, 0, -5),
			GRBReviewDeadline:  time.Now(),
		},
	)
	noErr(err)

	err = client.SystemIntake.SendSystemIntakeGRBReviewEndedEarly(
		ctx,
		email.SendSystemIntakeGRBReviewEndedEarlyInput{
			Recipient:          requesterEmail,
			SystemIntakeID:     intakeID,
			ProjectTitle:       "Voting Ended Early",
			RequesterName:      "Early Voter",
			RequesterComponent: "Center for Medicare",
			StartDate:          time.Now().AddDate(0, 0, -3),
			EndDate:            time.Now().AddDate(0, 0, 2),
		},
	)
	noErr(err)

	err = client.SystemIntake.SendSystemIntakeGRBReviewTimeAdded(
		ctx,
		emailNotificationRecipients,
		intakeID,
		"Supreme Taco Admin",
		"2 days",
		"Supreme Taco Project",
		"Taco King",
		"STP",
		time.Date(2026, 7, 1, 0, 0, 0, 0, time.UTC),
		time.Date(2026, 7, 3, 0, 0, 0, 0, time.UTC),
		time.Date(2026, 7, 5, 0, 0, 0, 0, time.UTC),
		5,
	)
	noErr(err)

	err = client.SystemIntake.SendSystemIntakeGRBReviewRestartedAdmin(
		ctx,
		emailNotificationRecipients,
		intakeID,
		"Taco Administrator",
		"Supreme Taco Project",
		"Taco King",
		"STP",
		time.Date(2025, 6, 1, 0, 0, 0, 0, time.UTC),
		time.Date(2026, 6, 7, 0, 0, 0, 0, time.UTC),
		time.Date(2026, 6, 7, 0, 0, 0, 0, time.UTC),
	)
	noErr(err)

	err = client.SystemIntake.SendSystemIntakeGRBReviewRestarted(
		ctx,
		emailNotificationRecipients,
		intakeID,
		"Supreme Taco Project",
		"Taco King",
		"STP",
		time.Date(2025, 6, 1, 0, 0, 0, 0, time.UTC),
		time.Date(2026, 6, 7, 0, 0, 0, 0, time.UTC),
	)
	noErr(err)

	err = client.SystemIntake.SendSystemIntakeGRBReviewerReminder(
		ctx,
		email.SendSystemIntakeGRBReviewerReminderInput{
			Recipient:          requesterEmail,
			SystemIntakeID:     intakeID,
			RequestName:        "Reminder Email Test",
			RequesterName:      "Reminder Email - Name",
			RequesterComponent: "Offices of Hearings and Inquiries",
			StartDate:          time.Now().AddDate(0, 0, -1),
			EndDate:            time.Now().AddDate(0, 0, 3),
		},
	)
	noErr(err)

	err = client.SystemIntake.SendGRBReviewerInvitedToVoteEmail(ctx,
		email.SendGRBReviewerInvitedToVoteInput{
			Recipient:          requesterEmail,
			StartDate:          time.Now().AddDate(0, 0, -1),
			EndDate:            time.Now().AddDate(0, 0, 3),
			SystemIntakeID:     intakeID,
			ProjectName:        "Invited to Vote Project",
			RequesterName:      "Requester Inviting",
			RequesterComponent: "Center for Medicare",
		})
	noErr(err)

	err = client.SystemIntake.SendGRBReviewHalfwayThrough(ctx,
		email.SendGRBReviewHalfwayThroughInput{
			SystemIntakeID:     intakeID,
			ProjectTitle:       "Halfway through title",
			RequesterName:      "Requester Halfway",
			RequesterComponent: "Center for Medicare",
			StartDate:          time.Now().AddDate(0, 0, -1),
			EndDate:            time.Now().AddDate(0, 0, 5),
			NoObjectionVotes:   2,
			ObjectionVotes:     3,
			NotYetVoted:        1,
		})
	noErr(err)

	err = client.SystemIntake.SendGRBReviewPastDueNoQuorum(ctx,
		email.SendGRBReviewPastDueNoQuorumInput{
			SystemIntakeID:     intakeID,
			ProjectTitle:       "Past Due No Quorum title",
			RequesterName:      "Requester Past Due No Quorum",
			RequesterComponent: "Office of Legislation",
			StartDate:          time.Now().AddDate(0, 0, -1),
			EndDate:            time.Now().AddDate(0, 0, 5),
			NoObjectionVotes:   1,
			ObjectionVotes:     1,
			NotYetVoted:        1,
		})
	noErr(err)

	err = client.SystemIntake.SendSystemIntakeGRBReviewLastDay(
		ctx,
		email.SendSystemIntakeGRBReviewLastDayInput{
			Recipient:          requesterEmail,
			SystemIntakeID:     intakeID,
			ProjectName:        "Last Day Project",
			RequesterName:      "Last Day - Name",
			RequesterComponent: "Last Day - Component",
			GRBReviewStart:     time.Now().AddDate(0, 0, -1),
			GRBReviewDeadline:  time.Now(),
		})
	noErr(err)

	err = client.SystemIntake.SendGRBReviewCompleteQuorumMet(ctx,
		email.SendGRBReviewCompleteQuorumMetInput{
			SystemIntakeID:     intakeID,
			ProjectTitle:       "Review Complete Quorum Met title",
			RequesterName:      "Requester Review Complete Quorum Met",
			RequesterComponent: "Emergency Preparedness and Response Operations",
			StartDate:          time.Now().AddDate(0, 0, -10),
			EndDate:            time.Now().AddDate(0, 0, -1),
			NoObjectionVotes:   6,
			ObjectionVotes:     1,
			NotYetVoted:        3,
		})
	noErr(err)

	err = client.SystemIntake.SendGRBReviewDiscussionProjectTeamIndividualTaggedEmail(ctx,
		email.SendGRBReviewDiscussionProjectTeamIndividualTaggedInput{
			SystemIntakeID:    intakeID,
			UserName:          "Sally Ride",
			RequestName:       "Project Team title",
			Role:              "Center for Medicaid and CHIP Services",
			DiscussionContent: `<p>banana apple carburetor Let me look into it, ok? <span data-type="mention" tag-type="USER_ACCOUNT" class="mention" data-id-db="8dc55eda-be23-4822-aa69-a3f67de6078b">@Audrey Abrams</span>!</p>`,
			Recipient:         requesterEmail,
		})
	noErr(err)

	err = client.SystemIntake.SendGRBReviewVoteSubmitted(ctx,
		email.SendGRBReviewVoteSubmittedInput{
			Recipient:          requesterEmail,
			SystemIntakeID:     intakeID,
			ProjectTitle:       "Vote Submitted Title",
			RequesterName:      "Some Voter",
			RequesterComponent: "Center for Medicaid and CHIP Services",
			StartDate:          time.Now().AddDate(0, 0, -5),
			EndDate:            time.Now().AddDate(0, 0, 5),
			Vote:               models.SystemIntakeAsyncGRBVotingOptionNoObjection,
		})
	noErr(err)

	err = client.SystemIntake.SendGRBReviewVoteSubmittedAdmin(ctx,
		email.SendGRBReviewVoteSubmittedAdminInput{
			SystemIntakeID:     intakeID,
			GRBMemberName:      "Admin Vote Submitter",
			ProjectTitle:       "Admin Vote Submitted Title",
			RequesterName:      "Admin Vote Submitted Requester",
			RequesterComponent: "Center for Medicaid and CHIP Services",
			StartDate:          time.Now().AddDate(0, 0, -5),
			EndDate:            time.Now().AddDate(0, 0, 5),
			Vote:               models.SystemIntakeAsyncGRBVotingOptionNoObjection,
			AdditionalComments: "I agree",
			NoObjectionVotes:   3,
			ObjectionVotes:     4,
			NotYetVoted:        2,
		})
	noErr(err)

	err = client.SystemIntake.SendGRBReviewVoteChangedAdmin(ctx,
		email.SendGRBReviewVoteChangedAdminInput{
			SystemIntakeID:     intakeID,
			GRBMemberName:      "Admin Vote Changer",
			ProjectTitle:       "Admin Vote Changed Title",
			RequesterName:      "Admin Vote Change Requester",
			RequesterComponent: "Center for Medicaid and CHIP Services",
			StartDate:          time.Now().AddDate(0, 0, -5),
			EndDate:            time.Now().AddDate(0, 0, 5),
			Vote:               models.SystemIntakeAsyncGRBVotingOptionNoObjection,
			AdditionalComments: "I agree",
			NoObjectionVotes:   3,
			ObjectionVotes:     4,
			NotYetVoted:        2,
		})
	noErr(err)
}
