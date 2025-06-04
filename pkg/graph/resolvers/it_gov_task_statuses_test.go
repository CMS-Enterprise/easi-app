package resolvers

import (
	"context"
	"testing"
	"time"

	"github.com/cms-enterprise/easi-app/pkg/helpers"

	"github.com/stretchr/testify/assert"

	"github.com/cms-enterprise/easi-app/pkg/models"
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
			expectedStatus: models.ITGISReady,
			expectError:    false,
		},
		{
			testCase: "Request form started",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepINITIALFORM,
				RequestFormState: models.SIRFSInProgress,
			},
			expectedStatus: models.ITGISInProgress,
			expectError:    false,
		},
		{
			testCase: "Request form edits requested",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepINITIALFORM,
				RequestFormState: models.SIRFSEditsRequested,
			},
			expectedStatus: models.ITGISEditsRequested,
			expectError:    false,
		},
		{
			testCase: "Request form submitted",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepINITIALFORM,
				RequestFormState: models.SIRFSSubmitted,
			},
			expectedStatus: models.ITGISCompleted,
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
			expectedStatus: models.ITGISCompleted,
			expectError:    false,
		},
		{
			testCase: "Request form started: not at intake form step",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepGRBMEETING,
				RequestFormState: models.SIRFSInProgress,
			},
			expectedStatus: models.ITGISCompleted,
			expectError:    false,
		},
		{
			testCase: "Request form edits requested: not at intake form step",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepGRBMEETING,
				RequestFormState: models.SIRFSEditsRequested,
			},
			expectedStatus: models.ITGISCompleted,
			expectError:    false,
		},
		{
			testCase: "Request form submitted: not at intake form step",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepGRBMEETING,
				RequestFormState: models.SIRFSSubmitted,
			},
			expectedStatus: models.ITGISCompleted,
			expectError:    false,
		},
		{
			testCase: "Request form default state: not at intake form step, expect complete",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepGRBMEETING,
				RequestFormState: defaultTestState,
			},
			expectedStatus: models.ITGISCompleted,
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
			expectedStatus: models.ITGFBSCantStart,
			expectError:    false,
		},
		{
			testCase: "Request form started",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepINITIALFORM,
				RequestFormState: models.SIRFSInProgress,
			},
			expectedStatus: models.ITGFBSCantStart,
			expectError:    false,
		},
		{
			testCase: "Request form Submitted",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepINITIALFORM,
				RequestFormState: models.SIRFSSubmitted,
			},
			expectedStatus: models.ITGFBSInReview,
			expectError:    false,
		},

		{
			testCase: "Request form edits requested",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepINITIALFORM,
				RequestFormState: models.SIRFSEditsRequested,
			},
			expectedStatus: models.ITGFBSCompleted,
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
			expectedStatus: models.ITGFBSCompleted,
			expectError:    false,
		},
		{
			testCase: "Request form started: not at intake form step",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepGRBMEETING,
				RequestFormState: models.SIRFSInProgress,
			},
			expectedStatus: models.ITGFBSCompleted,
			expectError:    false,
		},
		{
			testCase: "Request form edits requested: not at intake form step",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepGRBMEETING,
				RequestFormState: models.SIRFSEditsRequested,
			},
			expectedStatus: models.ITGFBSCompleted,
			expectError:    false,
		},
		{
			testCase: "Request form submitted: not at intake form step",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepGRBMEETING,
				RequestFormState: models.SIRFSSubmitted,
			},
			expectedStatus: models.ITGFBSCompleted,
			expectError:    false,
		},
		{
			testCase: "Request form default state: not at intake form step, expect complete",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepGRBMEETING,
				RequestFormState: defaultTestState,
			},
			expectedStatus: models.ITGFBSCompleted,
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
			expectedStatus: models.ITGDSCantStart,
			expectError:    false,
		},
		{
			testCase: "Draft Business Case",
			intake: models.SystemIntake{
				Step: models.SystemIntakeStepDRAFTBIZCASE,
			},
			expectedStatus: models.ITGDSCantStart,
			expectError:    false,
		},
		{
			testCase: "GRT Meeting",
			intake: models.SystemIntake{
				Step: models.SystemIntakeStepGRTMEETING,
			},
			expectedStatus: models.ITGDSCantStart,
			expectError:    false,
		},
		{
			testCase: "Final Business Case",
			intake: models.SystemIntake{
				Step: models.SystemIntakeStepFINALBIZCASE,
			},
			expectedStatus: models.ITGDSCantStart,
			expectError:    false,
		},
		//Testing GRB Meeting States
		{
			testCase: "GRB Meeting: no meeting scheduled",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepGRBMEETING,
				GrbReviewType: models.SystemIntakeGRBReviewTypeStandard,
				GRBDate:       nil,
			},
			expectedStatus: models.ITGDSCantStart,
			expectError:    false,
		},
		{
			testCase: "GRB Meeting: meeting scheduled, but hasn't happened",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepGRBMEETING,
				GrbReviewType: models.SystemIntakeGRBReviewTypeStandard,
				GRBDate:       &tomorrow,
			},
			expectedStatus: models.ITGDSCantStart,
			expectError:    false,
		},
		{
			testCase: "GRB Meeting: meeting scheduled, it already happened",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepGRBMEETING,
				GrbReviewType: models.SystemIntakeGRBReviewTypeStandard,
				GRBDate:       &yesterday,
			},
			expectedStatus: models.ITGDSInReview,
			expectError:    false,
		},
		{
			testCase: "GRB Meeting: Async review, voting ended manually",
			intake: models.SystemIntake{
				Step:                        models.SystemIntakeStepGRBMEETING,
				GrbReviewType:               models.SystemIntakeGRBReviewTypeAsync,
				GrbReviewAsyncEndDate:       &tomorrow,
				GrbReviewAsyncManualEndDate: &yesterday,
			},
			expectedStatus: models.ITGDSInReview,
			expectError:    false,
		},
		{
			testCase: "Decision issued step: LCID Issued",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepDECISION,
				DecisionState: models.SIDSLcidIssued,
			},
			expectedStatus: models.ITGDSCompleted,
			expectError:    false,
		},
		{
			testCase: "Decision issued step: Not Approved",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepDECISION,
				DecisionState: models.SIDSNotApproved,
			},
			expectedStatus: models.ITGDSCompleted,
			expectError:    false,
		},
		{
			testCase: "Decision issued step: Not an IT Governance Request",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepDECISION,
				DecisionState: models.SIDSNotGovernance,
			},
			expectedStatus: models.ITGDSCompleted,
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
		{
			testCase: "Decision issued step: GRB Meeting, standard, GRB Date nil",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepGRBMEETING,
				GrbReviewType: models.SystemIntakeGRBReviewTypeStandard,
				GRBDate:       nil,
			},
			expectedStatus: models.ITGDSCantStart,
			expectError:    false,
		},
		{
			testCase: "Decision issued step: GRB Meeting, standard, GRB Date nil",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepGRBMEETING,
				GrbReviewType: models.SystemIntakeGRBReviewTypeStandard,
				GRBDate:       nil,
			},

			expectedStatus: models.ITGDSCantStart,
			expectError:    false,
		},
		{
			testCase: "Decision issued step: GRB Meeting, standard, GRB Date future",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepGRBMEETING,
				GrbReviewType: models.SystemIntakeGRBReviewTypeStandard,
				GRBDate:       helpers.PointerTo(time.Now().Add(time.Hour * 24)),
			},
			expectedStatus: models.ITGDSCantStart,
			expectError:    false,
		},
		{
			testCase: "Decision issued step: GRB Meeting, async, GRB Date nil",
			intake: models.SystemIntake{
				Step:                  models.SystemIntakeStepGRBMEETING,
				GrbReviewType:         models.SystemIntakeGRBReviewTypeAsync,
				GrbReviewAsyncEndDate: nil,
			},
			expectedStatus: models.ITGDSCantStart,
			expectError:    false,
		},
		{
			testCase: "Decision issued step: GRB Meeting, async, GRB Date future",
			intake: models.SystemIntake{
				Step:                  models.SystemIntakeStepGRBMEETING,
				GrbReviewType:         models.SystemIntakeGRBReviewTypeAsync,
				GrbReviewAsyncEndDate: helpers.PointerTo(time.Now().Add(time.Hour * 24)),
			},
			expectedStatus: models.ITGDSCantStart,
			expectError:    false,
		},
	}

	for i := range decisionStateTests {
		test := decisionStateTests[i]
		t.Run(test.testCase, func(t *testing.T) {
			status, err := DecisionAndNextStepsStatus(context.TODO(), &test.intake)
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
			expectedStatus: models.ITGDBCSCantStart,
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
			expectedStatus: models.ITGDBCSReady,
			expectError:    false,
		},
		{
			testCase: "Draft Business Case Step: In Progress",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDRAFTBIZCASE,
				DraftBusinessCaseState: models.SIRFSInProgress,
			},
			expectedStatus: models.ITGDBCSInProgress,
			expectError:    false,
		},
		{
			testCase: "Draft Business Case Step: Submitted",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDRAFTBIZCASE,
				DraftBusinessCaseState: models.SIRFSSubmitted,
			},
			expectedStatus: models.ITGDBCSSubmitted,
			expectError:    false,
		},
		{
			testCase: "Draft Business Case Step: Edits Requested",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDRAFTBIZCASE,
				DraftBusinessCaseState: models.SIRFSEditsRequested,
			},
			expectedStatus: models.ITGDBCSEditsRequested,
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
			expectedStatus: models.ITGDBCSNotNeeded,
			expectError:    false,
		},
		{
			testCase: "GRT Step: Draft Business Case Not Needed",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRTMEETING,
				DraftBusinessCaseState: models.SIRFSNotStarted,
			},
			expectedStatus: models.ITGDBCSNotNeeded,
			expectError:    false,
		},
		{
			testCase: "GRB Step: Draft Business Case Not Needed",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRBMEETING,
				DraftBusinessCaseState: models.SIRFSNotStarted,
			},
			expectedStatus: models.ITGDBCSNotNeeded,
			expectError:    false,
		},
		{
			testCase: "Final Business Case: Draft Business Case Not Needed",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepFINALBIZCASE,
				DraftBusinessCaseState: models.SIRFSNotStarted,
			},
			expectedStatus: models.ITGDBCSNotNeeded,
			expectError:    false,
		},
		{
			testCase: "Decision Step: Draft Business Case Edits Requested --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDECISION,
				DraftBusinessCaseState: models.SIRFSEditsRequested,
			},
			expectedStatus: models.ITGDBCSDone,
			expectError:    false,
		},
		{
			testCase: "GRT Step: Draft Business Case Edits Requested --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRTMEETING,
				DraftBusinessCaseState: models.SIRFSEditsRequested,
			},
			expectedStatus: models.ITGDBCSDone,
			expectError:    false,
		},
		{
			testCase: "GRB Step: Draft Business Case Edits Requested --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRBMEETING,
				DraftBusinessCaseState: models.SIRFSEditsRequested,
			},
			expectedStatus: models.ITGDBCSDone,
			expectError:    false,
		},
		{
			testCase: "Final Business Case: Draft Business Case Edits Requested --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepFINALBIZCASE,
				DraftBusinessCaseState: models.SIRFSEditsRequested,
			},
			expectedStatus: models.ITGDBCSDone,
			expectError:    false,
		},
		{
			testCase: "Decision Step: Draft Business Case In Progress --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDECISION,
				DraftBusinessCaseState: models.SIRFSInProgress,
			},
			expectedStatus: models.ITGDBCSDone,
			expectError:    false,
		},
		{
			testCase: "GRT Step: Draft Business Case In Progress --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRTMEETING,
				DraftBusinessCaseState: models.SIRFSInProgress,
			},
			expectedStatus: models.ITGDBCSDone,
			expectError:    false,
		},
		{
			testCase: "GRB Step: Draft Business Case In Progress --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRBMEETING,
				DraftBusinessCaseState: models.SIRFSInProgress,
			},
			expectedStatus: models.ITGDBCSDone,
			expectError:    false,
		},
		{
			testCase: "Final Business Case: Draft Business Case In Progress --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepFINALBIZCASE,
				DraftBusinessCaseState: models.SIRFSInProgress,
			},
			expectedStatus: models.ITGDBCSDone,
			expectError:    false,
		},
		{
			testCase: "Decision Step: Draft Business Case Submitted --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDECISION,
				DraftBusinessCaseState: models.SIRFSSubmitted,
			},
			expectedStatus: models.ITGDBCSDone,
			expectError:    false,
		},
		{
			testCase: "GRT Step: Draft Business Case Submitted --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRTMEETING,
				DraftBusinessCaseState: models.SIRFSSubmitted,
			},
			expectedStatus: models.ITGDBCSDone,
			expectError:    false,
		},
		{
			testCase: "GRB Step: Draft Business Case Submitted --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRBMEETING,
				DraftBusinessCaseState: models.SIRFSSubmitted,
			},
			expectedStatus: models.ITGDBCSDone,
			expectError:    false,
		},
		{
			testCase: "Final Business Case: Draft Business Case Submitted --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepFINALBIZCASE,
				DraftBusinessCaseState: models.SIRFSSubmitted,
			},
			expectedStatus: models.ITGDBCSDone,
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
			expectedStatus: models.ITGGRTSCantStart,
			expectError:    false,
		},
		{
			testCase: "Request form: GRT Date Yesterday",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepINITIALFORM,
				GRTDate: &yesterday,
			},
			expectedStatus: models.ITGGRTSCompleted,
			expectError:    false,
		},
		{
			testCase: "Request form: GRT Date Tommorrow",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepINITIALFORM,
				GRTDate: &tomorrow,
			},
			expectedStatus: models.ITGGRTSScheduled,
			expectError:    false,
		},
		{
			testCase: "Draft Business Case: No GRT Date Scheduled",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepDRAFTBIZCASE,
				GRTDate: nil,
			},
			expectedStatus: models.ITGGRTSCantStart,
			expectError:    false,
		},
		{
			testCase: "Draft Business Case: GRT Date Yesterday",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepDRAFTBIZCASE,
				GRTDate: &yesterday,
			},
			expectedStatus: models.ITGGRTSCompleted,
			expectError:    false,
		},
		{
			testCase: "Draft Business Case: GRT Date Tommorrow",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepDRAFTBIZCASE,
				GRTDate: &tomorrow,
			},
			expectedStatus: models.ITGGRTSScheduled,
			expectError:    false,
		},
		{
			testCase: "GRT Step: No GRT Date Scheduled",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepGRTMEETING,
				GRTDate: nil,
			},
			expectedStatus: models.ITGGRTSReadyToSchedule,
			expectError:    false,
		},
		{
			testCase: "GRT Step: GRT Date Yesterday",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepGRTMEETING,
				GRTDate: &yesterday,
			},
			expectedStatus: models.ITGGRTSAwaitingDecision,
			expectError:    false,
		},
		{
			testCase: "GRT Step: GRT Date Tommorrow",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepGRTMEETING,
				GRTDate: &tomorrow,
			},
			expectedStatus: models.ITGGRTSScheduled,
			expectError:    false,
		},
		{
			testCase: "Final Business Case Step: No GRT Date Scheduled",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepFINALBIZCASE,
				GRTDate: nil,
			},
			expectedStatus: models.ITGGRTSNotNeeded,
			expectError:    false,
		},
		{
			testCase: "Final Business Case Step: GRT Date Yesterday",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepFINALBIZCASE,
				GRTDate: &yesterday,
			},
			expectedStatus: models.ITGGRTSCompleted,
			expectError:    false,
		},
		{
			testCase: "Final Business Case Step: GRT Date Tommorrow",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepFINALBIZCASE,
				GRTDate: &tomorrow,
			},
			expectedStatus: models.ITGGRTSScheduled,
			expectError:    false,
		},
		{
			testCase: "GRB Step: No GRT Date Scheduled",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepGRBMEETING,
				GRTDate: nil,
			},
			expectedStatus: models.ITGGRTSNotNeeded,
			expectError:    false,
		},
		{
			testCase: "GRB Step: GRT Date Yesterday",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepGRBMEETING,
				GRTDate: &yesterday,
			},
			expectedStatus: models.ITGGRTSCompleted,
			expectError:    false,
		},
		{
			testCase: "GRB Step: GRT Date Tommorrow",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepGRBMEETING,
				GRTDate: &tomorrow,
			},
			expectedStatus: models.ITGGRTSScheduled,
			expectError:    false,
		},
		{
			testCase: "Decision Step: No GRT Date Scheduled",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepDECISION,
				GRTDate: nil,
			},
			expectedStatus: models.ITGGRTSNotNeeded,
			expectError:    false,
		},
		{
			testCase: "Decision Step: GRT Date Yesterday",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepDECISION,
				GRTDate: &yesterday,
			},
			expectedStatus: models.ITGGRTSCompleted,
			expectError:    false,
		},
		{
			testCase: "Decision Step: GRT Date Tommorrow",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepDECISION,
				GRTDate: &tomorrow,
			},
			expectedStatus: models.ITGGRTSScheduled,
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
			expectedStatus: models.ITGGRTSCompleted,
			expectError:    false,
		},
		{
			testCase: "Invalid Step: GRT Date Tommorrow, no error",
			intake: models.SystemIntake{
				Step:    invalidTestStep,
				GRTDate: &tomorrow,
			},
			expectedStatus: models.ITGGRTSScheduled,
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
			expectedStatus: models.ITGFBCSCantStart,
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
			expectedStatus: models.ITGFBCSReady,
			expectError:    false,
		},
		{
			testCase: "Final Business Case Step: In Progress",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepFINALBIZCASE,
				FinalBusinessCaseState: models.SIRFSInProgress,
			},
			expectedStatus: models.ITGFBCSInProgress,
			expectError:    false,
		},
		{
			testCase: "Final Business Case Step: Submitted",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepFINALBIZCASE,
				FinalBusinessCaseState: models.SIRFSSubmitted,
			},
			expectedStatus: models.ITGFBCSSubmitted,
			expectError:    false,
		},
		{
			testCase: "Final Business Case Step: Edits Requested",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepFINALBIZCASE,
				FinalBusinessCaseState: models.SIRFSEditsRequested,
			},
			expectedStatus: models.ITGFBCSEditsRequested,
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
			expectedStatus: models.ITGFBCSCantStart, // because it isn't there yet, we don't care about the invalid state
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
			expectedStatus: models.ITGFBCSCantStart, // because it isn't there yet, we don't care about the invalid state
			expectError:    false,
		},
		{
			testCase: "Decision Step: Final Business Case Not Needed",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDECISION,
				FinalBusinessCaseState: models.SIRFSNotStarted,
			},
			expectedStatus: models.ITGFBCSNotNeeded,
			expectError:    false,
		},
		{
			testCase: "GRT Step: Final Business Case Cant Start",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRTMEETING,
				FinalBusinessCaseState: models.SIRFSNotStarted,
			},
			expectedStatus: models.ITGFBCSCantStart,
			expectError:    false,
		},
		{
			testCase: "GRB Step: Final Business Case Not Needed",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRBMEETING,
				FinalBusinessCaseState: models.SIRFSNotStarted,
			},
			expectedStatus: models.ITGFBCSNotNeeded,
			expectError:    false,
		},
		{
			testCase: "Draft Business Case: Final Business Case Cant Start",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDRAFTBIZCASE,
				FinalBusinessCaseState: models.SIRFSNotStarted,
			},
			expectedStatus: models.ITGFBCSCantStart,
			expectError:    false,
		},
		{
			testCase: "Decision Step: Final Business Case Edits Requested --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDECISION,
				FinalBusinessCaseState: models.SIRFSEditsRequested,
			},
			expectedStatus: models.ITGFBCSDone,
			expectError:    false,
		},
		{
			testCase: "GRT Step: Final Business Case Edits Requested --> Cant start",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRTMEETING,
				FinalBusinessCaseState: models.SIRFSEditsRequested,
			},
			expectedStatus: models.ITGFBCSCantStart,
			expectError:    false,
		},
		{
			testCase: "GRB Step: Final Business Case Edits Requested --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRBMEETING,
				FinalBusinessCaseState: models.SIRFSEditsRequested,
			},
			expectedStatus: models.ITGFBCSDone,
			expectError:    false,
		},
		{
			testCase: "Draft Business Case: Final Business Case Edits Requested --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDRAFTBIZCASE,
				FinalBusinessCaseState: models.SIRFSEditsRequested,
			},
			expectedStatus: models.ITGFBCSCantStart,
			expectError:    false,
		},
		{
			testCase: "Decision Step: Final Business Case In Progress --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDECISION,
				FinalBusinessCaseState: models.SIRFSInProgress,
			},
			expectedStatus: models.ITGFBCSDone,
			expectError:    false,
		},
		{
			testCase: "GRT Step: Final Business Case In Progress --> Can't Start",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRTMEETING,
				FinalBusinessCaseState: models.SIRFSInProgress,
			},
			expectedStatus: models.ITGFBCSCantStart,
			expectError:    false,
		},
		{
			testCase: "GRB Step: Final Business Case In Progress --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRBMEETING,
				FinalBusinessCaseState: models.SIRFSInProgress,
			},
			expectedStatus: models.ITGFBCSDone,
			expectError:    false,
		},
		{
			testCase: "Draft Business Case: Final Business Case In Progress --> Cant Start",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDRAFTBIZCASE,
				FinalBusinessCaseState: models.SIRFSInProgress,
			},
			expectedStatus: models.ITGFBCSCantStart,
			expectError:    false,
		},
		{
			testCase: "Decision Step: Final Business Case Submitted --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDECISION,
				FinalBusinessCaseState: models.SIRFSSubmitted,
			},
			expectedStatus: models.ITGFBCSDone,
			expectError:    false,
		},
		{
			testCase: "GRT Step: Final Business Case Submitted --> Cant Start",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRTMEETING,
				FinalBusinessCaseState: models.SIRFSSubmitted,
			},
			expectedStatus: models.ITGFBCSCantStart,
			expectError:    false,
		},
		{
			testCase: "GRB Step: Final Business Case Submitted --> Done",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepGRBMEETING,
				FinalBusinessCaseState: models.SIRFSSubmitted,
			},
			expectedStatus: models.ITGFBCSDone,
			expectError:    false,
		},
		{
			testCase: "Draft Business Case: Final Business Case Submitted --> Cant Start",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDRAFTBIZCASE,
				FinalBusinessCaseState: models.SIRFSSubmitted,
			},
			expectedStatus: models.ITGFBCSCantStart,
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
	now := time.Now()
	yesterday := now.Add(-24 * time.Hour)
	tomorrow := now.Add(24 * time.Hour)

	invalidStep := models.SystemIntakeStep("Testing Invalid Step")

	tests := []testSystemIntakeGRBStatusType{
		// ---------- Initial Form ----------
		{
			testCase: "Request form: No GRB Date",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepINITIALFORM,
				GrbReviewType: models.SystemIntakeGRBReviewTypeStandard,
				GRBDate:       nil,
			},
			expectedStatus: models.ITGGRBSCantStart,
		},
		{
			testCase: "Request form: GRB Date Yesterday",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepINITIALFORM,
				GrbReviewType: models.SystemIntakeGRBReviewTypeStandard,
				GRBDate:       &yesterday,
			},
			expectedStatus: models.ITGGRBSCompleted,
		},
		{
			testCase: "Request form: GRB Date Tomorrow",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepINITIALFORM,
				GrbReviewType: models.SystemIntakeGRBReviewTypeStandard,
				GRBDate:       &tomorrow,
			},
			expectedStatus: models.ITGGRBSScheduled,
		},

		// ---------- Draft Business Case ----------
		{
			testCase: "Draft BC: No GRB Date",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepDRAFTBIZCASE,
				GrbReviewType: models.SystemIntakeGRBReviewTypeStandard,
				GRBDate:       nil,
			},
			expectedStatus: models.ITGGRBSCantStart,
		},
		{
			testCase: "Draft BC: GRB Date Yesterday",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepDRAFTBIZCASE,
				GrbReviewType: models.SystemIntakeGRBReviewTypeStandard,
				GRBDate:       &yesterday,
			},
			expectedStatus: models.ITGGRBSCompleted,
		},
		{
			testCase: "Draft BC: GRB Date Tomorrow",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepDRAFTBIZCASE,
				GrbReviewType: models.SystemIntakeGRBReviewTypeStandard,
				GRBDate:       &tomorrow,
			},
			expectedStatus: models.ITGGRBSScheduled,
		},

		// ---------- GRT ----------
		{
			testCase: "GRT: No GRB Date",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepGRTMEETING,
				GrbReviewType: models.SystemIntakeGRBReviewTypeStandard,
				GRBDate:       nil,
			},
			expectedStatus: models.ITGGRBSCantStart,
		},
		{
			testCase: "GRT: GRB Date Yesterday",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepGRTMEETING,
				GrbReviewType: models.SystemIntakeGRBReviewTypeStandard,
				GRBDate:       &yesterday,
			},
			expectedStatus: models.ITGGRBSCompleted,
		},
		{
			testCase: "GRT: GRB Date Tomorrow",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepGRTMEETING,
				GrbReviewType: models.SystemIntakeGRBReviewTypeStandard,
				GRBDate:       &tomorrow,
			},
			expectedStatus: models.ITGGRBSScheduled,
		},

		// ---------- Final BC ----------
		{
			testCase: "Final BC: No GRB Date",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepFINALBIZCASE,
				GrbReviewType: models.SystemIntakeGRBReviewTypeStandard,
				GRBDate:       nil,
			},
			expectedStatus: models.ITGGRBSCantStart,
		},
		{
			testCase: "Final BC: GRB Date Yesterday",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepFINALBIZCASE,
				GrbReviewType: models.SystemIntakeGRBReviewTypeStandard,
				GRBDate:       &yesterday,
			},
			expectedStatus: models.ITGGRBSCompleted,
		},
		{
			testCase: "Final BC: GRB Date Tomorrow",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepFINALBIZCASE,
				GrbReviewType: models.SystemIntakeGRBReviewTypeStandard,
				GRBDate:       &tomorrow,
			},
			expectedStatus: models.ITGGRBSScheduled,
		},

		// ---------- GRB step ----------
		{
			testCase: "GRB step: No GRB Date",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepGRBMEETING,
				GrbReviewType: models.SystemIntakeGRBReviewTypeStandard,
				GRBDate:       nil,
			},
			expectedStatus: models.ITGGRBSReadyToSchedule,
		},
		{
			testCase: "GRB step: GRB Date Yesterday (awaiting decision)",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepGRBMEETING,
				GrbReviewType: models.SystemIntakeGRBReviewTypeStandard,
				GRBDate:       &yesterday,
			},
			expectedStatus: models.ITGGRBSAwaitingDecision,
		},
		{
			testCase: "GRB step: GRB Date Tomorrow (scheduled)",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepGRBMEETING,
				GrbReviewType: models.SystemIntakeGRBReviewTypeStandard,
				GRBDate:       &tomorrow,
			},
			expectedStatus: models.ITGGRBSScheduled,
		},

		// ---------- Async review (already existed) ----------
		{
			testCase: "Async: Review in progress",
			intake: models.SystemIntake{
				Step:                        models.SystemIntakeStepGRBMEETING,
				GrbReviewType:               models.SystemIntakeGRBReviewTypeAsync,
				GRBReviewStartedAt:          &yesterday,
				GrbReviewAsyncEndDate:       &tomorrow,
				GrbReviewAsyncRecordingTime: &yesterday,
			},
			expectedStatus: models.ITGRRBSReviewInProgress,
		},
		{
			testCase: "Async: Awaiting GRB review (recording passed)",
			intake: models.SystemIntake{
				Step:                        models.SystemIntakeStepGRBMEETING,
				GrbReviewType:               models.SystemIntakeGRBReviewTypeAsync,
				GrbReviewAsyncRecordingTime: &yesterday,
			},
			expectedStatus: models.ITGRRBSAwaitingGRBReview,
		},

		// ---------- Decision ----------
		{
			testCase: "Decision: No GRB Date",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepDECISION,
				GrbReviewType: models.SystemIntakeGRBReviewTypeStandard,
				GRBDate:       nil,
			},
			expectedStatus: models.ITGGRBSNotNeeded,
		},
		{
			testCase: "Decision: GRB Date Yesterday",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepDECISION,
				GrbReviewType: models.SystemIntakeGRBReviewTypeStandard,
				GRBDate:       &yesterday,
			},
			expectedStatus: models.ITGGRBSCompleted,
		},
		{
			testCase: "Decision: GRB Date Tomorrow",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepDECISION,
				GrbReviewType: models.SystemIntakeGRBReviewTypeStandard,
				GRBDate:       &tomorrow,
			},
			expectedStatus: models.ITGGRBSScheduled,
		},

		// ---------- Invalid step ----------
		{
			testCase: "Invalid step: No GRB Date (error expected)",
			intake: models.SystemIntake{
				Step:          invalidStep,
				GrbReviewType: models.SystemIntakeGRBReviewTypeStandard,
				GRBDate:       nil,
			},
			expectError: true,
		},
		{
			testCase: "Invalid step: GRB Date Yesterday",
			intake: models.SystemIntake{
				Step:          invalidStep,
				GrbReviewType: models.SystemIntakeGRBReviewTypeStandard,
				GRBDate:       &yesterday,
			},
			expectedStatus: models.ITGGRBSCompleted,
		},
		{
			testCase: "Invalid step: GRB Date Tomorrow",
			intake: models.SystemIntake{
				Step:          invalidStep,
				GrbReviewType: models.SystemIntakeGRBReviewTypeStandard,
				GRBDate:       &tomorrow,
			},
			expectedStatus: models.ITGGRBSScheduled,
		},
		// ---------- Async review ----------
		{
			testCase: "Async: Review in progress (between start and end, no recording time)",
			intake: models.SystemIntake{
				Step:                  models.SystemIntakeStepGRBMEETING,
				GrbReviewType:         models.SystemIntakeGRBReviewTypeAsync,
				GRBReviewStartedAt:    &yesterday,
				GrbReviewAsyncEndDate: &tomorrow,
			},
			expectedStatus: models.ITGRRBSReviewInProgress,
		},
		{
			testCase: "Async: Awaiting GRB review (recording passed)",
			intake: models.SystemIntake{
				Step:                        models.SystemIntakeStepGRBMEETING,
				GrbReviewType:               models.SystemIntakeGRBReviewTypeAsync,
				GRBReviewStartedAt:          &yesterday,
				GrbReviewAsyncEndDate:       &tomorrow,
				GrbReviewAsyncRecordingTime: &yesterday,
			},
			expectedStatus: models.ITGRRBSReviewInProgress,
		},
		{
			testCase: "Async: Scheduled (recording time in future)",
			intake: models.SystemIntake{
				Step:                        models.SystemIntakeStepGRBMEETING,
				GrbReviewType:               models.SystemIntakeGRBReviewTypeAsync,
				GrbReviewAsyncEndDate:       &tomorrow,
				GrbReviewAsyncRecordingTime: &tomorrow,
			},
			expectedStatus: models.ITGGRBSScheduled,
		},
		{
			testCase: "Async: Voting has been ended early",
			intake: models.SystemIntake{
				Step:                        models.SystemIntakeStepGRBMEETING,
				GrbReviewType:               models.SystemIntakeGRBReviewTypeAsync,
				GRBReviewStartedAt:          &yesterday,
				GrbReviewAsyncEndDate:       &tomorrow,
				GrbReviewAsyncRecordingTime: &tomorrow,
				GrbReviewAsyncManualEndDate: &now,
			},
			expectedStatus: models.ITGGRBSAwaitingDecision,
		},
	}

	for _, tc := range tests {
		t.Run(tc.testCase, func(t *testing.T) {
			status, err := GrbMeetingStatus(context.TODO(), &tc.intake)
			assert.EqualValues(t, tc.expectedStatus, status)
			if tc.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}
		})
	}
}
