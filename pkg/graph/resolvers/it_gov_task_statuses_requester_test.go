package resolvers

import "github.com/cmsgov/easi-app/pkg/models"

// TODO: fullly implement the unit tests whent he status calculations have been developed. Store methods should ideally happen on a parent resolver, so the child requests can utilize the same object
func (suite *ResolverSuite) TestIntakeFormStatusReq() {
	intake := models.SystemIntake{
		Status: models.SystemIntakeStatusCLOSED,
	}

	status := IntakeFormStatusReq(&intake)
	suite.EqualValues(models.ITGISRReady, status)

}

func (suite *ResolverSuite) TestFeedbackFromInitialReviewStatusReq() {
	intake := models.SystemIntake{
		Status: models.SystemIntakeStatusCLOSED,
	}

	status := FeedbackFromInitialReviewStatusReq(&intake)

	suite.EqualValues(models.ITGFBSRCantStart, status)

}
func (suite *ResolverSuite) TestDecisionAndNextStepsStatusReq() {
	intake := models.SystemIntake{
		Status: models.SystemIntakeStatusCLOSED,
	}

	status := DecisionAndNextStepsStatusReq(&intake)

	suite.EqualValues(models.ITGDSRCantStart, status)

}
func (suite *ResolverSuite) TestBizCaseDraftStatusReq() {
	intake := models.SystemIntake{
		Status: models.SystemIntakeStatusCLOSED,
	}

	status := BizCaseDraftStatusReq(&intake)

	suite.EqualValues(models.ITGDBCSRCantStart, status)

}
func (suite *ResolverSuite) TestGrtMeetingStatusReq() {
	intake := models.SystemIntake{
		Status: models.SystemIntakeStatusCLOSED,
	}

	status := GrtMeetingStatusReq(&intake)

	suite.EqualValues(models.ITGGRTSRCantStart, status)

}
func (suite *ResolverSuite) TestBizCaseFinalStatusReq() {
	intake := models.SystemIntake{
		Status: models.SystemIntakeStatusCLOSED,
	}

	status := BizCaseFinalStatusReq(&intake)

	suite.EqualValues(models.ITGFBCSRCantStart, status)

}
func (suite *ResolverSuite) TestGrbMeetingStatusReq() {
	intake := models.SystemIntake{
		Status: models.SystemIntakeStatusCLOSED,
	}

	status := GrbMeetingStatusReq(&intake)

	suite.EqualValues(models.ITGGRBSRCantStart, status)

}
