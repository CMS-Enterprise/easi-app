package storage

import (
	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func newBusinessCase() models.BusinessCase {
	businessCaseID := uuid.New()
	year2 := models.LifecycleCostYear2
	return models.BusinessCase{
		ID:                              businessCaseID,
		EUAUserID:                       testhelpers.RandomEUAID(),
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
				businessCaseID,
				testhelpers.EstimatedLifecycleCostOptions{Year: &year2},
			),
			testhelpers.NewEstimatedLifecycleCost(businessCaseID, testhelpers.EstimatedLifecycleCostOptions{}),
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
		id := businessCase.ID
		tx := s.db.MustBegin()
		_, err = tx.NamedExec(
			`INSERT INTO business_case (id, eua_user_id, system_intake, project_name)
			VALUES (:id, :eua_user_id, :system_intake, :project_name)`,
			&businessCase)
		s.NoError(err)
		for _, lifecycleItem := range businessCase.LifecycleCostLines {
			_, err = tx.NamedExec(
				`INSERT INTO estimated_lifecycle_cost (id, business_case, solution, year, phase, cost)
					VALUES (:id, :business_case, :solution, :year, :phase, :cost)`,
				&lifecycleItem)
			s.NoError(err)
		}
		err = tx.Commit()
		s.NoError(err)

		fetched, err := s.store.FetchBusinessCaseByID(id)

		s.NoError(err, "failed to fetch business case")
		s.Equal(businessCase.ID, fetched.ID)
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
		businessCase := newBusinessCase()
		businessCase2 := newBusinessCase()
		businessCase2.EUAUserID = businessCase.EUAUserID

		tx := s.db.MustBegin()
		insertBusinessCaseSQL := `
			INSERT INTO business_case (
				 id, 
				 eua_user_id, 
				 project_name, 
				 requester, 
				 requester_phone_number, 
				 business_owner, 
				 business_need, 
				 cms_benefit, 
				 priority_alignment, 
				 success_indicators, 
				 as_is_title, 
				 as_is_summary, 
				 as_is_pros, 
				 as_is_cons, 
				 as_is_cost_savings, 
				 preferred_title, 
				 preferred_summary, 
				 preferred_acquisition_approach, 
				 preferred_pros, 
				 preferred_cons, 
				 preferred_cost_savings, 
				 alternative_a_title, 
				 alternative_a_summary, 
				 alternative_a_acquisition_approach, 
				 alternative_a_pros, 
				 alternative_a_cons, 
				 alternative_a_cost_savings, 
				 alternative_b_title, 
				 alternative_b_summary, 
				 alternative_b_acquisition_approach, 
				 alternative_b_pros, 
				 alternative_b_cons, 
				 alternative_b_cost_savings
			)
			VALUES 
			(
				 :id, 
				 :eua_user_id, 
				 :project_name, 
				 :requester, 
				 :requester_phone_number, 
				 :business_owner, 
				 :business_need, 
				 :cms_benefit, 
				 :priority_alignment, 
				 :success_indicators, 
				 :as_is_title, 
				 :as_is_summary, 
				 :as_is_pros, 
				 :as_is_cons, 
				 :as_is_cost_savings, 
				 :preferred_title, 
				 :preferred_summary, 
				 :preferred_acquisition_approach, 
				 :preferred_pros, 
				 :preferred_cons, 
				 :preferred_cost_savings, 
				 :alternative_a_title, 
				 :alternative_a_summary, 
				 :alternative_a_acquisition_approach, 
				 :alternative_a_pros, 
				 :alternative_a_cons, 
				 :alternative_a_cost_savings, 
				 :alternative_b_title, 
				 :alternative_b_summary, 
				 :alternative_b_acquisition_approach, 
				 :alternative_b_pros, 
				 :alternative_b_cons, 
				 :alternative_b_cost_savings 
			)
		`
		_, err := tx.NamedExec(insertBusinessCaseSQL, &businessCase)
		s.NoError(err)
		_, err = tx.NamedExec(insertBusinessCaseSQL, &businessCase2)
		s.NoError(err)
		for _, lifecycleItem := range businessCase.LifecycleCostLines {
			_, err = tx.NamedExec(
				`INSERT INTO estimated_lifecycle_cost (id, business_case, solution, year, phase, cost)
					VALUES (:id, :business_case, :solution, :year, :phase, :cost)`,
				&lifecycleItem)
			s.NoError(err)
		}
		for _, lifecycleItem := range businessCase2.LifecycleCostLines {
			_, err = tx.NamedExec(
				`INSERT INTO estimated_lifecycle_cost (id, business_case, solution, year, phase, cost)
					VALUES (:id, :business_case, :solution, :year, :phase, :cost)`,
				&lifecycleItem)
			s.NoError(err)
		}
		err = tx.Commit()
		s.NoError(err)

		fetched, err := s.store.FetchBusinessCasesByEuaID(businessCase.EUAUserID)

		s.NoError(err, "failed to fetch business cases")
		s.Len(fetched, 2)
		s.Len(fetched[0].LifecycleCostLines, 2)
		s.Equal(businessCase.EUAUserID, fetched[0].EUAUserID)
		s.Contains(fetched, businessCase)
	})

	s.Run("fetches no results with other EUA ID", func() {
		fetched, err := s.store.FetchBusinessCasesByEuaID(testhelpers.RandomEUAID())

		s.NoError(err)
		s.Len(fetched, 0)
		s.Equal(models.BusinessCases{}, fetched)
	})
}
