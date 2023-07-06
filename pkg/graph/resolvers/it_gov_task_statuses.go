package resolvers

import "github.com/cmsgov/easi-app/pkg/models"

//NOTE these functions are deterministic. Ideally when implementing we should separate the logic which obtains any database information from the methods that calculate the status

// IntakeFormStatus calculates the ITGovTaskListStatus of a system intake for the requester view
func IntakeFormStatus(intake *models.SystemIntake) models.ITGovIntakeFormStatus {
	return models.ITGISReady
}

// FeedbackFromInitialReviewStatus calculates the ITGovTaskListStatus for the feedback section of a system intake task list  for the requester view
func FeedbackFromInitialReviewStatus(intake *models.SystemIntake) models.ITGovFeedbackStatus {
	return models.ITGFBSCantStart
}

// BizCaseDraftStatus calculates the ITGovDraftBusinessCaseStatus for the BizCaseDraft section for the system intake task list for the requester view
func BizCaseDraftStatus(intake *models.SystemIntake) models.ITGovDraftBusinessCaseStatus {
	return models.ITGDBCSCantStart
}

// GrtMeetingStatus calculates the ITGovGRTStatus for the GrtMeeting section for the system intake task list for the requester view
func GrtMeetingStatus(intake *models.SystemIntake) models.ITGovGRTStatus {
	return models.ITGGRTSCantStart
}

// BizCaseFinalStatus calculates the ITGovFinalBusinessCaseStatus for the BizCaseFinal section for the system intake task list for the requester view
func BizCaseFinalStatus(intake *models.SystemIntake) models.ITGovFinalBusinessCaseStatus {
	return models.ITGFBCSCantStart
}

// GrbMeetingStatus calculates the ITGovGRBStatus for the GrbMeeting section for the system intake task list for the requester view
func GrbMeetingStatus(intake *models.SystemIntake) models.ITGovGRBStatus {
	return models.ITGGRBSCantStart
}

// DecisionAndNextStepsStatus calculates the ITGovDecisionStatus for the Decisions section for the system intake task list for the requester view
func DecisionAndNextStepsStatus(intake *models.SystemIntake) models.ITGovDecisionStatus {
	return models.ITGDSCantStart
}
