package models

// ITGovTaskListStatuses is a helper struct used by GQL to wrap a returned System Intake, so section statuses can be calculated onle when requested
type ITGovTaskListStatuses struct {
	ParentSystemIntake *SystemIntake
}

// IntakeFormStatus calculates the ITGovTaskListStatus for a system intake
func (i *ITGovTaskListStatuses) IntakeFormStatus() ITGovTaskListStatus {
	return ITGTLSReady
}

// FeedbackFromInitialReviewStatus calculates the ITGovTaskListStatus for the feedback section for the system intake task list
func (i *ITGovTaskListStatuses) FeedbackFromInitialReviewStatus() ITGovTaskListStatus {
	return ITGTLSReady
}

// DecisionAndNextStepsStatus calculates the ITGovTaskListStatus for the Decisions section for the system intake task list
func (i *ITGovTaskListStatuses) DecisionAndNextStepsStatus() ITGovTaskListStatus {
	return ITGTLSReady
}

// BizCaseDraftStatus calculates the ITGovTaskListStatus for the BizCaseDraft section for the system intake task list
func (i *ITGovTaskListStatuses) BizCaseDraftStatus() ITGovTaskListStatus {
	return ITGTLSReady
}

// GrtMeetingStatus calculates the ITGovTaskListStatus for the GrtMeeting section for the system intake task list
func (i *ITGovTaskListStatuses) GrtMeetingStatus() ITGovTaskListStatus {
	return ITGTLSReady
}

// BizCaseFinalStatus calculates the ITGovTaskListStatus for the BizCaseFinal section for the system intake task list
func (i *ITGovTaskListStatuses) BizCaseFinalStatus() ITGovTaskListStatus {
	return ITGTLSReady
}

// GrbMeetingStatus calculates the ITGovTaskListStatus for the GrbMeeting section for the system intake task list
func (i *ITGovTaskListStatuses) GrbMeetingStatus() ITGovTaskListStatus {
	return ITGTLSReady
}

// ITGovTaskListStatus represents the types of ITGovTaskListStatus types.
type ITGovTaskListStatus string

// These are the options for ITGovTaskListStatus
const (
	ITGTLSReady          ITGovTaskListStatus = "READY"
	ITGTLSCantStart      ITGovTaskListStatus = "CANT_START"
	ITGTLSInProgress     ITGovTaskListStatus = "IN_PROGRESS"
	ITGTLSInReview       ITGovTaskListStatus = "IN_REVIEW"
	ITGTLSEditsRequested ITGovTaskListStatus = "EDITS_REQUESTED"
	ITGTLSCompleted      ITGovTaskListStatus = "COMPLETED"
)
