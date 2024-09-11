package resolvers

import (
	"context"

	"github.com/google/uuid"
	"github.com/guregu/null/zero"
	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
)

type trbRequestRelationTestCase struct {
	InitialContractNumbers []string
	NewContractNumbers     []string
	InitialSystemIDs       []string
	NewSystemIDs           []string
}

func (s *ResolverSuite) TestSetTRBRequestRelationNewSystem() {
	store := s.testConfigs.Store
	ctx := s.testConfigs.Context

	var cases = map[string]trbRequestRelationTestCase{
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

	for caseName, caseValues := range cases {
		s.Run(caseName, func() {
			trbRequest, err := CreateTRBRequest(ctx, models.TRBTNeedHelp, store)
			s.NoError(err)
			changes := map[string]interface{}{"contractName": zero.StringFrom("Test Name")}
			trbRequest, err = UpdateTRBRequest(ctx, trbRequest.ID, changes, store)
			s.NoError(err)
			s.NotEqual(trbRequest.ID, uuid.Nil)
			s.NotNil(trbRequest)
			s.Equal(trbRequest.ContractName, zero.StringFrom("Test Name"))

			// Set existing contract numbers
			err = sqlutils.WithTransaction(ctx, store, func(tx *sqlx.Tx) error {
				return store.SetTRBRequestContractNumbers(ctx, tx, trbRequest.ID, caseValues.InitialContractNumbers)
			})
			s.NoError(err)

			updatedTRBRequestContractNumbers, err := TRBRequestContractNumbers(s.ctxWithNewDataloaders(), trbRequest.ID)
			s.NoError(err)
			s.Equal(len(caseValues.InitialContractNumbers), len(updatedTRBRequestContractNumbers))

			// Set existing system IDs
			err = sqlutils.WithTransaction(ctx, store, func(tx *sqlx.Tx) error {
				return store.SetTRBRequestSystems(ctx, tx, trbRequest.ID, caseValues.InitialSystemIDs)
			})
			s.NoError(err)

			updatedTRBRequestSystemIDs, err := TRBRequestSystems(s.ctxWithNewDataloaders(), trbRequest.ID)
			s.NoError(err)
			s.Equal(len(caseValues.InitialSystemIDs), len(updatedTRBRequestSystemIDs))

			// Set the "new system" relationship
			input := models.SetTRBRequestRelationNewSystemInput{
				TrbRequestID:    trbRequest.ID,
				ContractNumbers: caseValues.NewContractNumbers,
			}

			// Run Resolver
			updatedTRBRequest, err := SetTRBRequestRelationNewSystem(ctx, store, input)
			s.NoError(err)

			// Ensure the contract name was deleted properly
			s.True(updatedTRBRequest.ContractName.IsZero())

			// refetch contract numbers and system IDs
			updatedTRBRequestContractNumbers, err = TRBRequestContractNumbers(s.ctxWithNewDataloaders(), updatedTRBRequest.ID)
			s.NoError(err)

			updatedTRBRequestSystemIDs, err = TRBRequestSystems(s.ctxWithNewDataloaders(), trbRequest.ID)
			s.NoError(err)

			// Ensure the system IDs were modified properly
			// New System relation should always remove existing system IDs
			s.Equal(len(caseValues.NewSystemIDs), len(updatedTRBRequestSystemIDs))
			for _, v := range updatedTRBRequestSystemIDs {
				s.Contains(caseValues.NewSystemIDs, v.ID)
			}

			// Ensure the contract numbers were modified properly
			s.Equal(len(caseValues.NewContractNumbers), len(updatedTRBRequestContractNumbers))
			for _, v := range updatedTRBRequestContractNumbers {
				s.Contains(caseValues.NewContractNumbers, v.ContractNumber)
			}

			// Check relation type
			s.NotNil(updatedTRBRequest.SystemRelationType)
			s.Equal(models.RelationTypeNewSystem, *updatedTRBRequest.SystemRelationType)
		})
	}
}

func (s *ResolverSuite) TestSetTRBRequestRelationExistingSystem() {
	store := s.testConfigs.Store
	ctx := s.testConfigs.Context

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
		s.Run(caseName, func() {
			trbRequest, err := CreateTRBRequest(ctx, models.TRBTNeedHelp, store)
			s.NoError(err)
			changes := map[string]interface{}{"contractName": zero.StringFrom("Test Name")}
			trbRequest, err = UpdateTRBRequest(ctx, trbRequest.ID, changes, store)
			s.NoError(err)
			s.NotEqual(trbRequest.ID, uuid.Nil)
			s.NotNil(trbRequest)
			s.Equal(trbRequest.ContractName, zero.StringFrom("Test Name"))

			// Set existing contract numbers
			err = sqlutils.WithTransaction(ctx, store, func(tx *sqlx.Tx) error {
				return store.SetTRBRequestContractNumbers(ctx, tx, trbRequest.ID, caseValues.InitialContractNumbers)
			})
			s.NoError(err)

			updatedTRBRequestContractNumbers, err := TRBRequestContractNumbers(s.ctxWithNewDataloaders(), trbRequest.ID)
			s.NoError(err)
			s.Equal(len(caseValues.InitialContractNumbers), len(updatedTRBRequestContractNumbers))

			// Set existing system IDs
			err = sqlutils.WithTransaction(ctx, store, func(tx *sqlx.Tx) error {
				return store.SetTRBRequestSystems(ctx, tx, trbRequest.ID, caseValues.InitialSystemIDs)
			})
			s.NoError(err)

			updatedTRBRequestSystemIDs, err := TRBRequestSystems(s.ctxWithNewDataloaders(), trbRequest.ID)
			s.NoError(err)
			s.Equal(len(caseValues.InitialSystemIDs), len(updatedTRBRequestSystemIDs))

			// Set the "existing system" relationship
			input := models.SetTRBRequestRelationExistingSystemInput{
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

			s.NoError(err)

			// Ensure the contract name was deleted properly
			s.True(updatedTRBRequest.ContractName.IsZero())

			// refetch contract numbers and system IDs
			updatedTRBRequestContractNumbers, err = TRBRequestContractNumbers(s.ctxWithNewDataloaders(), updatedTRBRequest.ID)
			s.NoError(err)

			updatedTRBRequestSystemIDs, err = TRBRequestSystems(s.ctxWithNewDataloaders(), trbRequest.ID)
			s.NoError(err)

			// Ensure the system IDs were modified properly
			s.Equal(len(caseValues.NewSystemIDs), len(updatedTRBRequestSystemIDs))
			for _, v := range updatedTRBRequestSystemIDs {
				s.Contains(caseValues.NewSystemIDs, v.ID.String)
			}

			// Ensure the contract numbers were modified properly
			s.Equal(len(caseValues.NewContractNumbers), len(updatedTRBRequestContractNumbers))
			for _, v := range updatedTRBRequestContractNumbers {
				s.Contains(caseValues.NewContractNumbers, v.ContractNumber)
			}

			// Check relation type
			s.NotNil(updatedTRBRequest.SystemRelationType)
			s.Equal(models.RelationTypeExistingSystem, *updatedTRBRequest.SystemRelationType)
		})
	}
}

func (s *ResolverSuite) TestSetTRBRequestRelationExistingService() {
	store := s.testConfigs.Store
	ctx := s.testConfigs.Context

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
		s.Run(caseName, func() {
			trbRequest, err := CreateTRBRequest(ctx, models.TRBTNeedHelp, store)
			s.NoError(err)
			s.NotEqual(trbRequest.ID, uuid.Nil)
			s.NotNil(trbRequest)

			// Set existing contract numbers
			err = sqlutils.WithTransaction(ctx, store, func(tx *sqlx.Tx) error {
				return store.SetTRBRequestContractNumbers(ctx, tx, trbRequest.ID, caseValues.InitialContractNumbers)
			})
			s.NoError(err)

			updatedTRBRequestContractNumbers, err := TRBRequestContractNumbers(s.ctxWithNewDataloaders(), trbRequest.ID)
			s.NoError(err)
			s.Equal(len(caseValues.InitialContractNumbers), len(updatedTRBRequestContractNumbers))

			// Set existing system IDs
			err = sqlutils.WithTransaction(ctx, store, func(tx *sqlx.Tx) error {
				return store.SetTRBRequestSystems(ctx, tx, trbRequest.ID, caseValues.InitialSystemIDs)
			})
			s.NoError(err)

			updatedTRBRequestSystemIDs, err := TRBRequestSystems(s.ctxWithNewDataloaders(), trbRequest.ID)
			s.NoError(err)
			s.Equal(len(caseValues.InitialSystemIDs), len(updatedTRBRequestSystemIDs))

			// Set the existing service relationship
			newContractName := "My New Contract Name"
			input := models.SetTRBRequestRelationExistingServiceInput{
				TrbRequestID:    trbRequest.ID,
				ContractName:    newContractName,
				ContractNumbers: caseValues.NewContractNumbers,
			}
			updatedTRBRequest, err := SetTRBRequestRelationExistingService(ctx, store, input)
			s.NoError(err)

			// Ensure the contract name was updated properly
			s.Equal(newContractName, updatedTRBRequest.ContractName.String)

			// refetch contract numbers and system IDs
			updatedTRBRequestContractNumbers, err = TRBRequestContractNumbers(s.ctxWithNewDataloaders(), updatedTRBRequest.ID)
			s.NoError(err)

			updatedTRBRequestSystemIDs, err = TRBRequestSystems(s.ctxWithNewDataloaders(), trbRequest.ID)
			s.NoError(err)

			// Ensure the system IDs were modified properly
			s.Equal(len(caseValues.NewSystemIDs), len(updatedTRBRequestSystemIDs))
			for _, v := range updatedTRBRequestSystemIDs {
				s.Contains(caseValues.NewSystemIDs, v.ID)
			}

			// Ensure the contract numbers were modified properly
			// Existing Service relation should always remove existing system IDs
			s.Equal(len(caseValues.NewContractNumbers), len(updatedTRBRequestContractNumbers))
			for _, v := range updatedTRBRequestContractNumbers {
				s.Contains(caseValues.NewContractNumbers, v.ContractNumber)
			}

			// Check relation type
			s.NotNil(updatedTRBRequest.SystemRelationType)
			s.Equal(models.RelationTypeExistingService, *updatedTRBRequest.SystemRelationType)
		})
	}
}

func (s *ResolverSuite) TestUnlinkTRBRequestRelation() {
	ctx := s.testConfigs.Context
	store := s.testConfigs.Store

	s.Run("unlink new trb request", func() {
		// Create an initial TRBRequest
		trbRequest, err := CreateTRBRequest(ctx, models.TRBTNeedHelp, store)
		s.NoError(err)
		s.NotEqual(trbRequest.ID, uuid.Nil)
		s.NotNil(trbRequest)

		// Set the new system relationship
		input := models.SetTRBRequestRelationNewSystemInput{
			TrbRequestID:    trbRequest.ID,
			ContractNumbers: []string{"12345", "67890"},
		}
		_, err = SetTRBRequestRelationNewSystem(ctx, store, input)
		s.NoError(err) // we don't need to test the SetTRBRequestRelationNewSystem function here

		// Now unlink the relationship
		unlinkedTRBRequest, err := UnlinkTRBRequestRelation(ctx, store, trbRequest.ID)
		s.NoError(err)

		// Assert that all values are cleared appropriately
		s.Equal("", unlinkedTRBRequest.ContractName.ValueOrZero())
		s.Nil(unlinkedTRBRequest.SystemRelationType)

		// Check contract numbers are cleared
		nums, err := TRBRequestContractNumbers(s.ctxWithNewDataloaders(), unlinkedTRBRequest.ID)
		s.NoError(err)
		s.Empty(nums)

		// Check system IDs are cleared
		systemIDs, err := TRBRequestSystems(s.ctxWithNewDataloaders(), unlinkedTRBRequest.ID)
		s.NoError(err)
		s.Empty(systemIDs)
	})

	s.Run("unlink existing trb request", func() {
		// Create an initial TRBRequest
		trbRequest, err := CreateTRBRequest(ctx, models.TRBTNeedHelp, store)
		s.NoError(err)
		s.NotEqual(trbRequest.ID, uuid.Nil)
		s.NotNil(trbRequest)

		// Set the existing system relationship
		input := models.SetTRBRequestRelationExistingSystemInput{
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
		s.NoError(err) // we don't need to test the SetTRBRequestRelationExistingSystem function here

		// Now unlink the relationship
		unlinkedTRBRequest, err := UnlinkTRBRequestRelation(ctx, store, trbRequest.ID)
		s.NoError(err)

		// Assert that all values are cleared appropriately
		s.Equal("", unlinkedTRBRequest.ContractName.ValueOrZero())
		s.Nil(unlinkedTRBRequest.SystemRelationType)

		// Check contract numbers are cleared
		nums, err := TRBRequestContractNumbers(s.ctxWithNewDataloaders(), unlinkedTRBRequest.ID)
		s.NoError(err)
		s.Empty(nums)

		// Check system IDs are cleared
		systemIDs, err := TRBRequestSystems(s.ctxWithNewDataloaders(), unlinkedTRBRequest.ID)
		s.NoError(err)
		s.Empty(systemIDs)
	})

	s.Run("unlink existing service TRBRequest", func() {
		// Create an initial TRBRequest
		trbRequest, err := CreateTRBRequest(ctx, models.TRBTNeedHelp, store)
		s.NoError(err)
		s.NotEqual(trbRequest.ID, uuid.Nil)
		s.NotNil(trbRequest)

		// Set the existing service relationship
		contractName := "My Test Contract Name"
		input := models.SetTRBRequestRelationExistingServiceInput{
			TrbRequestID:    trbRequest.ID,
			ContractName:    contractName,
			ContractNumbers: []string{"12345", "67890"},
		}
		_, err = SetTRBRequestRelationExistingService(ctx, store, input)
		s.NoError(err) // we don't need to test the SetTRBRequestRelationExistingService function here

		// Now unlink the relationship
		unlinkedTRBRequest, err := UnlinkTRBRequestRelation(ctx, store, trbRequest.ID)
		s.NoError(err)

		// Assert that all values are cleared appropriately
		s.Equal("", unlinkedTRBRequest.ContractName.ValueOrZero())
		s.Nil(unlinkedTRBRequest.SystemRelationType)

		// Check contract numbers are cleared
		nums, err := TRBRequestContractNumbers(s.ctxWithNewDataloaders(), unlinkedTRBRequest.ID)
		s.NoError(err)
		s.Empty(nums)

		// Check system IDs are cleared
		systemIDs, err := TRBRequestSystems(s.ctxWithNewDataloaders(), unlinkedTRBRequest.ID)
		s.NoError(err)
		s.Empty(systemIDs)
	})
}
