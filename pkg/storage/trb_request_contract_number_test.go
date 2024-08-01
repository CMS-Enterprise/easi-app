package storage

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
)

func (s *StoreTestSuite) TestLinkTRBRequestContractNumbers() {
	ctx := context.Background()

	const (
		contract1 = "1"
		contract2 = "2"
		contract3 = "3"
		contract4 = "4"
	)

	var createdIDs []uuid.UUID

	s.Run("sets contracts on a TRB Request", func() {
		// create three TRB Requests
		for i := 0; i < 3; i++ {
			createdIDs = append(createdIDs, createTRBRequest(ctx, s, "ANON"))
		}

		contractNumbers := []string{
			contract1,
			contract2,
			contract3,
		}

		for _, trbRequestID := range createdIDs {
			err := sqlutils.WithTransaction(ctx, s.db, func(tx *sqlx.Tx) error {
				return s.store.SetTRBRequestContractNumbers(ctx, tx, trbRequestID, contractNumbers)
			})
			s.NoError(err)
		}
		// retrieve these contract numbers
		results, err := s.store.TRBRequestContractNumbersByTRBRequestIDs(ctx, createdIDs)
		s.NoError(err)

		data := helpers.OneToMany(createdIDs, results)
		s.Equal(len(data), len(createdIDs))

		for i, trbRequestID := range createdIDs {
			contractsFound := data[i]
			s.Len(contractsFound, 3)

			var (
				found1 bool
				found2 bool
				found3 bool
			)

			for _, contract := range contractsFound {
				s.Equal(trbRequestID, contract.TRBRequestID)
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

		// add contract 4 to one of the TRB Requests and confirm the first three were not modified in any way
		err = sqlutils.WithTransaction(ctx, s.db, func(tx *sqlx.Tx) error {
			return s.store.SetTRBRequestContractNumbers(ctx, tx, createdIDs[0], append(contractNumbers, contract4))
		})
		s.NoError(err)

		results, err = s.store.TRBRequestContractNumbersByTRBRequestIDs(ctx, []uuid.UUID{createdIDs[0]})
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
			s.Equal(createdIDs[0], contract.TRBRequestID)
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

		_, err = s.db.Exec("DELETE FROM trb_request WHERE id = ANY($1)", pq.Array(createdIDs))
		s.NoError(err)
	})
}
