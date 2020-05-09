package storage

import (
	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func newEstimatedLifecycleCost(businessCaseID uuid.UUID) models.EstimatedLifecycleCost {
	return models.EstimatedLifecycleCost{
		ID:             uuid.New(),
		BusinessCaseID: businessCaseID,
		Solution:       models.LifecycleCostSolutionASIS,
		Phase:          models.LifecycleCostPhaseINITIATE,
		Year:           models.LifecycleCostYear1,
		Cost:           100,
	}
}

func newBusinessCase() models.BusinessCase {
	businessCaseID := uuid.New()
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
			newEstimatedLifecycleCost(businessCaseID),
			newEstimatedLifecycleCost(businessCaseID),
		},
	}
}

func (s StoreTestSuite) TestFetchBusinessCaseByID() {
	s.Run("golden path to fetch a business case", func() {
		businessCase := newBusinessCase()
		id := businessCase.ID
		tx := s.db.MustBegin()
		_, err := tx.NamedExec(
			`INSERT INTO business_case (id, eua_user_id, project_name) 
			VALUES (:id, :eua_user_id, :project_name)`,
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
