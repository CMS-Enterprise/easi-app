package storage

import (
	"context"
	"errors"

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
			trb.Type = models.TRBTNeedHelp
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
		err := sqlutils.WithTransaction(ctx, suite.store, func(tx *sqlx.Tx) error {

			trb := models.NewTRBRequest(anonEua)
			trb.Type = models.TRBTNeedHelp
			trb.State = models.TRBRequestStateOpen

			_, err := suite.store.CreateTRBRequest(ctx, tx, trb)
			if err != nil {
				return err
			}
			return errArtifical

		})
		suite.ErrorIs(err, errArtifical)
	})

	suite.Run("With Transaction can also perform discrete db actions not directly part of the transaction", func() {
		//NOTE: this is not behavior we should expect in production code.
		var trbGlobal *models.TRBRequest
		err := sqlutils.WithTransaction(ctx, suite.store, func(tx *sqlx.Tx) error {

			trb := models.NewTRBRequest(anonEua)
			trb.Type = models.TRBTNeedHelp
			trb.State = models.TRBRequestStateOpen

			createdTRB, err := suite.store.CreateTRBRequest(ctx, suite.store, trb) //Call the method on the store itself, so it is automatically created
			if err != nil {
				return err
			}
			trbGlobal = createdTRB
			return errArtifical

		})
		suite.ErrorIs(err, errArtifical)

		trbRet, err := suite.store.GetTRBRequestByID(ctx, trbGlobal.ID) // If the transaction was commited, we should get the plan
		suite.NoError(err)
		suite.NotNil(trbRet)
	})

}
