package resolvers

import (
	"context"
	"fmt"
	"time"

	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// CalculateSystemIntakeAdminStatus calculates the status to display in the admin view for a System Intake Request, based on the current step, and the state of that step and the overall state
func CalculateSystemIntakeAdminStatus(ctx context.Context, intake *models.SystemIntake) (models.SystemIntakeStatusAdmin, error) {
	if intake.Step == models.SystemIntakeStepDECISION && intake.DecisionState == models.SIDSNoDecision {
		return "", fmt.Errorf("invalid state") // This status should not be returned in normal use of the application
	}

	if intake.LifecycleRetiresAt != nil &&
		intake.LifecycleRetiresAt.After(time.Now()) {
		return models.SISALcidRetiringSoon, nil
	}

	if intake.State == models.SystemIntakeStateClosed && intake.DecisionState == models.SIDSNoDecision {
		// If the decision is closed and a decision wasn't issued, show closed
		// An intake that is closed without a decision doesn't progress to the SystemIntakeStepDECISION step, but remains on its current step. This allows it to stay on that step if re-opened.
		return models.SISAClosed, nil
	}

	if intake.State == models.SystemIntakeStateClosed &&
		intake.DecisionState != models.SIDSNoDecision &&
		intake.Step != models.SystemIntakeStepDECISION {
		// If an intake has a decision but is re-opened, progressed to an earlier step,
		// and then closed without a decision, show closed.
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
		retStatus = calcSystemIntakeGRBMeetingStatusAdmin(ctx, intake)
	case models.SystemIntakeStepDECISION:
		retStatus, err = calcSystemIntakeDecisionStatusAdmin(intake.DecisionState, intake.LCIDStatus(time.Now()))
	default:
		return retStatus, fmt.Errorf("issue calculating the admin state status, no valid step: %s", intake.Step)

	}
	return retStatus, err
}

func calcSystemIntakeInitialFormStatusAdmin(intakeFormState models.SystemIntakeFormState) models.SystemIntakeStatusAdmin {
	if intakeFormState == models.SIRFSSubmitted {
		return models.SISAInitialRequestFormSubmitted
	}
	return models.SISAInitialRequestFormInProgress
}

func calcSystemIntakeDraftBusinessCaseStatusAdmin(draftBusinessCaseState models.SystemIntakeFormState) models.SystemIntakeStatusAdmin {
	if draftBusinessCaseState == models.SIRFSSubmitted {
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

func calcSystemIntakeFinalBusinessCaseStatusAdmin(finalBusinessCaseState models.SystemIntakeFormState) models.SystemIntakeStatusAdmin {
	if finalBusinessCaseState == models.SIRFSSubmitted {
		return models.SISAFinalBusinessCaseSubmitted
	}
	return models.SISAFinalBusinessCaseInProgress
}

func calcSystemIntakeGRBMeetingStatusAdmin(ctx context.Context, intake *models.SystemIntake) models.SystemIntakeStatusAdmin {
	switch intake.GrbReviewType {
	case models.SystemIntakeGRBReviewTypeStandard:
		return calcSystemIntakeStandardGRBReviewStatusAdmin(intake.GRBDate)
	case models.SystemIntakeGRBReviewTypeAsync:
		return calcSystemIntakeAsyncGRBReviewStatusAdmin(ctx, intake)
	}

	return models.SISAGrbReviewComplete
}

// this function is pretty similar to the logic in CalcSystemIntakeGRBReviewStandardStatus
// TODO Consider refactoring to share the logic?
func calcSystemIntakeStandardGRBReviewStatusAdmin(grbDate *time.Time) models.SystemIntakeStatusAdmin {
	if grbDate == nil || grbDate.After(time.Now()) {
		return models.SISAGrbMeetingReady
	}

	return models.SISAGrbReviewComplete
}

func calcSystemIntakeAsyncGRBReviewStatusAdmin(ctx context.Context, intake *models.SystemIntake) models.SystemIntakeStatusAdmin {
	if intake.GRBReviewStartedAt == nil || intake.GrbReviewAsyncEndDate == nil {
		return models.SISAGrbMeetingReady
	}

	now := time.Now()
	if intake.GrbReviewAsyncManualEndDate == nil && intake.GRBReviewStartedAt.Before(now) && intake.GrbReviewAsyncEndDate.After(now) {
		return models.SISAGrbReviewInProgress
	}

	// If end date has passed but quorum has not been met, return models.SISAGrbReviewInProgress
	if now.After(*intake.GrbReviewAsyncEndDate) && intake.GrbReviewAsyncManualEndDate == nil {
		// check quorum status
		grbVotingInformation, err := GRBVotingInformationGetBySystemIntake(ctx, intake)
		if err != nil {
			appcontext.ZLogger(ctx).Error("problem getting grb voting information", zap.Error(err), zap.String("intake.id", intake.ID.String()))
			return models.SISAGrbReviewInProgress
		}

		if !grbVotingInformation.QuorumReached() && intake.GrbReviewAsyncManualEndDate == nil {
			return models.SISAGrbReviewInProgress
		}
	}

	return models.SISAGrbReviewComplete
}

func calcSystemIntakeDecisionStatusAdmin(decisionState models.SystemIntakeDecisionState, lcidStatus *models.SystemIntakeLCIDStatus) (models.SystemIntakeStatusAdmin, error) {
	switch decisionState {
	case models.SIDSLcidIssued:
		return calcLCIDIssuedDecisionStatus(lcidStatus)
	case models.SIDSNotGovernance:
		return models.SISANotGovernance, nil
	case models.SIDSNotApproved:
		return models.SISANotApproved, nil
	case models.SIDSNoDecision:
		fallthrough
	default:
		return "", fmt.Errorf("invalid decision state: %s", decisionState) // This status should not be returned in normal use of the application
	}

}

// calcLCIDIssuedDecisionStatus checks an LCID status and appropriately converts it to a SystemIntakeStatusAdmin
func calcLCIDIssuedDecisionStatus(lcidStatus *models.SystemIntakeLCIDStatus) (models.SystemIntakeStatusAdmin, error) {
	if lcidStatus == nil {
		return models.SISALcidIssued, nil
	}

	switch *lcidStatus {
	case models.SystemIntakeLCIDStatusIssued:
		return models.SISALcidIssued, nil
	case models.SystemIntakeLCIDStatusExpired:
		return models.SISALcidExpired, nil
	case models.SystemIntakeLCIDStatusRetired:
		return models.SISALcidRetired, nil
	default:
		return "", fmt.Errorf("invalid lcid status provided: %s", *lcidStatus)
	}
}
