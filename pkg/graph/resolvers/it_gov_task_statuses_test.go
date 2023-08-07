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

type testSystemIntakeDecisionStateStatusType struct {
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

	decisionStateTests := []testSystemIntakeDecisionStateStatusType{
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
func (suite *ResolverSuite) TestBizCaseDraftStatus() {
	intake := models.SystemIntake{
		Status: models.SystemIntakeStatusCLOSED,
	}

	status := BizCaseDraftStatus(&intake)

	suite.EqualValues(models.ITGDBCSCantStart, status)

}
func (suite *ResolverSuite) TestGrtMeetingStatus() {
	intake := models.SystemIntake{
		Status: models.SystemIntakeStatusCLOSED,
	}

	status := GrtMeetingStatus(&intake)

	suite.EqualValues(models.ITGGRTSCantStart, status)

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

	for _, test := range finalBusinessCaseTests {
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
func (suite *ResolverSuite) TestGrbMeetingStatus() {
	intake := models.SystemIntake{
		Status: models.SystemIntakeStatusCLOSED,
	}

	status := GrbMeetingStatus(&intake)

	suite.EqualValues(models.ITGGRBSCantStart, status)

}
