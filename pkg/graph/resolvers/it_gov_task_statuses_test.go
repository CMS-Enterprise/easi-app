package resolvers

import "github.com/cmsgov/easi-app/pkg/models"

// TODO: fullly implement the unit tests whent he status calculations have been developed. Store methods should ideally happen on a parent resolver, so the child requests can utilize the same object
func (suite *ResolverSuite) TestIntakeFormStatus() {
	intake := models.SystemIntake{
		Status: models.SystemIntakeStatusCLOSED,
	}

	status := IntakeFormStatus(&intake)
	suite.EqualValues(models.ITGISReady, status)

}

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
