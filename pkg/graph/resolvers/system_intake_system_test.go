package resolvers

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
	"github.com/cms-enterprise/easi-app/pkg/testhelpers"
)

func (s *ResolverSuite) TestIntakeRelatedSystems() {
	ctx := s.testConfigs.Context

	const (
		systemID1 = "{11AB1A00-1234-5678-ABC1-1A001B00CC0A}"
		systemID2 = "{11AB1A00-1234-5678-ABC1-1A001B00CC1B}"
		systemID3 = "{11AB1A00-1234-5678-ABC1-1A001B00CC2C}"
	)

	var createdIDs []uuid.UUID

	// create system intake
	s.Run("create system intakes for test", func() {
		for i := 0; i < 2; i++ {
			intake := models.SystemIntake{
				EUAUserID:   testhelpers.RandomEUAIDNull(),
				RequestType: models.SystemIntakeRequestTypeNEW,
				Requester:   fmt.Sprintf("system intake system data loader %d", i),
			}

			created, err := s.testConfigs.Store.CreateSystemIntake(ctx, &intake)
			s.NoError(err)
			createdIDs = append(createdIDs, created.ID)
		}

		// set contract for the created system intake
		// insert systems for this created system intake
		systemIDs := []string{
			systemID1,
			systemID2,
			systemID3,
		}

		err := sqlutils.WithTransaction(ctx, s.testConfigs.Store, func(tx *sqlx.Tx) error {
			return s.testConfigs.Store.SetSystemIntakeSystems(ctx, tx, createdIDs[0], systemIDs, []*models.SystemRelationship{})
		})
		s.NoError(err)

		data, err := SystemIntakeSystems(s.ctxWithNewDataloaders(), createdIDs[0])
		s.NoError(err)
		s.Len(data, 3)

		var (
			found1 bool
			found2 bool
			found3 bool
		)

		for _, result := range data {
			if result.ID.String == systemID1 {
				found1 = true
			}

			if result.ID.String == systemID2 {
				found2 = true
			}

			if result.ID.String == systemID3 {
				found3 = true
			}
		}

		s.True(found1)
		s.True(found2)
		s.True(found3)

		// attempt to get systems for a system intake without linked systems
		data, err = SystemIntakeSystems(s.ctxWithNewDataloaders(), createdIDs[1])
		s.NoError(err)
		s.Empty(data)
	})
}

func (s *ResolverSuite) TestSystemIntakesByCedarSystemID() {
	ctx := s.testConfigs.Context

	var (
		open1 uuid.UUID
		open2 uuid.UUID

		closed uuid.UUID
	)

	const (
		system1 = "1"
		system2 = "2"
		system3 = "3"
		system4 = "4"
	)

	s.Run("test getting system intakes by cedar system id", func() {
		// create some intakes
		intake1 := models.SystemIntake{
			EUAUserID:   testhelpers.RandomEUAIDNull(),
			RequestType: models.SystemIntakeRequestTypeNEW,
			State:       models.SystemIntakeStateOpen,
		}

		create1, err := s.testConfigs.Store.CreateSystemIntake(ctx, &intake1)
		s.NoError(err)
		s.NotNil(create1)

		open1 = create1.ID

		intake2 := models.SystemIntake{
			EUAUserID:   testhelpers.RandomEUAIDNull(),
			RequestType: models.SystemIntakeRequestTypeNEW,
			State:       models.SystemIntakeStateOpen,
		}

		create2, err := s.testConfigs.Store.CreateSystemIntake(ctx, &intake2)
		s.NoError(err)
		s.NotNil(create2)

		open2 = create2.ID

		intake3 := models.SystemIntake{
			EUAUserID:   testhelpers.RandomEUAIDNull(),
			RequestType: models.SystemIntakeRequestTypeNEW,
			State:       models.SystemIntakeStateClosed,
		}

		create3, err := s.testConfigs.Store.CreateSystemIntake(ctx, &intake3)
		s.NoError(err)
		s.NotNil(create3)

		closed = create3.ID

		// link all systems to all system intakes
		systemNumbers := []string{
			system1,
			system2,
			system3,
			system4,
		}

		err = sqlutils.WithTransaction(ctx, s.testConfigs.Store, func(tx *sqlx.Tx) error {
			return s.testConfigs.Store.SetSystemIntakeSystems(ctx, tx, open1, systemNumbers, []*models.SystemRelationship{})
		})
		s.NoError(err)

		err = sqlutils.WithTransaction(ctx, s.testConfigs.Store, func(tx *sqlx.Tx) error {
			return s.testConfigs.Store.SetSystemIntakeSystems(ctx, tx, open2, systemNumbers, []*models.SystemRelationship{})
		})
		s.NoError(err)

		err = sqlutils.WithTransaction(ctx, s.testConfigs.Store, func(tx *sqlx.Tx) error {
			return s.testConfigs.Store.SetSystemIntakeSystems(ctx, tx, closed, systemNumbers, []*models.SystemRelationship{})
		})
		s.NoError(err)

		results, err := CedarSystemLinkedSystemIntakes(s.ctxWithNewDataloaders(), system1, models.SystemIntakeStateOpen)
		s.NoError(err)
		s.Len(results, 2)

		foundClosed := false

		for _, result := range results {
			if result.ID == closed {
				foundClosed = true
				break
			}
		}

		s.False(foundClosed)

		// now get the closed one
		results, err = CedarSystemLinkedSystemIntakes(s.ctxWithNewDataloaders(), system1, models.SystemIntakeStateClosed)
		s.NoError(err)
		s.Len(results, 1)
		s.Equal(results[0].ID, closed)
	})
}
