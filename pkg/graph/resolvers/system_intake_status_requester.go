package resolvers

import (
	"errors"
	"fmt"
	"time"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

const noDecisionInvalidStateErrMsg = "issue calculating the requester intake status, intake is in an invalid state - step is DECISION, but decisionState is NO_DECISION"

// CalculateSystemIntakeRequesterStatus calculates the status to display in the requester view for a System Intake Request,
// based on the intake's current step, the state of that step, and the overall intake state (open/closed)
func CalculateSystemIntakeRequesterStatus(intake *models.SystemIntake, currentTime time.Time) (models.SystemIntakeStatusRequester, error) {
	if intake.Step == models.SystemIntakeStepDECISION && intake.DecisionState == models.SIDSNoDecision {
		return "", errors.New(noDecisionInvalidStateErrMsg)
	}

	if intake.State == models.SystemIntakeStateClosed && intake.DecisionState == models.SIDSNoDecision {
		return models.SISRClosed, nil
	}
	if intake.State == models.SystemIntakeStateClosed &&
		intake.DecisionState != models.SIDSNoDecision &&
		intake.Step != models.SystemIntakeStepDECISION {
		// If an intake has a decision but is re-opened, progressed to an earlier step,
		// and then closed without a decision, show closed.
		return models.SISRClosed, nil
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
		return calcSystemIntakeGRBMeetingStatusRequester(intake, currentTime), nil
	case models.SystemIntakeStepDECISION:
		return calcSystemIntakeDecisionStatusRequester(intake.DecisionState, intake.LCIDStatus(time.Now()))
	default:
		return "", fmt.Errorf("issue calculating the requester intake status, no valid step")
	}
}

func calcSystemIntakeInitialFormStatusRequester(intakeFormState models.SystemIntakeFormState) (models.SystemIntakeStatusRequester, error) {
	switch intakeFormState {
	case models.SIRFSNotStarted:
		return models.SISRInitialRequestFormNew, nil
	case models.SIRFSInProgress:
		return models.SISRInitialRequestFormInProgress, nil
	case models.SIRFSEditsRequested:
		return models.SISRInitialRequestFormEditsRequested, nil
	case models.SIRFSSubmitted:
		return models.SISRInitialRequestFormSubmitted, nil
	default:
		return "", fmt.Errorf("issue calculating the requester intake status, no valid intakeFormState")
	}
}

func calcSystemIntakeDraftBusinessCaseStatusRequester(draftBusinessCaseState models.SystemIntakeFormState) (models.SystemIntakeStatusRequester, error) {
	switch draftBusinessCaseState {
	case models.SIRFSNotStarted, models.SIRFSInProgress:
		return models.SISRDraftBusinessCaseInProgress, nil
	case models.SIRFSEditsRequested:
		return models.SISRDraftBusinessCaseEditsRequested, nil
	case models.SIRFSSubmitted:
		return models.SISRDraftBusinessCaseSubmitted, nil
	default:
		return "", fmt.Errorf("issue calculating the requester intake status, no valid draftBusinessCaseState")
	}
}

func calcSystemIntakeGRTMeetingStatusRequester(grtDate *time.Time, currentTime time.Time) models.SystemIntakeStatusRequester {
	if grtDate == nil || grtDate.After(currentTime) {
		return models.SISRGrtMeetingReady
	}

	return models.SISRGrtMeetingAwaitingDecision
}

func calcSystemIntakeFinalBusinessCaseStatusRequester(finalBusinessCaseState models.SystemIntakeFormState) (models.SystemIntakeStatusRequester, error) {
	switch finalBusinessCaseState {
	case models.SIRFSNotStarted, models.SIRFSInProgress:
		return models.SISRFinalBusinessCaseInProgress, nil
	case models.SIRFSEditsRequested:
		return models.SISRFinalBusinessCaseEditsRequested, nil
	case models.SIRFSSubmitted:
		return models.SISRFinalBusinessCaseSubmitted, nil
	default:
		return "", fmt.Errorf("issue calculating the requester intake status, no valid finalBusinessCaseState")
	}
}

func calcSystemIntakeGRBMeetingStatusRequester(intake *models.SystemIntake, currentTime time.Time) models.SystemIntakeStatusRequester {
	switch intake.GrbReviewType {
	case models.SystemIntakeGRBReviewTypeStandard:
		return calcSystemIntakeStandardGRBReviewStatusRequester(intake.GRBDate, currentTime)
	case models.SystemIntakeGRBReviewTypeAsync:
		return calcSystemIntakeAsyncGRBReviewStatusRequester(intake.GRBReviewStartedAt, intake.GrbReviewAsyncEndDate, intake.GrbReviewAsyncManualEndDate, currentTime)
	}

	return models.SISRGrbMeetingAwaitingDecision
}

func calcSystemIntakeStandardGRBReviewStatusRequester(grbDate *time.Time, currentTime time.Time) models.SystemIntakeStatusRequester {
	if grbDate == nil || grbDate.After(currentTime) {
		return models.SISRGrbMeetingReady
	}

	return models.SISRGrbMeetingAwaitingDecision
}

func calcSystemIntakeAsyncGRBReviewStatusRequester(startDate *time.Time, endDate *time.Time, manualEndDate *time.Time, currentTime time.Time) models.SystemIntakeStatusRequester {
	if startDate == nil || endDate == nil {
		return models.SISRGrbMeetingReady
	}

	if manualEndDate == nil && startDate.Before(currentTime) && endDate.After(currentTime) {
		return models.SISRGrbReviewInProgress
	}

	return models.SISRGrbMeetingAwaitingDecision
}

func calcSystemIntakeDecisionStatusRequester(decisionState models.SystemIntakeDecisionState, lcidStatus *models.SystemIntakeLCIDStatus) (models.SystemIntakeStatusRequester, error) {
	switch decisionState {
	case models.SIDSLcidIssued:
		return calcLCIDIssuedDecisionStatusRequester(lcidStatus)
	case models.SIDSNotApproved:
		return models.SISRNotApproved, nil
	case models.SIDSNotGovernance:
		return models.SISRNotGovernance, nil
	case models.SIDSNoDecision:
		// we shouldn't hit this case, it should be caught by the check at the start of CalculateSystemIntakeRequesterStatus(),
		// but it's repeated here for clarity and to make sure we handle all possible values of decisionState in this function
		return "", errors.New(noDecisionInvalidStateErrMsg)
	}

	return "", fmt.Errorf("issue calculating the requester intake status, no valid decisionState")
}

// calcLCIDIssuedDecisionStatusRequester checks an LCID status and appropriately converts it to a SystemIntakeStatusRequester
func calcLCIDIssuedDecisionStatusRequester(lcidStatus *models.SystemIntakeLCIDStatus) (models.SystemIntakeStatusRequester, error) {
	if lcidStatus == nil {
		return models.SISRLcidIssued, nil
	}
	if *lcidStatus == models.SystemIntakeLCIDStatusIssued {
		return models.SISRLcidIssued, nil
	}
	if *lcidStatus == models.SystemIntakeLCIDStatusExpired {
		return models.SISRLcidExpired, nil
	}
	if *lcidStatus == models.SystemIntakeLCIDStatusRetired {
		return models.SISRLcidRetired, nil
	}
	return "", fmt.Errorf("invalid lcid status provided: %v", lcidStatus)

}
