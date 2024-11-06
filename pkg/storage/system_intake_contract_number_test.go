package storage

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
	"github.com/cms-enterprise/easi-app/pkg/testhelpers"
)

func (s *StoreTestSuite) TestLinkSystemIntakeContractNumbers() {
	ctx := context.Background()

	const (
		contract1 = "1"
		contract2 = "2"
		contract3 = "3"
		contract4 = "4"
	)

	var createdIDs []uuid.UUID

	s.Run("sets contracts on a system intake", func() {
		// create three intakes
		for i := 0; i < 3; i++ {
			intake := models.SystemIntake{
				EUAUserID:   testhelpers.RandomEUAIDNull(),
				RequestType: models.SystemIntakeRequestTypeNEW,
				Requester:   fmt.Sprintf("link to contracts %d", i),
			}

			created, err := s.store.CreateSystemIntake(ctx, &intake)
			s.NoError(err)
			createdIDs = append(createdIDs, created.ID)
		}

		// insert contracts for this created system intake
		contractNumbers := []string{
			contract1,
			contract2,
			contract3,
		}
		for _, systemIntakeID := range createdIDs {
			err := sqlutils.WithTransaction(ctx, s.db, func(tx *sqlx.Tx) error {
				return s.store.SetSystemIntakeContractNumbers(ctx, tx, systemIntakeID, contractNumbers)
			})
			s.NoError(err)
		}

		results, err := s.store.SystemIntakeContractNumbersBySystemIntakeIDs(ctx, createdIDs)
		s.NoError(err)

		data := helpers.OneToMany(createdIDs, results)
		s.Equal(len(data), len(createdIDs))

		for i, systemIntakeID := range createdIDs {
			contractsFound := data[i]
			s.Len(contractsFound, 3)

			var (
				found1 bool
				found2 bool
				found3 bool
			)

			for _, contract := range contractsFound {
				s.Equal(systemIntakeID, contract.SystemIntakeID)
				if contract.ContractNumber == contract1 {
					found1 = true
				}

				if contract.ContractNumber == contract2 {
					found2 = true
				}

				if contract.ContractNumber == contract3 {
					found3 = true
				}
			}

			s.True(found1)
			s.True(found2)
			s.True(found3)
		}

		// now, we can add contract 4 to one of the system intakes and verify that the created_at dates for the first three remain unchanged
		err = sqlutils.WithTransaction(ctx, s.db, func(tx *sqlx.Tx) error {
			return s.store.SetSystemIntakeContractNumbers(ctx, tx, createdIDs[0], append(contractNumbers, contract4))
		})
		s.NoError(err)

		results, err = s.store.SystemIntakeContractNumbersBySystemIntakeIDs(ctx, []uuid.UUID{createdIDs[0]})
		s.NoError(err)

		data = helpers.OneToMany([]uuid.UUID{createdIDs[0]}, results)
		s.Len(data, 1)
		contractsFound := data[0]
		s.Len(contractsFound, 4)

		var (
			firstThreeContractsTime time.Time
			fourthContractTime      time.Time
		)

		for _, contract := range contractsFound {
			s.Equal(createdIDs[0], contract.SystemIntakeID)
			if contract.ContractNumber == contract1 ||
				contract.ContractNumber == contract2 ||
				contract.ContractNumber == contract3 {
				firstThreeContractsTime = contract.CreatedAt
			}

			if contract.ContractNumber == contract4 {
				fourthContractTime = contract.CreatedAt
			}
		}

		s.False(firstThreeContractsTime.IsZero())
		s.False(fourthContractTime.IsZero())

		s.True(fourthContractTime.After(firstThreeContractsTime))

		_, err = s.db.Exec("DELETE FROM system_intakes WHERE id = ANY($1)", pq.Array(createdIDs))
		s.NoError(err)
	})
}
