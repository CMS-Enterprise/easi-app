package email

import (
	"context"
	"fmt"
	"html/template"
	"io"
	"net/url"
	"path"
	"strings"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

// Config holds EASi application specific configs for SES
type Config struct {
	GRTEmail                    models.EmailAddress
	ITInvestmentEmail           models.EmailAddress
	EASIHelpEmail               models.EmailAddress
	TRBEmail                    models.EmailAddress
	CEDARTeamEmail              models.EmailAddress
	OITFeedbackChannelSlackLink string
	URLHost                     string
	URLScheme                   string
	TemplateDirectory           string
}

// templateCaller is an interface to helping with testing template dependencies
type templateCaller interface {
	Execute(wr io.Writer, data interface{}) error
}

// templates stores typed templates
// since the template.Template uses string access
type templates struct {
	intakeReviewTemplate                            templateCaller
	namedRequestWithdrawTemplate                    templateCaller
	unnamedRequestWithdrawTemplate                  templateCaller
	lcidExpirationAlertTemplate                     templateCaller
	rejectRequestTemplate                           templateCaller
	newDocumentTemplate                             templateCaller
	helpSendFeedback                                templateCaller
	helpCantFindSomething                           templateCaller
	helpReportAProblem                              templateCaller
	trbRequestConsultMeeting                        templateCaller
	trbRequestTRBLeadAdmin                          templateCaller
	trbRequestTRBLeadAssignee                       templateCaller
	trbGuidanceLetterInternalReview                 templateCaller
	trbFormSubmittedAdmin                           templateCaller
	trbFormSubmittedRequester                       templateCaller
	trbAttendeeAdded                                templateCaller
	trbReadyForConsult                              templateCaller
	trbEditsNeededOnForm                            templateCaller
	trbRequestReopened                              templateCaller
	trbGuidanceLetterSubmitted                      templateCaller
	trbRequestClosed                                templateCaller
	cedarRolesChanged                               templateCaller
	cedarYouHaveBeenAdded                           templateCaller
	cedarNewTeamMember                              templateCaller
	systemIntakeAdminUploadDocTemplate              templateCaller
	systemIntakeGRBReviewDeadlineExtendedTemplate   templateCaller
	systemIntakeGRBReviewRestartedTemplate          templateCaller
	systemIntakeGRBReviewRestartedAdminTemplate     templateCaller
	systemIntakeGRBReviewTimeAddedTemplate          templateCaller
	systemIntakeSubmitInitialFormRequesterTemplate  templateCaller
	systemIntakeSubmitInitialFormReviewerTemplate   templateCaller
	systemIntakeSubmitBusinessCaseRequesterTemplate templateCaller
	systemIntakeSubmitBusinessCaseReviewerTemplate  templateCaller
	systemIntakeRequestEdits                        templateCaller
	systemIntakeCloseRequest                        templateCaller
	systemIntakeReopenRequest                       templateCaller
	systemIntakePresentationDeckUploadReminder      templateCaller
	systemIntakeProgressToNewStep                   templateCaller
	systemIntakeNotITGovRequest                     templateCaller
	systemIntakeNotApproved                         templateCaller
	systemIntakeIssueLCID                           templateCaller
	systemIntakeConfirmLCID                         templateCaller
	systemIntakeRetireLCID                          templateCaller
	systemIntakeUnretireLCID                        templateCaller
	systemIntakeExpireLCID                          templateCaller
	systemIntakeUpdateLCID                          templateCaller
	systemIntakeChangeLCIDRetirementDate            templateCaller
	systemIntakeCreateGRBReviewer                   templateCaller
	grbReviewDiscussionReply                        templateCaller
	grbReviewDiscussionReplyRequester               templateCaller
	grbReviewDiscussionIndividualTagged             templateCaller
	grbReviewDiscussionGroupTagged                  templateCaller
	grbReviewDiscussionProjectTeamIndividualTagged  templateCaller
	grbReviewEnded                                  templateCaller
	grbReviewLastDay                                templateCaller
	grbReviewPresentationLinksUpdated               templateCaller
	grbReviewReminder                               templateCaller
	grbReviewerInvitedToVote                        templateCaller
	grbReviewHalfwayThrough                         templateCaller
	grbReviewPastDueNoQuorum                        templateCaller
	grbReviewCompleteQuorumMet                      templateCaller
}

// sender is an interface for swapping out email provider implementations
type sender interface {
	Send(ctx context.Context, email Email) error
}

// Client is an EASi SES client wrapper
type Client struct {
	config       Config
	templates    templates
	sender       sender
	SystemIntake *systemIntakeEmails
}

// templateError is just a helper method for formatting errors
func templateError(name string) error {
	return fmt.Errorf("failed to get template: %s", name)
}

// NewClient returns a new email client for EASi
func NewClient(config Config, sender sender) (Client, error) {
	rawTemplates, err := template.ParseGlob(path.Join(config.TemplateDirectory, "*.gohtml"))
	if err != nil {
		return Client{}, err
	}
	appTemplates := templates{}

	intakeReviewTemplateName := "system_intake_review.gohtml"
	intakeReviewTemplate := rawTemplates.Lookup(intakeReviewTemplateName)
	if intakeReviewTemplate == nil {
		return Client{}, templateError(intakeReviewTemplateName)
	}
	appTemplates.intakeReviewTemplate = intakeReviewTemplate

	namedRequestWithdrawTemplateName := "named_request_withdrawal.gohtml"
	namedRequestWithdrawTemplate := rawTemplates.Lookup(namedRequestWithdrawTemplateName)
	if namedRequestWithdrawTemplate == nil {
		return Client{}, templateError(namedRequestWithdrawTemplateName)
	}
	appTemplates.namedRequestWithdrawTemplate = namedRequestWithdrawTemplate

	unnamedRequestWithdrawTemplateName := "unnamed_request_withdrawal.gohtml"
	unnamedRequestWithdrawTemplate := rawTemplates.Lookup(unnamedRequestWithdrawTemplateName)
	if unnamedRequestWithdrawTemplate == nil {
		return Client{}, templateError(unnamedRequestWithdrawTemplateName)
	}
	appTemplates.unnamedRequestWithdrawTemplate = unnamedRequestWithdrawTemplate

	lcidExpirationAlertTemplateName := "system_intake_lcid_expiration_alert.gohtml"
	lcidExpirationAlertTemplate := rawTemplates.Lookup(lcidExpirationAlertTemplateName)
	if lcidExpirationAlertTemplate == nil {
		return Client{}, templateError(lcidExpirationAlertTemplateName)
	}
	appTemplates.lcidExpirationAlertTemplate = lcidExpirationAlertTemplate

	rejectRequestTemplateName := "reject_request.gohtml"
	rejectRequestTemplate := rawTemplates.Lookup(rejectRequestTemplateName)
	if rejectRequestTemplate == nil {
		return Client{}, templateError(rejectRequestTemplateName)
	}
	appTemplates.rejectRequestTemplate = rejectRequestTemplate

	newDocumentTemplateName := "new_document.gohtml"
	newDocumentTemplate := rawTemplates.Lookup(newDocumentTemplateName)
	if newDocumentTemplate == nil {
		return Client{}, templateError(newDocumentTemplateName)
	}
	appTemplates.newDocumentTemplate = newDocumentTemplate

	helpSendFeedbackTemplateName := "help_send_feedback.gohtml"
	helpSendFeedbackTemplate := rawTemplates.Lookup(helpSendFeedbackTemplateName)
	if helpSendFeedbackTemplate == nil {
		return Client{}, templateError(helpSendFeedbackTemplateName)
	}
	appTemplates.helpSendFeedback = helpSendFeedbackTemplate

	helpCantFindSomethingTemplateName := "help_cant_find_something.gohtml"
	helpCantFindSomethingTemplate := rawTemplates.Lookup(helpCantFindSomethingTemplateName)
	if helpCantFindSomethingTemplate == nil {
		return Client{}, templateError(helpCantFindSomethingTemplateName)
	}
	appTemplates.helpCantFindSomething = helpCantFindSomethingTemplate

	helpReportAProblemTemplateName := "help_report_a_problem.gohtml"
	helpReportAProblemTemplate := rawTemplates.Lookup(helpReportAProblemTemplateName)
	if helpReportAProblemTemplate == nil {
		return Client{}, templateError(helpReportAProblemTemplateName)
	}
	appTemplates.helpReportAProblem = helpReportAProblemTemplate

	trbRequestConsultMeetingTemplateName := "trb_request_consult_meeting.gohtml"
	trbRequestConsultMeetingTemplate := rawTemplates.Lookup(trbRequestConsultMeetingTemplateName)
	if trbRequestConsultMeetingTemplate == nil {
		return Client{}, templateError(trbRequestConsultMeetingTemplateName)
	}
	appTemplates.trbRequestConsultMeeting = trbRequestConsultMeetingTemplate

	trbRequestTRBLeadAdminTemplateName := "trb_request_trb_lead_admin.gohtml"
	trbRequestTRBLeadAdminTemplate := rawTemplates.Lookup(trbRequestTRBLeadAdminTemplateName)
	if trbRequestTRBLeadAdminTemplate == nil {
		return Client{}, templateError(trbRequestTRBLeadAdminTemplateName)
	}
	appTemplates.trbRequestTRBLeadAdmin = trbRequestTRBLeadAdminTemplate

	trbRequestTRBLeadAssigneeTemplateName := "trb_request_trb_lead_assignee.gohtml"
	trbRequestTRBLeadAssigneeTemplate := rawTemplates.Lookup(trbRequestTRBLeadAssigneeTemplateName)
	if trbRequestTRBLeadAssigneeTemplate == nil {
		return Client{}, templateError(trbRequestTRBLeadAssigneeTemplateName)
	}
	appTemplates.trbRequestTRBLeadAssignee = trbRequestTRBLeadAssigneeTemplate

	trbGuidanceLetterInternalReviewTemplateName := "trb_guidance_letter_internal_review.gohtml"
	trbGuidanceLetterInternalReviewTemplate := rawTemplates.Lookup(trbGuidanceLetterInternalReviewTemplateName)
	if trbGuidanceLetterInternalReviewTemplate == nil {
		return Client{}, templateError(trbGuidanceLetterInternalReviewTemplateName)
	}
	appTemplates.trbGuidanceLetterInternalReview = trbGuidanceLetterInternalReviewTemplate

	trbFormSubmittedAdminTemplateName := "trb_request_form_submission_admin.gohtml"
	trbFormSubmittedAdminTemplate := rawTemplates.Lookup(trbFormSubmittedAdminTemplateName)
	if trbFormSubmittedAdminTemplate == nil {
		return Client{}, templateError(trbFormSubmittedAdminTemplateName)
	}
	appTemplates.trbFormSubmittedAdmin = trbFormSubmittedAdminTemplate

	trbFormSubmittedRequesterTemplateName := "trb_request_form_submission_requester.gohtml"
	trbFormSubmittedRequesterTemplate := rawTemplates.Lookup(trbFormSubmittedRequesterTemplateName)
	if trbFormSubmittedRequesterTemplate == nil {
		return Client{}, templateError(trbFormSubmittedRequesterTemplateName)
	}
	appTemplates.trbFormSubmittedRequester = trbFormSubmittedRequesterTemplate

	trbAttendeeAddedTemplateName := "trb_attendee_added.gohtml"
	trbAttendeeAddedTemplate := rawTemplates.Lookup(trbAttendeeAddedTemplateName)
	if trbAttendeeAddedTemplate == nil {
		return Client{}, templateError(trbAttendeeAddedTemplateName)
	}
	appTemplates.trbAttendeeAdded = trbAttendeeAddedTemplate

	trbReadyForConsultTemplateName := "trb_ready_for_consult.gohtml"
	trbReadyForConsultTemplate := rawTemplates.Lookup(trbReadyForConsultTemplateName)
	if trbReadyForConsultTemplate == nil {
		return Client{}, templateError(trbReadyForConsultTemplateName)
	}
	appTemplates.trbReadyForConsult = trbReadyForConsultTemplate

	trbGuidanceLetterSubmittedTemplateName := "trb_guidance_letter_submitted.gohtml"
	trbGuidanceLetterSubmittedTemplate := rawTemplates.Lookup(trbGuidanceLetterSubmittedTemplateName)
	if trbGuidanceLetterSubmittedTemplate == nil {
		return Client{}, templateError(trbGuidanceLetterSubmittedTemplateName)
	}
	appTemplates.trbGuidanceLetterSubmitted = trbGuidanceLetterSubmittedTemplate

	trbEditsNeededOnFormTemplateName := "trb_edits_needed_on_form.gohtml"
	trbEditsNeededOnFormTemplate := rawTemplates.Lookup(trbEditsNeededOnFormTemplateName)
	if trbEditsNeededOnFormTemplate == nil {
		return Client{}, templateError(trbEditsNeededOnFormTemplateName)
	}
	appTemplates.trbEditsNeededOnForm = trbEditsNeededOnFormTemplate

	trbRequestClosedTemplateName := "trb_request_closed.gohtml"
	trbRequestClosedTemplate := rawTemplates.Lookup(trbRequestClosedTemplateName)
	if trbRequestClosedTemplate == nil {
		return Client{}, templateError(trbRequestClosedTemplateName)
	}
	appTemplates.trbRequestClosed = trbRequestClosedTemplate

	trbRequestReopenedTemplateName := "trb_request_reopened.gohtml"
	trbRequestReopenedTemplate := rawTemplates.Lookup(trbRequestReopenedTemplateName)
	if trbRequestReopenedTemplate == nil {
		return Client{}, templateError(trbRequestReopenedTemplateName)
	}
	appTemplates.trbRequestReopened = trbRequestReopenedTemplate

	cedarRolesChangedTemplateName := "cedar_roles_changed.gohtml"
	cedarRolesChanged := rawTemplates.Lookup(cedarRolesChangedTemplateName)
	if cedarRolesChanged == nil {
		return Client{}, templateError(cedarRolesChangedTemplateName)
	}
	appTemplates.cedarRolesChanged = cedarRolesChanged

	cedarYouHaveBeenAddedTemplateName := "cedar_you_have_been_added.gohtml"
	cedarYouHaveBeenAdded := rawTemplates.Lookup(cedarYouHaveBeenAddedTemplateName)
	if cedarYouHaveBeenAdded == nil {
		return Client{}, templateError(cedarYouHaveBeenAddedTemplateName)
	}
	appTemplates.cedarYouHaveBeenAdded = cedarYouHaveBeenAdded

	cedarNewTeamMemberTemplateName := "cedar_new_team_member.gohtml"
	cedarNewTeamMember := rawTemplates.Lookup(cedarNewTeamMemberTemplateName)
	if cedarNewTeamMember == nil {
		return Client{}, templateError(cedarNewTeamMemberTemplateName)
	}
	appTemplates.cedarNewTeamMember = cedarNewTeamMember

	sisAdminUploadDocTemplateName := "system_intake_admin_upload_doc.gohtml"
	sisAdminUploadDocTemplate := rawTemplates.Lookup(sisAdminUploadDocTemplateName)
	if sisAdminUploadDocTemplate == nil {
		return Client{}, templateError(sisAdminUploadDocTemplateName)
	}
	appTemplates.systemIntakeAdminUploadDocTemplate = sisAdminUploadDocTemplate

	sisGRBReviewDeadlineExtendedTemplateName := "system_intake_grb_review_deadline_extended.gohtml"
	sisGRBReviewDeadlineExtendedTemplate := rawTemplates.Lookup(sisGRBReviewDeadlineExtendedTemplateName)
	if sisGRBReviewDeadlineExtendedTemplate == nil {
		return Client{}, templateError(sisGRBReviewDeadlineExtendedTemplateName)
	}
	appTemplates.systemIntakeGRBReviewDeadlineExtendedTemplate = sisGRBReviewDeadlineExtendedTemplate

	sisGRBReviewRestartedTemplateName := "system_intake_grb_review_restarted.gohtml"
	sisGRBReviewRestartedTemplate := rawTemplates.Lookup(sisGRBReviewRestartedTemplateName)
	if sisGRBReviewRestartedTemplate == nil {
		return Client{}, templateError(sisGRBReviewRestartedTemplateName)
	}
	appTemplates.systemIntakeGRBReviewRestartedTemplate = sisGRBReviewRestartedTemplate

	sisGRBReviewRestartedAdminTemplateName := "system_intake_grb_review_restarted_admin.gohtml"
	sisGRBReviewRestartedAdminTemplate := rawTemplates.Lookup(sisGRBReviewRestartedAdminTemplateName)
	if sisGRBReviewRestartedAdminTemplate == nil {
		return Client{}, templateError(sisGRBReviewRestartedAdminTemplateName)
	}
	appTemplates.systemIntakeGRBReviewRestartedAdminTemplate = sisGRBReviewRestartedAdminTemplate

	sisGRBReviewTimeAddedTemplateName := "system_intake_grb_review_time_added.gohtml"
	sisGRBReviewTimeAddedTemplate := rawTemplates.Lookup(sisGRBReviewTimeAddedTemplateName)
	if sisGRBReviewTimeAddedTemplate == nil {
		return Client{}, templateError(sisGRBReviewTimeAddedTemplateName)
	}
	appTemplates.systemIntakeGRBReviewTimeAddedTemplate = sisGRBReviewTimeAddedTemplate

	sisInitialFormRequesterTemplateName := "system_intake_submit_initial_form_requester.gohtml"
	sisInitialFormRequesterTemplate := rawTemplates.Lookup(sisInitialFormRequesterTemplateName)
	if sisInitialFormRequesterTemplate == nil {
		return Client{}, templateError(sisInitialFormRequesterTemplateName)
	}
	appTemplates.systemIntakeSubmitInitialFormRequesterTemplate = sisInitialFormRequesterTemplate

	sisInitialFormReviewerTemplateName := "system_intake_submit_initial_form_reviewer.gohtml"
	sisInitialFormReviewerTemplate := rawTemplates.Lookup(sisInitialFormReviewerTemplateName)
	if sisInitialFormReviewerTemplate == nil {
		return Client{}, templateError(sisInitialFormReviewerTemplateName)
	}
	appTemplates.systemIntakeSubmitInitialFormReviewerTemplate = sisInitialFormReviewerTemplate

	sisBusinessCaseRequesterTemplateName := "system_intake_submit_business_case_requester.gohtml"
	sisBusinessCaseRequesterTemplate := rawTemplates.Lookup(sisBusinessCaseRequesterTemplateName)
	if sisBusinessCaseRequesterTemplate == nil {
		return Client{}, templateError(sisBusinessCaseRequesterTemplateName)
	}
	appTemplates.systemIntakeSubmitBusinessCaseRequesterTemplate = sisBusinessCaseRequesterTemplate

	sisBusinessCaseReviewerTemplateName := "system_intake_submit_business_case_reviewer.gohtml"
	sisBusinessCaseReviewerTemplate := rawTemplates.Lookup(sisBusinessCaseReviewerTemplateName)
	if sisBusinessCaseReviewerTemplate == nil {
		return Client{}, templateError(sisBusinessCaseReviewerTemplateName)
	}
	appTemplates.systemIntakeSubmitBusinessCaseReviewerTemplate = sisBusinessCaseReviewerTemplate

	systemIntakeRequestEditsTemplateName := "system_intake_request_edits_on_form.gohtml"
	systemIntakeRequestEdits := rawTemplates.Lookup(systemIntakeRequestEditsTemplateName)
	if systemIntakeRequestEdits == nil {
		return Client{}, templateError(systemIntakeRequestEditsTemplateName)
	}
	appTemplates.systemIntakeRequestEdits = systemIntakeRequestEdits

	systemIntakeCloseRequestTemplateName := "system_intake_close_request.gohtml"
	systemIntakeCloseRequest := rawTemplates.Lookup(systemIntakeCloseRequestTemplateName)
	if systemIntakeCloseRequest == nil {
		return Client{}, templateError(systemIntakeCloseRequestTemplateName)
	}
	appTemplates.systemIntakeCloseRequest = systemIntakeCloseRequest

	systemIntakeReopenRequestTemplateName := "system_intake_reopen_request.gohtml"
	systemIntakeReopenRequest := rawTemplates.Lookup(systemIntakeReopenRequestTemplateName)
	if systemIntakeReopenRequest == nil {
		return Client{}, templateError(systemIntakeReopenRequestTemplateName)
	}
	appTemplates.systemIntakeReopenRequest = systemIntakeReopenRequest

	systemIntakePresentationDeckUploadReminderTemplateName := "system_intake_presentation_deck_upload_reminder.gohtml"
	systemIntakePresentationDeckUploadReminder := rawTemplates.Lookup(systemIntakePresentationDeckUploadReminderTemplateName)
	if systemIntakePresentationDeckUploadReminder == nil {
		return Client{}, templateError(systemIntakePresentationDeckUploadReminderTemplateName)
	}
	appTemplates.systemIntakePresentationDeckUploadReminder = systemIntakePresentationDeckUploadReminder

	systemIntakeProgressToNewStepTemplateName := "system_intake_progress_to_new_step.gohtml"
	systemIntakeProgressToNewStep := rawTemplates.Lookup(systemIntakeProgressToNewStepTemplateName)
	if systemIntakeProgressToNewStep == nil {
		return Client{}, templateError(systemIntakeProgressToNewStepTemplateName)
	}
	appTemplates.systemIntakeProgressToNewStep = systemIntakeProgressToNewStep

	systemIntakeNotITGovRequestTemplateName := "system_intake_not_it_gov_request.gohtml"
	systemIntakeNotITGovRequest := rawTemplates.Lookup(systemIntakeNotITGovRequestTemplateName)
	if systemIntakeNotITGovRequest == nil {
		return Client{}, templateError(systemIntakeNotITGovRequestTemplateName)
	}
	appTemplates.systemIntakeNotITGovRequest = systemIntakeNotITGovRequest

	systemIntakeNotApprovedTemplateName := "system_intake_not_approved.gohtml"
	systemIntakeNotApproved := rawTemplates.Lookup(systemIntakeNotApprovedTemplateName)
	if systemIntakeNotApproved == nil {
		return Client{}, templateError(systemIntakeNotApprovedTemplateName)
	}
	appTemplates.systemIntakeNotApproved = systemIntakeNotApproved

	systemIntakeIssueLCIDTemplateName := "system_intake_issue_lcid.gohtml"
	systemIntakeIssueLCID := rawTemplates.Lookup(systemIntakeIssueLCIDTemplateName)
	if systemIntakeIssueLCID == nil {
		return Client{}, templateError(systemIntakeIssueLCIDTemplateName)
	}
	appTemplates.systemIntakeIssueLCID = systemIntakeIssueLCID

	systemIntakeConfirmLCIDTemplateName := "system_intake_confirm_lcid.gohtml"
	systemIntakeConfirmLCID := rawTemplates.Lookup(systemIntakeConfirmLCIDTemplateName)
	if systemIntakeConfirmLCID == nil {
		return Client{}, templateError(systemIntakeConfirmLCIDTemplateName)
	}
	appTemplates.systemIntakeConfirmLCID = systemIntakeConfirmLCID

	systemIntakeRetireLCIDTemplateName := "system_intake_retire_lcid.gohtml"
	systemIntakeRetireLCID := rawTemplates.Lookup(systemIntakeRetireLCIDTemplateName)
	if systemIntakeRetireLCID == nil {
		return Client{}, templateError(systemIntakeRetireLCIDTemplateName)
	}
	appTemplates.systemIntakeRetireLCID = systemIntakeRetireLCID

	systemIntakeUnretireLCIDTemplateName := "system_intake_unretire_lcid.gohtml"
	systemIntakeUnretireLCID := rawTemplates.Lookup(systemIntakeUnretireLCIDTemplateName)
	if systemIntakeUnretireLCID == nil {
		return Client{}, templateError(systemIntakeUnretireLCIDTemplateName)
	}
	appTemplates.systemIntakeUnretireLCID = systemIntakeUnretireLCID

	systemIntakeExpireLCIDTemplateName := "system_intake_expire_lcid.gohtml"
	systemIntakeExpireLCID := rawTemplates.Lookup(systemIntakeExpireLCIDTemplateName)
	if systemIntakeExpireLCID == nil {
		return Client{}, templateError(systemIntakeExpireLCIDTemplateName)
	}
	appTemplates.systemIntakeExpireLCID = systemIntakeExpireLCID

	systemIntakeUpdateLCIDTemplateName := "system_intake_update_lcid.gohtml"
	systemIntakeUpdateLCID := rawTemplates.Lookup(systemIntakeUpdateLCIDTemplateName)
	if systemIntakeUpdateLCID == nil {
		return Client{}, templateError(systemIntakeUpdateLCIDTemplateName)
	}
	appTemplates.systemIntakeUpdateLCID = systemIntakeUpdateLCID

	systemIntakeChangeLCIDRetirementDateTemplateName := "system_intake_change_lcid_retirement_date.gohtml"
	systemIntakeChangeLCIDRetirementDate := rawTemplates.Lookup(systemIntakeChangeLCIDRetirementDateTemplateName)
	if systemIntakeChangeLCIDRetirementDate == nil {
		return Client{}, templateError(systemIntakeChangeLCIDRetirementDateTemplateName)
	}
	appTemplates.systemIntakeChangeLCIDRetirementDate = systemIntakeChangeLCIDRetirementDate

	systemIntakeCreateGRBReviewerTemplateName := "system_intake_create_grb_reviewer.gohtml"
	systemIntakeCreateGRBReviewer := rawTemplates.Lookup(systemIntakeCreateGRBReviewerTemplateName)
	if systemIntakeCreateGRBReviewer == nil {
		return Client{}, templateError(systemIntakeCreateGRBReviewerTemplateName)
	}
	appTemplates.systemIntakeCreateGRBReviewer = systemIntakeCreateGRBReviewer

	grbReviewDiscussionReplyTemplateName := "grb_review_discussion_reply.gohtml"
	grbReviewDiscussionReply := rawTemplates.Lookup(grbReviewDiscussionReplyTemplateName)
	if grbReviewDiscussionReply == nil {
		return Client{}, templateError(grbReviewDiscussionReplyTemplateName)
	}
	appTemplates.grbReviewDiscussionReply = grbReviewDiscussionReply

	grbReviewDiscussionReplyRequesterName := "grb_review_discussion_reply_requester.gohtml"
	tpl := rawTemplates.Lookup(grbReviewDiscussionReplyRequesterName)
	if tpl == nil {
		return Client{}, templateError(grbReviewDiscussionReplyRequesterName)
	}
	appTemplates.grbReviewDiscussionReplyRequester = tpl

	grbReviewDiscussionIndividualTaggedTemplateName := "grb_review_discussion_individual_tagged.gohtml"
	grbReviewDiscussionIndividualTagged := rawTemplates.Lookup(grbReviewDiscussionIndividualTaggedTemplateName)
	if grbReviewDiscussionIndividualTagged == nil {
		return Client{}, templateError(grbReviewDiscussionIndividualTaggedTemplateName)
	}
	appTemplates.grbReviewDiscussionIndividualTagged = grbReviewDiscussionIndividualTagged

	grbReviewDiscussionGroupTaggedTemplateName := "grb_review_discussion_group_tagged.gohtml"
	grbReviewDiscussionGroupTagged := rawTemplates.Lookup(grbReviewDiscussionGroupTaggedTemplateName)
	if grbReviewDiscussionGroupTagged == nil {
		return Client{}, templateError(grbReviewDiscussionGroupTaggedTemplateName)
	}
	appTemplates.grbReviewDiscussionGroupTagged = grbReviewDiscussionGroupTagged

	grbReviewDiscussionProjectTeamIndividualTaggedTemplateName := "grb_review_discussion_project_team_individual_tagged.gohtml"
	grbReviewDiscussionProjectTeamIndividualTagged := rawTemplates.Lookup(grbReviewDiscussionProjectTeamIndividualTaggedTemplateName)
	if grbReviewDiscussionProjectTeamIndividualTagged == nil {
		return Client{}, templateError(grbReviewDiscussionProjectTeamIndividualTaggedTemplateName)
	}
	appTemplates.grbReviewDiscussionProjectTeamIndividualTagged = grbReviewDiscussionProjectTeamIndividualTagged

	grbReviewEndedTemplateName := "system_intake_grb_review_voting_ended.gohtml"
	grbReviewEndedTemplate := rawTemplates.Lookup(grbReviewEndedTemplateName)
	if grbReviewEndedTemplate == nil {
		return Client{}, templateError(grbReviewEndedTemplateName)
	}
	appTemplates.grbReviewEnded = grbReviewEndedTemplate

	grbReviewLastDayTemplateName := "system_intake_grb_review_last_day_reminder.gohtml"
	grbReviewLastDayTemplate := rawTemplates.Lookup(grbReviewLastDayTemplateName)
	if grbReviewLastDayTemplate == nil {
		return Client{}, templateError(grbReviewLastDayTemplateName)
	}
	appTemplates.grbReviewLastDay = grbReviewLastDayTemplate

	grbReviewPresentationLinksUpdatedTemplateName := "grb_review_presentation_links_updated.gohtml"
	grbReviewPresentationLinksUpdated := rawTemplates.Lookup(grbReviewPresentationLinksUpdatedTemplateName)
	if grbReviewPresentationLinksUpdated == nil {
		return Client{}, templateError(grbReviewPresentationLinksUpdatedTemplateName)
	}
	appTemplates.grbReviewPresentationLinksUpdated = grbReviewPresentationLinksUpdated

	grbReviewReminderTemplateName := "system_intake_grb_reviewer_reminder.gohtml"
	grbReviewReminder := rawTemplates.Lookup(grbReviewReminderTemplateName)
	if grbReviewReminder == nil {
		return Client{}, templateError(grbReviewReminderTemplateName)
	}
	appTemplates.grbReviewReminder = grbReviewReminder

	grbReviewerInvitedToVoteTemplateName := "grb_reviewer_invited_to_vote.gohtml"
	grbReviewerInvitedToVote := rawTemplates.Lookup(grbReviewerInvitedToVoteTemplateName)
	if grbReviewerInvitedToVote == nil {
		return Client{}, templateError(grbReviewerInvitedToVoteTemplateName)
	}
	appTemplates.grbReviewerInvitedToVote = grbReviewerInvitedToVote

	grbReviewHalfwayThroughTemplateName := "grb_review_halfway_done.gohtml"
	grbReviewHalfwayThrough := rawTemplates.Lookup(grbReviewHalfwayThroughTemplateName)
	if grbReviewHalfwayThrough == nil {
		return Client{}, templateError(grbReviewHalfwayThroughTemplateName)
	}
	appTemplates.grbReviewHalfwayThrough = grbReviewHalfwayThrough

	grbReviewPastDueNoQuorumTemplateName := "grb_review_past_due_no_quorum.gohtml"
	grbReviewPastDueNoQuorum := rawTemplates.Lookup(grbReviewPastDueNoQuorumTemplateName)
	if grbReviewPastDueNoQuorum == nil {
		return Client{}, templateError(grbReviewPastDueNoQuorumTemplateName)
	}
	appTemplates.grbReviewPastDueNoQuorum = grbReviewPastDueNoQuorum

	grbReviewCompleteQuorumMetTemplateName := "grb_review_complete_quorum_met.gohtml"
	grbReviewCompleteQuorumMet := rawTemplates.Lookup(grbReviewCompleteQuorumMetTemplateName)
	if grbReviewCompleteQuorumMet == nil {
		return Client{}, templateError(grbReviewCompleteQuorumMetTemplateName)
	}
	appTemplates.grbReviewCompleteQuorumMet = grbReviewCompleteQuorumMet

	client := Client{
		config:    config,
		templates: appTemplates,
		sender:    sender,
	}
	intakeEmails := systemIntakeEmails{
		client: &client,
	}
	client.SystemIntake = &intakeEmails
	return client, nil
}

// urlFromPath uses the client's URL configs to format one with a specific path
func (c Client) urlFromPath(path string) string {
	u := url.URL{
		Scheme: c.config.URLScheme,
		Host:   c.config.URLHost,
		Path:   path,
	}

	return u.String()
}

// urlFromPathAndQuery uses the client's URL configs to format one with a specific path and appended query
func (c Client) urlFromPathAndQuery(path string, query string) string {
	u := url.URL{
		Scheme:   c.config.URLScheme,
		Host:     c.config.URLHost,
		Path:     path,
		RawQuery: query,
	}

	return u.String()
}

// SendTestEmail sends an email to a no-reply address
func (c Client) SendTestEmail(ctx context.Context) error {
	testToAddress := models.NewEmailAddress("success@simulator.amazonses.com")
	return c.sender.Send(
		ctx,
		NewEmail().
			WithToAddresses([]models.EmailAddress{testToAddress}).
			WithSubject("test").
			WithBody("test"),
	)
}

// helper method to get a list of all addresses from a models.EmailNotificationRecipients value
func (c Client) listAllRecipients(recipients models.EmailNotificationRecipients) []models.EmailAddress {
	allRecipients := recipients.RegularRecipientEmails
	if recipients.ShouldNotifyITGovernance {
		allRecipients = append(allRecipients, c.config.GRTEmail)
	}

	if recipients.ShouldNotifyITInvestment {
		allRecipients = append(allRecipients, c.config.ITInvestmentEmail)
	}

	return allRecipients
}

// HumanizeSnakeCase replaces underscores with spaces and converts an uppercased word to a capitalized one
func HumanizeSnakeCase(s string) string {
	if s == "" {
		return ""
	}
	upperSlice := strings.Split(s, "_")
	var wordSlice []string
	for _, word := range upperSlice {
		capitalFirstLetter := strings.ToUpper(string(word[0]))
		restOfWord := strings.ToLower(word[1:])
		capitalizedWord := capitalFirstLetter + restOfWord
		wordSlice = append(wordSlice, capitalizedWord)
	}
	return strings.Join(wordSlice, " ")
}

// Email consists of the basic components of an email
// note: only one of `To`/`CC`/`BCC` needed to send an email
// ex: you can send to only BCC recipients if desired
type Email struct {
	ToAddresses  []models.EmailAddress
	CcAddresses  []models.EmailAddress
	BccAddresses []models.EmailAddress
	Subject      string
	Body         string
}

// NewEmail returns an empty email object
func NewEmail() Email {
	return Email{}
}

// WithToAddresses sets the `To` field on an email
func (e Email) WithToAddresses(toAddresses []models.EmailAddress) Email {
	e.ToAddresses = toAddresses
	return e
}

// WithCCAddresses sets the `CC` field on an email
func (e Email) WithCCAddresses(ccAddresses []models.EmailAddress) Email {
	e.CcAddresses = ccAddresses
	return e
}

// WithBCCAddresses sets the `BCC` field on an email
func (e Email) WithBCCAddresses(bccAddresses []models.EmailAddress) Email {
	e.BccAddresses = bccAddresses
	return e
}

// WithSubject sets the Subject on an email
func (e Email) WithSubject(subject string) Email {
	e.Subject = subject
	return e
}

// WithBody sets the content (body) of an email
func (e Email) WithBody(body string) Email {
	e.Body = body
	return e
}
