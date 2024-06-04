package resolvers

import (
	"fmt"
	"time"

	"github.com/cmsgov/easi-app/pkg/models"
)

// CalculateSystemIntakeAdminStatus calculates the status to display in the admin view for a System Intake request, based on the current step, and the state of that step and the overall state
func CalculateSystemIntakeAdminStatus(intake *models.SystemIntake) (models.SystemIntakeStatusAdmin, error) {
	if intake.Step == models.SystemIntakeStepDecisionAndNextSteps && intake.DecisionState == models.SIDSNoDecision {
		return "", fmt.Errorf("invalid state") // This status should not be returned in normal use of the application
	}

	if intake.State == models.SystemIntakeStateClosed && intake.DecisionState == models.SIDSNoDecision {
		// If the decision is closed and a decision wasn't issued, show closed
		// An intake that is closed without a decision doesn't progress to the SystemIntakeStepDECISION step, but remains on it's current step. This allows it to stay on that step if re-opened.
		return models.SystemIntakeStatusAdminClosed, nil
	}

	if intake.State == models.SystemIntakeStateClosed &&
		intake.DecisionState != models.SIDSNoDecision &&
		intake.Step != models.SystemIntakeStepDecisionAndNextSteps {
		// If an intake has a decision but is re-opened, progressed to an earlier step,
		// and then closed without a decision, show closed.
		return models.SystemIntakeStatusAdminClosed, nil
	}

	var retStatus models.SystemIntakeStatusAdmin
	var err error
	switch intake.Step {
	case models.SystemIntakeStepInitialRequestForm:
		retStatus = calcSystemIntakeInitialFormStatusAdmin(intake.RequestFormState)
	case models.SystemIntakeStepDraftBusinessCase:
		retStatus = calcSystemIntakeDraftBusinessCaseStatusAdmin(intake.DraftBusinessCaseState)
	case models.SystemIntakeStepGrtMeeting:
		retStatus = calcSystemIntakeGRTMeetingStatusAdmin(intake.GRTDate)
	case models.SystemIntakeStepFinalBusinessCase:
		retStatus = calcSystemIntakeFinalBusinessCaseStatusAdmin(intake.FinalBusinessCaseState)
	case models.SystemIntakeStepGrbMeeting:
		retStatus = calcSystemIntakeGRBMeetingStatusAdmin(intake.GRBDate)
	case models.SystemIntakeStepDecisionAndNextSteps:
		retStatus, err = calcSystemIntakeDecisionStatusAdmin(intake.DecisionState, intake.LCIDStatus(time.Now()))
	default:
		return retStatus, fmt.Errorf("issue calculating the admin state status, no valid step: %s", intake.Step)

	}
	return retStatus, err
}

func calcSystemIntakeInitialFormStatusAdmin(intakeFormState models.SystemIntakeFormState) models.SystemIntakeStatusAdmin {
	if intakeFormState == models.SIRFSSubmitted {
		return models.SystemIntakeStatusAdminInitialRequestFormSubmitted
	}
	return models.SystemIntakeStatusAdminInitialRequestFormInProgress
}

func calcSystemIntakeDraftBusinessCaseStatusAdmin(draftBusinessCaseState models.SystemIntakeFormState) models.SystemIntakeStatusAdmin {
	if draftBusinessCaseState == models.SIRFSSubmitted {
		return models.SystemIntakeStatusAdminDraftBusinessCaseSubmitted
	}
	return models.SystemIntakeStatusAdminDraftBusinessCaseInProgress
}

func calcSystemIntakeGRTMeetingStatusAdmin(grtDate *time.Time) models.SystemIntakeStatusAdmin {
	if grtDate == nil {
		return models.SystemIntakeStatusAdminGrtMeetingReady
	}

	if grtDate.After(time.Now()) {
		return models.SystemIntakeStatusAdminGrtMeetingReady
	}

	return models.SystemIntakeStatusAdminGrtMeetingComplete
}

func calcSystemIntakeFinalBusinessCaseStatusAdmin(finalBusinessCaseState models.SystemIntakeFormState) models.SystemIntakeStatusAdmin {
	if finalBusinessCaseState == models.SIRFSSubmitted {
		return models.SystemIntakeStatusAdminFinalBusinessCaseSubmitted
	}
	return models.SystemIntakeStatusAdminFinalBusinessCaseInProgress
}

func calcSystemIntakeGRBMeetingStatusAdmin(grbDate *time.Time) models.SystemIntakeStatusAdmin {

	if grbDate == nil {
		return models.SystemIntakeStatusAdminGrbMeetingReady
	}

	if grbDate.After(time.Now()) {
		return models.SystemIntakeStatusAdminGrbMeetingReady
	}
	return models.SystemIntakeStatusAdminGrbMeetingComplete
}

func calcSystemIntakeDecisionStatusAdmin(decisionState models.SystemIntakeDecisionState, lcidStatus *models.SystemIntakeLCIDStatus) (models.SystemIntakeStatusAdmin, error) {
	switch decisionState {
	case models.SIDSLcidIssued:
		return calcLCIDIssuedDecisionStatus(lcidStatus)
	case models.SIDSNotGovernance:
		return models.SystemIntakeStatusAdminNotGovernance, nil
	case models.SIDSNotApproved:
		return models.SystemIntakeStatusAdminNotApproved, nil
	case models.SIDSNoDecision:
		fallthrough
	default:
		return "", fmt.Errorf("invalid decision state: %s", decisionState) // This status should not be returned in normal use of the application
	}

}

// calcLCIDIssuedDecisionStatus checks an LCID status and appropriately converts it to a SystemIntakeStatusAdmin
func calcLCIDIssuedDecisionStatus(lcidStatus *models.SystemIntakeLCIDStatus) (models.SystemIntakeStatusAdmin, error) {
	if lcidStatus == nil {
		return models.SystemIntakeStatusAdminLcidIssued, nil
	}

	switch *lcidStatus {
	case models.SystemIntakeLCIDStatusIssued:
		return models.SystemIntakeStatusAdminLcidIssued, nil
	case models.SystemIntakeLCIDStatusExpired:
		return models.SystemIntakeStatusAdminLcidExpired, nil
	case models.SystemIntakeLCIDStatusRetired:
		return models.SystemIntakeStatusAdminLcidRetired, nil
	default:
		return "", fmt.Errorf("invalid lcid status provided: %s", *lcidStatus)
	}
}
