package resolvers

import (
	"fmt"
	"time"

	"github.com/cmsgov/easi-app/pkg/models"
)

// SystemIntakeStatusAdminGet calculates the status to display in the admin view for a System Intake request, based on the current step, and the state of that step and the overall state
func SystemIntakeStatusAdminGet(intake *models.SystemIntake) (models.SystemIntakeStatusAdmin, error) {

	if intake.State == models.SystemIntakeStateCLOSED && intake.DecisionState == models.SIDSNoDecision { // If the decision is closed and a decision wasn't issued, show closed
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
		return models.SISADraftBusinessCaseComplete
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
		return models.SISAFinalBusinessCaseComplete
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

func calcSystemIntakeDecisionStatusAdmin(decisionStatus models.SystemIntakeDecisionState) (models.SystemIntakeStatusAdmin, error) {
	if decisionStatus == models.SIDSLcidIssued {
		return models.SISALcidIssued, nil
	}
	if decisionStatus == models.SIDSNoGovernance {
		return models.SISANoGovernance, nil
	}
	if decisionStatus == models.SIDSNotApproved {
		return models.SISANotApproved, nil
	}

	return "", fmt.Errorf("invalid state") // This status should not be returned in normal use of the application
}
