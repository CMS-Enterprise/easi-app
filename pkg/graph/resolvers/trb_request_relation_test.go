package resolvers

import (
	"context"

	"github.com/google/uuid"
	"github.com/guregu/null/zero"
	"github.com/jmoiron/sqlx"

	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/sqlutils"
)

type trbRequestRelationTestCase struct {
	InitialContractNumbers []string
	NewContractNumbers     []string
	InitialSystemIDs       []string
	NewSystemIDs           []string
}

func (suite *ResolverSuite) TestSetTRBRequestRelationNewSystem() {
	store := suite.testConfigs.Store
	ctx := suite.testConfigs.Context

	var contractNumberCases = map[string]trbRequestRelationTestCase{
		"adds contract numbers when no initial contract numbers exist": {
			InitialContractNumbers: []string{},
			NewContractNumbers:     []string{"1", "2"},
		},
		"removes existing contract numbers when none are given": {
			InitialContractNumbers: []string{"1", "2"},
			NewContractNumbers:     []string{},
		},
		"changes existing contract numbers to different ones": {
			InitialContractNumbers: []string{"1", "2"},
			NewContractNumbers:     []string{"3", "4"},
		},
		"changes existing contract numbers to add new ones": {
			InitialContractNumbers: []string{"1", "2"},
			NewContractNumbers:     []string{"1", "2", "3"},
		},
		"changes existing contract numbers to remove old ones": {
			InitialContractNumbers: []string{"1", "2"},
			NewContractNumbers:     []string{"1"},
		},
		"should remove existing system IDs": {
			InitialContractNumbers: []string{"1", "2"},
			NewContractNumbers:     []string{"1"},
			InitialSystemIDs:       []string{"{11AB1A00-1234-5678-ABC1-1A001B00CC2C}", "{11AB1A00-1234-5678-ABC1-1A001B00CC1B}"},
			NewSystemIDs:           []string{},
		},
		"should not add system IDs": {
			InitialContractNumbers: []string{"1", "2"},
			NewContractNumbers:     []string{"1"},
			InitialSystemIDs:       []string{},
			NewSystemIDs:           []string{},
		},
	}

	for caseName, caseValues := range contractNumberCases {
		suite.Run(caseName, func() {
			trbRequest, err := CreateTRBRequest(ctx, models.TRBTNeedHelp, store)
			suite.NoError(err)
			changes := map[string]interface{}{"contractName": zero.StringFrom("Test Name")}
			trbRequest, err = UpdateTRBRequest(ctx, trbRequest.ID, changes, store)
			suite.NoError(err)
			suite.NotEqual(trbRequest.ID, uuid.Nil)
			suite.NotNil(trbRequest)
			suite.Equal(trbRequest.ContractName, zero.StringFrom("Test Name"))

			// Set existing contract numbers
			err = sqlutils.WithTransaction(ctx, store, func(tx *sqlx.Tx) error {
				return store.SetTRBRequestContractNumbers(ctx, tx, trbRequest.ID, caseValues.InitialContractNumbers)
			})
			suite.NoError(err)

			updatedTRBRequestContractNumbers, err := TRBRequestContractNumbers(ctx, trbRequest.ID)
			suite.NoError(err)
			suite.Equal(len(caseValues.InitialContractNumbers), len(updatedTRBRequestContractNumbers))

			// Set existing system IDs
			err = sqlutils.WithTransaction(ctx, store, func(tx *sqlx.Tx) error {
				return store.SetTRBRequestSystems(ctx, tx, trbRequest.ID, caseValues.InitialSystemIDs)
			})
			suite.NoError(err)

			updatedTRBRequestSystemIDs, err := TRBRequestSystems(ctx, trbRequest.ID)
			suite.NoError(err)
			suite.Equal(len(caseValues.InitialSystemIDs), len(updatedTRBRequestSystemIDs))

			// Set the "new system" relationship
			input := model.SetTRBRequestRelationNewSystemInput{
				TrbRequestID:    trbRequest.ID,
				ContractNumbers: caseValues.NewContractNumbers,
			}

			// Run Resolver
			updatedTRBRequest, err := SetTRBRequestRelationNewSystem(ctx, store, input)
			suite.NoError(err)

			// Ensure the contract name was deleted properly
			suite.True(updatedTRBRequest.ContractName.IsZero())

			// refetch contract numbers and system IDs
			updatedTRBRequestContractNumbers, err = TRBRequestContractNumbers(ctx, updatedTRBRequest.ID)
			suite.NoError(err)

			updatedTRBRequestSystemIDs, err = TRBRequestSystems(ctx, trbRequest.ID)
			suite.NoError(err)

			// Ensure the system IDs were modified properly
			// New System relation should always remove existing system IDs
			suite.Equal(len(caseValues.NewSystemIDs), len(updatedTRBRequestSystemIDs))
			for _, v := range updatedTRBRequestSystemIDs {
				suite.Contains(caseValues.NewSystemIDs, v.ID)
			}

			// Ensure the contract numbers were modified properly
			suite.Equal(len(caseValues.NewContractNumbers), len(updatedTRBRequestContractNumbers))
			for _, v := range updatedTRBRequestContractNumbers {
				suite.Contains(caseValues.NewContractNumbers, v.ContractNumber)
			}

			// Check relation type
			suite.NotNil(updatedTRBRequest.SystemRelationType)
			suite.Equal(models.RelationTypeNewSystem, *updatedTRBRequest.SystemRelationType)
		})
	}
}

func (suite *ResolverSuite) TestSetTRBRequestRelationExistingSystem() {
	store := suite.testConfigs.Store
	ctx := suite.testConfigs.Context

	var cases = map[string]trbRequestRelationTestCase{
		"adds contract numbers and system IDs when no initial ones exist": {
			InitialContractNumbers: []string{},
			InitialSystemIDs:       []string{},
			NewContractNumbers:     []string{"1", "2"},
			NewSystemIDs:           []string{"{11AB1A00-1234-5678-ABC1-1A001B00CC2C}", "{11AB1A00-1234-5678-ABC1-1A001B00CC1B}"},
		},
		"removes existing contract numbers and system IDs when none are given": {
			InitialContractNumbers: []string{"1", "2"},
			InitialSystemIDs:       []string{"{11AB1A00-1234-5678-ABC1-1A001B00CC2C}", "{11AB1A00-1234-5678-ABC1-1A001B00CC1B}"},
			NewContractNumbers:     []string{},
			NewSystemIDs:           []string{},
		},
		"changes existing contract numbers and system IDs to different ones": {
			InitialContractNumbers: []string{"1", "2"},
			InitialSystemIDs:       []string{"{11AB1A00-1234-5678-ABC1-1A001B00CC2C}", "{11AB1A00-1234-5678-ABC1-1A001B00CC1B}"},
			NewContractNumbers:     []string{"3", "4"},
			NewSystemIDs:           []string{"{11AB1A00-1234-5678-ABC1-1A001B00CC3D}", "{11AB1A00-1234-5678-ABC1-1A001B00CC4E}"},
		},
		"changes existing contract numbers and system IDs to add new ones": {
			InitialContractNumbers: []string{"1", "2"},
			InitialSystemIDs:       []string{"{11AB1A00-1234-5678-ABC1-1A001B00CC2C}", "{11AB1A00-1234-5678-ABC1-1A001B00CC1B}"},
			NewContractNumbers:     []string{"1", "2", "3"},
			NewSystemIDs:           []string{"{11AB1A00-1234-5678-ABC1-1A001B00CC3D}", "{11AB1A00-1234-5678-ABC1-1A001B00CC4E}", "{11AB1A00-1234-5678-ABC1-1A001B00CC0A}"},
		},
		"changes existing contract numbers and system IDs to remove old ones": {
			InitialContractNumbers: []string{"1", "2"},
			InitialSystemIDs:       []string{"{11AB1A00-1234-5678-ABC1-1A001B00CC2C}", "{11AB1A00-1234-5678-ABC1-1A001B00CC1B}"},
			NewContractNumbers:     []string{"1"},
			NewSystemIDs:           []string{"{11AB1A00-1234-5678-ABC1-1A001B00CC2C}"},
		},
	}

	for caseName, caseValues := range cases {
		suite.Run(caseName, func() {
			trbRequest, err := CreateTRBRequest(ctx, models.TRBTNeedHelp, store)
			suite.NoError(err)
			changes := map[string]interface{}{"contractName": zero.StringFrom("Test Name")}
			trbRequest, err = UpdateTRBRequest(ctx, trbRequest.ID, changes, store)
			suite.NoError(err)
			suite.NotEqual(trbRequest.ID, uuid.Nil)
			suite.NotNil(trbRequest)
			suite.Equal(trbRequest.ContractName, zero.StringFrom("Test Name"))

			// Set existing contract numbers
			err = sqlutils.WithTransaction(ctx, store, func(tx *sqlx.Tx) error {
				return store.SetTRBRequestContractNumbers(ctx, tx, trbRequest.ID, caseValues.InitialContractNumbers)
			})
			suite.NoError(err)

			updatedTRBRequestContractNumbers, err := TRBRequestContractNumbers(ctx, trbRequest.ID)
			suite.NoError(err)
			suite.Equal(len(caseValues.InitialContractNumbers), len(updatedTRBRequestContractNumbers))

			// Set existing system IDs
			err = sqlutils.WithTransaction(ctx, store, func(tx *sqlx.Tx) error {
				return store.SetTRBRequestSystems(ctx, tx, trbRequest.ID, caseValues.InitialSystemIDs)
			})
			suite.NoError(err)

			updatedTRBRequestSystemIDs, err := TRBRequestSystems(ctx, trbRequest.ID)
			suite.NoError(err)
			suite.Equal(len(caseValues.InitialSystemIDs), len(updatedTRBRequestSystemIDs))

			// Set the "existing system" relationship
			input := model.SetTRBRequestRelationExistingSystemInput{
				TrbRequestID:    trbRequest.ID,
				CedarSystemIDs:  caseValues.NewSystemIDs,
				ContractNumbers: caseValues.NewContractNumbers,
			}
			updatedTRBRequest, err := SetTRBRequestRelationExistingSystem(
				ctx,
				store,
				func(ctx context.Context, systemID string) (*models.CedarSystem, error) {
					return &models.CedarSystem{}, nil
				},
				input,
			)

			suite.NoError(err)

			// Ensure the contract name was deleted properly
			suite.True(updatedTRBRequest.ContractName.IsZero())

			// refetch contract numbers and system IDs
			updatedTRBRequestContractNumbers, err = TRBRequestContractNumbers(ctx, updatedTRBRequest.ID)
			suite.NoError(err)

			updatedTRBRequestSystemIDs, err = TRBRequestSystems(ctx, trbRequest.ID)
			suite.NoError(err)

			// Ensure the system IDs were modified properly
			suite.Equal(len(caseValues.NewSystemIDs), len(updatedTRBRequestSystemIDs))
			for _, v := range updatedTRBRequestSystemIDs {
				suite.Contains(caseValues.NewSystemIDs, v.ID.String)
			}

			// Ensure the contract numbers were modified properly
			suite.Equal(len(caseValues.NewContractNumbers), len(updatedTRBRequestContractNumbers))
			for _, v := range updatedTRBRequestContractNumbers {
				suite.Contains(caseValues.NewContractNumbers, v.ContractNumber)
			}

			// Check relation type
			suite.NotNil(updatedTRBRequest.SystemRelationType)
			suite.Equal(models.RelationTypeExistingSystem, *updatedTRBRequest.SystemRelationType)
		})
	}
}

func (suite *ResolverSuite) TestSetTRBRequestRelationExistingService() {
	store := suite.testConfigs.Store
	ctx := suite.testConfigs.Context

	var cases = map[string]trbRequestRelationTestCase{
		"adds contract numbers when no initial ones exist": {
			InitialContractNumbers: []string{},
			NewContractNumbers:     []string{"1", "2"},
		},
		"removes existing contract numbers when none are given": {
			InitialContractNumbers: []string{"1", "2"},
			NewContractNumbers:     []string{},
		},
		"changes existing contract numbers to different ones": {
			InitialContractNumbers: []string{"1", "2"},
			NewContractNumbers:     []string{"3", "4"},
		},
		"changes existing contract numbers to add new ones": {
			InitialContractNumbers: []string{"1", "2"},
			NewContractNumbers:     []string{"1", "2", "3"},
		},
		"changes existing contract numbers to remove old ones": {
			InitialContractNumbers: []string{"1", "2"},
			NewContractNumbers:     []string{"1"},
		},
		"should remove existing system IDs": {
			InitialContractNumbers: []string{"1", "2"},
			NewContractNumbers:     []string{"1"},
			InitialSystemIDs:       []string{"{11AB1A00-1234-5678-ABC1-1A001B00CC2C}", "{11AB1A00-1234-5678-ABC1-1A001B00CC1B}"},
			NewSystemIDs:           []string{},
		},
		"should not add system IDs": {
			InitialContractNumbers: []string{"1", "2"},
			NewContractNumbers:     []string{"1"},
			InitialSystemIDs:       []string{},
			NewSystemIDs:           []string{},
		},
	}

	for caseName, caseValues := range cases {
		suite.Run(caseName, func() {
			trbRequest, err := CreateTRBRequest(ctx, models.TRBTNeedHelp, store)
			suite.NoError(err)
			suite.NotEqual(trbRequest.ID, uuid.Nil)
			suite.NotNil(trbRequest)

			// Set existing contract numbers
			err = sqlutils.WithTransaction(ctx, store, func(tx *sqlx.Tx) error {
				return store.SetTRBRequestContractNumbers(ctx, tx, trbRequest.ID, caseValues.InitialContractNumbers)
			})
			suite.NoError(err)

			updatedTRBRequestContractNumbers, err := TRBRequestContractNumbers(ctx, trbRequest.ID)
			suite.NoError(err)
			suite.Equal(len(caseValues.InitialContractNumbers), len(updatedTRBRequestContractNumbers))

			// Set existing system IDs
			err = sqlutils.WithTransaction(ctx, store, func(tx *sqlx.Tx) error {
				return store.SetTRBRequestSystems(ctx, tx, trbRequest.ID, caseValues.InitialSystemIDs)
			})
			suite.NoError(err)

			updatedTRBRequestSystemIDs, err := TRBRequestSystems(ctx, trbRequest.ID)
			suite.NoError(err)
			suite.Equal(len(caseValues.InitialSystemIDs), len(updatedTRBRequestSystemIDs))

			// Set the existing service relationship
			newContractName := "My New Contract Name"
			input := model.SetTRBRequestRelationExistingServiceInput{
				TrbRequestID:    trbRequest.ID,
				ContractName:    newContractName,
				ContractNumbers: caseValues.NewContractNumbers,
			}
			updatedTRBRequest, err := SetTRBRequestRelationExistingService(ctx, store, input)
			suite.NoError(err)

			// Ensure the contract name was updated properly
			suite.Equal(newContractName, updatedTRBRequest.ContractName.String)

			// refetch contract numbers and system IDs
			updatedTRBRequestContractNumbers, err = TRBRequestContractNumbers(ctx, updatedTRBRequest.ID)
			suite.NoError(err)

			updatedTRBRequestSystemIDs, err = TRBRequestSystems(ctx, trbRequest.ID)
			suite.NoError(err)

			// Ensure the system IDs were modified properly
			suite.Equal(len(caseValues.NewSystemIDs), len(updatedTRBRequestSystemIDs))
			for _, v := range updatedTRBRequestSystemIDs {
				suite.Contains(caseValues.NewSystemIDs, v.ID)
			}

			// Ensure the contract numbers were modified properly
			// Existing Service relation should always remove existing system IDs
			suite.Equal(len(caseValues.NewContractNumbers), len(updatedTRBRequestContractNumbers))
			for _, v := range updatedTRBRequestContractNumbers {
				suite.Contains(caseValues.NewContractNumbers, v.ContractNumber)
			}

			// Check relation type
			suite.NotNil(updatedTRBRequest.SystemRelationType)
			suite.Equal(models.RelationTypeExistingService, *updatedTRBRequest.SystemRelationType)
		})
	}
}

func (suite *ResolverSuite) TestUnlinkTRBRequestRelation() {
	ctx := suite.testConfigs.Context
	store := suite.testConfigs.Store

	suite.Run("unlink new trb request", func() {
		// Create an inital TRBRequest
		trbRequest, err := CreateTRBRequest(ctx, models.TRBTNeedHelp, store)
		suite.NoError(err)
		suite.NotEqual(trbRequest.ID, uuid.Nil)
		suite.NotNil(trbRequest)

		// Set the new system relationship
		input := model.SetTRBRequestRelationNewSystemInput{
			TrbRequestID:    trbRequest.ID,
			ContractNumbers: []string{"12345", "67890"},
		}
		_, err = SetTRBRequestRelationNewSystem(ctx, store, input)
		suite.NoError(err) // we don't need to test the SetTRBRequestRelationNewSystem function here

		// Now unlink the relationship
		unlinkedTRBRequest, err := UnlinkTRBRequestRelation(ctx, store, trbRequest.ID)
		suite.NoError(err)

		// Assert that all values are cleared appropriately
		suite.Equal("", unlinkedTRBRequest.ContractName.ValueOrZero())
		suite.Nil(unlinkedTRBRequest.SystemRelationType)

		// Check contract numbers are cleared
		nums, err := TRBRequestContractNumbers(ctx, unlinkedTRBRequest.ID)
		suite.NoError(err)
		suite.Empty(nums)

		// Check system IDs are cleared
		systemIDs, err := TRBRequestSystems(ctx, unlinkedTRBRequest.ID)
		suite.NoError(err)
		suite.Empty(systemIDs)
	})

	suite.Run("unlink existing trb request", func() {
		// Create an inital TRBRequest
		trbRequest, err := CreateTRBRequest(ctx, models.TRBTNeedHelp, store)
		suite.NoError(err)
		suite.NotEqual(trbRequest.ID, uuid.Nil)
		suite.NotNil(trbRequest)

		// Set the existing system relationship
		input := model.SetTRBRequestRelationExistingSystemInput{
			TrbRequestID:    trbRequest.ID,
			CedarSystemIDs:  []string{"abcde", "fghijk"},
			ContractNumbers: []string{"12345", "67890"},
		}
		_, err = SetTRBRequestRelationExistingSystem(
			ctx,
			store,
			func(ctx context.Context, systemID string) (*models.CedarSystem, error) {
				return &models.CedarSystem{}, nil
			},
			input,
		)
		suite.NoError(err) // we don't need to test the SetTRBRequestRelationExistingSystem function here

		// Now unlink the relationship
		unlinkedTRBRequest, err := UnlinkTRBRequestRelation(ctx, store, trbRequest.ID)
		suite.NoError(err)

		// Assert that all values are cleared appropriately
		suite.Equal("", unlinkedTRBRequest.ContractName.ValueOrZero())
		suite.Nil(unlinkedTRBRequest.SystemRelationType)

		// Check contract numbers are cleared
		nums, err := TRBRequestContractNumbers(ctx, unlinkedTRBRequest.ID)
		suite.NoError(err)
		suite.Empty(nums)

		// Check system IDs are cleared
		systemIDs, err := TRBRequestSystems(ctx, unlinkedTRBRequest.ID)
		suite.NoError(err)
		suite.Empty(systemIDs)
	})

	suite.Run("unlink existing service TRBRequest", func() {
		// Create an inital TRBRequest
		trbRequest, err := CreateTRBRequest(ctx, models.TRBTNeedHelp, store)
		suite.NoError(err)
		suite.NotEqual(trbRequest.ID, uuid.Nil)
		suite.NotNil(trbRequest)

		// Set the existing service relationship
		contractName := "My Test Contract Name"
		input := model.SetTRBRequestRelationExistingServiceInput{
			TrbRequestID:    trbRequest.ID,
			ContractName:    contractName,
			ContractNumbers: []string{"12345", "67890"},
		}
		_, err = SetTRBRequestRelationExistingService(ctx, store, input)
		suite.NoError(err) // we don't need to test the SetTRBRequestRelationExistingService function here

		// Now unlink the relationship
		unlinkedTRBRequest, err := UnlinkTRBRequestRelation(ctx, store, trbRequest.ID)
		suite.NoError(err)

		// Assert that all values are cleared appropriately
		suite.Equal("", unlinkedTRBRequest.ContractName.ValueOrZero())
		suite.Nil(unlinkedTRBRequest.SystemRelationType)

		// Check contract numbers are cleared
		nums, err := TRBRequestContractNumbers(ctx, unlinkedTRBRequest.ID)
		suite.NoError(err)
		suite.Empty(nums)

		// Check system IDs are cleared
		systemIDs, err := TRBRequestSystems(ctx, unlinkedTRBRequest.ID)
		suite.NoError(err)
		suite.Empty(systemIDs)
	})
}
