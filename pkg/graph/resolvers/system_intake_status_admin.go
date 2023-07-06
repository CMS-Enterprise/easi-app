package resolvers

import (
	"fmt"
	"time"

	"github.com/cmsgov/easi-app/pkg/models"
)

// SystemIntakeStatusAdminGet calculates the status to display in the admin view for a System Intake request, based on the current step, and the state of that step.
func SystemIntakeStatusAdminGet(intake *models.SystemIntake) (models.SystemIntakeStatusAdmin, error) { //TODO, maybe don't return an error here?

	//TODO IF CLOSED, check the DECISIONSTATE, if it is NO_DECISION, just return CLOSED, after that
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
		return retStatus, fmt.Errorf("issue calculating the admin state status, no valid step") //TODO: we really don't ever have an error, I'm not sure this signature makes any sense, maybe make this more deterministic

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

	if grtDate.Before(time.Now()) { // TODO do we need to handle any time zone issues? This library should handle it
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

	if grbDate.Before(time.Now()) { // TODO do we need to handle any time zone issues? This library should handle it
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

	return models.SISAInitialRequestFormInProgress, fmt.Errorf("invalid state") //TODO should we just make a generic no decision issued status for this?

	// TODO WHAT TO DO IF THE STATUS IS ACTUALLY IN in NO_DECISION???? WE should handle this case, though it isn't displayed in FIGMA
}
