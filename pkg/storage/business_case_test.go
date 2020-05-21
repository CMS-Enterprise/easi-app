package storage

import (
	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func newBusinessCase() models.BusinessCase {
	year2 := models.LifecycleCostYear2
	return models.BusinessCase{
		EUAUserID:                       testhelpers.RandomEUAID(),
		SystemIntakeID:                  uuid.New(),
		ProjectName:                     null.StringFrom("Test Project Name"),
		Requester:                       null.StringFrom("Test Requester"),
		RequesterPhoneNumber:            null.StringFrom("Test Requester Phone Number"),
		BusinessOwner:                   null.StringFrom("Test Business Owner"),
		BusinessNeed:                    null.StringFrom("Test Business Need"),
		CMSBenefit:                      null.StringFrom("Test CMS Benefit"),
		PriorityAlignment:               null.StringFrom("Test Priority Alignment"),
		SuccessIndicators:               null.StringFrom("Test Success Indicators"),
		AsIsTitle:                       null.StringFrom("Test As Is Title"),
		AsIsSummary:                     null.StringFrom("Test As Is Summary"),
		AsIsPros:                        null.StringFrom("Test As Is Pros"),
		AsIsCons:                        null.StringFrom("Test As Is Cons"),
		AsIsCostSavings:                 null.StringFrom("Test As Is Cost Savings"),
		PreferredTitle:                  null.StringFrom("Test Preferred Title"),
		PreferredSummary:                null.StringFrom("Test Preferred Summary"),
		PreferredAcquisitionApproach:    null.StringFrom("Test Preferred Acquisition Approach"),
		PreferredPros:                   null.StringFrom("Test Preferred Pros"),
		PreferredCons:                   null.StringFrom("Test Preferred Cons"),
		PreferredCostSavings:            null.StringFrom("Test Preferred Cost Savings"),
		AlternativeATitle:               null.StringFrom("Test Alternative A Title"),
		AlternativeASummary:             null.StringFrom("Test Alternative A Summary"),
		AlternativeAAcquisitionApproach: null.StringFrom("Test Alternative A Acquisition Approach"),
		AlternativeAPros:                null.StringFrom("Test Alternative A Pros"),
		AlternativeACons:                null.StringFrom("Test Alternative A Cons"),
		AlternativeACostSavings:         null.StringFrom("Test Alternative A Cost Savings"),
		AlternativeBTitle:               null.StringFrom("Test Alternative B Title"),
		AlternativeBSummary:             null.StringFrom("Test Alternative B Summary"),
		AlternativeBAcquisitionApproach: null.StringFrom("Test Alternative B Acquisition Approach"),
		AlternativeBPros:                null.StringFrom("Test Alternative B Pros"),
		AlternativeBCons:                null.StringFrom("Test Alternative B Cons"),
		AlternativeBCostSavings:         null.StringFrom("Test Alternative B Cost Savings"),
		LifecycleCostLines: models.EstimatedLifecycleCosts{
			testhelpers.NewEstimatedLifecycleCost(
				testhelpers.EstimatedLifecycleCostOptions{Year: &year2},
			),
			testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{}),
		},
	}
}

func (s StoreTestSuite) TestFetchBusinessCaseByID() {
	s.Run("golden path to fetch a business case", func() {
		intake := testhelpers.NewSystemIntake()
		err := s.store.SaveSystemIntake(&intake)
		s.NoError(err)
		businessCase := newBusinessCase()
		businessCase.SystemIntakeID = intake.ID
		created, err := s.store.CreateBusinessCase(&businessCase)
		s.NoError(err)
		fetched, err := s.store.FetchBusinessCaseByID(created.ID)

		s.NoError(err, "failed to fetch business case")
		s.Equal(created.ID, fetched.ID)
		s.Equal(businessCase.EUAUserID, fetched.EUAUserID)
		s.Len(fetched.LifecycleCostLines, 2)
	})

	s.Run("cannot without an ID that exists in the db", func() {
		badUUID, _ := uuid.Parse("")
		fetched, err := s.store.FetchBusinessCaseByID(badUUID)

		s.Error(err)
		s.Equal("sql: no rows in result set", err.Error())
		s.Equal(&models.BusinessCase{}, fetched)
	})
}

func (s StoreTestSuite) TestFetchBusinessCasesByEuaID() {
	s.Run("golden path to fetch business cases", func() {
		intake := testhelpers.NewSystemIntake()
		intake.Status = models.SystemIntakeStatusSUBMITTED
		err := s.store.SaveSystemIntake(&intake)
		s.NoError(err)

		intake2 := testhelpers.NewSystemIntake()
		intake2.EUAUserID = intake.EUAUserID
		intake2.Status = models.SystemIntakeStatusSUBMITTED
		err = s.store.SaveSystemIntake(&intake2)
		s.NoError(err)

		businessCase := newBusinessCase()
		businessCase.EUAUserID = intake.EUAUserID
		businessCase.SystemIntakeID = intake.ID

		businessCase2 := newBusinessCase()
		businessCase2.EUAUserID = intake.EUAUserID
		businessCase2.SystemIntakeID = intake2.ID

		_, err = s.store.CreateBusinessCase(&businessCase)
		s.NoError(err)

		_, err = s.store.CreateBusinessCase(&businessCase2)
		s.NoError(err)

		fetched, err := s.store.FetchBusinessCasesByEuaID(businessCase.EUAUserID)

		s.NoError(err, "failed to fetch business cases")
		s.Len(fetched, 2)
		s.Len(fetched[0].LifecycleCostLines, 2)
		s.Equal(businessCase.EUAUserID, fetched[0].EUAUserID)
	})

	s.Run("fetches no results with other EUA ID", func() {
		fetched, err := s.store.FetchBusinessCasesByEuaID(testhelpers.RandomEUAID())

		s.NoError(err)
		s.Len(fetched, 0)
		s.Equal(models.BusinessCases{}, fetched)
	})
}

func (s StoreTestSuite) TestCreateBusinessCase() {
	s.Run("golden path to create a business case", func() {
		intake := testhelpers.NewSystemIntake()
		err := s.store.SaveSystemIntake(&intake)
		s.NoError(err)
		businessCase := models.BusinessCase{
			SystemIntakeID: intake.ID,
			EUAUserID:      testhelpers.RandomEUAID(),
			LifecycleCostLines: models.EstimatedLifecycleCosts{
				testhelpers.NewEstimatedLifecycleCost(testhelpers.EstimatedLifecycleCostOptions{}),
			},
		}
		created, err := s.store.CreateBusinessCase(&businessCase)

		s.NoError(err, "failed to create a business case")
		s.NotNil(created.ID)
		s.Equal(businessCase.EUAUserID, created.EUAUserID)
		s.Len(created.LifecycleCostLines, 1)
	})

	s.Run("requires a system intake ID", func() {
		businessCase := models.BusinessCase{
			EUAUserID: testhelpers.RandomEUAID(),
		}

		_, err := s.store.CreateBusinessCase(&businessCase)

		s.Error(err)
		s.Equal("pq: Could not complete operation in a failed transaction", err.Error())
	})

	s.Run("requires a system intake ID that exists in the db", func() {
		badintakeID := uuid.New()
		businessCase := models.BusinessCase{
			SystemIntakeID: badintakeID,
			EUAUserID:      testhelpers.RandomEUAID(),
		}

		_, err := s.store.CreateBusinessCase(&businessCase)

		s.Error(err)
		s.Equal("pq: Could not complete operation in a failed transaction", err.Error())
	})

	s.Run("cannot without a eua user id", func() {
		intake := testhelpers.NewSystemIntake()
		err := s.store.SaveSystemIntake(&intake)
		s.NoError(err)
		businessCase := models.BusinessCase{
			SystemIntakeID: intake.ID,
		}
		_, err = s.store.CreateBusinessCase(&businessCase)

		s.Error(err)
		s.Equal("pq: Could not complete operation in a failed transaction", err.Error())
	})
}
