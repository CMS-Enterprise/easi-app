package resolvers

import (
	"fmt"
	"testing"
	"time"

	"github.com/guregu/null"
	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/easi-app/pkg/models"
)

type calculateSystemIntakeRequesterStatusTestCase struct {
	testName       string
	intake         models.SystemIntake
	expectedStatus models.SystemIntakeStatusRequester
	errorExpected  bool
}

type testCasesForStep struct {
	stepName  string
	testCases []calculateSystemIntakeRequesterStatusTestCase
}

func TestCalculateSystemIntakeRequesterStatus(t *testing.T) {
	mockCurrentTime := time.Unix(0, 0)
	allTestCases := systemIntakeStatusRequesterTestCases(mockCurrentTime)

	for _, singleStepTestCases := range allTestCases {
		t.Run(fmt.Sprintf("Testing statuses for the %v step", singleStepTestCases.stepName), func(t *testing.T) {
			for i := range singleStepTestCases.testCases {
				testCase := singleStepTestCases.testCases[i]

				t.Run(testCase.testName, func(t *testing.T) {
					actualStatus, err := CalculateSystemIntakeRequesterStatus(&testCase.intake, mockCurrentTime)
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

func systemIntakeStatusRequesterTestCases(mockCurrentTime time.Time) []testCasesForStep {
	yesterday := mockCurrentTime.Add(time.Hour * -24)
	tomorrow := mockCurrentTime.Add(time.Hour * 24)
	initialFormTests := testCasesForStep{
		stepName: "Initial Request form",
		testCases: []calculateSystemIntakeRequesterStatusTestCase{
			{
				testName: "Request form not started",
				intake: models.SystemIntake{
					Step:             models.SystemIntakeStepInitialRequestForm,
					RequestFormState: models.SIRFSNotStarted,
					State:            models.SystemIntakeStateOpen,
				},
				expectedStatus: models.SystemIntakeStatusRequesterInitialRequestFormNew,
				errorExpected:  false,
			},
			{
				testName: "Request form in progress",
				intake: models.SystemIntake{
					Step:             models.SystemIntakeStepInitialRequestForm,
					RequestFormState: models.SIRFSInProgress,
					State:            models.SystemIntakeStateOpen,
				},
				expectedStatus: models.SystemIntakeStatusRequesterInitialRequestFormInProgress,
				errorExpected:  false,
			},
			{
				testName: "Request form edits requested",
				intake: models.SystemIntake{
					Step:             models.SystemIntakeStepInitialRequestForm,
					RequestFormState: models.SIRFSEditsRequested,
					State:            models.SystemIntakeStateOpen,
				},
				expectedStatus: models.SystemIntakeStatusRequesterInitialRequestFormEditsRequested,
				errorExpected:  false,
			},
			{
				testName: "Request form submitted",
				intake: models.SystemIntake{
					Step:             models.SystemIntakeStepInitialRequestForm,
					RequestFormState: models.SIRFSSubmitted,
					State:            models.SystemIntakeStateOpen,
				},
				expectedStatus: models.SystemIntakeStatusRequesterInitialRequestFormSubmitted,
				errorExpected:  false,
			},
			{
				testName: "Closed while in request form",
				intake: models.SystemIntake{
					Step:             models.SystemIntakeStepInitialRequestForm,
					RequestFormState: models.SIRFSInProgress,
					State:            models.SystemIntakeStateClosed,
					DecisionState:    models.SIDSNoDecision,
				},
				expectedStatus: models.SystemIntakeStatusRequesterClosed,
				errorExpected:  false,
			},
		},
	}

	draftBizCaseTests := testCasesForStep{
		stepName: "Draft business case",
		testCases: []calculateSystemIntakeRequesterStatusTestCase{
			{
				testName: "Draft Biz Case form not started",
				intake: models.SystemIntake{
					Step:                   models.SystemIntakeStepDraftBusinessCase,
					DraftBusinessCaseState: models.SIRFSNotStarted,
					State:                  models.SystemIntakeStateOpen,
				},
				expectedStatus: models.SystemIntakeStatusRequesterDraftBusinessCaseInProgress,
				errorExpected:  false,
			},
			{
				testName: "Draft Biz Case form in progress",
				intake: models.SystemIntake{
					Step:                   models.SystemIntakeStepDraftBusinessCase,
					DraftBusinessCaseState: models.SIRFSInProgress,
					State:                  models.SystemIntakeStateOpen,
				},
				expectedStatus: models.SystemIntakeStatusRequesterDraftBusinessCaseInProgress,
				errorExpected:  false,
			},
			{
				testName: "Draft Biz Case form edits requested",
				intake: models.SystemIntake{
					Step:                   models.SystemIntakeStepDraftBusinessCase,
					DraftBusinessCaseState: models.SIRFSEditsRequested,
					State:                  models.SystemIntakeStateOpen,
				},
				expectedStatus: models.SystemIntakeStatusRequesterDraftBusinessCaseEditsRequested,
				errorExpected:  false,
			},
			{
				testName: "Draft Biz Case form submitted",
				intake: models.SystemIntake{
					Step:                   models.SystemIntakeStepDraftBusinessCase,
					DraftBusinessCaseState: models.SIRFSSubmitted,
					State:                  models.SystemIntakeStateOpen,
				},
				expectedStatus: models.SystemIntakeStatusRequesterDraftBusinessCaseSubmitted,
				errorExpected:  false,
			},
			{
				testName: "Closed while in Draft Biz Case form",
				intake: models.SystemIntake{
					Step:                   models.SystemIntakeStepDraftBusinessCase,
					DraftBusinessCaseState: models.SIRFSInProgress,
					State:                  models.SystemIntakeStateClosed,
					DecisionState:          models.SIDSNoDecision,
				},
				expectedStatus: models.SystemIntakeStatusRequesterClosed,
				errorExpected:  false,
			},
		},
	}

	grtMeetingTests := testCasesForStep{
		stepName: "GRT meeting",
		testCases: []calculateSystemIntakeRequesterStatusTestCase{
			{
				testName: "GRT meeting not scheduled yet",
				intake: models.SystemIntake{
					Step:    models.SystemIntakeStepGrtMeeting,
					GRTDate: nil,
					State:   models.SystemIntakeStateOpen,
				},
				expectedStatus: models.SystemIntakeStatusRequesterGrtMeetingReady,
				errorExpected:  false,
			},
			{
				testName: "GRT meeting scheduled for tomorrow",
				intake: models.SystemIntake{
					Step:    models.SystemIntakeStepGrtMeeting,
					GRTDate: &tomorrow,
					State:   models.SystemIntakeStateOpen,
				},
				expectedStatus: models.SystemIntakeStatusRequesterGrtMeetingReady,
				errorExpected:  false,
			},
			{
				testName: "GRT meeting happened yesterday",
				intake: models.SystemIntake{
					Step:    models.SystemIntakeStepGrtMeeting,
					GRTDate: &yesterday,
					State:   models.SystemIntakeStateOpen,
				},
				expectedStatus: models.SystemIntakeStatusRequesterGrtMeetingAwaitingDecision,
				errorExpected:  false,
			},
			{
				testName: "Closed while GRT meeting scheduled",
				intake: models.SystemIntake{
					Step:          models.SystemIntakeStepGrtMeeting,
					GRTDate:       &tomorrow,
					State:         models.SystemIntakeStateClosed,
					DecisionState: models.SIDSNoDecision,
				},
				expectedStatus: models.SystemIntakeStatusRequesterClosed,
				errorExpected:  false,
			},
		},
	}

	finalBizCaseTests := testCasesForStep{
		stepName: "Final business case",
		testCases: []calculateSystemIntakeRequesterStatusTestCase{
			{
				testName: "Final Biz Case form not started",
				intake: models.SystemIntake{
					Step:                   models.SystemIntakeStepFinalBusinessCase,
					FinalBusinessCaseState: models.SIRFSNotStarted,
					State:                  models.SystemIntakeStateOpen,
				},
				expectedStatus: models.SystemIntakeStatusRequesterFinalBusinessCaseInProgress,
				errorExpected:  false,
			},
			{
				testName: "Final Biz Case form in progress",
				intake: models.SystemIntake{
					Step:                   models.SystemIntakeStepFinalBusinessCase,
					FinalBusinessCaseState: models.SIRFSInProgress,
					State:                  models.SystemIntakeStateOpen,
				},
				expectedStatus: models.SystemIntakeStatusRequesterFinalBusinessCaseInProgress,
				errorExpected:  false,
			},
			{
				testName: "Final Biz Case form edits requested",
				intake: models.SystemIntake{
					Step:                   models.SystemIntakeStepFinalBusinessCase,
					FinalBusinessCaseState: models.SIRFSEditsRequested,
					State:                  models.SystemIntakeStateOpen,
				},
				expectedStatus: models.SystemIntakeStatusRequesterFinalBusinessCaseEditsRequested,
				errorExpected:  false,
			},
			{
				testName: "Final Biz Case form submitted",
				intake: models.SystemIntake{
					Step:                   models.SystemIntakeStepFinalBusinessCase,
					FinalBusinessCaseState: models.SIRFSSubmitted,
					State:                  models.SystemIntakeStateOpen,
				},
				expectedStatus: models.SystemIntakeStatusRequesterFinalBusinessCaseSubmitted,
				errorExpected:  false,
			},
			{
				testName: "Closed while in Final Biz Case form",
				intake: models.SystemIntake{
					Step:                   models.SystemIntakeStepFinalBusinessCase,
					FinalBusinessCaseState: models.SIRFSInProgress,
					State:                  models.SystemIntakeStateClosed,
					DecisionState:          models.SIDSNoDecision,
				},
				expectedStatus: models.SystemIntakeStatusRequesterClosed,
				errorExpected:  false,
			},
		},
	}

	grbMeetingTests := testCasesForStep{
		stepName: "GRB meeting",
		testCases: []calculateSystemIntakeRequesterStatusTestCase{
			{
				testName: "GRB meeting not scheduled yet",
				intake: models.SystemIntake{
					Step:    models.SystemIntakeStepGrbMeeting,
					GRBDate: nil,
					State:   models.SystemIntakeStateOpen,
				},
				expectedStatus: models.SystemIntakeStatusRequesterGrbMeetingReady,
				errorExpected:  false,
			},
			{
				testName: "GRB meeting scheduled for tomorrow",
				intake: models.SystemIntake{
					Step:    models.SystemIntakeStepGrbMeeting,
					GRBDate: &tomorrow,
					State:   models.SystemIntakeStateOpen,
				},
				expectedStatus: models.SystemIntakeStatusRequesterGrbMeetingReady,
				errorExpected:  false,
			},
			{
				testName: "GRB meeting happened yesterday",
				intake: models.SystemIntake{
					Step:    models.SystemIntakeStepGrbMeeting,
					GRBDate: &yesterday,
					State:   models.SystemIntakeStateOpen,
				},
				expectedStatus: models.SystemIntakeStatusRequesterGrbMeetingAwaitingDecision,
				errorExpected:  false,
			},
			{
				testName: "Closed while GRB meeting scheduled",
				intake: models.SystemIntake{
					Step:          models.SystemIntakeStepGrbMeeting,
					GRBDate:       &tomorrow,
					State:         models.SystemIntakeStateClosed,
					DecisionState: models.SIDSNoDecision,
				},
				expectedStatus: models.SystemIntakeStatusRequesterClosed,
				errorExpected:  false,
			},
		},
	}

	decisionTests := testCasesForStep{
		stepName: "Decision",
		testCases: []calculateSystemIntakeRequesterStatusTestCase{
			{
				testName: "Decision made, LCID issued, closed",
				intake: models.SystemIntake{
					Step:          models.SystemIntakeStepDecisionAndNextSteps,
					DecisionState: models.SIDSLcidIssued,
					State:         models.SystemIntakeStateClosed,
				},
				expectedStatus: models.SystemIntakeStatusRequesterLcidIssued,
				errorExpected:  false,
			},
			{
				testName: "Decision made, LCID issued, but not added, closed",
				intake: models.SystemIntake{
					Step:          models.SystemIntakeStepDecisionAndNextSteps,
					DecisionState: models.SIDSLcidIssued,
					// LifecycleID:        null.StringFrom("fake"), -- If there is no LCID, the status is closed
					LifecycleExpiresAt: &yesterday,
					LifecycleRetiresAt: &yesterday,
					State:              models.SystemIntakeStateClosed,
				},
				expectedStatus: models.SystemIntakeStatusRequesterLcidIssued,
				errorExpected:  false,
			},
			{
				testName: "Decision made, LCID expired, closed",
				intake: models.SystemIntake{
					Step:               models.SystemIntakeStepDecisionAndNextSteps,
					DecisionState:      models.SIDSLcidIssued,
					LifecycleID:        null.StringFrom("fake"),
					LifecycleExpiresAt: &yesterday,
					State:              models.SystemIntakeStateClosed,
				},
				expectedStatus: models.SystemIntakeStatusRequesterLcidExpired,
				errorExpected:  false,
			},

			{
				testName: "Decision made, LCID Retired, closed",
				intake: models.SystemIntake{
					Step:               models.SystemIntakeStepDecisionAndNextSteps,
					DecisionState:      models.SIDSLcidIssued,
					LifecycleID:        null.StringFrom("fake"),
					LifecycleRetiresAt: &yesterday,
					State:              models.SystemIntakeStateClosed,
				},
				expectedStatus: models.SystemIntakeStatusRequesterLcidRetired,
				errorExpected:  false,
			},
			{
				testName: "Decision made, LCID issued, re-opened",
				intake: models.SystemIntake{
					Step:          models.SystemIntakeStepDecisionAndNextSteps,
					DecisionState: models.SIDSLcidIssued,
					State:         models.SystemIntakeStateOpen,
				},
				expectedStatus: models.SystemIntakeStatusRequesterLcidIssued,
				errorExpected:  false,
			},
			{
				testName: "Decision made, Not Governance, closed",
				intake: models.SystemIntake{
					Step:          models.SystemIntakeStepDecisionAndNextSteps,
					DecisionState: models.SIDSNotGovernance,
					State:         models.SystemIntakeStateClosed,
				},
				expectedStatus: models.SystemIntakeStatusRequesterNotGovernance,
				errorExpected:  false,
			},
			{
				testName: "Decision made, Not Governance, re-opened",
				intake: models.SystemIntake{
					Step:          models.SystemIntakeStepDecisionAndNextSteps,
					DecisionState: models.SIDSNotGovernance,
					State:         models.SystemIntakeStateOpen,
				},
				expectedStatus: models.SystemIntakeStatusRequesterNotGovernance,
				errorExpected:  false,
			},
			{
				testName: "Decision made, Not Approved, closed",
				intake: models.SystemIntake{
					Step:          models.SystemIntakeStepDecisionAndNextSteps,
					DecisionState: models.SIDSNotApproved,
					State:         models.SystemIntakeStateClosed,
				},
				expectedStatus: models.SystemIntakeStatusRequesterNotApproved,
				errorExpected:  false,
			},
			{
				testName: "Decision made, Not Approved, re-opened",
				intake: models.SystemIntake{
					Step:          models.SystemIntakeStepDecisionAndNextSteps,
					DecisionState: models.SIDSNotApproved,
					State:         models.SystemIntakeStateOpen,
				},
				expectedStatus: models.SystemIntakeStatusRequesterNotApproved,
				errorExpected:  false,
			},
			{
				testName: "Decision made, but re-opened, progressed, then closed",
				intake: models.SystemIntake{
					Step:          models.SystemIntakeStepFinalBusinessCase,
					DecisionState: models.SIDSNotApproved,
					State:         models.SystemIntakeStateClosed,
				},
				expectedStatus: models.SystemIntakeStatusRequesterClosed,
				errorExpected:  false,
			},
			{
				// this state is invalid - an intake that's been closed with no decision should not have reached the decision step
				testName: "Closed with no decision while in the decision step",
				intake: models.SystemIntake{
					Step:          models.SystemIntakeStepDecisionAndNextSteps,
					DecisionState: models.SIDSNoDecision,
					State:         models.SystemIntakeStateClosed,
				},
				expectedStatus: "",
				errorExpected:  true,
			},
			{
				// this state is invalid - if an intake has been closed with no decision, it should not be re-opened and remain in the decision step
				testName: "Open with decisionState set to No Decision while in the decision step",
				intake: models.SystemIntake{
					Step:          models.SystemIntakeStepDecisionAndNextSteps,
					DecisionState: models.SIDSNoDecision,
					State:         models.SystemIntakeStateOpen,
				},
				expectedStatus: "",
				errorExpected:  true,
			},
		},
	}

	return []testCasesForStep{
		initialFormTests,
		draftBizCaseTests,
		grtMeetingTests,
		finalBizCaseTests,
		grbMeetingTests,
		decisionTests,
	}
}
