package storage

import (
	"context"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

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

	var createdID uuid.UUID

	// first, create system intake
	s.Run("create system intake for test", func() {
		intake := models.SystemIntake{
			EUAUserID:   testhelpers.RandomEUAIDNull(),
			Status:      models.SystemIntakeStatusINTAKEDRAFT,
			RequestType: models.SystemIntakeRequestTypeNEW,
			Requester:   "link to contracts",
		}

		created, err := s.store.CreateSystemIntake(ctx, &intake)
		s.NoError(err)
		createdID = created.ID
	})

	s.Run("links the system intake to contracts", func() {
		// insert contracts for this created system intake
		contractNumbers := []string{
			contract1,
			contract2,
			contract3,
		}
		_, err := sqlutils.WithTransaction[any](s.db, func(tx *sqlx.Tx) (*any, error) {
			s.NoError(s.store.SetSystemIntakeContractNumbers(ctx, tx, createdID, contractNumbers))
			return nil, nil
		})
		s.NoError(err)
	})

	s.Run("deletes the test intake", func() {
		_, err := s.db.ExecContext(ctx, "DELETE FROM system_intakes WHERE id = $1", createdID)
		s.NoError(err)
	})
}
