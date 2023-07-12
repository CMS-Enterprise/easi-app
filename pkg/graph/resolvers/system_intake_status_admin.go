package resolvers

import (
	"fmt"
	"time"

	"github.com/cmsgov/easi-app/pkg/models"
)

// CalculateSystemIntakeAdminStatus calculates the status to display in the admin view for a System Intake request, based on the current step, and the state of that step and the overall state
func CalculateSystemIntakeAdminStatus(intake *models.SystemIntake) (models.SystemIntakeStatusAdmin, error) {

	if intake.State == models.SystemIntakeStateCLOSED && intake.DecisionState == models.SIDSNoDecision {
		// If the decision is closed and a decision wasn't issued, show closed
		// An intake that is closed without a decision doesn't progress to the SystemIntakeStepDECISION step, but remains on it's current step. This allows it to stay on that step if re-opened.
		return models.SISAClosed, nil

	}
	var retStatus models.SystemIntakeStatusAdmin
	var err error
	switch intake.Step {
	case models.SystemIntakeStepINITIALFORM:
		retStatus = calcSystemIntakeInitialFormStatusAdmin(intake.RequestFormState)
	case models.SystemIntakeStepDRAFTBIZCASE:
		retStatus = calcSystemIntakeDraftBusinessCaseStatusAdmin(intake.DraftBusinessCaseState)
	case models.SystemIntakeStepGRTMEETING:
		retStatus = calcSystemIntakeGRTMeetingStatusAdmin(intake.GRTDate)
	case models.SystemIntakeStepFINALBIZCASE:
		retStatus = calcSystemIntakeFinalBusinessCaseStatusAdmin(intake.FinalBusinessCaseState)
	case models.SystemIntakeStepGRBMEETING:
		retStatus = calcSystemIntakeGRBMeetingStatusAdmin(intake.GRBDate)
	case models.SystemIntakeStepDECISION:
		retStatus, err = calcSystemIntakeDecisionStatusAdmin(intake.DecisionState)
	default:
		return retStatus, fmt.Errorf("issue calculating the admin state status, no valid step")

	}
	return retStatus, err
}

func calcSystemIntakeInitialFormStatusAdmin(intakeFormState models.SystemIntakeFormState) models.SystemIntakeStatusAdmin {
	if intakeFormState == models.SIRFSSubmitted {
		return models.SISAInitialRequestFormSubmitted
	}
	return models.SISAInitialRequestFormInProgress
}

func calcSystemIntakeDraftBusinessCaseStatusAdmin(draftBuisnessCaseState models.SystemIntakeFormState) models.SystemIntakeStatusAdmin {
	if draftBuisnessCaseState == models.SIRFSSubmitted {
		return models.SISADraftBusinessCaseSubmitted
	}
	return models.SISADraftBusinessCaseInProgress
}

func calcSystemIntakeGRTMeetingStatusAdmin(grtDate *time.Time) models.SystemIntakeStatusAdmin {

	if grtDate == nil {
		return models.SISAGrtMeetingReady
	}

	if grtDate.After(time.Now()) {
		return models.SISAGrtMeetingReady
	}
	return models.SISAGrtMeetingComplete
}

func calcSystemIntakeFinalBusinessCaseStatusAdmin(finalBuisnessCaseState models.SystemIntakeFormState) models.SystemIntakeStatusAdmin {
	if finalBuisnessCaseState == models.SIRFSSubmitted {
		return models.SISAFinalBusinessCaseSubmitted
	}
	return models.SISAFinalBusinessCaseInProgress
}

func calcSystemIntakeGRBMeetingStatusAdmin(grbDate *time.Time) models.SystemIntakeStatusAdmin {

	if grbDate == nil {
		return models.SISAGrbMeetingReady
	}

	if grbDate.After(time.Now()) {
		return models.SISAGrbMeetingReady
	}
	return models.SISAGrbMeetingComplete
}

func calcSystemIntakeDecisionStatusAdmin(decisionState models.SystemIntakeDecisionState) (models.SystemIntakeStatusAdmin, error) {
	if decisionState == models.SIDSLcidIssued {
		return models.SISALcidIssued, nil
	}
	if decisionState == models.SIDSNoGovernance {
		return models.SISANoGovernance, nil
	}
	if decisionState == models.SIDSNotApproved {
		return models.SISANotApproved, nil
	}

	return "", fmt.Errorf("invalid state") // This status should not be returned in normal use of the application
}
