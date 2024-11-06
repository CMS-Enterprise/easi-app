package resolvers

import (
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
)

func (s *ResolverSuite) TestTRBRequestContractNumbers() {
	ctx := s.testConfigs.Context

	const (
		contract1 = "1"
		contract2 = "2"
		contract3 = "3"
	)

	var createdIDs []uuid.UUID

	s.Run("create TRB Requests for test", func() {
		for i := 0; i < 2; i++ {
			created, err := CreateTRBRequest(ctx, models.TRBTBrainstorm, s.testConfigs.Store)
			s.NoError(err)
			createdIDs = append(createdIDs, created.ID)
		}

		contractNumbers := []string{
			contract1,
			contract2,
			contract3,
		}

		// set contract numbers on these TRB Requests
		err := sqlutils.WithTransaction(ctx, s.testConfigs.Store, func(tx *sqlx.Tx) error {
			return s.testConfigs.Store.SetTRBRequestContractNumbers(ctx, tx, createdIDs[0], contractNumbers)
		})
		s.NoError(err)

		data, err := TRBRequestContractNumbers(s.ctxWithNewDataloaders(), createdIDs[0])
		s.NoError(err)
		s.Len(data, 3)

		var (
			found1 bool
			found2 bool
			found3 bool
		)

		for _, result := range data {
			s.Equal(result.TRBRequestID, createdIDs[0])

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

		// confirm second TRB Request does not have any contract numbers on it
		data, err = TRBRequestContractNumbers(s.ctxWithNewDataloaders(), createdIDs[1])
		s.NoError(err)
		s.Empty(data)
	})

}
