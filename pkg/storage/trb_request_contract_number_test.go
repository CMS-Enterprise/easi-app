package storage

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"

	"github.com/cmsgov/easi-app/pkg/sqlutils"
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
			_, err := sqlutils.WithTransaction[any](s.db, func(tx *sqlx.Tx) (*any, error) {
				s.NoError(s.store.SetTRBRequestContractNumbers(ctx, tx, trbRequestID, contractNumbers))
				return nil, nil
			})
			s.NoError(err)
		}
		// retrieve these contract numbers
		data, err := s.store.TRBRequestContractNumbersByTRBRequestIDLOADER(ctx, formatParamTableJSON("trb_request_id", createdIDs))
		s.NoError(err)

		for _, trbRequestID := range createdIDs {
			contractsFound, ok := data[trbRequestID.String()]
			s.True(ok)
			s.Len(contractsFound, 3)

			var (
				found1 bool
				found2 bool
				found3 bool
			)

			for _, contract := range contractsFound {
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
		_, err = sqlutils.WithTransaction[any](s.db, func(tx *sqlx.Tx) (*any, error) {
			s.NoError(s.store.SetTRBRequestContractNumbers(ctx, tx, createdIDs[0], append(contractNumbers, contract4)))
			return nil, nil
		})
		s.NoError(err)

		data, err = s.store.TRBRequestContractNumbersByTRBRequestIDLOADER(ctx, formatParamTableJSON("trb_request_id", []uuid.UUID{createdIDs[0]}))
		s.NoError(err)

		contractsFound, ok := data[createdIDs[0].String()]
		s.True(ok)
		s.Len(contractsFound, 4)

		var (
			firstThreeContractsTime time.Time
			fourthContractTime      time.Time
		)

		for _, contract := range contractsFound {
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

		_, err = s.db.ExecContext(ctx, "DELETE FROM trb_request WHERE id = ANY($1)", pq.Array(createdIDs))
		s.NoError(err)
	})
}
