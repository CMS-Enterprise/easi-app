package resolvers

import (
	"context"
	"errors"

	"github.com/jmoiron/sqlx"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/sqlutils"
	"github.com/cmsgov/easi-app/pkg/storage"
	"github.com/cmsgov/easi-app/pkg/userhelpers"
)

// SetSystemIntakeRelationExistingService sets the relationship between a system intake and
func CreateSystemIntakeGRBReviewer(
	ctx context.Context,
	store *storage.Store,
	fetchUser userhelpers.GetAccountInfoFunc,
	input *models.CreateSystemIntakeGRBReviewerInput,
) (*models.SystemIntakeGRBReviewer, error) {
	return sqlutils.WithTransactionRet(ctx, store, func(tx *sqlx.Tx) (*models.SystemIntakeGRBReviewer, error) {
		// Fetch intake by ID
		intake, err := store.FetchSystemIntakeByIDNP(ctx, tx, input.SystemIntakeID)
		if err != nil {
			return nil, err
		}
		if intake == nil {
			return nil, errors.New("system intake not found")
		}
		acct, err := userhelpers.GetOrCreateUserAccount(ctx, tx, store, input.EuaUserID, false, fetchUser)
		if err != nil {
			return nil, err
		}
		createdByID := appcontext.Principal(ctx).Account().ID
		reviewer := models.NewSystemIntakeGRBReviewer(acct.ID, createdByID)
		reviewer.VotingRole = models.SIGRBReviewerVotingRole(input.VotingRole)
		reviewer.GRBRole = models.SIGRBReviewerRole(input.GrbRole)
		reviewer.SystemIntakeID = input.SystemIntakeID
		err = store.CreateSystemIntakeGRBReviewer(ctx, tx, intake.ID, reviewer)
		if err != nil {
			return nil, err
		}

		return reviewer, nil
	})
}
