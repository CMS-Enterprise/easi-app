package resolvers

import (
	"context"
	"time"

	"github.com/guregu/null/zero"
	"github.com/jmoiron/sqlx"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/sqlutils"
)

type systemIntakeRelationTestCase struct {
	InitialContractNumbers []string
	NewContractNumbers     []string
	InitialSystemIDs       []string
	NewSystemIDs           []string
}

func (suite *ResolverSuite) TestSetSystemIntakeRelationNewSystem() {
	ctx := suite.testConfigs.Context
	store := suite.testConfigs.Store

	submittedAt := time.Now()

	var contractNumberCases = map[string]systemIntakeRelationTestCase{
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
			openIntake, err := store.CreateSystemIntake(ctx, &models.SystemIntake{
				State:        models.SystemIntakeStateOpen,
				RequestType:  models.SystemIntakeRequestTypeNEW,
				SubmittedAt:  &submittedAt,
				ContractName: zero.StringFrom("My Test Contract Name"),
			})
			suite.NoError(err)
			suite.NotNil(openIntake)

			// Set existing contract numbers
			err = sqlutils.WithTransaction(ctx, store, func(tx *sqlx.Tx) error {
				return store.SetSystemIntakeContractNumbers(ctx, tx, openIntake.ID, caseValues.InitialContractNumbers)
			})
			suite.NoError(err)

			updatedIntakeContractNumbers, err := SystemIntakeContractNumbers(ctx, openIntake.ID)
			suite.NoError(err)
			suite.Equal(len(caseValues.InitialContractNumbers), len(updatedIntakeContractNumbers))

			// Set existing system IDs
			err = sqlutils.WithTransaction(ctx, store, func(tx *sqlx.Tx) error {
				return store.SetSystemIntakeSystems(ctx, tx, openIntake.ID, caseValues.InitialSystemIDs)

			})
			suite.NoError(err)

			updatedIntakeSystemIDs, err := SystemIntakeSystems(ctx, openIntake.ID)
			suite.NoError(err)
			suite.Equal(len(caseValues.InitialSystemIDs), len(updatedIntakeSystemIDs))

			// Set the "new system" relationship
			input := &models.SetSystemIntakeRelationNewSystemInput{
				SystemIntakeID:  openIntake.ID,
				ContractNumbers: caseValues.NewContractNumbers,
			}

			// Run Resolver
			updatedIntake, err := SetSystemIntakeRelationNewSystem(ctx, store, input)
			suite.NoError(err)

			// Ensure the contract name was deleted properly
			suite.True(updatedIntake.ContractName.IsZero())

			// refetch contract numbers and system IDs
			updatedIntakeContractNumbers, err = SystemIntakeContractNumbers(ctx, updatedIntake.ID)
			suite.NoError(err)

			updatedIntakeSystemIDs, err = SystemIntakeSystems(ctx, openIntake.ID)
			suite.NoError(err)

			// Ensure the system IDs were modified properly
			// New System relation should always remove existing system IDs
			suite.Equal(len(caseValues.NewSystemIDs), len(updatedIntakeSystemIDs))
			for _, v := range updatedIntakeSystemIDs {
				suite.Contains(caseValues.NewSystemIDs, v.ID)
			}

			// Ensure the contract numbers were modified properly
			// skip the following test, see Note [EASI-4160 Disable Contract Number Linking]
			// suite.Equal(len(caseValues.NewContractNumbers), len(updatedIntakeContractNumbers))
			// for _, v := range updatedIntakeContractNumbers {
			// 	suite.Contains(caseValues.NewContractNumbers, v.ContractNumber)
			// }
			// temp, remove after the above is uncommented
			_ = updatedIntakeContractNumbers

			// Check relation type
			suite.NotNil(updatedIntake.SystemRelationType)
			suite.Equal(models.RelationTypeNewSystem, *updatedIntake.SystemRelationType)
		})
	}
}

func (suite *ResolverSuite) TestSetSystemIntakeRelationExistingSystem() {
	ctx := suite.testConfigs.Context
	store := suite.testConfigs.Store

	submittedAt := time.Now()

	var cases = map[string]systemIntakeRelationTestCase{
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
			openIntake, err := store.CreateSystemIntake(ctx, &models.SystemIntake{
				State:        models.SystemIntakeStateOpen,
				RequestType:  models.SystemIntakeRequestTypeNEW,
				SubmittedAt:  &submittedAt,
				ContractName: zero.StringFrom("My Test Contract Name"),
			})
			suite.NoError(err)
			suite.NotNil(openIntake)

			// Set existing contract numbers
			err = sqlutils.WithTransaction(ctx, store, func(tx *sqlx.Tx) error {
				return store.SetSystemIntakeContractNumbers(ctx, tx, openIntake.ID, caseValues.InitialContractNumbers)
			})
			suite.NoError(err)

			updatedIntakeContractNumbers, err := SystemIntakeContractNumbers(ctx, openIntake.ID)
			suite.NoError(err)
			suite.Equal(len(caseValues.InitialContractNumbers), len(updatedIntakeContractNumbers))

			// Set existing system IDs
			err = sqlutils.WithTransaction(ctx, store, func(tx *sqlx.Tx) error {
				return store.SetSystemIntakeSystems(ctx, tx, openIntake.ID, caseValues.InitialSystemIDs)
			})
			suite.NoError(err)

			updatedIntakeSystemIDs, err := SystemIntakeSystems(ctx, openIntake.ID)
			suite.NoError(err)
			suite.Equal(len(caseValues.InitialSystemIDs), len(updatedIntakeSystemIDs))

			// Set the "existing system" relationship
			input := &models.SetSystemIntakeRelationExistingSystemInput{
				SystemIntakeID:  openIntake.ID,
				CedarSystemIDs:  caseValues.NewSystemIDs,
				ContractNumbers: caseValues.NewContractNumbers,
			}
			updatedIntake, err := SetSystemIntakeRelationExistingSystem(
				ctx,
				store,
				func(ctx context.Context, systemID string) (*models.CedarSystem, error) {
					return &models.CedarSystem{}, nil
				},
				input,
			)

			suite.NoError(err)

			// Ensure the contract name was deleted properly
			suite.True(updatedIntake.ContractName.IsZero())

			// refetch contract numbers and system IDs
			updatedIntakeContractNumbers, err = SystemIntakeContractNumbers(ctx, updatedIntake.ID)
			suite.NoError(err)

			updatedIntakeSystemIDs, err = SystemIntakeSystems(ctx, openIntake.ID)
			suite.NoError(err)

			// Ensure the system IDs were modified properly
			suite.Equal(len(caseValues.NewSystemIDs), len(updatedIntakeSystemIDs))
			for _, v := range updatedIntakeSystemIDs {
				suite.Contains(caseValues.NewSystemIDs, v.ID.String)
			}

			// Ensure the contract numbers were modified properly
			// skip the following test, see Note [EASI-4160 Disable Contract Number Linking]
			// suite.Equal(len(caseValues.NewContractNumbers), len(updatedIntakeContractNumbers))
			// for _, v := range updatedIntakeContractNumbers {
			// 	suite.Contains(caseValues.NewContractNumbers, v.ContractNumber)
			// }
			// temp, remove when above is uncommented
			_ = updatedIntakeContractNumbers

			// Check relation type
			suite.NotNil(updatedIntake.SystemRelationType)
			suite.Equal(models.RelationTypeExistingSystem, *updatedIntake.SystemRelationType)
		})
	}
}

func (suite *ResolverSuite) TestSetSystemIntakeRelationExistingService() {
	ctx := suite.testConfigs.Context
	store := suite.testConfigs.Store

	submittedAt := time.Now()

	var cases = map[string]systemIntakeRelationTestCase{
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
			openIntake, err := store.CreateSystemIntake(ctx, &models.SystemIntake{
				State:        models.SystemIntakeStateOpen,
				RequestType:  models.SystemIntakeRequestTypeNEW,
				SubmittedAt:  &submittedAt,
				ContractName: zero.StringFrom("My Test Contract Name"),
			})
			suite.NoError(err)
			suite.NotNil(openIntake)

			// Set existing contract numbers
			err = sqlutils.WithTransaction(ctx, store, func(tx *sqlx.Tx) error {
				return store.SetSystemIntakeContractNumbers(ctx, tx, openIntake.ID, caseValues.InitialContractNumbers)

			})
			suite.NoError(err)

			updatedIntakeContractNumbers, err := SystemIntakeContractNumbers(ctx, openIntake.ID)
			suite.NoError(err)
			suite.Equal(len(caseValues.InitialContractNumbers), len(updatedIntakeContractNumbers))

			// Set existing system IDs
			err = sqlutils.WithTransaction(ctx, store, func(tx *sqlx.Tx) error {
				return store.SetSystemIntakeSystems(ctx, tx, openIntake.ID, caseValues.InitialSystemIDs)

			})
			suite.NoError(err)

			updatedIntakeSystemIDs, err := SystemIntakeSystems(ctx, openIntake.ID)
			suite.NoError(err)
			suite.Equal(len(caseValues.InitialSystemIDs), len(updatedIntakeSystemIDs))

			// Set the existing service relationship
			newContractName := "My New Contract Name"
			input := &models.SetSystemIntakeRelationExistingServiceInput{
				SystemIntakeID:  openIntake.ID,
				ContractName:    newContractName,
				ContractNumbers: caseValues.NewContractNumbers,
			}
			updatedIntake, err := SetSystemIntakeRelationExistingService(ctx, store, input)
			suite.NoError(err)

			// Ensure the contract name was updated properly
			suite.Equal(newContractName, updatedIntake.ContractName.String)

			// refetch contract numbers and system IDs
			updatedIntakeContractNumbers, err = SystemIntakeContractNumbers(ctx, updatedIntake.ID)
			suite.NoError(err)

			updatedIntakeSystemIDs, err = SystemIntakeSystems(ctx, openIntake.ID)
			suite.NoError(err)

			//openID := openIntake.ID.String()
			//updatedID := updatedIntake.ID.String()
			//
			//if openID != updatedID {
			//	panic("ids don't match")
			//}
			//
			//l1 := len(caseValues.NewSystemIDs)
			//l2 := len(updatedIntakeSystemIDs)
			//
			//if l1 != l2 {
			//	panic("len wrong for: " + caseName)
			//}
			// Ensure the system IDs were modified properly
			suite.Equal(len(caseValues.NewSystemIDs), len(updatedIntakeSystemIDs))
			for _, v := range updatedIntakeSystemIDs {
				suite.Contains(caseValues.NewSystemIDs, v.ID)
			}

			// Ensure the contract numbers were modified properly
			// Existing Service relation should always remove existing system IDs
			// skip the following test, see Note [EASI-4160 Disable Contract Number Linking]
			// suite.Equal(len(caseValues.NewContractNumbers), len(updatedIntakeContractNumbers))
			// for _, v := range updatedIntakeContractNumbers {
			// 	suite.Contains(caseValues.NewContractNumbers, v.ContractNumber)
			// }
			// temp, remove after the above is uncommented
			_ = updatedIntakeContractNumbers

			// Check relation type
			suite.NotNil(updatedIntake.SystemRelationType)
			suite.Equal(models.RelationTypeExistingService, *updatedIntake.SystemRelationType)
		})
	}
}

func (suite *ResolverSuite) TestUnlinkSystemIntakeRelation() {
	ctx := suite.testConfigs.Context
	store := suite.testConfigs.Store

	submittedAt := time.Now()

	suite.Run("unlink new system intake", func() {
		// Create an initial intake
		openIntake, err := store.CreateSystemIntake(ctx, &models.SystemIntake{
			State:        models.SystemIntakeStateOpen,
			RequestType:  models.SystemIntakeRequestTypeNEW,
			SubmittedAt:  &submittedAt,
			ContractName: zero.StringFrom("My Test Contract Name"),
		})
		suite.NoError(err)
		suite.NotNil(openIntake)

		// Set the new system relationship
		input := &models.SetSystemIntakeRelationNewSystemInput{
			SystemIntakeID:  openIntake.ID,
			ContractNumbers: []string{"12345", "67890"},
		}
		_, err = SetSystemIntakeRelationNewSystem(ctx, store, input)
		suite.NoError(err) // we don't need to test the SetSystemIntakeRelationNewSystem function here

		// Now unlink the relationship
		unlinkedIntake, err := UnlinkSystemIntakeRelation(ctx, store, openIntake.ID)
		suite.NoError(err)

		// Assert that all values are cleared appropriately
		suite.Equal("", unlinkedIntake.ContractName.ValueOrZero())
		suite.Nil(unlinkedIntake.SystemRelationType)

		// Check contract numbers are cleared
		// skip the following test, see Note [EASI-4160 Disable Contract Number Linking]
		// nums, err := SystemIntakeContractNumbers(ctx, unlinkedIntake.ID)
		// suite.NoError(err)
		// suite.Empty(nums)

		// Check system IDs are cleared
		systemIDs, err := SystemIntakeSystems(ctx, unlinkedIntake.ID)
		suite.NoError(err)
		suite.Empty(systemIDs)
	})

	suite.Run("unlink existing system intake", func() {
		// Create an initial intake
		openIntake, err := store.CreateSystemIntake(ctx, &models.SystemIntake{
			State:        models.SystemIntakeStateOpen,
			RequestType:  models.SystemIntakeRequestTypeNEW,
			SubmittedAt:  &submittedAt,
			ContractName: zero.StringFrom("My Test Contract Name"),
		})
		suite.NoError(err)
		suite.NotNil(openIntake)

		// Set the existing system relationship
		input := &models.SetSystemIntakeRelationExistingSystemInput{
			SystemIntakeID:  openIntake.ID,
			CedarSystemIDs:  []string{"abcde", "fghijk"},
			ContractNumbers: []string{"12345", "67890"},
		}
		_, err = SetSystemIntakeRelationExistingSystem(
			ctx,
			store,
			func(ctx context.Context, systemID string) (*models.CedarSystem, error) {
				return &models.CedarSystem{}, nil
			},
			input,
		)
		suite.NoError(err) // we don't need to test the SetSystemIntakeRelationExistingSystem function here

		// Now unlink the relationship
		unlinkedIntake, err := UnlinkSystemIntakeRelation(ctx, store, openIntake.ID)
		suite.NoError(err)

		// Assert that all values are cleared appropriately
		suite.Equal("", unlinkedIntake.ContractName.ValueOrZero())
		suite.Nil(unlinkedIntake.SystemRelationType)

		// Check contract numbers are cleared
		// skip the following test, see Note [EASI-4160 Disable Contract Number Linking]
		// nums, err := SystemIntakeContractNumbers(ctx, unlinkedIntake.ID)
		// suite.NoError(err)
		// suite.Empty(nums)

		// Check system IDs are cleared
		systemIDs, err := SystemIntakeSystems(ctx, unlinkedIntake.ID)
		suite.NoError(err)
		suite.Empty(systemIDs)
	})

	suite.Run("unlink existing service intake", func() {
		// Create an initial intake
		openIntake, err := store.CreateSystemIntake(ctx, &models.SystemIntake{
			State:       models.SystemIntakeStateOpen,
			RequestType: models.SystemIntakeRequestTypeNEW,
			SubmittedAt: &submittedAt,
		})
		suite.NoError(err)
		suite.NotNil(openIntake)

		// Set the existing service relationship
		contractName := "My Test Contract Name"
		input := &models.SetSystemIntakeRelationExistingServiceInput{
			SystemIntakeID:  openIntake.ID,
			ContractName:    contractName,
			ContractNumbers: []string{"12345", "67890"},
		}
		_, err = SetSystemIntakeRelationExistingService(ctx, store, input)
		suite.NoError(err) // we don't need to test the SetSystemIntakeRelationExistingService function here

		// Now unlink the relationship
		unlinkedIntake, err := UnlinkSystemIntakeRelation(ctx, store, openIntake.ID)
		suite.NoError(err)

		// Assert that all values are cleared appropriately
		suite.Equal("", unlinkedIntake.ContractName.ValueOrZero())
		suite.Nil(unlinkedIntake.SystemRelationType)

		// Check contract numbers are cleared
		nums, err := SystemIntakeContractNumbers(ctx, unlinkedIntake.ID)
		suite.NoError(err)
		suite.Empty(nums)

		// Check system IDs are cleared
		systemIDs, err := SystemIntakeSystems(ctx, unlinkedIntake.ID)
		suite.NoError(err)
		suite.Empty(systemIDs)
	})
}
