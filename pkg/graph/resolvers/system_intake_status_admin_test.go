package resolvers

import (
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/easi-app/pkg/models"
)

type testSystemIntakeAdminStatusType struct {
	testCase       string
	intake         models.SystemIntake
	expectedStatus models.SystemIntakeStatusAdmin
	expectError    bool
}

// func (suite *ResolverSuite) TestSystemIntakeStatusAdminGet() {
func TestSystemIntakeStatusAdminGet(t *testing.T) {
	intakeFormTests := []testSystemIntakeAdminStatusType{
		// Intake Form Statuses
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
			expectedStatus: models.SISADraftBusinessCaseComplete,
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
	systemIntakeAdminStatusRunTestCollection(t, intakeFormTests, "Testing all system intake form Statuses")
	systemIntakeAdminStatusRunTestCollection(t, draftBizCaseTests, "Testing all draft Buisness Case Statuses")

	/* Test iterations for  the draftBizCase forms */

}
func systemIntakeAdminStatusRunTestCollection(t *testing.T, tests []testSystemIntakeAdminStatusType, testType string) {
	t.Run(testType, func(t *testing.T) {
		for _, test := range tests {
			t.Run(test.testCase, func(t *testing.T) {
				verifySystemIntakeAdminStatusView(t, test)
			})
		}
	})
}

func verifySystemIntakeAdminStatusView(t *testing.T, test testSystemIntakeAdminStatusType) {
	status, err := SystemIntakeStatusAdminGet(&test.intake)
	assert.EqualValues(t, test.expectedStatus, status)

	if test.expectError {
		assert.Error(t, err)
	} else {
		assert.NoError(t, err)
	}
}
