package storage

import (
	"context"
	"fmt"
	"strings"

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
	)

	var createdIDs []uuid.UUID

	s.Run("sets contracts on a system intake", func() {
		// create three intakes
		for i := 0; i < 3; i++ {
			intake := models.SystemIntake{
				EUAUserID:   testhelpers.RandomEUAIDNull(),
				Status:      models.SystemIntakeStatusINTAKEDRAFT,
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

		params := formatParamTableJSON("system_intake_id", createdIDs)

		data, err := s.store.SystemIntakeContractNumbersBySystemIntakeIDLOADER(ctx, params)
		s.NoError(err)

		for _, systemIntakeID := range createdIDs {
			contactsFound, ok := data[systemIntakeID.String()]
			s.True(ok)
			s.Len(contactsFound, 3)
		}

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
