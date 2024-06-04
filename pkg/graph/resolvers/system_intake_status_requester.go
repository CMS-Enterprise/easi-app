package resolvers

import (
	"fmt"
	"time"

	"github.com/cmsgov/easi-app/pkg/models"
)

const noDecisionInvalidStateErrMsg = "issue calculating the requester intake status, intake is in an invalid state - step is DECISION, but decisionState is NO_DECISION"

// CalculateSystemIntakeRequesterStatus calculates the status to display in the requester view for a System Intake request,
// based on the intake's current step, the state of that step, and the overall intake state (open/closed)
func CalculateSystemIntakeRequesterStatus(intake *models.SystemIntake, currentTime time.Time) (models.SystemIntakeStatusRequester, error) {
	if intake.Step == models.SystemIntakeStepDECISION && intake.DecisionState == models.SIDSNoDecision {
		return "", fmt.Errorf(noDecisionInvalidStateErrMsg)
	}

	if intake.State == models.SystemIntakeStateClosed && intake.DecisionState == models.SIDSNoDecision {
		return models.SystemIntakeStatusRequesterClosed, nil
	}
	if intake.State == models.SystemIntakeStateClosed &&
		intake.DecisionState != models.SIDSNoDecision &&
		intake.Step != models.SystemIntakeStepDECISION {
		// If an intake has a decision but is re-opened, progressed to an earlier step,
		// and then closed without a decision, show closed.
		return models.SystemIntakeStatusRequesterClosed, nil
	}

	switch intake.Step {
	case models.SystemIntakeStepINITIALFORM:
		return calcSystemIntakeInitialFormStatusRequester(intake.RequestFormState)
	case models.SystemIntakeStepDRAFTBIZCASE:
		return calcSystemIntakeDraftBusinessCaseStatusRequester(intake.DraftBusinessCaseState)
	case models.SystemIntakeStepGRTMEETING:
		// this calc function doesn't use a switch statement and can't possibly return an error
		return calcSystemIntakeGRTMeetingStatusRequester(intake.GRTDate, currentTime), nil
	case models.SystemIntakeStepFINALBIZCASE:
		return calcSystemIntakeFinalBusinessCaseStatusRequester(intake.FinalBusinessCaseState)
	case models.SystemIntakeStepGRBMEETING:
		// this calc function doesn't use a switch statement and can't possibly return an error
		return calcSystemIntakeGRBMeetingStatusRequester(intake.GRBDate, currentTime), nil
	case models.SystemIntakeStepDECISION:
		return calcSystemIntakeDecisionStatusRequester(intake.DecisionState, intake.LCIDStatus(time.Now()))
	default:
		return "", fmt.Errorf("issue calculating the requester intake status, no valid step")
	}
}

func calcSystemIntakeInitialFormStatusRequester(intakeFormState models.SystemIntakeFormState) (models.SystemIntakeStatusRequester, error) {
	switch intakeFormState {
	case models.SIRFSNotStarted:
		return models.SystemIntakeStatusRequesterInitialRequestFormNew, nil
	case models.SIRFSInProgress:
		return models.SystemIntakeStatusRequesterInitialRequestFormInProgress, nil
	case models.SIRFSEditsRequested:
		return models.SystemIntakeStatusRequesterInitialRequestFormEditsRequested, nil
	case models.SIRFSSubmitted:
		return models.SystemIntakeStatusRequesterInitialRequestFormSubmitted, nil
	default:
		return "", fmt.Errorf("issue calculating the requester intake status, no valid intakeFormState")
	}
}

func calcSystemIntakeDraftBusinessCaseStatusRequester(draftBusinessCaseState models.SystemIntakeFormState) (models.SystemIntakeStatusRequester, error) {
	switch draftBusinessCaseState {
	case models.SIRFSNotStarted, models.SIRFSInProgress:
		return models.SystemIntakeStatusRequesterDraftBusinessCaseInProgress, nil
	case models.SIRFSEditsRequested:
		return models.SystemIntakeStatusRequesterDraftBusinessCaseEditsRequested, nil
	case models.SIRFSSubmitted:
		return models.SystemIntakeStatusRequesterDraftBusinessCaseSubmitted, nil
	default:
		return "", fmt.Errorf("issue calculating the requester intake status, no valid draftBusinessCaseState")
	}
}

func calcSystemIntakeGRTMeetingStatusRequester(grtDate *time.Time, currentTime time.Time) models.SystemIntakeStatusRequester {
	if grtDate == nil || grtDate.After(currentTime) {
		return models.SystemIntakeStatusRequesterGrtMeetingReady
	}

	return models.SystemIntakeStatusRequesterGrtMeetingAwaitingDecision
}

func calcSystemIntakeFinalBusinessCaseStatusRequester(finalBusinessCaseState models.SystemIntakeFormState) (models.SystemIntakeStatusRequester, error) {
	switch finalBusinessCaseState {
	case models.SIRFSNotStarted, models.SIRFSInProgress:
		return models.SystemIntakeStatusRequesterFinalBusinessCaseInProgress, nil
	case models.SIRFSEditsRequested:
		return models.SystemIntakeStatusRequesterFinalBusinessCaseEditsRequested, nil
	case models.SIRFSSubmitted:
		return models.SystemIntakeStatusRequesterFinalBusinessCaseSubmitted, nil
	default:
		return "", fmt.Errorf("issue calculating the requester intake status, no valid finalBusinessCaseState")
	}
}

func calcSystemIntakeGRBMeetingStatusRequester(grbDate *time.Time, currentTime time.Time) models.SystemIntakeStatusRequester {
	if grbDate == nil || grbDate.After(currentTime) {
		return models.SystemIntakeStatusRequesterGrbMeetingReady
	}

	return models.SystemIntakeStatusRequesterGrbMeetingAwaitingDecision
}

func calcSystemIntakeDecisionStatusRequester(decisionState models.SystemIntakeDecisionState, lcidStatus *models.SystemIntakeLCIDStatus) (models.SystemIntakeStatusRequester, error) {
	switch decisionState {
	case models.SIDSLcidIssued:
		return calcLCIDIssuedDecisionStatusRequester(lcidStatus)
	case models.SIDSNotApproved:
		return models.SystemIntakeStatusRequesterNotApproved, nil
	case models.SIDSNotGovernance:
		return models.SystemIntakeStatusRequesterNotGovernance, nil
	case models.SIDSNoDecision:
		// we shouldn't hit this case, it should be caught by the check at the start of CalculateSystemIntakeRequesterStatus(),
		// but it's repeated here for clarity and to make sure we handle all possible values of decisionState in this function
		return "", fmt.Errorf(noDecisionInvalidStateErrMsg)
	}

	return "", fmt.Errorf("issue calculating the requester intake status, no valid decisionState")
}

// calcLCIDIssuedDecisionStatusRequester checks an LCID status and appropriately converts it to a SystemIntakeStatusRequester
func calcLCIDIssuedDecisionStatusRequester(lcidStatus *models.SystemIntakeLCIDStatus) (models.SystemIntakeStatusRequester, error) {
	if lcidStatus == nil {
		return models.SystemIntakeStatusRequesterLcidIssued, nil
	}
	if *lcidStatus == models.SystemIntakeLCIDStatusIssued {
		return models.SystemIntakeStatusRequesterLcidIssued, nil
	}
	if *lcidStatus == models.SystemIntakeLCIDStatusExpired {
		return models.SystemIntakeStatusRequesterLcidExpired, nil
	}
	if *lcidStatus == models.SystemIntakeLCIDStatusRetired {
		return models.SystemIntakeStatusRequesterLcidRetired, nil
	}
	return "", fmt.Errorf("invalid lcid status provided: %v", lcidStatus)

}
