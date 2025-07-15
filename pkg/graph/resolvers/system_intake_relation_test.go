package resolvers

import (
	"context"
	"time"

	"github.com/guregu/null/zero"
	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
)

type systemIntakeRelationTestCase struct {
	InitialContractNumbers []string
	NewContractNumbers     []string
	InitialSystemIDs       []string
	NewSystemIDs           []string
	InitialLinkedSystems   []*models.SystemRelationshipInput
	NewLinkedSystems       []*models.SystemRelationshipInput
}

func (s *ResolverSuite) TestSetSystemIntakeRelationNewSystem() {
	ctx := s.testConfigs.Context
	store := s.testConfigs.Store

	submittedAt := time.Now()

	idOne := "{11AB1A00-1234-5678-ABC1-1A001B00CC2C}"
	descriptionOne := "other description"
	idTwo := "{11AB1A00-1234-5678-ABC1-1A001B00CC1B}"

	var cases = map[string]systemIntakeRelationTestCase{
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
			InitialLinkedSystems: []*models.SystemRelationshipInput{
				{
					CedarSystemID:                      &idOne,
					SystemRelationshipType:             []models.SystemRelationshipType{"PRIMARY_SUPPORT", "OTHER"},
					OtherSystemRelationshipDescription: &descriptionOne,
				},
				{
					CedarSystemID:          &idTwo,
					SystemRelationshipType: []models.SystemRelationshipType{"PRIMARY_SUPPORT"},
				},
			},
			NewLinkedSystems: []*models.SystemRelationshipInput{},
		},
		"should not add system IDs": {
			InitialContractNumbers: []string{"1", "2"},
			NewContractNumbers:     []string{"1"},
			InitialSystemIDs:       []string{},
			NewSystemIDs:           []string{},
			InitialLinkedSystems:   []*models.SystemRelationshipInput{},
			NewLinkedSystems:       []*models.SystemRelationshipInput{},
		},
	}

	for caseName, caseValues := range cases {
		s.Run(caseName, func() {
			openIntake, err := store.CreateSystemIntake(ctx, &models.SystemIntake{
				State:        models.SystemIntakeStateOpen,
				RequestType:  models.SystemIntakeRequestTypeNEW,
				SubmittedAt:  &submittedAt,
				ContractName: zero.StringFrom("My Test Contract Name"),
			})
			s.NoError(err)
			s.NotNil(openIntake)

			// Set existing contract numbers
			err = sqlutils.WithTransaction(ctx, store, func(tx *sqlx.Tx) error {
				return store.SetSystemIntakeContractNumbers(ctx, tx, openIntake.ID, caseValues.InitialContractNumbers)
			})
			s.NoError(err)

			updatedIntakeContractNumbers, err := SystemIntakeContractNumbers(s.ctxWithNewDataloaders(), openIntake.ID)
			s.NoError(err)
			s.Equal(len(caseValues.InitialContractNumbers), len(updatedIntakeContractNumbers))

			// Set existing system IDs
			err = sqlutils.WithTransaction(ctx, store, func(tx *sqlx.Tx) error {
				//Ids removed were caseValues.InitialSystemIDs
				return store.SetSystemIntakeSystems(ctx, tx, openIntake.ID, caseValues.InitialLinkedSystems)

			})
			s.NoError(err)

			updatedIntakeSystemIDs, err := SystemIntakeSystems(s.ctxWithNewDataloaders(), openIntake.ID)
			s.NoError(err)
			s.Equal(len(caseValues.InitialSystemIDs), len(updatedIntakeSystemIDs))

			// Set the "new system" relationship
			input := &models.SetSystemIntakeRelationNewSystemInput{
				SystemIntakeID:  openIntake.ID,
				ContractNumbers: caseValues.NewContractNumbers,
			}

			// Run Resolver
			updatedIntake, err := SetSystemIntakeRelationNewSystem(ctx, store, input)
			s.NoError(err)

			// Ensure the contract name was deleted properly
			s.True(updatedIntake.ContractName.IsZero())

			// refetch contract numbers and system IDs
			updatedIntakeContractNumbers, err = SystemIntakeContractNumbers(s.ctxWithNewDataloaders(), updatedIntake.ID)
			s.NoError(err)

			updatedIntakeSystemIDs, err = SystemIntakeSystems(s.ctxWithNewDataloaders(), openIntake.ID)
			s.NoError(err)

			// Ensure the system IDs were modified properly
			s.Equal(len(caseValues.NewSystemIDs), len(updatedIntakeSystemIDs))
			for _, v := range updatedIntakeSystemIDs {
				s.Contains(caseValues.NewSystemIDs, v.ID)
			}

			// Ensure the contract numbers were modified properly
			// skip the following test, see Note [EASI-4160 Disable Contract Number Linking]
			// s.Equal(len(caseValues.NewContractNumbers), len(updatedIntakeContractNumbers))
			// for _, v := range updatedIntakeContractNumbers {
			// 	s.Contains(caseValues.NewContractNumbers, v.ContractNumber)
			// }
			// temp, remove after the above is uncommented
			_ = updatedIntakeContractNumbers

			// Check relation type
			s.NotNil(updatedIntake.SystemRelationType)
			s.Equal(models.RelationTypeNewSystem, *updatedIntake.SystemRelationType)
		})
	}
}

func (s *ResolverSuite) TestSetSystemIntakeRelationExistingSystem() {
	ctx := s.testConfigs.Context
	store := s.testConfigs.Store

	submittedAt := time.Now()

	idOne := "{11AB1A00-1234-5678-ABC1-1A001B00CC2C}"
	descriptionOne := "other description"
	idTwo := "{11AB1A00-1234-5678-ABC1-1A001B00CC1B}"
	idThree := "{11AB1A00-1234-5678-ABC1-1A001B00CC3D}"
	idFour := "{11AB1A00-1234-5678-ABC1-1A001B00CC4E}"
	idFive := "{11AB1A00-1234-5678-ABC1-1A001B00CC0A}"

	var cases = map[string]systemIntakeRelationTestCase{
		"adds contract numbers and system IDs when no initial ones exist": {
			InitialContractNumbers: []string{},
			NewContractNumbers:     []string{"1", "2"},
			InitialSystemIDs:       []string{},
			NewSystemIDs:           []string{"{11AB1A00-1234-5678-ABC1-1A001B00CC2C}", "{11AB1A00-1234-5678-ABC1-1A001B00CC1B}"},
			InitialLinkedSystems:   []*models.SystemRelationshipInput{},
			NewLinkedSystems: []*models.SystemRelationshipInput{
				{
					CedarSystemID:                      &idOne,
					SystemRelationshipType:             []models.SystemRelationshipType{"PRIMARY_SUPPORT", "OTHER"},
					OtherSystemRelationshipDescription: &descriptionOne,
				},
				{
					CedarSystemID:          &idTwo,
					SystemRelationshipType: []models.SystemRelationshipType{"PRIMARY_SUPPORT"},
				},
			},
		},
		"removes existing contract numbers and system IDs when none are given": {
			InitialContractNumbers: []string{"1", "2"},
			NewContractNumbers:     []string{},
			InitialSystemIDs:       []string{"{11AB1A00-1234-5678-ABC1-1A001B00CC2C}", "{11AB1A00-1234-5678-ABC1-1A001B00CC1B}"},
			NewSystemIDs:           []string{},

			InitialLinkedSystems: []*models.SystemRelationshipInput{
				{
					CedarSystemID:                      &idOne,
					SystemRelationshipType:             []models.SystemRelationshipType{"PRIMARY_SUPPORT", "OTHER"},
					OtherSystemRelationshipDescription: &descriptionOne,
				},
				{
					CedarSystemID:          &idTwo,
					SystemRelationshipType: []models.SystemRelationshipType{"PRIMARY_SUPPORT"},
				},
			},
			NewLinkedSystems: []*models.SystemRelationshipInput{},
		},
		"changes existing contract numbers and system IDs to different ones": {
			InitialContractNumbers: []string{"1", "2"},
			NewContractNumbers:     []string{"3", "4"},
			InitialSystemIDs:       []string{"{11AB1A00-1234-5678-ABC1-1A001B00CC2C}", "{11AB1A00-1234-5678-ABC1-1A001B00CC1B}"},
			NewSystemIDs:           []string{"{11AB1A00-1234-5678-ABC1-1A001B00CC3D}", "{11AB1A00-1234-5678-ABC1-1A001B00CC4E}"},
			InitialLinkedSystems: []*models.SystemRelationshipInput{
				{
					CedarSystemID:                      &idOne,
					SystemRelationshipType:             []models.SystemRelationshipType{"PRIMARY_SUPPORT", "OTHER"},
					OtherSystemRelationshipDescription: &descriptionOne,
				},
				{
					CedarSystemID:          &idTwo,
					SystemRelationshipType: []models.SystemRelationshipType{"PRIMARY_SUPPORT"},
				},
			},
			NewLinkedSystems: []*models.SystemRelationshipInput{
				{
					CedarSystemID:                      &idThree,
					SystemRelationshipType:             []models.SystemRelationshipType{"PRIMARY_SUPPORT", "OTHER"},
					OtherSystemRelationshipDescription: &descriptionOne,
				},
				{
					CedarSystemID:          &idFour,
					SystemRelationshipType: []models.SystemRelationshipType{"PRIMARY_SUPPORT"},
				},
			},
		},
		"changes existing contract numbers and system IDs to add new ones": {
			InitialContractNumbers: []string{"1", "2"},
			NewContractNumbers:     []string{"1", "2", "3"},
			InitialSystemIDs:       []string{"{11AB1A00-1234-5678-ABC1-1A001B00CC2C}", "{11AB1A00-1234-5678-ABC1-1A001B00CC1B}"},
			NewSystemIDs:           []string{"{11AB1A00-1234-5678-ABC1-1A001B00CC2C}", "{11AB1A00-1234-5678-ABC1-1A001B00CC1B}", "{11AB1A00-1234-5678-ABC1-1A001B00CC3D}", "{11AB1A00-1234-5678-ABC1-1A001B00CC4E}", "{11AB1A00-1234-5678-ABC1-1A001B00CC0A}"},
			InitialLinkedSystems: []*models.SystemRelationshipInput{
				{
					CedarSystemID:                      &idOne,
					SystemRelationshipType:             []models.SystemRelationshipType{"PRIMARY_SUPPORT", "OTHER"},
					OtherSystemRelationshipDescription: &descriptionOne,
				},
				{
					CedarSystemID:          &idTwo,
					SystemRelationshipType: []models.SystemRelationshipType{"PRIMARY_SUPPORT"},
				},
			},
			NewLinkedSystems: []*models.SystemRelationshipInput{
				{
					CedarSystemID:                      &idThree,
					SystemRelationshipType:             []models.SystemRelationshipType{"PRIMARY_SUPPORT", "OTHER"},
					OtherSystemRelationshipDescription: &descriptionOne,
				},
				{
					CedarSystemID:          &idFour,
					SystemRelationshipType: []models.SystemRelationshipType{"PRIMARY_SUPPORT"},
				},
				{
					CedarSystemID:          &idFive,
					SystemRelationshipType: []models.SystemRelationshipType{"PRIMARY_SUPPORT"},
				},
			},
		},
		"changes existing contract numbers and system IDs to remove old ones": {
			InitialContractNumbers: []string{"1", "2"},
			NewContractNumbers:     []string{"1"},
			InitialSystemIDs:       []string{"{11AB1A00-1234-5678-ABC1-1A001B00CC2C}", "{11AB1A00-1234-5678-ABC1-1A001B00CC1B}"},
			NewSystemIDs:           []string{"{11AB1A00-1234-5678-ABC1-1A001B00CC2C}", "{11AB1A00-1234-5678-ABC1-1A001B00CC1B}"},
			InitialLinkedSystems: []*models.SystemRelationshipInput{
				{
					CedarSystemID:                      &idOne,
					SystemRelationshipType:             []models.SystemRelationshipType{"PRIMARY_SUPPORT", "OTHER"},
					OtherSystemRelationshipDescription: &descriptionOne,
				},
				{
					CedarSystemID:          &idTwo,
					SystemRelationshipType: []models.SystemRelationshipType{"PRIMARY_SUPPORT"},
				},
			},
			NewLinkedSystems: []*models.SystemRelationshipInput{
				{
					CedarSystemID:                      &idOne,
					SystemRelationshipType:             []models.SystemRelationshipType{"PRIMARY_SUPPORT", "OTHER"},
					OtherSystemRelationshipDescription: &descriptionOne,
				},
			},
		},
	}

	for caseName, caseValues := range cases {
		s.Run(caseName, func() {
			openIntake, err := store.CreateSystemIntake(ctx, &models.SystemIntake{
				State:        models.SystemIntakeStateOpen,
				RequestType:  models.SystemIntakeRequestTypeNEW,
				SubmittedAt:  &submittedAt,
				ContractName: zero.StringFrom("My Test Contract Name"),
			})
			s.NoError(err)
			s.NotNil(openIntake)

			// Set existing contract numbers
			err = sqlutils.WithTransaction(ctx, store, func(tx *sqlx.Tx) error {
				return store.SetSystemIntakeContractNumbers(ctx, tx, openIntake.ID, caseValues.InitialContractNumbers)
			})
			s.NoError(err)

			updatedIntakeContractNumbers, err := SystemIntakeContractNumbers(s.ctxWithNewDataloaders(), openIntake.ID)
			s.NoError(err)
			s.Equal(len(caseValues.InitialContractNumbers), len(updatedIntakeContractNumbers))

			// Set existing system IDs
			err = sqlutils.WithTransaction(ctx, store, func(tx *sqlx.Tx) error {
				// Ids removed were caseValues.InitialSystemIDs
				return store.SetSystemIntakeSystems(ctx, tx, openIntake.ID, caseValues.InitialLinkedSystems)
			})
			s.NoError(err)

			updatedIntakeSystemIDs, err := SystemIntakeSystems(s.ctxWithNewDataloaders(), openIntake.ID)
			s.NoError(err)
			s.Equal(len(caseValues.InitialSystemIDs), len(updatedIntakeSystemIDs))

			// Set the "existing system" relationship
			input := &models.SetSystemIntakeRelationExistingSystemInput{
				SystemIntakeID:           openIntake.ID,
				CedarSystemRelationShips: caseValues.NewLinkedSystems,
				ContractNumbers:          caseValues.NewContractNumbers,
			}
			updatedIntake, err := SetSystemIntakeRelationExistingSystem(
				ctx,
				store,
				func(ctx context.Context, systemID string) (*models.CedarSystem, error) {
					return &models.CedarSystem{}, nil
				},
				input,
			)

			s.NoError(err)

			// Ensure the contract name was deleted properly
			s.True(updatedIntake.ContractName.IsZero())

			// refetch contract numbers and system IDs
			updatedIntakeContractNumbers, err = SystemIntakeContractNumbers(s.ctxWithNewDataloaders(), updatedIntake.ID)
			s.NoError(err)

			updatedIntakeSystemIDs, err = SystemIntakeSystems(s.ctxWithNewDataloaders(), openIntake.ID)
			s.NoError(err)

			// Ensure the system IDs were modified properly
			s.Equal(len(caseValues.NewSystemIDs), len(updatedIntakeSystemIDs))
			for _, v := range updatedIntakeSystemIDs {
				s.Contains(caseValues.NewSystemIDs, v.ID.String)
			}

			// Ensure the contract numbers were modified properly
			// skip the following test, see Note [EASI-4160 Disable Contract Number Linking]
			// s.Equal(len(caseValues.NewContractNumbers), len(updatedIntakeContractNumbers))
			// for _, v := range updatedIntakeContractNumbers {
			// 	s.Contains(caseValues.NewContractNumbers, v.ContractNumber)
			// }
			// temp, remove when above is uncommented
			_ = updatedIntakeContractNumbers

			// Check relation type
			s.NotNil(updatedIntake.SystemRelationType)
			s.Equal(models.RelationTypeExistingSystem, *updatedIntake.SystemRelationType)
		})
	}
}

func (s *ResolverSuite) TestSetSystemIntakeRelationExistingService() {
	ctx := s.testConfigs.Context
	store := s.testConfigs.Store

	submittedAt := time.Now()

	idOne := "{11AB1A00-1234-5678-ABC1-1A001B00CC2C}"
	descriptionOne := "other description"
	idTwo := "{11AB1A00-1234-5678-ABC1-1A001B00CC1B}"

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
		"should not add system IDs": {
			InitialContractNumbers: []string{"1", "2"},
			NewContractNumbers:     []string{"1"},
			InitialSystemIDs:       []string{},
			NewSystemIDs:           []string{},
			InitialLinkedSystems:   []*models.SystemRelationshipInput{},
			NewLinkedSystems:       []*models.SystemRelationshipInput{},
		},
		"should remove existing system IDs": {
			InitialContractNumbers: []string{"1", "2"},
			NewContractNumbers:     []string{"1"},
			InitialSystemIDs:       []string{"{11AB1A00-1234-5678-ABC1-1A001B00CC2C}", "{11AB1A00-1234-5678-ABC1-1A001B00CC1B}"},
			NewSystemIDs:           []string{},
			InitialLinkedSystems: []*models.SystemRelationshipInput{
				{
					CedarSystemID:                      &idOne,
					SystemRelationshipType:             []models.SystemRelationshipType{"PRIMARY_SUPPORT", "OTHER"},
					OtherSystemRelationshipDescription: &descriptionOne,
				},
				{
					CedarSystemID:          &idTwo,
					SystemRelationshipType: []models.SystemRelationshipType{"PRIMARY_SUPPORT"},
				},
			},
			NewLinkedSystems: []*models.SystemRelationshipInput{},
		},
	}

	for caseName, caseValues := range cases {
		s.Run(caseName, func() {
			openIntake, err := store.CreateSystemIntake(ctx, &models.SystemIntake{
				State:        models.SystemIntakeStateOpen,
				RequestType:  models.SystemIntakeRequestTypeNEW,
				SubmittedAt:  &submittedAt,
				ContractName: zero.StringFrom("My Test Contract Name"),
			})
			s.NoError(err)
			s.NotNil(openIntake)

			// Set existing contract numbers
			err = sqlutils.WithTransaction(ctx, store, func(tx *sqlx.Tx) error {
				return store.SetSystemIntakeContractNumbers(ctx, tx, openIntake.ID, caseValues.InitialContractNumbers)

			})
			s.NoError(err)

			updatedIntakeContractNumbers, err := SystemIntakeContractNumbers(s.ctxWithNewDataloaders(), openIntake.ID)
			s.NoError(err)
			s.Equal(len(caseValues.InitialContractNumbers), len(updatedIntakeContractNumbers))

			// Set existing system IDs
			err = sqlutils.WithTransaction(ctx, store, func(tx *sqlx.Tx) error {
				// caseValues.InitialSystemIDs
				return store.SetSystemIntakeSystems(ctx, tx, openIntake.ID, caseValues.InitialLinkedSystems)

			})
			s.NoError(err)

			updatedIntakeSystemIDs, err := SystemIntakeSystems(s.ctxWithNewDataloaders(), openIntake.ID)
			s.NoError(err)
			s.Equal(len(caseValues.InitialSystemIDs), len(updatedIntakeSystemIDs))

			// Set the existing service relationship
			newContractName := "My New Contract Name"
			input := &models.SetSystemIntakeRelationExistingServiceInput{
				SystemIntakeID:  openIntake.ID,
				ContractName:    newContractName,
				ContractNumbers: caseValues.NewContractNumbers,
			}
			updatedIntake, err := SetSystemIntakeRelationExistingService(ctx, store, input)
			s.NoError(err)

			// Ensure the contract name was updated properly
			s.Equal(newContractName, updatedIntake.ContractName.String)

			// refetch contract numbers and system IDs
			updatedIntakeContractNumbers, err = SystemIntakeContractNumbers(s.ctxWithNewDataloaders(), updatedIntake.ID)
			s.NoError(err)

			updatedIntakeSystemIDs, err = SystemIntakeSystems(s.ctxWithNewDataloaders(), openIntake.ID)
			s.NoError(err)

			// Ensure the system IDs were modified properly
			s.Equal(len(caseValues.NewSystemIDs), len(updatedIntakeSystemIDs))
			for _, v := range updatedIntakeSystemIDs {
				s.Contains(caseValues.NewSystemIDs, v.ID)
			}

			// Ensure the contract numbers were modified properly
			// Existing Service relation should always remove existing system IDs
			// skip the following test, see Note [EASI-4160 Disable Contract Number Linking]
			// s.Equal(len(caseValues.NewContractNumbers), len(updatedIntakeContractNumbers))
			// for _, v := range updatedIntakeContractNumbers {
			// 	s.Contains(caseValues.NewContractNumbers, v.ContractNumber)
			// }
			// temp, remove after the above is uncommented
			_ = updatedIntakeContractNumbers

			// Check relation type
			s.NotNil(updatedIntake.SystemRelationType)
			s.Equal(models.RelationTypeExistingService, *updatedIntake.SystemRelationType)
		})
	}
}

func (s *ResolverSuite) TestUnlinkSystemIntakeRelation() {
	ctx := s.testConfigs.Context
	store := s.testConfigs.Store

	submittedAt := time.Now()

	s.Run("unlink new system intake", func() {
		// Create an initial intake
		openIntake, err := store.CreateSystemIntake(ctx, &models.SystemIntake{
			State:        models.SystemIntakeStateOpen,
			RequestType:  models.SystemIntakeRequestTypeNEW,
			SubmittedAt:  &submittedAt,
			ContractName: zero.StringFrom("My Test Contract Name"),
		})
		s.NoError(err)
		s.NotNil(openIntake)

		// Set the new system relationship
		input := &models.SetSystemIntakeRelationNewSystemInput{
			SystemIntakeID:  openIntake.ID,
			ContractNumbers: []string{"12345", "67890"},
		}
		_, err = SetSystemIntakeRelationNewSystem(ctx, store, input)
		s.NoError(err) // we don't need to test the SetSystemIntakeRelationNewSystem function here

		// Now unlink the relationship
		unlinkedIntake, err := UnlinkSystemIntakeRelation(ctx, store, openIntake.ID)
		s.NoError(err)

		// Assert that all values are cleared appropriately
		s.Equal("", unlinkedIntake.ContractName.ValueOrZero())
		s.Nil(unlinkedIntake.SystemRelationType)

		// Check contract numbers are cleared
		// skip the following test, see Note [EASI-4160 Disable Contract Number Linking]
		// nums, err := SystemIntakeContractNumbers(s.ctxWithNewDataloaders(), unlinkedIntake.ID)
		// s.NoError(err)
		// s.Empty(nums)

		// Check system IDs are cleared
		systemIDs, err := SystemIntakeSystems(s.ctxWithNewDataloaders(), unlinkedIntake.ID)
		s.NoError(err)
		s.Empty(systemIDs)
	})

	s.Run("unlink existing system intake", func() {
		// Create an initial intake
		openIntake, err := store.CreateSystemIntake(ctx, &models.SystemIntake{
			State:        models.SystemIntakeStateOpen,
			RequestType:  models.SystemIntakeRequestTypeNEW,
			SubmittedAt:  &submittedAt,
			ContractName: zero.StringFrom("My Test Contract Name"),
		})
		s.NoError(err)
		s.NotNil(openIntake)

		// Set the existing system relationship
		input := &models.SetSystemIntakeRelationExistingSystemInput{
			SystemIntakeID:           openIntake.ID,
			CedarSystemRelationShips: []*models.SystemRelationshipInput{},
			ContractNumbers:          []string{"12345", "67890"},
		}
		_, err = SetSystemIntakeRelationExistingSystem(
			ctx,
			store,
			func(ctx context.Context, systemID string) (*models.CedarSystem, error) {
				return &models.CedarSystem{}, nil
			},
			input,
		)
		s.NoError(err) // we don't need to test the SetSystemIntakeRelationExistingSystem function here

		// Now unlink the relationship
		unlinkedIntake, err := UnlinkSystemIntakeRelation(ctx, store, openIntake.ID)
		s.NoError(err)

		// Assert that all values are cleared appropriately
		s.Equal("", unlinkedIntake.ContractName.ValueOrZero())
		s.Nil(unlinkedIntake.SystemRelationType)

		// Check contract numbers are cleared
		// skip the following test, see Note [EASI-4160 Disable Contract Number Linking]
		// nums, err := SystemIntakeContractNumbers(s.ctxWithNewDataloaders(), unlinkedIntake.ID)
		// s.NoError(err)
		// s.Empty(nums)

		// Check system IDs are cleared
		systemIDs, err := SystemIntakeSystems(s.ctxWithNewDataloaders(), unlinkedIntake.ID)
		s.NoError(err)
		s.Empty(systemIDs)
	})

	s.Run("unlink existing service intake", func() {
		// Create an initial intake
		openIntake, err := store.CreateSystemIntake(ctx, &models.SystemIntake{
			State:       models.SystemIntakeStateOpen,
			RequestType: models.SystemIntakeRequestTypeNEW,
			SubmittedAt: &submittedAt,
		})
		s.NoError(err)
		s.NotNil(openIntake)

		// Set the existing service relationship
		contractName := "My Test Contract Name"
		input := &models.SetSystemIntakeRelationExistingServiceInput{
			SystemIntakeID:  openIntake.ID,
			ContractName:    contractName,
			ContractNumbers: []string{"12345", "67890"},
		}
		_, err = SetSystemIntakeRelationExistingService(ctx, store, input)
		s.NoError(err) // we don't need to test the SetSystemIntakeRelationExistingService function here

		// Now unlink the relationship
		unlinkedIntake, err := UnlinkSystemIntakeRelation(ctx, store, openIntake.ID)
		s.NoError(err)

		// Assert that all values are cleared appropriately
		s.Equal("", unlinkedIntake.ContractName.ValueOrZero())
		s.Nil(unlinkedIntake.SystemRelationType)

		// Check contract numbers are cleared
		nums, err := SystemIntakeContractNumbers(s.ctxWithNewDataloaders(), unlinkedIntake.ID)
		s.NoError(err)
		s.Empty(nums)

		// Check system IDs are cleared
		systemIDs, err := SystemIntakeSystems(s.ctxWithNewDataloaders(), unlinkedIntake.ID)
		s.NoError(err)
		s.Empty(systemIDs)
	})
}
