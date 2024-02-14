package storage

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/sqlutils"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
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
			_, err := sqlutils.WithTransaction[any](s.db, func(tx *sqlx.Tx) (*any, error) {
				s.NoError(s.store.SetSystemIntakeContractNumbers(ctx, tx, systemIntakeID, contractNumbers))
				return nil, nil
			})
			s.NoError(err)
		}

		data, err := s.store.SystemIntakeContractNumbersBySystemIntakeIDLOADER(ctx, formatParamTableJSON("system_intake_id", createdIDs))
		s.NoError(err)

		for _, systemIntakeID := range createdIDs {
			contractsFound, ok := data[systemIntakeID.String()]
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

		// now, we can add contract 4 to one of the system intakes and verify that the created_at dates for the first three remain unchanged
		_, err = sqlutils.WithTransaction[any](s.db, func(tx *sqlx.Tx) (*any, error) {
			s.NoError(s.store.SetSystemIntakeContractNumbers(ctx, tx, createdIDs[0], append(contractNumbers, contract4)))
			return nil, nil
		})
		s.NoError(err)

		data, err = s.store.SystemIntakeContractNumbersBySystemIntakeIDLOADER(ctx, formatParamTableJSON("system_intake_id", []uuid.UUID{createdIDs[0]}))
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

		_, err = s.db.ExecContext(ctx, "DELETE FROM system_intakes WHERE id = ANY($1)", pq.Array(createdIDs))
		s.NoError(err)
	})
}

// formatParamTableJSON returns a string in this format `[{"system_intake_id":"84f41936-9d81-4c06-aa8e-df8010bfec72"}]`
func formatParamTableJSON(key string, ids []uuid.UUID) string {
	var out []string

	for _, id := range ids {
		out = append(out, fmt.Sprintf(`{"%[1]s":"%[2]s"}`, key, id.String()))
	}

	return fmt.Sprintf(`[%s]`, strings.Join(out, ","))
}
