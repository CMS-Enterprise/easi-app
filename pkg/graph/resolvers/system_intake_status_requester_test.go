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
					Step:             models.SystemIntakeStepINITIALFORM,
					RequestFormState: models.SIRFSNotStarted,
					State:            models.SystemIntakeStateOPEN,
				},
				expectedStatus: models.SISRInitialRequestFormNew,
				errorExpected:  false,
			},
			{
				testName: "Request form in progress",
				intake: models.SystemIntake{
					Step:             models.SystemIntakeStepINITIALFORM,
					RequestFormState: models.SIRFSInProgress,
					State:            models.SystemIntakeStateOPEN,
				},
				expectedStatus: models.SISRInitialRequestFormInProgress,
				errorExpected:  false,
			},
			{
				testName: "Request form edits requested",
				intake: models.SystemIntake{
					Step:             models.SystemIntakeStepINITIALFORM,
					RequestFormState: models.SIRFSEditsRequested,
					State:            models.SystemIntakeStateOPEN,
				},
				expectedStatus: models.SISRInitialRequestFormEditsRequested,
				errorExpected:  false,
			},
			{
				testName: "Request form submitted",
				intake: models.SystemIntake{
					Step:             models.SystemIntakeStepINITIALFORM,
					RequestFormState: models.SIRFSSubmitted,
					State:            models.SystemIntakeStateOPEN,
				},
				expectedStatus: models.SISRInitialRequestFormSubmitted,
				errorExpected:  false,
			},
			{
				testName: "Closed while in request form",
				intake: models.SystemIntake{
					Step:             models.SystemIntakeStepINITIALFORM,
					RequestFormState: models.SIRFSInProgress,
					State:            models.SystemIntakeStateCLOSED,
					DecisionState:    models.SIDSNoDecision,
				},
				expectedStatus: models.SISRClosed,
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
					Step:                   models.SystemIntakeStepDRAFTBIZCASE,
					DraftBusinessCaseState: models.SIRFSNotStarted,
					State:                  models.SystemIntakeStateOPEN,
				},
				expectedStatus: models.SISRDraftBusinessCaseInProgress,
				errorExpected:  false,
			},
			{
				testName: "Draft Biz Case form in progress",
				intake: models.SystemIntake{
					Step:                   models.SystemIntakeStepDRAFTBIZCASE,
					DraftBusinessCaseState: models.SIRFSInProgress,
					State:                  models.SystemIntakeStateOPEN,
				},
				expectedStatus: models.SISRDraftBusinessCaseInProgress,
				errorExpected:  false,
			},
			{
				testName: "Draft Biz Case form edits requested",
				intake: models.SystemIntake{
					Step:                   models.SystemIntakeStepDRAFTBIZCASE,
					DraftBusinessCaseState: models.SIRFSEditsRequested,
					State:                  models.SystemIntakeStateOPEN,
				},
				expectedStatus: models.SISRDraftBusinessCaseEditsRequested,
				errorExpected:  false,
			},
			{
				testName: "Draft Biz Case form submitted",
				intake: models.SystemIntake{
					Step:                   models.SystemIntakeStepDRAFTBIZCASE,
					DraftBusinessCaseState: models.SIRFSSubmitted,
					State:                  models.SystemIntakeStateOPEN,
				},
				expectedStatus: models.SISRDraftBusinessCaseSubmitted,
				errorExpected:  false,
			},
			{
				testName: "Closed while in Draft Biz Case form",
				intake: models.SystemIntake{
					Step:                   models.SystemIntakeStepDRAFTBIZCASE,
					DraftBusinessCaseState: models.SIRFSInProgress,
					State:                  models.SystemIntakeStateCLOSED,
					DecisionState:          models.SIDSNoDecision,
				},
				expectedStatus: models.SISRClosed,
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
					Step:    models.SystemIntakeStepGRTMEETING,
					GRTDate: nil,
					State:   models.SystemIntakeStateOPEN,
				},
				expectedStatus: models.SISRGrtMeetingReady,
				errorExpected:  false,
			},
			{
				testName: "GRT meeting scheduled for tomorrow",
				intake: models.SystemIntake{
					Step:    models.SystemIntakeStepGRTMEETING,
					GRTDate: &tomorrow,
					State:   models.SystemIntakeStateOPEN,
				},
				expectedStatus: models.SISRGrtMeetingReady,
				errorExpected:  false,
			},
			{
				testName: "GRT meeting happened yesterday",
				intake: models.SystemIntake{
					Step:    models.SystemIntakeStepGRTMEETING,
					GRTDate: &yesterday,
					State:   models.SystemIntakeStateOPEN,
				},
				expectedStatus: models.SISRGrtMeetingAwaitingDecision,
				errorExpected:  false,
			},
			{
				testName: "Closed while GRT meeting scheduled",
				intake: models.SystemIntake{
					Step:          models.SystemIntakeStepGRTMEETING,
					GRTDate:       &tomorrow,
					State:         models.SystemIntakeStateCLOSED,
					DecisionState: models.SIDSNoDecision,
				},
				expectedStatus: models.SISRClosed,
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
					Step:                   models.SystemIntakeStepFINALBIZCASE,
					FinalBusinessCaseState: models.SIRFSNotStarted,
					State:                  models.SystemIntakeStateOPEN,
				},
				expectedStatus: models.SISRFinalBusinessCaseInProgress,
				errorExpected:  false,
			},
			{
				testName: "Final Biz Case form in progress",
				intake: models.SystemIntake{
					Step:                   models.SystemIntakeStepFINALBIZCASE,
					FinalBusinessCaseState: models.SIRFSInProgress,
					State:                  models.SystemIntakeStateOPEN,
				},
				expectedStatus: models.SISRFinalBusinessCaseInProgress,
				errorExpected:  false,
			},
			{
				testName: "Final Biz Case form edits requested",
				intake: models.SystemIntake{
					Step:                   models.SystemIntakeStepFINALBIZCASE,
					FinalBusinessCaseState: models.SIRFSEditsRequested,
					State:                  models.SystemIntakeStateOPEN,
				},
				expectedStatus: models.SISRFinalBusinessCaseEditsRequested,
				errorExpected:  false,
			},
			{
				testName: "Final Biz Case form submitted",
				intake: models.SystemIntake{
					Step:                   models.SystemIntakeStepFINALBIZCASE,
					FinalBusinessCaseState: models.SIRFSSubmitted,
					State:                  models.SystemIntakeStateOPEN,
				},
				expectedStatus: models.SISRFinalBusinessCaseSubmitted,
				errorExpected:  false,
			},
			{
				testName: "Closed while in Final Biz Case form",
				intake: models.SystemIntake{
					Step:                   models.SystemIntakeStepFINALBIZCASE,
					FinalBusinessCaseState: models.SIRFSInProgress,
					State:                  models.SystemIntakeStateCLOSED,
					DecisionState:          models.SIDSNoDecision,
				},
				expectedStatus: models.SISRClosed,
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
					Step:    models.SystemIntakeStepGRBMEETING,
					GRBDate: nil,
					State:   models.SystemIntakeStateOPEN,
				},
				expectedStatus: models.SISRGrbMeetingReady,
				errorExpected:  false,
			},
			{
				testName: "GRB meeting scheduled for tomorrow",
				intake: models.SystemIntake{
					Step:    models.SystemIntakeStepGRBMEETING,
					GRBDate: &tomorrow,
					State:   models.SystemIntakeStateOPEN,
				},
				expectedStatus: models.SISRGrbMeetingReady,
				errorExpected:  false,
			},
			{
				testName: "GRB meeting happened yesterday",
				intake: models.SystemIntake{
					Step:    models.SystemIntakeStepGRBMEETING,
					GRBDate: &yesterday,
					State:   models.SystemIntakeStateOPEN,
				},
				expectedStatus: models.SISRGrbMeetingAwaitingDecision,
				errorExpected:  false,
			},
			{
				testName: "Closed while GRB meeting scheduled",
				intake: models.SystemIntake{
					Step:          models.SystemIntakeStepGRBMEETING,
					GRBDate:       &tomorrow,
					State:         models.SystemIntakeStateCLOSED,
					DecisionState: models.SIDSNoDecision,
				},
				expectedStatus: models.SISRClosed,
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
					Step:          models.SystemIntakeStepDECISION,
					DecisionState: models.SIDSLcidIssued,
					State:         models.SystemIntakeStateCLOSED,
				},
				expectedStatus: models.SISRLcidIssued,
				errorExpected:  false,
			},
			{
				testName: "Decision made, LCID issued, but not added, closed",
				intake: models.SystemIntake{
					Step:          models.SystemIntakeStepDECISION,
					DecisionState: models.SIDSLcidIssued,
					// LifecycleID:        null.StringFrom("fake"), -- If there is no LCID, the status is closed
					LifecycleExpiresAt: &yesterday,
					LifecycleRetiresAt: &yesterday,
					State:              models.SystemIntakeStateCLOSED,
				},
				expectedStatus: models.SISRLcidIssued,
				errorExpected:  false,
			},
			{
				testName: "Decision made, LCID expired, closed",
				intake: models.SystemIntake{
					Step:               models.SystemIntakeStepDECISION,
					DecisionState:      models.SIDSLcidIssued,
					LifecycleID:        null.StringFrom("fake"),
					LifecycleExpiresAt: &yesterday,
					State:              models.SystemIntakeStateCLOSED,
				},
				expectedStatus: models.SISRLcidExpired,
				errorExpected:  false,
			},

			{
				testName: "Decision made, LCID Retired, closed",
				intake: models.SystemIntake{
					Step:               models.SystemIntakeStepDECISION,
					DecisionState:      models.SIDSLcidIssued,
					LifecycleID:        null.StringFrom("fake"),
					LifecycleRetiresAt: &yesterday,
					State:              models.SystemIntakeStateCLOSED,
				},
				expectedStatus: models.SISRLcidRetired,
				errorExpected:  false,
			},
			{
				testName: "Decision made, LCID issued, re-opened",
				intake: models.SystemIntake{
					Step:          models.SystemIntakeStepDECISION,
					DecisionState: models.SIDSLcidIssued,
					State:         models.SystemIntakeStateOPEN,
				},
				expectedStatus: models.SISRLcidIssued,
				errorExpected:  false,
			},
			{
				testName: "Decision made, Not Governance, closed",
				intake: models.SystemIntake{
					Step:          models.SystemIntakeStepDECISION,
					DecisionState: models.SIDSNotGovernance,
					State:         models.SystemIntakeStateCLOSED,
				},
				expectedStatus: models.SISRNotGovernance,
				errorExpected:  false,
			},
			{
				testName: "Decision made, Not Governance, re-opened",
				intake: models.SystemIntake{
					Step:          models.SystemIntakeStepDECISION,
					DecisionState: models.SIDSNotGovernance,
					State:         models.SystemIntakeStateOPEN,
				},
				expectedStatus: models.SISRNotGovernance,
				errorExpected:  false,
			},
			{
				testName: "Decision made, Not Approved, closed",
				intake: models.SystemIntake{
					Step:          models.SystemIntakeStepDECISION,
					DecisionState: models.SIDSNotApproved,
					State:         models.SystemIntakeStateCLOSED,
				},
				expectedStatus: models.SISRNotApproved,
				errorExpected:  false,
			},
			{
				testName: "Decision made, Not Approved, re-opened",
				intake: models.SystemIntake{
					Step:          models.SystemIntakeStepDECISION,
					DecisionState: models.SIDSNotApproved,
					State:         models.SystemIntakeStateOPEN,
				},
				expectedStatus: models.SISRNotApproved,
				errorExpected:  false,
			},
			{
				testName: "Decision made, but re-opened, progressed, then closed",
				intake: models.SystemIntake{
					Step:          models.SystemIntakeStepFINALBIZCASE,
					DecisionState: models.SIDSNotApproved,
					State:         models.SystemIntakeStateCLOSED,
				},
				expectedStatus: models.SISRClosed,
				errorExpected:  false,
			},
			{
				// this state is invalid - an intake that's been closed with no decision should not have reached the decision step
				testName: "Closed with no decision while in the decision step",
				intake: models.SystemIntake{
					Step:          models.SystemIntakeStepDECISION,
					DecisionState: models.SIDSNoDecision,
					State:         models.SystemIntakeStateCLOSED,
				},
				expectedStatus: "",
				errorExpected:  true,
			},
			{
				// this state is invalid - if an intake has been closed with no decision, it should not be re-opened and remain in the decision step
				testName: "Open with decisionState set to No Decision while in the decision step",
				intake: models.SystemIntake{
					Step:          models.SystemIntakeStepDECISION,
					DecisionState: models.SIDSNoDecision,
					State:         models.SystemIntakeStateOPEN,
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
