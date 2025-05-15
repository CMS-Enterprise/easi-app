package models

// SystemIntakeStatusAdmin represents the types of statuses that a user can see in the admin view of a system Intake Request.
type SystemIntakeStatusAdmin string

// These are the options for SystemIntakeStatusAdmin
const (
	SISAInitialRequestFormInProgress SystemIntakeStatusAdmin = "INITIAL_REQUEST_FORM_IN_PROGRESS"
	SISAInitialRequestFormSubmitted  SystemIntakeStatusAdmin = "INITIAL_REQUEST_FORM_SUBMITTED"
	SISADraftBusinessCaseInProgress  SystemIntakeStatusAdmin = "DRAFT_BUSINESS_CASE_IN_PROGRESS"
	SISADraftBusinessCaseSubmitted   SystemIntakeStatusAdmin = "DRAFT_BUSINESS_CASE_SUBMITTED"
	SISAGrtMeetingReady              SystemIntakeStatusAdmin = "GRT_MEETING_READY"
	SISAGrtMeetingComplete           SystemIntakeStatusAdmin = "GRT_MEETING_COMPLETE"
	SISAGrbMeetingReady              SystemIntakeStatusAdmin = "GRB_MEETING_READY"
	SISAGrbMeetingComplete           SystemIntakeStatusAdmin = "GRB_MEETING_COMPLETE"
	SISAFinalBusinessCaseInProgress  SystemIntakeStatusAdmin = "FINAL_BUSINESS_CASE_IN_PROGRESS"
	SISAFinalBusinessCaseSubmitted   SystemIntakeStatusAdmin = "FINAL_BUSINESS_CASE_SUBMITTED"
	SISALcidIssued                   SystemIntakeStatusAdmin = "LCID_ISSUED"
	SISALcidExpired                  SystemIntakeStatusAdmin = "LCID_EXPIRED"
	SISALcidRetired                  SystemIntakeStatusAdmin = "LCID_RETIRED"
	SISALcidRetiringSoon             SystemIntakeStatusAdmin = "LCID_RETIRING_SOON"
	SISANotGovernance                SystemIntakeStatusAdmin = "NOT_GOVERNANCE"
	SISANotApproved                  SystemIntakeStatusAdmin = "NOT_APPROVED"
	SISAClosed                       SystemIntakeStatusAdmin = "CLOSED"
)
