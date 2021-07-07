package graph

import (
	"context"
	"fmt"

	"github.com/guregu/null"
	_ "github.com/lib/pq" // required for postgres driver in sql

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func (s GraphQLTestSuite) TestFetchBusinessCaseForSystemIntakeQuery() {
	ctx := context.Background()

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		Status:      models.SystemIntakeStatusINTAKESUBMITTED,
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(intakeErr)

	businessCase, businessCaseErr := s.store.CreateBusinessCase(ctx, &models.BusinessCase{
		SystemIntakeID: intake.ID,
		Status:         models.BusinessCaseStatusOPEN,
		EUAUserID:      "TEST",
	})
	s.NoError(businessCaseErr)

	var resp struct {
		SystemIntake struct {
			ID           string
			BusinessCase struct {
				ID                   string
				AlternativeASolution struct {
					Cons *string
				}
				LifecycleCostLines []struct {
					Phase *string
				}
			}
		}
	}

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(fmt.Sprintf(
		`query {
			systemIntake(id: "%s") {
				id
				businessCase {
					id
					alternativeASolution {
						cons
					}
					lifecycleCostLines {
						phase
					}
				}
			}
		}`, intake.ID), &resp, testhelpers.AddAuthWithAllJobCodesToGraphQLClientTest(testhelpers.RandomEUAID()))

	s.Equal(intake.ID.String(), resp.SystemIntake.ID)

	respBusinessCase := resp.SystemIntake.BusinessCase
	s.Equal(businessCase.ID.String(), respBusinessCase.ID)
	s.Nil(respBusinessCase.AlternativeASolution.Cons)
	s.Nil(respBusinessCase.LifecycleCostLines[0].Phase)
}

func (s GraphQLTestSuite) TestFetchBusinessCaseWithSolutionAForSystemIntakeQuery() {
	ctx := context.Background()

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		Status:      models.SystemIntakeStatusINTAKESUBMITTED,
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(intakeErr)

	businessCase, businessCaseErr := s.store.CreateBusinessCase(ctx, &models.BusinessCase{
		SystemIntakeID:                      intake.ID,
		Status:                              models.BusinessCaseStatusOPEN,
		EUAUserID:                           "TEST",
		AlternativeAAcquisitionApproach:     null.StringFrom("Aquisition Approach"),
		AlternativeACons:                    null.StringFrom("Cons"),
		AlternativeACostSavings:             null.StringFrom("Savings"),
		AlternativeAHasUI:                   null.StringFrom("Has UI"),
		AlternativeAHostingCloudServiceType: null.StringFrom("Cloud Type"),
		AlternativeAHostingLocation:         null.StringFrom("Hosting Location"),
		AlternativeAHostingType:             null.StringFrom("Hosting Type"),
		AlternativeAPros:                    null.StringFrom("Pros"),
		AlternativeASecurityIsApproved:      null.BoolFrom(true),
		AlternativeASecurityIsBeingReviewed: null.StringFrom("Being Reviewed"),
		AlternativeASummary:                 null.StringFrom("Summary"),
		AlternativeATitle:                   null.StringFrom("Title"),
	})
	s.NoError(businessCaseErr)

	var resp struct {
		SystemIntake struct {
			ID           string
			BusinessCase struct {
				ID                   string
				AlternativeASolution struct {
					AcquisitionApproach     string
					Cons                    string
					CostSavings             string
					HasUI                   string
					HostingCloudServiceType string
					HostingLocation         string
					HostingType             string
					Pros                    string
					SecurityIsApproved      bool
					SecurityIsBeingReviewed string
					Summary                 string
					Title                   string
				}
			}
		}
	}

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(fmt.Sprintf(
		`query {
			systemIntake(id: "%s") {
				id
				businessCase {
					id
					alternativeASolution {
						acquisitionApproach
						cons
						costSavings
						hasUi
						hostingCloudServiceType
						hostingLocation
						hostingType
						pros
						securityIsApproved
						securityIsBeingReviewed
						summary
						title
					}
				}
			}
		}`, intake.ID), &resp, testhelpers.AddAuthWithAllJobCodesToGraphQLClientTest(testhelpers.RandomEUAID()))

	s.Equal(intake.ID.String(), resp.SystemIntake.ID)

	respBusinessCase := resp.SystemIntake.BusinessCase
	s.Equal(businessCase.ID.String(), respBusinessCase.ID)

	respAlternativeA := respBusinessCase.AlternativeASolution
	s.Equal(respAlternativeA.AcquisitionApproach, "Aquisition Approach")
	s.Equal(respAlternativeA.Cons, "Cons")
	s.Equal(respAlternativeA.CostSavings, "Savings")
	s.Equal(respAlternativeA.HasUI, "Has UI")
	s.Equal(respAlternativeA.HostingCloudServiceType, "Cloud Type")
	s.Equal(respAlternativeA.HostingLocation, "Hosting Location")
	s.Equal(respAlternativeA.HostingType, "Hosting Type")
	s.Equal(respAlternativeA.Pros, "Pros")
	s.True(respAlternativeA.SecurityIsApproved)
	s.Equal(respAlternativeA.SecurityIsBeingReviewed, "Being Reviewed")
	s.Equal(respAlternativeA.Summary, "Summary")
	s.Equal(respAlternativeA.Title, "Title")
}

func (s GraphQLTestSuite) TestFetchBusinessCaseWithCostLinesForSystemIntakeQuery() {
	ctx := context.Background()

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		Status:      models.SystemIntakeStatusINTAKESUBMITTED,
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(intakeErr)

	dev := models.LifecycleCostPhaseDEVELOPMENT
	oam := models.LifecycleCostPhaseOPERATIONMAINTENANCE
	other := models.LifecycleCostPhaseOTHER
	cost := 1234
	lifecycleCostLines := models.EstimatedLifecycleCosts{
		models.EstimatedLifecycleCost{
			Solution: models.LifecycleCostSolutionASIS,
			Phase:    &dev,
			Year:     models.LifecycleCostYear1,
			Cost:     &cost,
		},
		models.EstimatedLifecycleCost{
			Solution: models.LifecycleCostSolutionPREFERRED,
			Phase:    &oam,
			Year:     models.LifecycleCostYear2,
			Cost:     &cost,
		},
		models.EstimatedLifecycleCost{
			Solution: models.LifecycleCostSolutionA,
			Phase:    &other,
			Year:     models.LifecycleCostYear3,
			Cost:     &cost,
		},
		models.EstimatedLifecycleCost{
			Solution: models.LifecycleCostSolutionB,
			Phase:    &dev,
			Year:     models.LifecycleCostYear4,
			Cost:     &cost,
		},
	}
	businessCase, businessCaseErr := s.store.CreateBusinessCase(ctx, &models.BusinessCase{
		SystemIntakeID:     intake.ID,
		Status:             models.BusinessCaseStatusOPEN,
		EUAUserID:          "TEST",
		LifecycleCostLines: lifecycleCostLines,
	})
	s.NoError(businessCaseErr)

	var resp struct {
		SystemIntake struct {
			ID           string
			BusinessCase struct {
				ID                 string
				LifecycleCostLines []struct {
					ID             string
					BusinessCaseID string
					Solution       string
					Phase          string
					Year           string
					Cost           int
				}
			}
		}
	}

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(fmt.Sprintf(
		`query {
			systemIntake(id: "%s") {
				id
				businessCase {
					id
					lifecycleCostLines {
						cost
						phase
						solution
						year
					}
				}
			}
		}`, intake.ID), &resp, testhelpers.AddAuthWithAllJobCodesToGraphQLClientTest(testhelpers.RandomEUAID()))

	s.Equal(intake.ID.String(), resp.SystemIntake.ID)

	respBusinessCase := resp.SystemIntake.BusinessCase
	s.Equal(businessCase.ID.String(), respBusinessCase.ID)

	respLifeCycleCostLines := respBusinessCase.LifecycleCostLines
	s.Len(respLifeCycleCostLines, 4)

	costLine1 := respLifeCycleCostLines[0]
	s.Equal(costLine1.Cost, 1234)
	s.Equal(costLine1.Phase, "Development")
	s.Equal(costLine1.Solution, "As Is")
	s.Equal(costLine1.Year, "1")

	costLine2 := respLifeCycleCostLines[1]
	s.Equal(costLine2.Cost, 1234)
	s.Equal(costLine2.Phase, "Operations and Maintenance")
	s.Equal(costLine2.Solution, "Preferred")
	s.Equal(costLine2.Year, "2")

	costLine3 := respLifeCycleCostLines[2]
	s.Equal(costLine3.Cost, 1234)
	s.Equal(costLine3.Phase, "Other")
	s.Equal(costLine3.Solution, "A")
	s.Equal(costLine3.Year, "3")

	costLine4 := respLifeCycleCostLines[3]
	s.Equal(costLine4.Cost, 1234)
	s.Equal(costLine4.Phase, "Development")
	s.Equal(costLine4.Solution, "B")
	s.Equal(costLine4.Year, "4")
}
