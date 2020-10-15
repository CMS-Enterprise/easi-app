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
		s.Len(fetched.LifecycleCostLines, 2)
	})

	s.Run("cannot without an ID that exists in the db", func() {
		badUUID, _ := uuid.Parse("")
		fetched, err := s.store.FetchBusinessCaseByID(ctx, badUUID)

		s.Error(err)
		s.IsType(&apperrors.ResourceNotFoundError{}, err)
		s.Nil(fetched)
	})

	s.Run("does not fetch archived business case", func() {
		intake := testhelpers.NewSystemIntake()
		_, err := s.store.CreateSystemIntake(ctx, &intake)
		s.NoError(err)
		businessCase := testhelpers.NewBusinessCase()
		businessCase.SystemIntakeID = intake.ID
		businessCase.Status = models.BusinessCaseStatusARCHIVED
		created, err := s.store.CreateBusinessCase(ctx, &businessCase)
		s.NoError(err)
		fetched, err := s.store.FetchBusinessCaseByID(ctx, created.ID)

		s.Error(err)
		s.IsType(&apperrors.ResourceNotFoundError{}, err)
		s.Nil(fetched)
	})
}

func (s StoreTestSuite) TestFetchBusinessCasesByEuaID() {
	ctx := context.Background()

	s.Run("golden path to fetch business cases", func() {
		intake := testhelpers.NewSystemIntake()
		intake.Status = models.SystemIntakeStatusSUBMITTED
		_, err := s.store.CreateSystemIntake(ctx, &intake)
		s.NoError(err)

		intake2 := testhelpers.NewSystemIntake()
		intake2.EUAUserID = intake.EUAUserID
		intake2.Status = models.SystemIntakeStatusSUBMITTED
		_, err = s.store.CreateSystemIntake(ctx, &intake2)
		s.NoError(err)

		businessCase := testhelpers.NewBusinessCase()
		businessCase.EUAUserID = intake.EUAUserID
		businessCase.SystemIntakeID = intake.ID

		businessCase2 := testhelpers.NewBusinessCase()
		businessCase2.EUAUserID = intake.EUAUserID
		businessCase2.SystemIntakeID = intake2.ID

		_, err = s.store.CreateBusinessCase(ctx, &businessCase)
		s.NoError(err)

		_, err = s.store.CreateBusinessCase(ctx, &businessCase2)
		s.NoError(err)

		fetched, err := s.store.FetchBusinessCasesByEuaID(ctx, businessCase.EUAUserID)

		s.NoError(err, "failed to fetch business cases")
		s.Len(fetched, 2)
		s.Len(fetched[0].LifecycleCostLines, 2)
		s.Equal(businessCase.EUAUserID, fetched[0].EUAUserID)
	})

	s.Run("fetches no results with other EUA ID", func() {
		fetched, err := s.store.FetchBusinessCasesByEuaID(ctx, testhelpers.RandomEUAID())

		s.NoError(err)
		s.Len(fetched, 0)
		s.Equal(models.BusinessCases{}, fetched)
	})

	s.Run("does not fetch archived business case", func() {
		intake := testhelpers.NewSystemIntake()
		intake.Status = models.SystemIntakeStatusSUBMITTED
		_, err := s.store.CreateSystemIntake(ctx, &intake)
		s.NoError(err)

		intake2 := testhelpers.NewSystemIntake()
		intake2.EUAUserID = intake.EUAUserID
		intake2.Status = models.SystemIntakeStatusDRAFT
		_, err = s.store.CreateSystemIntake(ctx, &intake2)
		s.NoError(err)
		intake2.Status = models.SystemIntakeStatusARCHIVED
		_, err = s.store.UpdateSystemIntake(ctx, &intake2)
		s.NoError(err)

		businessCase := testhelpers.NewBusinessCase()
		businessCase.EUAUserID = intake.EUAUserID
		businessCase.SystemIntakeID = intake.ID

		businessCase2 := testhelpers.NewBusinessCase()
		businessCase2.EUAUserID = intake.EUAUserID
		businessCase2.SystemIntakeID = intake2.ID
		businessCase2.Status = models.BusinessCaseStatusARCHIVED

		_, err = s.store.CreateBusinessCase(ctx, &businessCase)
		s.NoError(err)

		_, err = s.store.CreateBusinessCase(ctx, &businessCase2)
		s.NoError(err)

		fetched, err := s.store.FetchBusinessCasesByEuaID(ctx, businessCase.EUAUserID)

		s.NoError(err, "failed to fetch business cases")
		s.Len(fetched, 1)
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
			Status:         models.BusinessCaseStatusDRAFT,
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
			Status:    models.BusinessCaseStatusDRAFT,
		}

		_, err := s.store.CreateBusinessCase(ctx, &businessCase)

		s.Error(err)
		s.Equal(IntakeExistsMsg, err.Error())
	})

	s.Run("requires a system intake ID that exists in the db", func() {
		badintakeID := uuid.New()
		businessCase := models.BusinessCase{
			SystemIntakeID: badintakeID,
			EUAUserID:      testhelpers.RandomEUAID(),
			Status:         models.BusinessCaseStatusDRAFT,
		}

		_, err := s.store.CreateBusinessCase(ctx, &businessCase)

		s.Error(err)
		s.Equal(IntakeExistsMsg, err.Error())
	})

	s.Run("requires an eua user id", func() {
		intake := testhelpers.NewSystemIntake()
		_, err := s.store.CreateSystemIntake(ctx, &intake)
		s.NoError(err)
		businessCase := models.BusinessCase{
			SystemIntakeID: intake.ID,
			Status:         models.BusinessCaseStatusDRAFT,
		}
		_, err = s.store.CreateBusinessCase(ctx, &businessCase)

		s.Error(err)
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
		s.Contains(err.Error(), ValidStatusMsg)
	})
}

func (s StoreTestSuite) TestUpdateBusinessCase() {
	ctx := context.Background()

	intake := testhelpers.NewSystemIntake()
	_, err := s.store.CreateSystemIntake(ctx, &intake)
	s.NoError(err)
	euaID := intake.EUAUserID
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
			Status:               models.BusinessCaseStatusDRAFT,
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
			Status: models.BusinessCaseStatusSUBMITTED,
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
			Status:         models.BusinessCaseStatusDRAFT,
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
			Status:             models.BusinessCaseStatusDRAFT,
			LifecycleCostLines: models.EstimatedLifecycleCosts{},
		}
		_, err := s.store.UpdateBusinessCase(ctx, &businessCaseToUpdate)
		s.Error(err)
		s.Equal("business case not found", err.Error())
	})
}

func (s StoreTestSuite) TestFetchBusinessCaseByIntakeID() {
	ctx := context.Background()

	s.Run("golden path to fetching a business case id by intake id", func() {
		businessCase := testhelpers.NewBusinessCase()
		intake := testhelpers.NewSystemIntake()
		businessCase.SystemIntakeID = intake.ID
		intake.Status = models.SystemIntakeStatusACCEPTED
		setupTx := s.db.MustBegin()
		_, err := setupTx.NamedExec("INSERT INTO system_intake (id, eua_user_id, status, requester) VALUES (:id, :eua_user_id, :status, :requester)", &intake)
		s.NoError(err)
		_, err = setupTx.NamedExec("INSERT INTO business_case (id, eua_user_id, status, requester, system_intake) VALUES (:id, :eua_user_id, :status, :requester, :system_intake)", &businessCase)
		s.NoError(err)
		err = setupTx.Commit()
		s.NoError(err)

		fetchedBizCaseID, err := s.store.FetchBusinessCaseIDByIntakeID(ctx, intake.ID)
		s.NoError(err)
		s.Equal(&businessCase.ID, fetchedBizCaseID)
	})

	s.Run("doesn't error when no records are found", func() {
		fetchedBizCaseID, err := s.store.FetchBusinessCaseIDByIntakeID(ctx, uuid.New())
		s.NoError(err)
		s.Equal((*uuid.UUID)(nil), fetchedBizCaseID)
	})
}
