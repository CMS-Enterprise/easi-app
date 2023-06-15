package models

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

// TODO: fullly implement the unit tests whent he status calculations have been develped
func TestIntakeFormStatus(t *testing.T) {
	intake := SystemIntake{
		Status: SystemIntakeStatusCLOSED,
	}
	ITGovTaskStatuses := &ITGovTaskStatuses{
		ParentSystemIntake: &intake,
	}

	requesterStatuses := ITGovTaskStatusesRequester{
		ParentStatus: ITGovTaskStatuses,
	}

	status := requesterStatuses.IntakeFormStatus()

	assert.EqualValues(t, ITGISRReady, status)

}

func TestFeedbackFromInitialReviewStatus(t *testing.T) {
	intake := SystemIntake{
		Status: SystemIntakeStatusCLOSED,
	}
	ITGovTaskStatuses := &ITGovTaskStatuses{
		ParentSystemIntake: &intake,
	}

	requesterStatuses := ITGovTaskStatusesRequester{
		ParentStatus: ITGovTaskStatuses,
	}

	status := requesterStatuses.FeedbackFromInitialReviewStatus()

	assert.EqualValues(t, ITGFBSRCantStart, status)

}
func TestDecisionAndNextStepsStatus(t *testing.T) {
	intake := SystemIntake{
		Status: SystemIntakeStatusCLOSED,
	}
	ITGovTaskStatuses := &ITGovTaskStatuses{
		ParentSystemIntake: &intake,
	}

	requesterStatuses := ITGovTaskStatusesRequester{
		ParentStatus: ITGovTaskStatuses,
	}

	status := requesterStatuses.DecisionAndNextStepsStatus()

	assert.EqualValues(t, ITGDSRCantStart, status)

}
func TestBizCaseDraftStatus(t *testing.T) {
	intake := SystemIntake{
		Status: SystemIntakeStatusCLOSED,
	}
	ITGovTaskStatuses := &ITGovTaskStatuses{
		ParentSystemIntake: &intake,
	}

	requesterStatuses := ITGovTaskStatusesRequester{
		ParentStatus: ITGovTaskStatuses,
	}

	status := requesterStatuses.BizCaseDraftStatus()

	assert.EqualValues(t, ITGDBCSRCantStart, status)

}
func TestGrtMeetingStatus(t *testing.T) {
	intake := SystemIntake{
		Status: SystemIntakeStatusCLOSED,
	}
	ITGovTaskStatuses := &ITGovTaskStatuses{
		ParentSystemIntake: &intake,
	}

	requesterStatuses := ITGovTaskStatusesRequester{
		ParentStatus: ITGovTaskStatuses,
	}

	status := requesterStatuses.GrtMeetingStatus()

	assert.EqualValues(t, ITGGRTSRCantStart, status)

}
func TestBizCaseFinalStatus(t *testing.T) {
	intake := SystemIntake{
		Status: SystemIntakeStatusCLOSED,
	}
	ITGovTaskStatuses := &ITGovTaskStatuses{
		ParentSystemIntake: &intake,
	}

	requesterStatuses := ITGovTaskStatusesRequester{
		ParentStatus: ITGovTaskStatuses,
	}

	status := requesterStatuses.BizCaseFinalStatus()

	assert.EqualValues(t, ITGFBCSRCantStart, status)

}
func TestGrbMeetingStatus(t *testing.T) {
	intake := SystemIntake{
		Status: SystemIntakeStatusCLOSED,
	}
	ITGovTaskStatuses := &ITGovTaskStatuses{
		ParentSystemIntake: &intake,
	}

	requesterStatuses := ITGovTaskStatusesRequester{
		ParentStatus: ITGovTaskStatuses,
	}

	status := requesterStatuses.GrbMeetingStatus()

	assert.EqualValues(t, ITGGRBSRCantStart, status)

}

// func (suite *ModelTestSuite) TestSystemIntakeDocumentResolvers() {
