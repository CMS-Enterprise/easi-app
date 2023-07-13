package resolvers

import (
	"fmt"
	"time"

	"github.com/cmsgov/easi-app/pkg/models"
)

// CalculateSystemIntakeRequesterStatus calculates the status to display in the requester view for a System Intake request,
// based on the intake's current step, the state of that step, and the overall intake state (open/closed)
func CalculateSystemIntakeRequesterStatus(intake *models.SystemIntake, currentTime time.Time) (models.SystemIntakeStatusRequester, error) {
	if intake.State == models.SystemIntakeStateCLOSED && intake.DecisionState == models.SIDSNoDecision {
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
		return calcSystemIntakeGRBMeetingStatusRequester(intake.GRBDate, currentTime), nil
	case models.SystemIntakeStepDECISION:
		return calcSystemIntakeDecisionStatusRequester(intake.DecisionState)
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

func calcSystemIntakeGRBMeetingStatusRequester(grbDate *time.Time, currentTime time.Time) models.SystemIntakeStatusRequester {
	if grbDate == nil || grbDate.After(currentTime) {
		return models.SISRGrbMeetingReady
	}

	return models.SISRGrbMeetingAwaitingDecision
}

func calcSystemIntakeDecisionStatusRequester(decisionState models.SystemIntakeDecisionState) (models.SystemIntakeStatusRequester, error) {
	switch decisionState {
	case models.SIDSLcidIssued:
		return models.SISRLcidIssued, nil
	case models.SIDSNotApproved:
		return models.SISRNotApproved, nil
	case models.SIDSNotGovernance:
		return models.SISRNotGovernance, nil
	case models.SIDSNoDecision:
		return "", fmt.Errorf("issue calculating the requester intake status - invalid state, intake decisionState is NO_DECISION, but intake is not closed")
	}

	return "", fmt.Errorf("issue calculating the requester intake status, no valid decisionState")
}
