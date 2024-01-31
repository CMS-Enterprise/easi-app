package storage

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func (s *StoreTestSuite) TestLinkSystemIntakeContractNumbers() {
	ctx := context.Background()

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

		// insert contracts for this created system intake
		contractNumbers := []string{
			"1", "2", "3",
		}

		s.NoError(s.store.LinkSystemIntakeContractNumbers(ctx, s.db.MustBegin(), created.ID, contractNumbers))
	})
}
