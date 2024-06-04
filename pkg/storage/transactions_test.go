package storage

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/sqlutils"
)

var errArtifical = errors.New("this is an artificial error to ensure that the transaction rolls back")

func (suite *StoreTestSuite) TestWithTransaction() {

	ctx := context.Background()
	anonEua := "ANON"
	suite.Run("No errors will commit a transaction", func() {
		newTRB, err := sqlutils.WithTransactionRet[*models.TRBRequest](ctx, suite.store, func(tx *sqlx.Tx) (*models.TRBRequest, error) {

			trb := models.NewTRBRequest(anonEua)
			trb.Type = models.TRBRequestTypeNeedHelp
			trb.State = models.TRBRequestStateOpen

			createdTRB, err := suite.store.CreateTRBRequest(ctx, tx, trb)
			if err != nil {
				return nil, err
			}
			return createdTRB, nil

		})
		suite.NoError(err)
		suite.NotNil(newTRB)

		trbRet, err := suite.store.GetTRBRequestByID(ctx, newTRB.ID) // If the transaction was commited, we should get the plan
		suite.NoError(err)
		suite.NotNil(trbRet)
	})

	suite.Run("Errors will rollback a transaction", func() {
		var createId uuid.UUID
		retVal, err := sqlutils.WithTransactionRet[*models.TRBRequest](ctx, suite.store, func(tx *sqlx.Tx) (*models.TRBRequest, error) {

			trb := models.NewTRBRequest(anonEua)
			trb.Type = models.TRBRequestTypeNeedHelp
			trb.State = models.TRBRequestStateOpen

			created, err := suite.store.CreateTRBRequest(ctx, tx, trb)
			if err != nil {
				return nil, err
			}

			// prove the TRB request was created in the tx
			suite.NotNil(created)

			// assign id to external var for later
			createId = created.ID

			return created, errArtifical

		})
		suite.ErrorIs(err, errArtifical)

		// a transaction should never return useful data on error
		suite.Nil(retVal)

		// attempt to get new TRB by the created ID - we should not get anything
		trb, err := suite.store.GetTRBRequestByID(ctx, createId)
		suite.Error(err)

		// that same TRB request that was not nil in the tx will now be nil after rollback
		suite.Nil(trb)
	})

	suite.Run("With Transaction can also perform discrete db actions not directly part of the transaction", func() {
		//NOTE: this is not behavior we should expect in production code.
		var trbGlobal *models.TRBRequest
		retVal, err := sqlutils.WithTransactionRet[*models.TRBRequest](ctx, suite.store, func(tx *sqlx.Tx) (*models.TRBRequest, error) {

			trb := models.NewTRBRequest(anonEua)
			trb.Type = models.TRBRequestTypeNeedHelp
			trb.State = models.TRBRequestStateOpen

			createdTRB, err := suite.store.CreateTRBRequest(ctx, suite.store, trb) //Call the method on the store itself, so it is automatically created
			if err != nil {
				return nil, err
			}
			trbGlobal = createdTRB
			return createdTRB, errArtifical
		})
		suite.ErrorIs(err, errArtifical)

		// the return value from the transaction will be `nil`, but, to reiterate the above comment, this is a bad pattern and should not be seen in prod
		suite.Nil(retVal)

		trbRet, err := suite.store.GetTRBRequestByID(ctx, trbGlobal.ID) // we should get the plan no matter what as it was executed outside of `tx` context
		suite.NoError(err)
		suite.NotNil(trbRet)
	})

	suite.Run("With Transaction will rollback on panic", func() {
		var createId uuid.UUID

		panicFunc := func() {
			_ = sqlutils.WithTransaction(ctx, suite.store, func(tx *sqlx.Tx) error {
				trb := models.NewTRBRequest(anonEua)
				trb.Type = models.TRBRequestTypeNeedHelp
				trb.State = models.TRBRequestStateOpen

				createdTRB, err := suite.store.CreateTRBRequest(ctx, tx, trb)
				if err != nil {
					return err
				}

				// prove creation
				suite.NotNil(createdTRB)

				// assign id for later
				createId = createdTRB.ID

				panic("panic!")
			})
		}

		// we expect a panic, so we don't want the test to fail due to our panic
		suite.Panics(panicFunc)

		// attempt to get new TRB by the created ID - we should not get anything
		trb, err := suite.store.GetTRBRequestByID(ctx, createId)
		suite.Error(err)

		// should no longer exist due to panic-induced rollback
		suite.Nil(trb)

	})
}
