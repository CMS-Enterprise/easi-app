package resolvers

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/easi-app/pkg/models"
)

type testSystemIntakeAdminStatusType struct {
	testCase       string
	intake         models.SystemIntake
	expectedStatus models.SystemIntakeStatusAdmin
	expectError    bool
}

// TestSystemIntakeStatusAdminGet tests the possible permutations for the systemIntakeStatusAdminGet method.
// It doesn't use the testify suit, as this is not dependant on anything besides the resolver.
func TestSystemIntakeStatusAdminGet(t *testing.T) {
	yesterday := time.Now().Add(time.Hour * -24)
	tomorrow := time.Now().Add(time.Hour * 24)
	intakeFormTests := []testSystemIntakeAdminStatusType{
		{
			testCase: "Request form not started",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepINITIALFORM,
				RequestFormState: models.SIRFSNotStarted,
				State:            models.SystemIntakeStateOPEN,
			},
			expectedStatus: models.SISAInitialRequestFormInProgress,
			expectError:    false,
		},
		{
			testCase: "Request form in progress",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepINITIALFORM,
				RequestFormState: models.SIRFSInProgress,
				State:            models.SystemIntakeStateOPEN,
			},
			expectedStatus: models.SISAInitialRequestFormInProgress,
			expectError:    false,
		},
		{
			testCase: "Request form edits requested",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepINITIALFORM,
				RequestFormState: models.SIRFSEditsRequested,
				State:            models.SystemIntakeStateOPEN,
			},
			expectedStatus: models.SISAInitialRequestFormInProgress,
			expectError:    false,
		},
		{
			testCase: "Request form submitted",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepINITIALFORM,
				RequestFormState: models.SIRFSSubmitted,
				State:            models.SystemIntakeStateOPEN,
			},
			expectedStatus: models.SISAInitialRequestFormSubmitted,
			expectError:    false,
		},
		{
			testCase: "Request form closed",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepINITIALFORM,
				RequestFormState: models.SIRFSSubmitted,
				DecisionState:    models.SIDSNoDecision,
				State:            models.SystemIntakeStateCLOSED,
			},
			expectedStatus: models.SISAClosed,
			expectError:    false,
		},
	}

	draftBizCaseTests := []testSystemIntakeAdminStatusType{
		{
			testCase: "Draft Biz Case form not started",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDRAFTBIZCASE,
				DraftBusinessCaseState: models.SIRFSNotStarted,
				State:                  models.SystemIntakeStateOPEN,
			},
			expectedStatus: models.SISADraftBusinessCaseInProgress,
			expectError:    false,
		},
		{
			testCase: "Draft Biz Case form in progress",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDRAFTBIZCASE,
				DraftBusinessCaseState: models.SIRFSInProgress,
				State:                  models.SystemIntakeStateOPEN,
			},
			expectedStatus: models.SISADraftBusinessCaseInProgress,
			expectError:    false,
		},
		{
			testCase: "Draft Biz Case edits requested",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDRAFTBIZCASE,
				DraftBusinessCaseState: models.SIRFSEditsRequested,
				State:                  models.SystemIntakeStateOPEN,
			},
			expectedStatus: models.SISADraftBusinessCaseInProgress,
			expectError:    false,
		},
		{
			testCase: "Draft Biz Case Submitted",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDRAFTBIZCASE,
				DraftBusinessCaseState: models.SIRFSSubmitted,
				State:                  models.SystemIntakeStateOPEN,
			},
			expectedStatus: models.SISADraftBusinessCaseSubmitted,
			expectError:    false,
		},
		{
			testCase: "Draft Biz Case, Closed",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepDRAFTBIZCASE,
				DraftBusinessCaseState: models.SIRFSSubmitted,
				DecisionState:          models.SIDSNoDecision,
				State:                  models.SystemIntakeStateCLOSED,
			},
			expectedStatus: models.SISAClosed,
			expectError:    false,
		},
	}

	grtMeetingTests := []testSystemIntakeAdminStatusType{
		{
			testCase: "GRT meeting not scheduled yet",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepGRTMEETING,
				GRTDate: nil,
				State:   models.SystemIntakeStateOPEN,
			},
			expectedStatus: models.SISAGrtMeetingReady,
			expectError:    false,
		},
		{
			testCase: "GRT meeting happens tomorrow",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepGRTMEETING,
				GRTDate: &tomorrow,
				State:   models.SystemIntakeStateOPEN,
			},
			expectedStatus: models.SISAGrtMeetingReady,
			expectError:    false,
		},
		{
			testCase: "GRT meeting happened yesterday",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepGRTMEETING,
				GRTDate: &yesterday,
				State:   models.SystemIntakeStateOPEN,
			},
			expectedStatus: models.SISAGrtMeetingComplete,
			expectError:    false,
		},
		{
			testCase: "GRT, request closed",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepGRTMEETING,
				GRTDate:       &yesterday,
				State:         models.SystemIntakeStateCLOSED,
				DecisionState: models.SIDSNoDecision,
			},
			expectedStatus: models.SISAClosed,
			expectError:    false,
		},
	}

	finalBizCaseTests := []testSystemIntakeAdminStatusType{
		{
			testCase: "Final Biz Case form not started",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepFINALBIZCASE,
				FinalBusinessCaseState: models.SIRFSNotStarted,
				State:                  models.SystemIntakeStateOPEN,
			},
			expectedStatus: models.SISAFinalBusinessCaseInProgress,
			expectError:    false,
		},
		{
			testCase: "Final Biz Case form in progress",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepFINALBIZCASE,
				FinalBusinessCaseState: models.SIRFSInProgress,
				State:                  models.SystemIntakeStateOPEN,
			},
			expectedStatus: models.SISAFinalBusinessCaseInProgress,
			expectError:    false,
		},
		{
			testCase: "Final Biz Case edits requested",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepFINALBIZCASE,
				FinalBusinessCaseState: models.SIRFSEditsRequested,
				State:                  models.SystemIntakeStateOPEN,
			},
			expectedStatus: models.SISAFinalBusinessCaseInProgress,
			expectError:    false,
		},
		{
			testCase: "Final Biz Case Submitted",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepFINALBIZCASE,
				FinalBusinessCaseState: models.SIRFSSubmitted,
				State:                  models.SystemIntakeStateOPEN,
			},
			expectedStatus: models.SISAFinalBusinessCaseSubmitted,
			expectError:    false,
		},
		{
			testCase: "Final Biz Case, Closed",
			intake: models.SystemIntake{
				Step:                   models.SystemIntakeStepFINALBIZCASE,
				FinalBusinessCaseState: models.SIRFSSubmitted,
				DecisionState:          models.SIDSNoDecision,
				State:                  models.SystemIntakeStateCLOSED,
			},
			expectedStatus: models.SISAClosed,
			expectError:    false,
		},
	}
	grbMeetingTests := []testSystemIntakeAdminStatusType{
		{
			testCase: "GRB meeting not scheduled yet",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepGRBMEETING,
				GRBDate: nil,
				State:   models.SystemIntakeStateOPEN,
			},
			expectedStatus: models.SISAGrbMeetingReady,
			expectError:    false,
		},
		{
			testCase: "GRB meeting happens tomorrow",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepGRBMEETING,
				GRBDate: &tomorrow,
				State:   models.SystemIntakeStateOPEN,
			},
			expectedStatus: models.SISAGrbMeetingReady,
			expectError:    false,
		},
		{
			testCase: "GRB meeting happened yesterday",
			intake: models.SystemIntake{
				Step:    models.SystemIntakeStepGRBMEETING,
				GRBDate: &yesterday,
				State:   models.SystemIntakeStateOPEN,
			},
			expectedStatus: models.SISAGrbMeetingComplete,
			expectError:    false,
		},
		{
			testCase: "GRB, request closed",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepGRBMEETING,
				GRBDate:       &yesterday,
				State:         models.SystemIntakeStateCLOSED,
				DecisionState: models.SIDSNoDecision,
			},
			expectedStatus: models.SISAClosed,
			expectError:    false,
		},
	}

	decisionTests := []testSystemIntakeAdminStatusType{
		{
			testCase: "Decision LCID issued, open",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepDECISION,
				DecisionState: models.SIDSLcidIssued,
				State:         models.SystemIntakeStateOPEN,
			},
			expectedStatus: models.SISALcidIssued,
			expectError:    false,
		},
		{
			testCase: "Decision LCID issued, closed",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepDECISION,
				DecisionState: models.SIDSLcidIssued,
				State:         models.SystemIntakeStateCLOSED,
			},
			expectedStatus: models.SISALcidIssued,
			expectError:    false,
		},
		{
			testCase: "Decision No Governance, open",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepDECISION,
				DecisionState: models.SIDSNoGovernance,
				State:         models.SystemIntakeStateOPEN,
			},
			expectedStatus: models.SISANoGovernance,
			expectError:    false,
		},
		{
			testCase: "Decision No Governance, closed",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepDECISION,
				DecisionState: models.SIDSNoGovernance,
				State:         models.SystemIntakeStateCLOSED,
			},
			expectedStatus: models.SISANoGovernance,
			expectError:    false,
		},
		{
			testCase: "Decision Not Approved, open",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepDECISION,
				DecisionState: models.SIDSNotApproved,
				State:         models.SystemIntakeStateOPEN,
			},
			expectedStatus: models.SISANotApproved,
			expectError:    false,
		},
		{
			testCase: "Decision Not Approved, closed",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepDECISION,
				DecisionState: models.SIDSNotApproved,
				State:         models.SystemIntakeStateCLOSED,
			},
			expectedStatus: models.SISANotApproved,
			expectError:    false,
		},
		// These cases should not be present in the actual app, but they are possible edge cases
		{
			testCase: "Decision No Decision, closed",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepDECISION,
				DecisionState: models.SIDSNoDecision,
				State:         models.SystemIntakeStateCLOSED,
			},
			expectedStatus: models.SISAClosed,
			expectError:    false,
		},
		// This case will be handled in application code to ensure this doesn't occur. If needed, further logic can be created to enforce it, such as a check constraint in the DB
		{
			testCase: "Decision No Decision, closed",
			intake: models.SystemIntake{
				Step:          models.SystemIntakeStepDECISION,
				DecisionState: models.SIDSNoDecision,
				State:         models.SystemIntakeStateOPEN,
			},
			expectedStatus: "",
			expectError:    true,
		},
	}
	systemIntakeAdminStatusRunTestCollection(t, intakeFormTests, "Testing all system intake form Statuses")
	systemIntakeAdminStatusRunTestCollection(t, draftBizCaseTests, "Testing all draft Business Case Statuses")
	systemIntakeAdminStatusRunTestCollection(t, grtMeetingTests, "Testing all GRT Meeting Statuses")
	systemIntakeAdminStatusRunTestCollection(t, finalBizCaseTests, "Testing all final Business Case Statuses")
	systemIntakeAdminStatusRunTestCollection(t, grbMeetingTests, "Testing all GRB Meeting Statuses")
	systemIntakeAdminStatusRunTestCollection(t, decisionTests, "Testing all Decision and Next Steps Statuses")

}

// systemIntakeAdminStatusRunTestCollection is a helper function to run all listed sub test cases
func systemIntakeAdminStatusRunTestCollection(t *testing.T, tests []testSystemIntakeAdminStatusType, testType string) {
	t.Run(testType, func(t *testing.T) {
		for _, test := range tests {
			t.Run(test.testCase, func(t *testing.T) {
				status, err := SystemIntakeStatusAdminGet(&test.intake)
				assert.EqualValues(t, test.expectedStatus, status)

				if test.expectError {
					assert.Error(t, err)
				} else {
					assert.NoError(t, err)
				}
			})
		}
	})
}
