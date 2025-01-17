package storage

import (
	"context"

	"github.com/guregu/null"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *StoreTestSuite) TestDeleteSystemIntakeGRBPresentationLinks() {
	ctx := context.Background()
	euaID := "ABCD"

	intake, err := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		RequestType: models.SystemIntakeRequestTypeNEW,
		EUAUserID:   null.StringFrom(euaID),
	})
	s.NoError(err)
	s.NotNil(intake)

	s.Run("test error case (only case for now)", func() {
		err := s.store.DeleteSystemIntakeGRBPresentationLinks(ctx, intake.ID)
		s.Error(err)
	})
}
