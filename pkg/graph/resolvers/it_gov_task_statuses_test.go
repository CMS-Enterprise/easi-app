package resolvers

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/easi-app/pkg/models"
)

type testSystemIntakeFormStatusType struct {
	testCase       string
	intake         models.SystemIntake
	expectedStatus models.ITGovIntakeFormStatus
	expectError    bool
}
type testSystemIntakeFormFeedbackStatusType struct {
	testCase       string
	intake         models.SystemIntake
	expectedStatus models.ITGovFeedbackStatus
	expectError    bool
}

type testSystemIntakeGRTStatusType struct {
	testCase       string
	intake         models.SystemIntake
	expectedStatus models.ITGovGRTStatus
	expectError    bool
}

type testSystemIntakeDraftBusinessCaseStatusType struct {
	testCase       string
	intake         models.SystemIntake
	expectedStatus models.ITGovDraftBusinessCaseStatus
	expectError    bool
}

type testSystemIntakeDecisionStatusType struct {
	testCase       string
	intake         models.SystemIntake
	expectedStatus models.ITGovDecisionStatus
	expectError    bool
}
type testSystemIntakeBusinessCaseFinalStatusType struct {
	testCase       string
	intake         models.SystemIntake
	expectedStatus models.ITGovFinalBusinessCaseStatus
	expectError    bool
}

type testSystemIntakeGRBStatusType struct {
	testCase       string
	intake         models.SystemIntake
	expectedStatus models.ITGovGRBStatus
	expectError    bool
}

func TestIntakeFormStatus(t *testing.T) {

	defaultTestState := models.SystemIntakeFormState("Testing Default State")

	intakeFormTests := []testSystemIntakeFormStatusType{
		//Test cases when the step is the Intake Form
		{
			testCase: "Request form not started",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepINITIALFORM,
				RequestFormState: models.SIRFSNotStarted,
			},
			expectedStatus: models.ITGovIntakeFormStatusReady,
			expectError:    false,
		},
		{
			testCase: "Request form started",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepINITIALFORM,
				RequestFormState: models.SIRFSInProgress,
			},
			expectedStatus: models.ITGovIntakeFormStatusInProgress,
			expectError:    false,
		},
		{
			testCase: "Request form edits requested",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepINITIALFORM,
				RequestFormState: models.SIRFSEditsRequested,
			},
			expectedStatus: models.ITGovIntakeFormStatusEditsRequested,
			expectError:    false,
		},
		{
			testCase: "Request form submitted",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepINITIALFORM,
				RequestFormState: models.SIRFSSubmitted,
			},
			expectedStatus: models.ITGovIntakeFormStatusCompleted,
			expectError:    false,
		},
		{
			testCase: "Request form default case",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepINITIALFORM,
				RequestFormState: defaultTestState,
			},
			expectedStatus: "",
			expectError:    true,
		},

		//Tests when the step is not the Intake form
		{
			testCase: "Request form not started: not at intake form step",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepGRBMEETING,
				RequestFormState: models.SIRFSNotStarted,
			},
			expectedStatus: models.ITGovIntakeFormStatusCompleted,
			expectError:    false,
		},
		{
			testCase: "Request form started: not at intake form step",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepGRBMEETING,
				RequestFormState: models.SIRFSInProgress,
			},
			expectedStatus: models.ITGovIntakeFormStatusCompleted,
			expectError:    false,
		},
		{
			testCase: "Request form edits requested: not at intake form step",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepGRBMEETING,
				RequestFormState: models.SIRFSEditsRequested,
			},
			expectedStatus: models.ITGovIntakeFormStatusCompleted,
			expectError:    false,
		},
		{
			testCase: "Request form submitted: not at intake form step",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepGRBMEETING,
				RequestFormState: models.SIRFSSubmitted,
			},
			expectedStatus: models.ITGovIntakeFormStatusCompleted,
			expectError:    false,
		},
		{
			testCase: "Request form default state: not at intake form step, expect complete",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepGRBMEETING,
				RequestFormState: defaultTestState,
			},
			expectedStatus: models.ITGovIntakeFormStatusCompleted,
			expectError:    false,
		},
	}

	for i := range intakeFormTests {
		test := intakeFormTests[i]
		t.Run(test.testCase, func(t *testing.T) {
			status, err := IntakeFormStatus(&test.intake)
			assert.EqualValues(t, test.expectedStatus, status)
			if test.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}

		})
	}

}

func TestFeedbackFromInitialReviewStatus(t *testing.T) {
	defaultTestState := models.SystemIntakeFormState("Testing Default State")

	intakeFormFeedbackTests := []testSystemIntakeFormFeedbackStatusType{
		//Test cases when the step is the Intake Form
		{
			testCase: "Request form not started",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepINITIALFORM,
				RequestFormState: models.SIRFSNotStarted,
			},
			expectedStatus: models.ITGovFeedbackStatusCantStart,
			expectError:    false,
		},
		{
			testCase: "Request form started",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepINITIALFORM,
				RequestFormState: models.SIRFSInProgress,
			},
			expectedStatus: models.ITGovFeedbackStatusCantStart,
			expectError:    false,
		},
		{
			testCase: "Request form Submitted",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepINITIALFORM,
				RequestFormState: models.SIRFSSubmitted,
			},
			expectedStatus: models.ITGovFeedbackStatusInReview,
			expectError:    false,
		},

		{
			testCase: "Request form edits requested",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepINITIALFORM,
				RequestFormState: models.SIRFSEditsRequested,
			},
			expectedStatus: models.ITGovFeedbackStatusCompleted,
			expectError:    false,
		},
		{
			testCase: "Request form default case",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepINITIALFORM,
				RequestFormState: defaultTestState,
			},
			expectedStatus: "",
			expectError:    true,
		},

		//Tests when the step is not the Intake form
		{
			testCase: "Request form not started: not at intake form step",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepGRBMEETING,
				RequestFormState: models.SIRFSNotStarted,
			},
			expectedStatus: models.ITGovFeedbackStatusCompleted,
			expectError:    false,
		},
		{
			testCase: "Request form started: not at intake form step",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepGRBMEETING,
				RequestFormState: models.SIRFSInProgress,
			},
			expectedStatus: models.ITGovFeedbackStatusCompleted,
			expectError:    false,
		},
		{
			testCase: "Request form edits requested: not at intake form step",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepGRBMEETING,
				RequestFormState: models.SIRFSEditsRequested,
			},
			expectedStatus: models.ITGovFeedbackStatusCompleted,
			expectError:    false,
		},
		{
			testCase: "Request form submitted: not at intake form step",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepGRBMEETING,
				RequestFormState: models.SIRFSSubmitted,
			},
			expectedStatus: models.ITGovFeedbackStatusCompleted,
			expectError:    false,
		},
		{
			testCase: "Request form default state: not at intake form step, expect complete",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepGRBMEETING,
				RequestFormState: defaultTestState,
			},
			expectedStatus: models.ITGovFeedbackStatusCompleted,
			expectError:    false,
		},
	}

	for i := range intakeFormFeedbackTests {
		test := intakeFormFeedbackTests[i]
		t.Run(test.testCase, func(t *testing.T) {
			status, err := FeedbackFromInitialReviewStatus(&test.intake)
			assert.EqualValues(t, test.expectedStatus, status)
			if test.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}

		})
	}

}
func TestDecisionAndNextStepsStatus(t *testing.T) {
	yesterday := time.Now().Add(time.Hour * -24)
	tomorrow := time.Now().Add(time.Hour * 24)

	decisionStateTests := []testSystemIntakeDecisionStatusType{
		{
			testCase: "Request form not started",
			intake: models.SystemIntake{
				Step: models.SystemIntakeStepINITIALFORM,
			},
			expectedStatus: models.ITGovDecisionStatusCantStart,
			expectError:    false,
		},
		{
			testCase: "Draft Business Case",
			intake: models.SystemIntake{
				Step: models.SystemIntakeStepDRAFTBIZCASE,
			},
			expectedStatus: models.ITGovDecisionStatusCantStart,
			expectError:    false,
		},
		{
			testCase: "GRT Meeting",
			intake: models.SystemIntake{
				Step: models.SystemIntakeStepGRTMEETING,
			},
			expectedStatus: models.ITGovDecisionStatusCantStart,
			expectError:    false,
		},
		{
			testCase: "Final Business Case",
			intake: models.SystemIntake{
				Step: models.SystemIntakeStepFINALBIZCASE,
			},
			expectedStatus: models.ITGovDecisionStatusCantStart,
			expectError:    false,
		},
		//Testing GRB Meeting States
		{
			testCase: "GRB Meeting: no meeting scheduled",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepGRBMEETING,
				GRBDate: nil,
			},
			expectedStatus: models.ITGovDecisionStatusCantStart,
			expectError:    false,
		},
		{
			testCase: "GRB Meeting: meeting scheduled, but hasn't happened",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepGRBMEETING,
				GRBDate: &tomorrow,
			},
			expectedStatus: models.ITGovDecisionStatusCantStart,
			expectError:    false,
		},
		{
			testCase: "GRB Meeting: meeting scheduled, it already happened",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepGRBMEETING,
				GRBDate: &yesterday,
			},
			expectedStatus: models.ITGovDecisionStatusInReview,
			expectError:    false,
		},
		{
			testCase: "Decision issued step: LCID Issued",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepDECISION,
				DecisionState: models.SIDSLcidIssued,
			},
			expectedStatus: models.ITGovDecisionStatusCompleted,
			expectError:    false,
		},
		{
			testCase: "Decision issued step: Not Approved",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepDECISION,
				DecisionState: models.SIDSNotApproved,
			},
			expectedStatus: models.ITGovDecisionStatusCompleted,
			expectError:    false,
		},
		{
			testCase: "Decision issued step: Not an IT Governance Request",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepDECISION,
				DecisionState: models.SIDSNotGovernance,
			},
			expectedStatus: models.ITGovDecisionStatusCompleted,
			expectError:    false,
		},
		{
			testCase: "Decision issued step: No decision issued",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepDECISION,
				DecisionState: models.SIDSNoDecision,
			},
			expectedStatus: "",
			expectError:    true,
		},
	}

	for i := range decisionStateTests {
		test := decisionStateTests[i]
		t.Run(test.testCase, func(t *testing.T) {
			status, err := DecisionAndNextStepsStatus(&test.intake)
			assert.EqualValues(t, test.expectedStatus, status)
			if test.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}

		})
	}

}
func TestBizCaseDraftStatus(t *testing.T) {
	defaultTestStep := models.SystemIntakeStep("Testing Default State")
	defaultTestState := models.SystemIntakeFormState("Testing Default State")

	draftBusinessCaseTests := []testSystemIntakeDraftBusinessCaseStatusType{
		//Test cases when the step is the Intake Form
		{
			testCase: "Request form not started",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepINITIALFORM,
				RequestFormState: models.SIRFSNotStarted,
			},
			expectedStatus: models.ITGovDraftBusinessCaseStatusCantStart,
			expectError:    false,
		},
		{
			testCase: "Invalid Step",
			intake: models.SystemIntake{
				Step: defaultTestStep,
			},
			expectedStatus: "",
			expectError:    true,
		},
		{
			testCase: "Draft Business Case Step: Invalid State",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDRAFTBIZCASE,
				DraftBusinessCaseState: defaultTestState,
			},
			expectedStatus: "",
			expectError:    true,
		},
		{
			testCase: "Draft Business Case Step: Not Started",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDRAFTBIZCASE,
				DraftBusinessCaseState: models.SIRFSNotStarted,
			},
			expectedStatus: models.ITGovDraftBusinessCaseStatusReady,
			expectError:    false,
		},
		{
			testCase: "Draft Business Case Step: In Progress",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDRAFTBIZCASE,
				DraftBusinessCaseState: models.SIRFSInProgress,
			},
			expectedStatus: models.ITGovDraftBusinessCaseStatusInProgress,
			expectError:    false,
		},
		{
			testCase: "Draft Business Case Step: Submitted",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDRAFTBIZCASE,
				DraftBusinessCaseState: models.SIRFSSubmitted,
			},
			expectedStatus: models.ITGovDraftBusinessCaseStatusSubmitted,
			expectError:    false,
		},
		{
			testCase: "Draft Business Case Step: Edits Requested",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDRAFTBIZCASE,
				DraftBusinessCaseState: models.SIRFSEditsRequested,
			},
			expectedStatus: models.ITGovDraftBusinessCaseStatusEditsRequested,
			expectError:    false,
		},
		{
			testCase: "Decision Step: Invalid State",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDECISION,
				DraftBusinessCaseState: defaultTestState,
			},
			expectedStatus: "",
			expectError:    true,
		},
		{
			testCase: "GRT Step: Invalid State",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRTMEETING,
				DraftBusinessCaseState: defaultTestState,
			},
			expectedStatus: "",
			expectError:    true,
		},
		{
			testCase: "GRB Step: Invalid State",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRBMEETING,
				DraftBusinessCaseState: defaultTestState,
			},
			expectedStatus: "",
			expectError:    true,
		},
		{
			testCase: "Final Business Case: Invalid State",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepFINALBIZCASE,
				DraftBusinessCaseState: defaultTestState,
			},
			expectedStatus: "",
			expectError:    true,
		},
		{
			testCase: "Decision Step: Draft Business Case Not Needed",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDECISION,
				DraftBusinessCaseState: models.SIRFSNotStarted,
			},
			expectedStatus: models.ITGovDraftBusinessCaseStatusNotNeeded,
			expectError:    false,
		},
		{
			testCase: "GRT Step: Draft Business Case Not Needed",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRTMEETING,
				DraftBusinessCaseState: models.SIRFSNotStarted,
			},
			expectedStatus: models.ITGovDraftBusinessCaseStatusNotNeeded,
			expectError:    false,
		},
		{
			testCase: "GRB Step: Draft Business Case Not Needed",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRBMEETING,
				DraftBusinessCaseState: models.SIRFSNotStarted,
			},
			expectedStatus: models.ITGovDraftBusinessCaseStatusNotNeeded,
			expectError:    false,
		},
		{
			testCase: "Final Business Case: Draft Business Case Not Needed",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepFINALBIZCASE,
				DraftBusinessCaseState: models.SIRFSNotStarted,
			},
			expectedStatus: models.ITGovDraftBusinessCaseStatusNotNeeded,
			expectError:    false,
		},
		{
			testCase: "Decision Step: Draft Business Case Edits Requested --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDECISION,
				DraftBusinessCaseState: models.SIRFSEditsRequested,
			},
			expectedStatus: models.ITGovDraftBusinessCaseStatusDone,
			expectError:    false,
		},
		{
			testCase: "GRT Step: Draft Business Case Edits Requested --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRTMEETING,
				DraftBusinessCaseState: models.SIRFSEditsRequested,
			},
			expectedStatus: models.ITGovDraftBusinessCaseStatusDone,
			expectError:    false,
		},
		{
			testCase: "GRB Step: Draft Business Case Edits Requested --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRBMEETING,
				DraftBusinessCaseState: models.SIRFSEditsRequested,
			},
			expectedStatus: models.ITGovDraftBusinessCaseStatusDone,
			expectError:    false,
		},
		{
			testCase: "Final Business Case: Draft Business Case Edits Requested --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepFINALBIZCASE,
				DraftBusinessCaseState: models.SIRFSEditsRequested,
			},
			expectedStatus: models.ITGovDraftBusinessCaseStatusDone,
			expectError:    false,
		},
		{
			testCase: "Decision Step: Draft Business Case In Progress --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDECISION,
				DraftBusinessCaseState: models.SIRFSInProgress,
			},
			expectedStatus: models.ITGovDraftBusinessCaseStatusDone,
			expectError:    false,
		},
		{
			testCase: "GRT Step: Draft Business Case In Progress --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRTMEETING,
				DraftBusinessCaseState: models.SIRFSInProgress,
			},
			expectedStatus: models.ITGovDraftBusinessCaseStatusDone,
			expectError:    false,
		},
		{
			testCase: "GRB Step: Draft Business Case In Progress --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRBMEETING,
				DraftBusinessCaseState: models.SIRFSInProgress,
			},
			expectedStatus: models.ITGovDraftBusinessCaseStatusDone,
			expectError:    false,
		},
		{
			testCase: "Final Business Case: Draft Business Case In Progress --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepFINALBIZCASE,
				DraftBusinessCaseState: models.SIRFSInProgress,
			},
			expectedStatus: models.ITGovDraftBusinessCaseStatusDone,
			expectError:    false,
		},
		{
			testCase: "Decision Step: Draft Business Case Submitted --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDECISION,
				DraftBusinessCaseState: models.SIRFSSubmitted,
			},
			expectedStatus: models.ITGovDraftBusinessCaseStatusDone,
			expectError:    false,
		},
		{
			testCase: "GRT Step: Draft Business Case Submitted --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRTMEETING,
				DraftBusinessCaseState: models.SIRFSSubmitted,
			},
			expectedStatus: models.ITGovDraftBusinessCaseStatusDone,
			expectError:    false,
		},
		{
			testCase: "GRB Step: Draft Business Case Submitted --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRBMEETING,
				DraftBusinessCaseState: models.SIRFSSubmitted,
			},
			expectedStatus: models.ITGovDraftBusinessCaseStatusDone,
			expectError:    false,
		},
		{
			testCase: "Final Business Case: Draft Business Case Submitted --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepFINALBIZCASE,
				DraftBusinessCaseState: models.SIRFSSubmitted,
			},
			expectedStatus: models.ITGovDraftBusinessCaseStatusDone,
			expectError:    false,
		},
	}

	for i := range draftBusinessCaseTests {
		test := draftBusinessCaseTests[i]
		t.Run(test.testCase, func(t *testing.T) {
			status, err := BizCaseDraftStatus(&test.intake)
			assert.EqualValues(t, test.expectedStatus, status)
			if test.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}

		})
	}

}
func TestGrtMeetingStatus(t *testing.T) {
	yesterday := time.Now().Add(time.Hour * -24)
	tomorrow := time.Now().Add(time.Hour * 24)
	invalidTestStep := models.SystemIntakeStep("Testing Invalid Step")

	decisionStateTests := []testSystemIntakeGRTStatusType{
		{
			testCase: "Request form: No GRT Date Scheduled",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepINITIALFORM,
				GRTDate: nil,
			},
			expectedStatus: models.ITGovGRTStatusCantStart,
			expectError:    false,
		},
		{
			testCase: "Request form: GRT Date Yesterday",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepINITIALFORM,
				GRTDate: &yesterday,
			},
			expectedStatus: models.ITGovGRTStatusCompleted,
			expectError:    false,
		},
		{
			testCase: "Request form: GRT Date Tommorrow",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepINITIALFORM,
				GRTDate: &tomorrow,
			},
			expectedStatus: models.ITGovGRTStatusScheduled,
			expectError:    false,
		},
		{
			testCase: "Draft Business Case: No GRT Date Scheduled",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepDRAFTBIZCASE,
				GRTDate: nil,
			},
			expectedStatus: models.ITGovGRTStatusCantStart,
			expectError:    false,
		},
		{
			testCase: "Draft Business Case: GRT Date Yesterday",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepDRAFTBIZCASE,
				GRTDate: &yesterday,
			},
			expectedStatus: models.ITGovGRTStatusCompleted,
			expectError:    false,
		},
		{
			testCase: "Draft Business Case: GRT Date Tommorrow",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepDRAFTBIZCASE,
				GRTDate: &tomorrow,
			},
			expectedStatus: models.ITGovGRTStatusScheduled,
			expectError:    false,
		},
		{
			testCase: "GRT Step: No GRT Date Scheduled",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepGRTMEETING,
				GRTDate: nil,
			},
			expectedStatus: models.ITGovGRTStatusReadyToSchedule,
			expectError:    false,
		},
		{
			testCase: "GRT Step: GRT Date Yesterday",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepGRTMEETING,
				GRTDate: &yesterday,
			},
			expectedStatus: models.ITGovGRTStatusAwaitingDecision,
			expectError:    false,
		},
		{
			testCase: "GRT Step: GRT Date Tommorrow",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepGRTMEETING,
				GRTDate: &tomorrow,
			},
			expectedStatus: models.ITGovGRTStatusScheduled,
			expectError:    false,
		},
		{
			testCase: "Final Business Case Step: No GRT Date Scheduled",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepFINALBIZCASE,
				GRTDate: nil,
			},
			expectedStatus: models.ITGovGRTStatusNotNeeded,
			expectError:    false,
		},
		{
			testCase: "Final Business Case Step: GRT Date Yesterday",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepFINALBIZCASE,
				GRTDate: &yesterday,
			},
			expectedStatus: models.ITGovGRTStatusCompleted,
			expectError:    false,
		},
		{
			testCase: "Final Business Case Step: GRT Date Tommorrow",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepFINALBIZCASE,
				GRTDate: &tomorrow,
			},
			expectedStatus: models.ITGovGRTStatusScheduled,
			expectError:    false,
		},
		{
			testCase: "GRB Step: No GRT Date Scheduled",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepGRBMEETING,
				GRTDate: nil,
			},
			expectedStatus: models.ITGovGRTStatusNotNeeded,
			expectError:    false,
		},
		{
			testCase: "GRB Step: GRT Date Yesterday",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepGRBMEETING,
				GRTDate: &yesterday,
			},
			expectedStatus: models.ITGovGRTStatusCompleted,
			expectError:    false,
		},
		{
			testCase: "GRB Step: GRT Date Tommorrow",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepGRBMEETING,
				GRTDate: &tomorrow,
			},
			expectedStatus: models.ITGovGRTStatusScheduled,
			expectError:    false,
		},
		{
			testCase: "Decision Step: No GRT Date Scheduled",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepDECISION,
				GRTDate: nil,
			},
			expectedStatus: models.ITGovGRTStatusNotNeeded,
			expectError:    false,
		},
		{
			testCase: "Decision Step: GRT Date Yesterday",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepDECISION,
				GRTDate: &yesterday,
			},
			expectedStatus: models.ITGovGRTStatusCompleted,
			expectError:    false,
		},
		{
			testCase: "Decision Step: GRT Date Tommorrow",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepDECISION,
				GRTDate: &tomorrow,
			},
			expectedStatus: models.ITGovGRTStatusScheduled,
			expectError:    false,
		},
		{
			testCase: "Invalid Step: No GRT Date Scheduled, expect error",
			intake: models.SystemIntake{
				Step:    invalidTestStep,
				GRTDate: nil,
			},
			expectedStatus: "",
			expectError:    true,
		},
		{
			testCase: "Invalid Step: GRT Date Yesterday, no error",
			intake: models.SystemIntake{
				Step:    invalidTestStep,
				GRTDate: &yesterday,
			},
			expectedStatus: models.ITGovGRTStatusCompleted,
			expectError:    false,
		},
		{
			testCase: "Invalid Step: GRT Date Tommorrow, no error",
			intake: models.SystemIntake{
				Step:    invalidTestStep,
				GRTDate: &tomorrow,
			},
			expectedStatus: models.ITGovGRTStatusScheduled,
			expectError:    false,
		},
	}

	for i := range decisionStateTests {
		test := decisionStateTests[i]
		t.Run(test.testCase, func(t *testing.T) {
			status, err := GrtMeetingStatus(&test.intake)
			assert.EqualValues(t, test.expectedStatus, status)
			if test.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}

		})
	}

}
func TestBizCaseFinalStatus(t *testing.T) {
	defaultTestStep := models.SystemIntakeStep("Testing Default State")
	defaultTestState := models.SystemIntakeFormState("Testing Default State")
	finalBusinessCaseTests := []testSystemIntakeBusinessCaseFinalStatusType{
		//Test cases when the step is the Intake Form
		{
			testCase: "Request form not started",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepINITIALFORM,
				RequestFormState: models.SIRFSNotStarted,
			},
			expectedStatus: models.ITGovFinalBusinessCaseStatusCantStart,
			expectError:    false,
		},
		{
			testCase: "Invalid Step",
			intake: models.SystemIntake{
				Step: defaultTestStep,
			},
			expectedStatus: "",
			expectError:    true,
		},
		{
			testCase: "Final Business Case Step: Invalid State",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepFINALBIZCASE,
				FinalBusinessCaseState: defaultTestState,
			},
			expectedStatus: "",
			expectError:    true,
		},
		{
			testCase: "Final Business Case Step: Not Started",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepFINALBIZCASE,
				FinalBusinessCaseState: models.SIRFSNotStarted,
			},
			expectedStatus: models.ITGovFinalBusinessCaseStatusReady,
			expectError:    false,
		},
		{
			testCase: "Final Business Case Step: In Progress",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepFINALBIZCASE,
				FinalBusinessCaseState: models.SIRFSInProgress,
			},
			expectedStatus: models.ITGovFinalBusinessCaseStatusInProgress,
			expectError:    false,
		},
		{
			testCase: "Final Business Case Step: Submitted",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepFINALBIZCASE,
				FinalBusinessCaseState: models.SIRFSSubmitted,
			},
			expectedStatus: models.ITGovFinalBusinessCaseStatusSubmitted,
			expectError:    false,
		},
		{
			testCase: "Final Business Case Step: Edits Requested",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepFINALBIZCASE,
				FinalBusinessCaseState: models.SIRFSEditsRequested,
			},
			expectedStatus: models.ITGovFinalBusinessCaseStatusEditsRequested,
			expectError:    false,
		},
		{
			testCase: "Decision Step: Invalid State",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDECISION,
				FinalBusinessCaseState: defaultTestState,
			},
			expectedStatus: "",
			expectError:    true,
		},
		{
			testCase: "GRT Step: Invalid State",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRTMEETING,
				FinalBusinessCaseState: defaultTestState,
			},
			expectedStatus: models.ITGovFinalBusinessCaseStatusCantStart, // because it isn't there yet, we don't care about the invalid state
			expectError:    false,
		},
		{
			testCase: "GRB Step: Invalid State",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRBMEETING,
				FinalBusinessCaseState: defaultTestState,
			},
			expectedStatus: "",
			expectError:    true,
		},
		{
			testCase: "Draft Business Case: Invalid State",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDRAFTBIZCASE,
				FinalBusinessCaseState: defaultTestState,
			},
			expectedStatus: models.ITGovFinalBusinessCaseStatusCantStart, // because it isn't there yet, we don't care about the invalid state
			expectError:    false,
		},
		{
			testCase: "Decision Step: Final Business Case Not Needed",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDECISION,
				FinalBusinessCaseState: models.SIRFSNotStarted,
			},
			expectedStatus: models.ITGovFinalBusinessCaseStatusNotNeeded,
			expectError:    false,
		},
		{
			testCase: "GRT Step: Final Business Case Cant Start",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRTMEETING,
				FinalBusinessCaseState: models.SIRFSNotStarted,
			},
			expectedStatus: models.ITGovFinalBusinessCaseStatusCantStart,
			expectError:    false,
		},
		{
			testCase: "GRB Step: Final Business Case Not Needed",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRBMEETING,
				FinalBusinessCaseState: models.SIRFSNotStarted,
			},
			expectedStatus: models.ITGovFinalBusinessCaseStatusNotNeeded,
			expectError:    false,
		},
		{
			testCase: "Draft Business Case: Final Business Case Cant Start",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDRAFTBIZCASE,
				FinalBusinessCaseState: models.SIRFSNotStarted,
			},
			expectedStatus: models.ITGovFinalBusinessCaseStatusCantStart,
			expectError:    false,
		},
		{
			testCase: "Decision Step: Final Business Case Edits Requested --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDECISION,
				FinalBusinessCaseState: models.SIRFSEditsRequested,
			},
			expectedStatus: models.ITGovFinalBusinessCaseStatusDone,
			expectError:    false,
		},
		{
			testCase: "GRT Step: Final Business Case Edits Requested --> Cant start",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRTMEETING,
				FinalBusinessCaseState: models.SIRFSEditsRequested,
			},
			expectedStatus: models.ITGovFinalBusinessCaseStatusCantStart,
			expectError:    false,
		},
		{
			testCase: "GRB Step: Final Business Case Edits Requested --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRBMEETING,
				FinalBusinessCaseState: models.SIRFSEditsRequested,
			},
			expectedStatus: models.ITGovFinalBusinessCaseStatusDone,
			expectError:    false,
		},
		{
			testCase: "Draft Business Case: Final Business Case Edits Requested --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDRAFTBIZCASE,
				FinalBusinessCaseState: models.SIRFSEditsRequested,
			},
			expectedStatus: models.ITGovFinalBusinessCaseStatusCantStart,
			expectError:    false,
		},
		{
			testCase: "Decision Step: Final Business Case In Progress --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDECISION,
				FinalBusinessCaseState: models.SIRFSInProgress,
			},
			expectedStatus: models.ITGovFinalBusinessCaseStatusDone,
			expectError:    false,
		},
		{
			testCase: "GRT Step: Final Business Case In Progress --> Can't Start",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRTMEETING,
				FinalBusinessCaseState: models.SIRFSInProgress,
			},
			expectedStatus: models.ITGovFinalBusinessCaseStatusCantStart,
			expectError:    false,
		},
		{
			testCase: "GRB Step: Final Business Case In Progress --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRBMEETING,
				FinalBusinessCaseState: models.SIRFSInProgress,
			},
			expectedStatus: models.ITGovFinalBusinessCaseStatusDone,
			expectError:    false,
		},
		{
			testCase: "Draft Business Case: Final Business Case In Progress --> Cant Start",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDRAFTBIZCASE,
				FinalBusinessCaseState: models.SIRFSInProgress,
			},
			expectedStatus: models.ITGovFinalBusinessCaseStatusCantStart,
			expectError:    false,
		},
		{
			testCase: "Decision Step: Final Business Case Submitted --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDECISION,
				FinalBusinessCaseState: models.SIRFSSubmitted,
			},
			expectedStatus: models.ITGovFinalBusinessCaseStatusDone,
			expectError:    false,
		},
		{
			testCase: "GRT Step: Final Business Case Submitted --> Cant Start",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRTMEETING,
				FinalBusinessCaseState: models.SIRFSSubmitted,
			},
			expectedStatus: models.ITGovFinalBusinessCaseStatusCantStart,
			expectError:    false,
		},
		{
			testCase: "GRB Step: Final Business Case Submitted --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRBMEETING,
				FinalBusinessCaseState: models.SIRFSSubmitted,
			},
			expectedStatus: models.ITGovFinalBusinessCaseStatusDone,
			expectError:    false,
		},
		{
			testCase: "Draft Business Case: Final Business Case Submitted --> Cant Start",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDRAFTBIZCASE,
				FinalBusinessCaseState: models.SIRFSSubmitted,
			},
			expectedStatus: models.ITGovFinalBusinessCaseStatusCantStart,
			expectError:    false,
		},
	}

	for i := range finalBusinessCaseTests {
		test := finalBusinessCaseTests[i]
		t.Run(test.testCase, func(t *testing.T) {
			status, err := BizCaseFinalStatus(&test.intake)
			assert.EqualValues(t, test.expectedStatus, status)
			if test.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}

		})
	}

}
func TestGrbMeetingStatus(t *testing.T) {

	yesterday := time.Now().Add(time.Hour * -24)
	tomorrow := time.Now().Add(time.Hour * 24)
	invalidTestStep := models.SystemIntakeStep("Testing Invalid Step")

	grbTests := []testSystemIntakeGRBStatusType{
		{
			testCase: "Request form: No GRB Date Scheduled",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepINITIALFORM,
				GRBDate: nil,
			},
			expectedStatus: models.ITGovGRBStatusCantStart,
			expectError:    false,
		},
		{
			testCase: "Request form: GRB Date Yesterday",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepINITIALFORM,
				GRBDate: &yesterday,
			},
			expectedStatus: models.ITGovGRBStatusCompleted,
			expectError:    false,
		},
		{
			testCase: "Request form: GRB Date Tommorrow",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepINITIALFORM,
				GRBDate: &tomorrow,
			},
			expectedStatus: models.ITGovGRBStatusScheduled,
			expectError:    false,
		},
		{
			testCase: "Draft Business Case: No GRB Date Scheduled",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepDRAFTBIZCASE,
				GRBDate: nil,
			},
			expectedStatus: models.ITGovGRBStatusCantStart,
			expectError:    false,
		},
		{
			testCase: "Draft Business Case: GRB Date Yesterday",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepDRAFTBIZCASE,
				GRBDate: &yesterday,
			},
			expectedStatus: models.ITGovGRBStatusCompleted,
			expectError:    false,
		},
		{
			testCase: "Draft Business Case: GRB Date Tommorrow",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepDRAFTBIZCASE,
				GRBDate: &tomorrow,
			},
			expectedStatus: models.ITGovGRBStatusScheduled,
			expectError:    false,
		},
		{
			testCase: "GRT Step: No GRB Date Scheduled",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepGRTMEETING,
				GRBDate: nil,
			},
			expectedStatus: models.ITGovGRBStatusCantStart,
			expectError:    false,
		},
		{
			testCase: "GRT Step: GRB Date Yesterday",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepGRTMEETING,
				GRBDate: &yesterday,
			},
			expectedStatus: models.ITGovGRBStatusCompleted,
			expectError:    false,
		},
		{
			testCase: "GRT Step: GRB Date Tommorrow",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepGRTMEETING,
				GRBDate: &tomorrow,
			},
			expectedStatus: models.ITGovGRBStatusScheduled,
			expectError:    false,
		},
		{
			testCase: "Final Business Case Step: No GRB Date Scheduled",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepFINALBIZCASE,
				GRBDate: nil,
			},
			expectedStatus: models.ITGovGRBStatusCantStart,
			expectError:    false,
		},
		{
			testCase: "Final Business Case Step: GRB Date Yesterday",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepFINALBIZCASE,
				GRBDate: &yesterday,
			},
			expectedStatus: models.ITGovGRBStatusCompleted,
			expectError:    false,
		},
		{
			testCase: "Final Business Case Step: GRB Date Tommorrow",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepFINALBIZCASE,
				GRBDate: &tomorrow,
			},
			expectedStatus: models.ITGovGRBStatusScheduled,
			expectError:    false,
		},
		{
			testCase: "GRB Step: No GRB Date Scheduled",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepGRBMEETING,
				GRBDate: nil,
			},
			expectedStatus: models.ITGovGRBStatusReadyToSchedule,
			expectError:    false,
		},
		{
			testCase: "GRB Step: GRB Date Yesterday",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepGRBMEETING,
				GRBDate: &yesterday,
			},
			expectedStatus: models.ITGovGRBStatusAwaitingDecision,
			expectError:    false,
		},
		{
			testCase: "GRB Step: GRB Date Tommorrow",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepGRBMEETING,
				GRBDate: &tomorrow,
			},
			expectedStatus: models.ITGovGRBStatusScheduled,
			expectError:    false,
		},
		{
			testCase: "Decision Step: No GRB Date Scheduled",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepDECISION,
				GRBDate: nil,
			},
			expectedStatus: models.ITGovGRBStatusNotNeeded,
			expectError:    false,
		},
		{
			testCase: "Decision Step: GRB Date Yesterday",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepDECISION,
				GRBDate: &yesterday,
			},
			expectedStatus: models.ITGovGRBStatusCompleted,
			expectError:    false,
		},
		{
			testCase: "Decision Step: GRB Date Tommorrow",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepDECISION,
				GRBDate: &tomorrow,
			},
			expectedStatus: models.ITGovGRBStatusScheduled,
			expectError:    false,
		},
		{
			testCase: "Invalid Step: No GRB Date Scheduled, expect error",
			intake: models.SystemIntake{
				Step:    invalidTestStep,
				GRBDate: nil,
			},
			expectedStatus: "",
			expectError:    true,
		},
		{
			testCase: "Invalid Step: GRB Date Yesterday, no error",
			intake: models.SystemIntake{
				Step:    invalidTestStep,
				GRBDate: &yesterday,
			},
			expectedStatus: models.ITGovGRBStatusCompleted,
			expectError:    false,
		},
		{
			testCase: "Invalid Step: GRB Date Tommorrow, no error",
			intake: models.SystemIntake{
				Step:    invalidTestStep,
				GRBDate: &tomorrow,
			},
			expectedStatus: models.ITGovGRBStatusScheduled,
			expectError:    false,
		},
	}

	for i := range grbTests {
		test := grbTests[i]
		t.Run(test.testCase, func(t *testing.T) {
			status, err := GrbMeetingStatus(&test.intake)
			assert.EqualValues(t, test.expectedStatus, status)
			if test.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}
		})
	}

}
