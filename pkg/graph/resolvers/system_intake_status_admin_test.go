package resolvers

import (
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/easi-app/pkg/models"
)

// func (suite *ResolverSuite) TestSystemIntakeStatusAdminGet() {
func TestSystemIntakeStatusAdminGet(t *testing.T) {
	intakeTests := []struct {
		testCase       string
		intake         models.SystemIntake
		expectedStatus models.SystemIntakeStatusAdmin
		expectError    bool
	}{
		// Intake Form Statuses
		{
			testCase: "Request form not started",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepINITIALFORM,
				RequestFormState: models.SIRFSNotStarted,
			},
			expectedStatus: models.SISAInitialRequestFormInProgress,
			expectError:    false,
		},
		{
			testCase: "Request form in progress",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepINITIALFORM,
				RequestFormState: models.SIRFSInProgress,
			},
			expectedStatus: models.SISAInitialRequestFormInProgress,
			expectError:    false,
		},
		{
			testCase: "Request form edits requested",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepINITIALFORM,
				RequestFormState: models.SIRFSEditsRequested,
			},
			expectedStatus: models.SISAInitialRequestFormInProgress,
			expectError:    false,
		},
		{
			testCase: "Request form submitted",
			intake: models.SystemIntake{
				Step:             models.SystemIntakeStepINITIALFORM,
				RequestFormState: models.SIRFSSubmitted,
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

				State: models.SystemIntakeStateCLOSED,
			},
			expectedStatus: models.SISAClosed,
			expectError:    false,
		},
	}

	// for _, test := range tests {
	// 	status, err := SystemIntakeStatusAdminGet(&test.intake)
	// 	assert.EqualValues(t, test.expectedStatus, status)

	// 	if test.expectError {
	// 		assert.Error(t, err)
	// 	} else {
	// 		assert.NoError(t, err)
	// 	}

	// }

	for _, test := range intakeTests {
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
	// t.Run(test.Name,func(t *testing.T){
	// 	status, err := SystemIntakeStatusAdminGet(&test.intake)
	// 	assert.EqualValues(t, test.expectedStatus, status)

	// 	if test.expectError {
	// 		assert.Error(t, err)
	// 	} else {
	// 		assert.NoError(t, err)
	// 	}
	// })
	/*
		TODO
		1. Make a an array of intakes in different states
		2. make a helper test for each to verify that we return each permutation of a system intake, and confirm that it is the in the correct status



	*/
}
