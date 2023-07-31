package resolvers

import (
	"fmt"
	"time"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

//NOTE these functions are deterministic. Ideally when implementing we should separate the logic which obtains any database information from the methods that calculate the status

// IntakeFormStatus calculates the ITGovTaskListStatus of a system intake for the requester view
func IntakeFormStatus(intake *models.SystemIntake) (models.ITGovIntakeFormStatus, error) {
	if intake.Step != models.SystemIntakeStepINITIALFORM {
		return models.ITGISCompleted, nil
	}
	switch intake.RequestFormState {
	case models.SIRFSNotStarted:
		return models.ITGISReady, nil

	case models.SIRFSInProgress:
		return models.ITGISInProgress, nil

	case models.SIRFSEditsRequested:
		return models.ITGISEditsRequested, nil

	case models.SIRFSSubmitted:
		return models.ITGISCompleted, nil
	default: //This is included to be explicit. This should not technically happen in normal use, but it is technically possible as the type is a type alias for string
		return "", apperrors.NewInvalidEnumError(fmt.Errorf("invalid has an invalid value for its intake form state"), intake.RequestFormState, "SystemIntakeFormState")
	}
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
func DecisionAndNextStepsStatus(intake *models.SystemIntake) (models.ITGovDecisionStatus, error) {
	if !(intake.Step == models.SystemIntakeStepGRBMEETING || intake.Step == models.SystemIntakeStepDECISION) { // If not in either of these steps, we can't issue a decision yet. Note, this does not check that the step is a valid enum
		return models.ITGDSCantStart, nil
	}
	if intake.Step == models.SystemIntakeStepGRBMEETING {
		if intake.GRBDate == nil {
			return models.ITGDSCantStart, nil
		}
		if intake.GRBDate.After(time.Now()) { // Meeting has not happened
			return models.ITGDSCantStart, nil
		}
		// Meeting has  happened, intake is waiting on a decision
		return models.ITGDSInReview, nil
	}
	// if the step is decision state, the step has to be completed, and a decision has to have been made
	if intake.DecisionState == models.SIDSNoDecision {
		return "", apperrors.NewInvalidEnumError(fmt.Errorf("intake has an invalid value for its decision state. a decision must be made in order to be in the decision state"), intake.RequestFormState, "SystemIntakeDecisionState")
	}

	return models.ITGDSCompleted, nil
}
