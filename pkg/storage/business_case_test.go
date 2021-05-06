package storage

import (
	"context"

	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func (s StoreTestSuite) TestFetchBusinessCaseByID() {
	ctx := context.Background()

	s.Run("golden path to fetch a business case", func() {
		intake := testhelpers.NewSystemIntake()
		_, err := s.store.CreateSystemIntake(ctx, &intake)
		s.NoError(err)
		businessCase := testhelpers.NewBusinessCase()
		businessCase.SystemIntakeID = intake.ID
		created, err := s.store.CreateBusinessCase(ctx, &businessCase)
		s.NoError(err)
		fetched, err := s.store.FetchBusinessCaseByID(ctx, created.ID)

		s.NoError(err, "failed to fetch business case")
		s.Equal(created.ID, fetched.ID)
		s.Equal(businessCase.EUAUserID, fetched.EUAUserID)
		s.Equal(intake.Status, fetched.SystemIntakeStatus)
		s.Len(fetched.LifecycleCostLines, 2)
	})

	s.Run("fetches an open business case", func() {
		intake := testhelpers.NewSystemIntake()
		_, err := s.store.CreateSystemIntake(ctx, &intake)
		s.NoError(err)
		businessCase := testhelpers.NewBusinessCase()
		businessCase.Status = models.BusinessCaseStatusOPEN
		businessCase.SystemIntakeID = intake.ID
		created, err := s.store.CreateBusinessCase(ctx, &businessCase)
		s.NoError(err)
		fetched, err := s.store.FetchOpenBusinessCaseByIntakeID(ctx, intake.ID)

		s.NoError(err, "failed to fetch business case")
		s.Equal(created.ID, fetched.ID)
		s.Equal(businessCase.EUAUserID, fetched.EUAUserID)
		s.Len(fetched.LifecycleCostLines, 2)
	})

	s.Run("cannot without an ID that exists in the db", func() {
		badUUID, _ := uuid.Parse("")
		fetched, err := s.store.FetchBusinessCaseByID(ctx, badUUID)

		s.Error(err)
		s.IsType(&apperrors.ResourceNotFoundError{}, err)
		s.Nil(fetched)
	})
}

func (s StoreTestSuite) TestCreateBusinessCase() {
	ctx := context.Background()

	s.Run("golden path to create a business case", func() {
		intake := testhelpers.NewSystemIntake()
		_, err := s.store.CreateSystemIntake(ctx, &intake)
		s.NoError(err)
		businessCase := models.BusinessCase{
			SystemIntakeID: intake.ID,
			EUAUserID:      testhelpers.RandomEUAID(),
			Status:         models.BusinessCaseStatusOPEN,
			LifecycleCostLines: models.EstimatedLifecycleCosts{
				testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{}),
			},
		}
		created, err := s.store.CreateBusinessCase(ctx, &businessCase)

		s.NoError(err, "failed to create a business case")
		s.NotNil(created.ID)
		s.Equal(businessCase.EUAUserID, created.EUAUserID)
		s.Len(created.LifecycleCostLines, 1)
	})

	s.Run("requires a system intake ID", func() {
		businessCase := models.BusinessCase{
			EUAUserID: testhelpers.RandomEUAID(),
			Status:    models.BusinessCaseStatusOPEN,
		}

		_, err := s.store.CreateBusinessCase(ctx, &businessCase)

		s.Error(err)
		s.IsType(&apperrors.QueryError{}, err)
		s.Equal(IntakeExistsMsg, err.Error())
	})

	s.Run("requires a system intake ID that exists in the db", func() {
		badintakeID := uuid.New()
		businessCase := models.BusinessCase{
			SystemIntakeID: badintakeID,
			EUAUserID:      testhelpers.RandomEUAID(),
			Status:         models.BusinessCaseStatusOPEN,
		}

		_, err := s.store.CreateBusinessCase(ctx, &businessCase)

		s.Error(err)
		s.IsType(&apperrors.QueryError{}, err)
		s.Equal(IntakeExistsMsg, err.Error())
	})

	s.Run("requires an eua user id", func() {
		intake := testhelpers.NewSystemIntake()
		_, err := s.store.CreateSystemIntake(ctx, &intake)
		s.NoError(err)
		businessCase := models.BusinessCase{
			SystemIntakeID: intake.ID,
			Status:         models.BusinessCaseStatusOPEN,
		}
		_, err = s.store.CreateBusinessCase(ctx, &businessCase)

		s.Error(err)
		s.IsType(&apperrors.QueryError{}, err)
		s.Equal(EuaIDMsg, err.Error())
	})

	s.Run("requires a status", func() {
		intake := testhelpers.NewSystemIntake()
		_, err := s.store.CreateSystemIntake(ctx, &intake)
		s.NoError(err)
		businessCase := models.BusinessCase{
			SystemIntakeID: intake.ID,
			EUAUserID:      testhelpers.RandomEUAID(),
		}
		_, err = s.store.CreateBusinessCase(ctx, &businessCase)

		s.Error(err)
		s.IsType(&apperrors.QueryError{}, err)
		s.Contains(err.Error(), ValidStatusMsg)
	})
}

func (s StoreTestSuite) TestUpdateBusinessCase() {
	ctx := context.Background()

	intake := testhelpers.NewSystemIntake()
	_, err := s.store.CreateSystemIntake(ctx, &intake)
	s.NoError(err)
	euaID := intake.EUAUserID.ValueOrZero()
	businessCaseOriginal := testhelpers.NewBusinessCase()
	businessCaseOriginal.EUAUserID = euaID
	businessCaseOriginal.SystemIntakeID = intake.ID
	createdBusinessCase, err := s.store.CreateBusinessCase(ctx, &businessCaseOriginal)
	s.NoError(err)
	id := createdBusinessCase.ID
	year2 := models.LifecycleCostYear2
	year3 := models.LifecycleCostYear3
	solution := models.LifecycleCostSolutionA

	s.Run("golden path to update a business case", func() {
		expectedPhoneNumber := null.StringFrom("3452345678")
		expectedProjectName := null.StringFrom("Fake name")
		businessCaseToUpdate := models.BusinessCase{
			ID:                   id,
			Status:               models.BusinessCaseStatusOPEN,
			ProjectName:          expectedProjectName,
			RequesterPhoneNumber: expectedPhoneNumber,
			PriorityAlignment:    null.String{},
			LifecycleCostLines: models.EstimatedLifecycleCosts{
				testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{}),
				testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{
					Year: &year2,
				}),
				testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{
					Solution: &solution,
				}),
			},
		}
		_, err := s.store.UpdateBusinessCase(ctx, &businessCaseToUpdate)
		s.NoError(err)
		//	fetch the newly updated business case
		updated, err := s.store.FetchBusinessCaseByID(context.Background(), id)
		s.NoError(err)
		s.Equal(expectedPhoneNumber, updated.RequesterPhoneNumber)
		s.Equal(expectedProjectName, updated.ProjectName)
		s.Equal(null.String{}, updated.PriorityAlignment)
		s.Equal(3, len(updated.LifecycleCostLines))
	})

	s.Run("lifecycle costs are recreated", func() {
		businessCaseToUpdate := models.BusinessCase{
			ID:     id,
			Status: models.BusinessCaseStatusOPEN,
			LifecycleCostLines: models.EstimatedLifecycleCosts{
				testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{}),
				testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{
					Year:     &year2,
					Solution: &solution,
				}),
				testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{
					Year:     &year3,
					Solution: &solution,
				}),
				testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{}),
				testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{
					Year: &year2,
				}),
				testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{
					Year: &year3,
				}),
				testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{
					Solution: &solution,
				}),
			},
		}
		_, err := s.store.UpdateBusinessCase(ctx, &businessCaseToUpdate)
		s.NoError(err)
		//	fetch the newly updated business case
		updated, err := s.store.FetchBusinessCaseByID(context.Background(), id)
		s.NoError(err)
		s.Equal(7, len(updated.LifecycleCostLines))
	})

	s.Run("doesn't update system intake or eua user id", func() {
		unwantedSystemIntakeID := uuid.New()
		unwantedEUAUserID := testhelpers.RandomEUAID()
		businessCaseToUpdate := models.BusinessCase{
			ID:             id,
			Status:         models.BusinessCaseStatusOPEN,
			SystemIntakeID: unwantedSystemIntakeID,
			EUAUserID:      unwantedEUAUserID,
		}
		_, err := s.store.UpdateBusinessCase(ctx, &businessCaseToUpdate)
		s.NoError(err)
		//	fetch the newly updated business case
		updated, err := s.store.FetchBusinessCaseByID(context.Background(), id)
		s.NoError(err)
		s.NotEqual(unwantedSystemIntakeID, updated.SystemIntakeID)
		s.Equal(intake.ID, updated.SystemIntakeID)
		s.NotEqual(unwantedEUAUserID, updated.EUAUserID)
		s.Equal(euaID, updated.EUAUserID)
	})

	s.Run("fails if the business case ID doesn't exist", func() {
		badUUID := uuid.New()
		businessCaseToUpdate := models.BusinessCase{
			ID:                 badUUID,
			Status:             models.BusinessCaseStatusOPEN,
			LifecycleCostLines: models.EstimatedLifecycleCosts{},
		}
		_, err := s.store.UpdateBusinessCase(ctx, &businessCaseToUpdate)
		s.Error(err)
		s.Equal("business case not found", err.Error())
	})
}
