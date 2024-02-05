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
			s.NoError(s.store.LinkSystemIntakeContractNumbers(ctx, tx, createdID, contractNumbers))
			return nil, nil
		})
		s.NoError(err)
	})

	s.Run("retrieves the contracts", func() {
		results, err := s.store.GetSystemIntakeContractNumbersBySystemIntakeID(ctx, createdID)
		s.NoError(err)
		s.Len(results, 3)

		var (
			found1 bool
			found2 bool
			found3 bool
		)

		for _, result := range results {
			s.Equal(result.IntakeID, createdID)

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
	})

	s.Run("retrieves one contract number by id", func() {
		results, err := s.store.GetSystemIntakeContractNumbersBySystemIntakeID(ctx, createdID)
		s.NoError(err)
		s.Len(results, 3)

		result, err := s.store.GetSystemIntakeContractNumberByID(ctx, results[0].ID)
		s.NoError(err)
		s.NotZero(result.ID)
	})

	s.Run("deletes the test intake", func() {
		_, err := s.db.ExecContext(ctx, "DELETE FROM system_intakes WHERE id = $1", createdID)
		s.NoError(err)
	})

	s.Run("confirm linked contract rows were deleted as well", func() {
		results, err := s.store.GetSystemIntakeContractNumbersBySystemIntakeID(ctx, createdID)
		s.NoError(err)
		s.Empty(results)
	})
}
