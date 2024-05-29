package resolvers

import (
	"time"

	"github.com/cmsgov/easi-app/pkg/models"
)

func (suite *ResolverSuite) TestSystemIntakesQuery() {
	ctx := suite.testConfigs.Context
	store := suite.testConfigs.Store

	submittedAt := time.Now()

	// Create an open intake
	openIntake, err := store.CreateSystemIntake(ctx, &models.SystemIntake{
		State:       models.SystemIntakeStateOpen,
		RequestType: models.SystemIntakeRequestTypeNEW,
		SubmittedAt: &submittedAt,
	})
	suite.NoError(err)
	suite.NotNil(openIntake)
	// set submitted_at
	openIntake.SubmittedAt = &submittedAt
	openIntake, err = store.UpdateSystemIntake(ctx, openIntake)
	suite.NoError(err)
	suite.NotNil(openIntake)

	// Create a closed intake
	closedIntake, err := store.CreateSystemIntake(ctx, &models.SystemIntake{
		State:       models.SystemIntakeStateClosed,
		RequestType: models.SystemIntakeRequestTypeNEW,
		SubmittedAt: &submittedAt,
	})
	suite.NoError(err)
	suite.NotNil(closedIntake)
	// set submitted_at
	closedIntake.SubmittedAt = &submittedAt
	closedIntake, err = store.UpdateSystemIntake(ctx, closedIntake)
	suite.NoError(err)
	suite.NotNil(closedIntake)

	// Check open intakes
	openIntakes, err := SystemIntakes(ctx, store, true)
	suite.NoError(err)
	suite.Len(openIntakes, 1)
	suite.Equal(openIntakes[0].ID, openIntake.ID)

	// Check closed intakes
	closedIntakes, err := SystemIntakes(ctx, store, false)
	suite.NoError(err)
	suite.Len(closedIntakes, 1)
	suite.Equal(closedIntakes[0].ID, closedIntake.ID)
}

func (suite *ResolverSuite) TestSystemIntakesQueryUnsubmitted() {
	ctx := suite.testConfigs.Context
	store := suite.testConfigs.Store

	// Create an open intake
	openIntake, err := store.CreateSystemIntake(ctx, &models.SystemIntake{
		State:       models.SystemIntakeStateOpen,
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	suite.NoError(err)
	suite.NotNil(openIntake)

	// Create a closed intake
	closedIntake, err := store.CreateSystemIntake(ctx, &models.SystemIntake{
		State:       models.SystemIntakeStateClosed,
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	suite.NoError(err)
	suite.NotNil(closedIntake)

	// Check open intakes
	openIntakes, err := SystemIntakes(ctx, store, true)
	suite.NoError(err)
	suite.Len(openIntakes, 0)

	// Check closed intakes
	closedIntakes, err := SystemIntakes(ctx, store, false)
	suite.NoError(err)
	suite.Len(closedIntakes, 0)
}

func (suite *ResolverSuite) TestSystemIntakesQueryArchived() {
	ctx := suite.testConfigs.Context
	store := suite.testConfigs.Store

	archivedAt := time.Now()

	// Create an open intake with an `archived_at`
	openIntake, err := store.CreateSystemIntake(ctx, &models.SystemIntake{
		State:       models.SystemIntakeStateOpen,
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	suite.NoError(err)
	suite.NotNil(openIntake)
	// set archived_at
	openIntake.ArchivedAt = &archivedAt
	openIntake, err = store.UpdateSystemIntake(ctx, openIntake)
	suite.NoError(err)
	suite.NotNil(openIntake)

	// Create a closed intake with an `archived_at`
	closedIntake, err := store.CreateSystemIntake(ctx, &models.SystemIntake{
		State:       models.SystemIntakeStateClosed,
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	suite.NoError(err)
	suite.NotNil(closedIntake)
	// set archived_at
	closedIntake.ArchivedAt = &archivedAt
	closedIntake, err = store.UpdateSystemIntake(ctx, closedIntake)
	suite.NoError(err)
	suite.NotNil(closedIntake)

	// Check open intakes
	openIntakes, err := SystemIntakes(ctx, store, true)
	suite.NoError(err)
	suite.Len(openIntakes, 0)

	// Check closed intakes
	closedIntakes, err := SystemIntakes(ctx, store, false)
	suite.NoError(err)
	suite.Len(closedIntakes, 0)
}
