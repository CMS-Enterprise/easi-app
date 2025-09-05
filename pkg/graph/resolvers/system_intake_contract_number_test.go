package resolvers

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	"github.com/cms-enterprise/easi-app/pkg/testhelpers"
)

func (s *ResolverSuite) TestSystemIntakeContractNumbers() {
	ctx := s.testConfigs.Context

	const (
		contract1 = "1"
		contract2 = "2"
		contract3 = "3"
	)

	var createdIDs []uuid.UUID

	// create system intake
	s.Run("create system intake for test", func() {
		for i := 0; i < 2; i++ {
			intake := models.SystemIntake{
				EUAUserID:   testhelpers.RandomEUAIDNull(),
				RequestType: models.SystemIntakeRequestTypeNEW,
				Requester:   fmt.Sprintf("system intake contract number data loader %d", i),
			}

			created, err := storage.CreateSystemIntake(ctx, s.testConfigs.Store, &intake)
			s.NoError(err)
			createdIDs = append(createdIDs, created.ID)
		}

		// set contract for the created system intake
		// insert contracts for this created system intake
		contractNumbers := []string{
			contract1,
			contract2,
			contract3,
		}

		err := sqlutils.WithTransaction(ctx, s.testConfigs.Store, func(tx *sqlx.Tx) error {
			return s.testConfigs.Store.SetSystemIntakeContractNumbers(ctx, tx, createdIDs[0], contractNumbers)
		})
		s.NoError(err)

		data, err := SystemIntakeContractNumbers(s.ctxWithNewDataloaders(), createdIDs[0])
		s.NoError(err)
		s.Len(data, 3)

		var (
			found1 bool
			found2 bool
			found3 bool
		)

		for _, result := range data {
			s.Equal(result.SystemIntakeID, createdIDs[0])

			if result.ContractNumber == contract1 {
				found1 = true
			}

			if result.ContractNumber == contract2 {
				found2 = true
			}

			if result.ContractNumber == contract3 {
				found3 = true
			}
		}

		s.True(found1)
		s.True(found2)
		s.True(found3)

		// attempt to get contract numbers for a system intake without linked contracts
		data, err = SystemIntakeContractNumbers(s.ctxWithNewDataloaders(), createdIDs[1])
		s.NoError(err)
		s.Empty(data)
	})
}
