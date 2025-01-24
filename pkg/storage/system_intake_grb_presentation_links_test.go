package storage

import (
	"context"

	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *StoreTestSuite) TestSystemIntakeGRBPresentationLinksByIntakeIDs() {
	ctx := context.Background()

	euaID := "ABCD"

	intake, err := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		RequestType: models.SystemIntakeRequestTypeNEW,
		EUAUserID:   null.StringFrom(euaID),
	})
	s.NoError(err)
	s.NotNil(intake)

	s.Run("query given intake id", func() {
		data, err := s.store.SystemIntakeGRBPresentationLinksByIntakeIDs(ctx, []uuid.UUID{intake.ID})
		s.NoError(err)
		s.Len(data, 0)
	})
}

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
