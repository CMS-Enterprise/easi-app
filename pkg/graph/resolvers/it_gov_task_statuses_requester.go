package resolvers

import "github.com/cmsgov/easi-app/pkg/models"

//NOTE these functions are deterministic. Ideally when implementing we should separate the logic which obtains any database information from the methods that calculate the status

// IntakeFormStatusReq calculates the ITGovTaskListStatus of a system intake for the requester view
func IntakeFormStatusReq(intake *models.SystemIntake) models.ITGovIntakeStatusReq {
	return models.ITGISRReady
}

// FeedbackFromInitialReviewStatusReq calculates the ITGovTaskListStatus for the feedback section of a system intake task list  for the requester view
func FeedbackFromInitialReviewStatusReq(intake *models.SystemIntake) models.ITGovFeedbackStatusReq {
	return models.ITGFBSRCantStart
}

// BizCaseDraftStatusReq calculates the ITGovDraftBuisnessCaseStatusReq for the BizCaseDraft section for the system intake task list for the requester view
func BizCaseDraftStatusReq(intake *models.SystemIntake) models.ITGovDraftBuisnessCaseStatusReq {
	return models.ITGDBCSRCantStart
}

// GrtMeetingStatusReq calculates the ITGovGRTStatusReq for the GrtMeeting section for the system intake task list for the requester view
func GrtMeetingStatusReq(intake *models.SystemIntake) models.ITGovGRTStatusReq {
	return models.ITGGRTSRCantStart
}

// BizCaseFinalStatusReq calculates the ITGovFinalBuisnessCaseStatusReq for the BizCaseFinal section for the system intake task list for the requester view
func BizCaseFinalStatusReq(intake *models.SystemIntake) models.ITGovFinalBuisnessCaseStatusReq {
	return models.ITGFBCSRCantStart
}

// GrbMeetingStatusReq calculates the ITGovGRBStatusReq for the GrbMeeting section for the system intake task list for the requester view
func GrbMeetingStatusReq(intake *models.SystemIntake) models.ITGovGRBStatusReq {
	return models.ITGGRBSRCantStart
}

// DecisionAndNextStepsStatusReq calculates the ITGovDecisionStatusReq for the Decisions section for the system intake task list for the requester view
func DecisionAndNextStepsStatusReq(intake *models.SystemIntake) models.ITGovDecisionStatusReq {
	return models.ITGDSRCantStart
}
