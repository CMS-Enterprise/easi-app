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

	for _, test := range intakeFormTests {
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

	for _, test := range intakeFormFeedbackTests {
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
				Step:    models.SystemIntakeStepGRBMEETING,
				GRBDate: nil,
			},
			expectedStatus: models.ITGDSCantStart,
			expectError:    false,
		},
		{
			testCase: "GRB Meeting: meeting scheduled, but hasn't happened",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepGRBMEETING,
				GRBDate: &tomorrow,
			},
			expectedStatus: models.ITGDSCantStart,
			expectError:    false,
		},
		{
			testCase: "GRB Meeting: meeting scheduled, it already happened",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepGRBMEETING,
				GRBDate: &yesterday,
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
	}

	for _, test := range decisionStateTests {
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

	for _, test := range draftBusinessCaseTests {
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
func (suite *ResolverSuite) TestGrtMeetingStatus() {
	intake := models.SystemIntake{
		Status: models.SystemIntakeStatusCLOSED,
	}

	status := GrtMeetingStatus(&intake)

	suite.EqualValues(models.ITGGRTSCantStart, status)

}
func (suite *ResolverSuite) TestBizCaseFinalStatus() {
	intake := models.SystemIntake{
		Status: models.SystemIntakeStatusCLOSED,
	}

	status := BizCaseFinalStatus(&intake)

	suite.EqualValues(models.ITGFBCSCantStart, status)

}
func TestGrbMeetingStatus(t *testing.T) {
	intake := models.SystemIntake{
		Status: models.SystemIntakeStatusCLOSED,
	}

	status, err := GrbMeetingStatus(&intake)

	assert.EqualValues(t, models.ITGGRBSCantStart, status)
	assert.NoError(t, err)

}
