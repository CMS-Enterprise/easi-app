package models

// SystemIntakeStatusRequester represents the (calculated) statuses that a requester view of a system Intake Request can show
type SystemIntakeStatusRequester string

// These are the options for SystemIntakeStatusRequester
const (
	SISRInitialRequestFormNew            SystemIntakeStatusRequester = "INITIAL_REQUEST_FORM_NEW"
	SISRInitialRequestFormInProgress     SystemIntakeStatusRequester = "INITIAL_REQUEST_FORM_IN_PROGRESS"
	SISRInitialRequestFormSubmitted      SystemIntakeStatusRequester = "INITIAL_REQUEST_FORM_SUBMITTED"
	SISRInitialRequestFormEditsRequested SystemIntakeStatusRequester = "INITIAL_REQUEST_FORM_EDITS_REQUESTED"
	SISRDraftBusinessCaseInProgress      SystemIntakeStatusRequester = "DRAFT_BUSINESS_CASE_IN_PROGRESS"
	SISRDraftBusinessCaseSubmitted       SystemIntakeStatusRequester = "DRAFT_BUSINESS_CASE_SUBMITTED"
	SISRDraftBusinessCaseEditsRequested  SystemIntakeStatusRequester = "DRAFT_BUSINESS_CASE_EDITS_REQUESTED"
	SISRGrtMeetingReady                  SystemIntakeStatusRequester = "GRT_MEETING_READY"
	SISRGrtMeetingAwaitingDecision       SystemIntakeStatusRequester = "GRT_MEETING_AWAITING_DECISION"
	SISRFinalBusinessCaseInProgress      SystemIntakeStatusRequester = "FINAL_BUSINESS_CASE_IN_PROGRESS"
	SISRFinalBusinessCaseSubmitted       SystemIntakeStatusRequester = "FINAL_BUSINESS_CASE_SUBMITTED"
	SISRFinalBusinessCaseEditsRequested  SystemIntakeStatusRequester = "FINAL_BUSINESS_CASE_EDITS_REQUESTED"

	SISRGrbMeetingReady            SystemIntakeStatusRequester = "GRB_MEETING_READY"
	SISRGrbMeetingAwaitingDecision SystemIntakeStatusRequester = "GRB_MEETING_AWAITING_DECISION"
	SISRGrbReviewInProgress        SystemIntakeStatusRequester = "GRB_REVIEW_IN_PROGRESS"
	SISRLcidIssued                 SystemIntakeStatusRequester = "LCID_ISSUED"
	SISRLcidExpired                SystemIntakeStatusRequester = "LCID_EXPIRED"
	SISRLcidRetired                SystemIntakeStatusRequester = "LCID_RETIRED"
	SISRNotGovernance              SystemIntakeStatusRequester = "NOT_GOVERNANCE"
	SISRNotApproved                SystemIntakeStatusRequester = "NOT_APPROVED"
	SISRClosed                     SystemIntakeStatusRequester = "CLOSED"
)
