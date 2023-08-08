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
		return "", apperrors.NewInvalidEnumError(fmt.Errorf("intake has an invalid value for its intake form state"), intake.RequestFormState, "SystemIntakeFormState")
	}
}

// FeedbackFromInitialReviewStatus calculates the ITGovTaskListStatus for the feedback section of a system intake task list  for the requester view
func FeedbackFromInitialReviewStatus(intake *models.SystemIntake) (models.ITGovFeedbackStatus, error) {
	if intake.Step != models.SystemIntakeStepINITIALFORM { // If the step is past the initial form, the review is complete
		return models.ITGFBSCompleted, nil
	}
	switch intake.RequestFormState {
	case models.SIRFSNotStarted, models.SIRFSInProgress: // If the form is just in progress, or not started, the review can't start yet
		return models.ITGFBSCantStart, nil

	case models.SIRFSSubmitted: //If the request form has been submitted, it show now show in_review for the feedback step
		return models.ITGFBSInReview, nil

	case models.SIRFSEditsRequested: // If the form has edits requested, review has happened and is complete.
		return models.ITGFBSCompleted, nil

	default: // The enum is invalid. This is included to be explicit. This should not technically happen in normal use, but it is technically possible as the type is a type alias for string
		return "", apperrors.NewInvalidEnumError(fmt.Errorf("intake has an invalid value for its intake form state"), intake.RequestFormState, "SystemIntakeFormState")
	}

}

// BizCaseDraftStatus calculates the ITGovDraftBusinessCaseStatus for the BizCaseDraft section for the system intake task list for the requester view
func BizCaseDraftStatus(intake *models.SystemIntake) (models.ITGovDraftBusinessCaseStatus, error) {
	switch intake.Step {
	case models.SystemIntakeStepINITIALFORM: //This is before the draft business case, always show can't start for clarity
		return models.ITGDBCSCantStart, nil
	case models.SystemIntakeStepDRAFTBIZCASE:
		switch intake.DraftBusinessCaseState { // The business case status depends on the state if in the draft business case step.
		case models.SIRFSSubmitted:
			return models.ITGDBCSSubmitted, nil
		case models.SIRFSNotStarted:
			return models.ITGDBCSReady, nil
		case models.SIRFSInProgress:
			return models.ITGDBCSInProgress, nil
		case models.SIRFSEditsRequested:
			return models.ITGDBCSEditsRequested, nil
		default:
			return "", apperrors.NewInvalidEnumError(fmt.Errorf("intake has an invalid value for its draft business case state"), intake.DraftBusinessCaseState, "SystemIntakeFormState")
		}

	case models.SystemIntakeStepDECISION, models.SystemIntakeStepGRTMEETING, models.SystemIntakeStepFINALBIZCASE, models.SystemIntakeStepGRBMEETING:

		switch intake.DraftBusinessCaseState {
		case models.SIRFSSubmitted, models.SIRFSInProgress, models.SIRFSEditsRequested: // If the draft business case had any progress made on it, and then the step advances, the case is considered complete.
			return models.ITGDBCSDone, nil
		case models.SIRFSNotStarted: // If in a more advanced step, and nothing has been completed, the draft business case is not needed.
			return models.ITGDBCSNotNeeded, nil
		default:
			return "", apperrors.NewInvalidEnumError(fmt.Errorf("intake has an invalid value for its draft business case state"), intake.DraftBusinessCaseState, "SystemIntakeFormState")
		}
	default: //This is included to be explicit. This should not technically happen in normal use, but it is technically possible as the type is a type alias for string. It will also provide an error if a new state is added and not handled.
		return "", apperrors.NewInvalidEnumError(fmt.Errorf("intake has an invalid value for its intake form step"), intake.Step, "SystemIntakeStep")
	}

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
func GrbMeetingStatus(intake *models.SystemIntake) (models.ITGovGRBStatus, error) {

	switch {
	case intake.GRBDate != nil: // status depends on if there is a date scheduled or not
		if intake.GRBDate.After(time.Now()) { // Meeting has not happened
			return models.ITGGRBSScheduled, nil
		}
		if intake.Step == models.SystemIntakeStepGRBMEETING { //if the step is GRB meeting, status is awaiting decision
			return models.ITGGRBSAwaitingDecision, nil
		}
		return models.ITGGRBSCompleted, nil // if the step is not GRB meeting, the status is completed
	default: // the grb date is not nil.
		switch intake.Step {
		case models.SystemIntakeStepINITIALFORM, models.SystemIntakeStepDRAFTBIZCASE, models.SystemIntakeStepGRTMEETING, models.SystemIntakeStepFINALBIZCASE: // Any step before GRB should show can't start
			return models.ITGGRBSCantStart, nil

		case models.SystemIntakeStepGRBMEETING: // If at the GRB step, show ready to schedule
			return models.ITGGRBSReadyToSchedule, nil

		case models.SystemIntakeStepDECISION: // If after GRB step, show that it was not needed (skipped)
			return models.ITGGRBSNotNeeded, nil
		default: //This is included to be explicit. This should not technically happen in normal use, but it is technically possible as the type is a type alias for string. It will also provide an error if a new state is added and not handled.
			return "", apperrors.NewInvalidEnumError(fmt.Errorf("intake has an invalid value for its intake form step"), intake.Step, "SystemIntakeStep")
		}
	}

}

// DecisionAndNextStepsStatus calculates the ITGovDecisionStatus for the Decisions section for the system intake task list for the requester view
func DecisionAndNextStepsStatus(intake *models.SystemIntake) (models.ITGovDecisionStatus, error) {

	switch intake.Step {
	case models.SystemIntakeStepINITIALFORM, models.SystemIntakeStepDRAFTBIZCASE, models.SystemIntakeStepGRTMEETING, models.SystemIntakeStepFINALBIZCASE:
		return models.ITGDSCantStart, nil
	case models.SystemIntakeStepGRBMEETING:
		if intake.GRBDate == nil {
			return models.ITGDSCantStart, nil
		}
		if intake.GRBDate.After(time.Now()) { // Meeting has not happened
			return models.ITGDSCantStart, nil
		}
		// Meeting has  happened, intake is waiting on a decision
		return models.ITGDSInReview, nil

	case models.SystemIntakeStepDECISION:

		if intake.DecisionState == models.SIDSNoDecision { // if the step is decision state, the step has to be completed, and a decision has to have been made
			return "", apperrors.NewInvalidEnumError(fmt.Errorf("intake has an invalid value for its decision state. a decision must be made in order to be in the decision state"), intake.RequestFormState, "SystemIntakeDecisionState")
		}

		return models.ITGDSCompleted, nil
	default: //This is included to be explicit. This should not technically happen in normal use, but it is technically possible as the type is a type alias for string. It will also provide an error if a new state is added and not handled.
		return "", apperrors.NewInvalidEnumError(fmt.Errorf("intake has an invalid value for its intake form step"), intake.RequestFormState, "SystemIntakeStep")
	}
}
