package resolvers

import (
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/easi-app/pkg/models"
)

type testSystemIntakeFormStatusType struct {
	testCase       string
	intake         models.SystemIntake
	expectedStatus models.ITGovIntakeFormStatus
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

// TODO: fullly implement the unit tests when the status calculations have been developed. Store methods should ideally happen on a parent resolver, so the child requests can utilize the same object
func (suite *ResolverSuite) TestFeedbackFromInitialReviewStatus() {
	intake := models.SystemIntake{
		Status: models.SystemIntakeStatusCLOSED,
	}

	status := FeedbackFromInitialReviewStatus(&intake)

	suite.EqualValues(models.ITGFBSCantStart, status)

}
func (suite *ResolverSuite) TestDecisionAndNextStepsStatus() {
	intake := models.SystemIntake{
		Status: models.SystemIntakeStatusCLOSED,
	}

	status := DecisionAndNextStepsStatus(&intake)

	suite.EqualValues(models.ITGDSCantStart, status)

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
func (suite *ResolverSuite) TestBizCaseFinalStatus() {
	intake := models.SystemIntake{
		Status: models.SystemIntakeStatusCLOSED,
	}

	status := BizCaseFinalStatus(&intake)

	suite.EqualValues(models.ITGFBCSCantStart, status)

}
func (suite *ResolverSuite) TestGrbMeetingStatus() {
	intake := models.SystemIntake{
		Status: models.SystemIntakeStatusCLOSED,
	}

	status := GrbMeetingStatus(&intake)

	suite.EqualValues(models.ITGGRBSCantStart, status)

}
