package storage

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
)

var errArtifical = errors.New("this is an artificial error to ensure that the transaction rolls back")

func (s *StoreTestSuite) TestWithTransaction() {

	ctx := context.Background()
	anonEua := "ANON"
	s.Run("No errors will commit a transaction", func() {
		newTRB, err := sqlutils.WithTransactionRet[*models.TRBRequest](ctx, s.store, func(tx *sqlx.Tx) (*models.TRBRequest, error) {

			trb := models.NewTRBRequest(anonEua)
			trb.Type = models.TRBTNeedHelp
			trb.State = models.TRBRequestStateOpen

			createdTRB, err := s.store.CreateTRBRequest(ctx, tx, trb)
			if err != nil {
				return nil, err
			}
			return createdTRB, nil

		})
		s.NoError(err)
		s.NotNil(newTRB)

		trbRet, err := s.store.GetTRBRequestByID(ctx, newTRB.ID) // If the transaction was commited, we should get the plan
		s.NoError(err)
		s.NotNil(trbRet)
	})

	s.Run("Errors will rollback a transaction", func() {
		var createID uuid.UUID
		retVal, err := sqlutils.WithTransactionRet[*models.TRBRequest](ctx, s.store, func(tx *sqlx.Tx) (*models.TRBRequest, error) {

			trb := models.NewTRBRequest(anonEua)
			trb.Type = models.TRBTNeedHelp
			trb.State = models.TRBRequestStateOpen

			created, err := s.store.CreateTRBRequest(ctx, tx, trb)
			if err != nil {
				return nil, err
			}

			// prove the TRB request was created in the tx
			s.NotNil(created)

			// assign id to external var for later
			createID = created.ID

			return created, errArtifical

		})
		s.ErrorIs(err, errArtifical)

		// a transaction should never return useful data on error
		s.Nil(retVal)

		// attempt to get new TRB by the created ID - we should not get anything
		trb, err := s.store.GetTRBRequestByID(ctx, createID)
		s.Error(err)

		// that same TRB request that was not nil in the tx will now be nil after rollback
		s.Nil(trb)
	})

	s.Run("With Transaction can also perform discrete db actions not directly part of the transaction", func() {
		//NOTE: this is not behavior we should expect in production code.
		var trbGlobal *models.TRBRequest
		retVal, err := sqlutils.WithTransactionRet[*models.TRBRequest](ctx, s.store, func(tx *sqlx.Tx) (*models.TRBRequest, error) {

			trb := models.NewTRBRequest(anonEua)
			trb.Type = models.TRBTNeedHelp
			trb.State = models.TRBRequestStateOpen

			createdTRB, err := s.store.CreateTRBRequest(ctx, s.store, trb) //Call the method on the store itself, so it is automatically created
			if err != nil {
				return nil, err
			}
			trbGlobal = createdTRB
			return createdTRB, errArtifical
		})
		s.ErrorIs(err, errArtifical)

		// the return value from the transaction will be `nil`, but, to reiterate the above comment, this is a bad pattern and should not be seen in prod
		s.Nil(retVal)

		trbRet, err := s.store.GetTRBRequestByID(ctx, trbGlobal.ID) // we should get the plan no matter what as it was executed outside of `tx` context
		s.NoError(err)
		s.NotNil(trbRet)
	})

	s.Run("With Transaction will rollback on panic", func() {
		var createID uuid.UUID

		panicFunc := func() {
			_ = sqlutils.WithTransaction(ctx, s.store, func(tx *sqlx.Tx) error {
				trb := models.NewTRBRequest(anonEua)
				trb.Type = models.TRBTNeedHelp
				trb.State = models.TRBRequestStateOpen

				createdTRB, err := s.store.CreateTRBRequest(ctx, tx, trb)
				if err != nil {
					return err
				}

				// prove creation
				s.NotNil(createdTRB)

				// assign id for later
				createID = createdTRB.ID

				panic("panic!")
			})
		}

		// we expect a panic, so we don't want the test to fail due to our panic
		s.Panics(panicFunc)

		// attempt to get new TRB by the created ID - we should not get anything
		trb, err := s.store.GetTRBRequestByID(ctx, createID)
		s.Error(err)

		// should no longer exist due to panic-induced rollback
		s.Nil(trb)

	})
}
