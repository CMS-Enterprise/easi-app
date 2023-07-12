package resolvers

import (
	"fmt"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/easi-app/pkg/models"
)

type systemIntakeStatusRequesterGetTestCase struct {
	testName       string
	intake         models.SystemIntake
	expectedStatus models.SystemIntakeStatusRequester
	errorExpected  bool
}

type testCasesForStep struct {
	stepName  string
	testCases []systemIntakeStatusRequesterGetTestCase
}

func TestSystemIntakeStatusRequesterGet(t *testing.T) {
	t.Parallel()

	mockCurrentTime := time.Unix(0, 0)
	allTestCases := systemIntakeStatusRequesterTestCases()

	for _, singleStepTestCases := range allTestCases {
		singleStepTestCases := singleStepTestCases // copy to local variable, instead of having callback close over loop variable

		t.Run(fmt.Sprintf("Testing statuses for the %v step", singleStepTestCases.stepName), func(t *testing.T) {
			t.Parallel()

			for _, testCase := range singleStepTestCases.testCases {
				testCase := testCase // copy to local variable, instead of having callback close over loop variable

				t.Run(testCase.testName, func(t *testing.T) {
					t.Parallel()

					actualStatus, err := SystemIntakeStatusRequesterGet(&testCase.intake, mockCurrentTime)
					assert.EqualValues(t, testCase.expectedStatus, actualStatus)
					if testCase.errorExpected {
						assert.Error(t, err)
					} else {
						assert.NoError(t, err)
					}
				})
			}
		})
	}
}

func systemIntakeStatusRequesterTestCases() []testCasesForStep {
	initialFormTests := testCasesForStep{
		stepName: "Initial Request form",
		testCases: []systemIntakeStatusRequesterGetTestCase{
			{
				testName: "Request not started",
				intake: models.SystemIntake{
					Step:             models.SystemIntakeStepINITIALFORM,
					RequestFormState: models.SIRFSNotStarted,
					State:            models.SystemIntakeStateOPEN,
				},
				expectedStatus: models.SISRInitialRequestFormNew,
				errorExpected:  false,
			},
			// TODO - more initial form tests (include closing from this step)
		},
	}

	draftBizCaseTests := testCasesForStep{
		stepName: "Draft business case",
		testCases: []systemIntakeStatusRequesterGetTestCase{
			{
				testName: "Draft Biz Case form not started",
				intake: models.SystemIntake{
					Step:                   models.SystemIntakeStepDRAFTBIZCASE,
					DraftBusinessCaseState: models.SIRFSNotStarted,
					State:                  models.SystemIntakeStateOPEN,
				},
				expectedStatus: models.SISRDraftBusinessCaseInProgress,
				errorExpected:  false,
			},
			// TODO - more draft biz case tests (include closing from this step)
		},
	}
	// TODO - GRT meeting (include closing from this step)
	// TODO - final biz case (include closing from this step)
	// TODO - GRB meeting (include closing from this step)
	// TODO - decisions

	return []testCasesForStep{
		initialFormTests,
		draftBizCaseTests,
		// TODO - other steps
	}
}
