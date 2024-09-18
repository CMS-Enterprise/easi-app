package resolvers

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	"github.com/cms-enterprise/easi-app/pkg/userhelpers"
)

// CreateSystemIntakeGRBReviewer creates a GRB Reviewer for a System Intake
func CreateSystemIntakeGRBReviewer(
	ctx context.Context,
	store *storage.Store,
	emailClient *email.Client,
	fetchUser userhelpers.GetAccountInfoFunc,
	input *models.CreateSystemIntakeGRBReviewersInput,
) (*models.CreateSystemIntakeGRBReviewersPayload, error) {
	return &models.CreateSystemIntakeGRBReviewersPayload{
		Reviewers: []*models.SystemIntakeGRBReviewer{},
	}, nil
	// return sqlutils.WithTransactionRet(ctx, store, func(tx *sqlx.Tx) (*models.SystemIntakeGRBReviewer, error) {
	// 	// Fetch intake by ID
	// 	intake, err := store.FetchSystemIntakeByIDNP(ctx, tx, input.SystemIntakeID)
	// 	if err != nil {
	// 		return nil, err
	// 	}
	// 	if intake == nil {
	// 		return nil, errors.New("system intake not found")
	// 	}
	// 	acct, err := userhelpers.GetOrCreateUserAccount(ctx, tx, store, input.EuaUserID, false, fetchUser)
	// 	if err != nil {
	// 		return nil, err
	// 	}
	// 	createdByID := appcontext.Principal(ctx).Account().ID
	// 	reviewer := models.NewSystemIntakeGRBReviewer(acct.ID, createdByID)
	// 	reviewer.VotingRole = models.SIGRBReviewerVotingRole(input.VotingRole)
	// 	reviewer.GRBRole = models.SIGRBReviewerRole(input.GrbRole)
	// 	reviewer.SystemIntakeID = input.SystemIntakeID
	// 	err = store.CreateSystemIntakeGRBReviewer(ctx, tx, reviewer)
	// 	if err != nil {
	// 		return nil, err
	// 	}
	//
	// 	// send notification email to reviewer
	// 	if emailClient != nil {
	// 		err = emailClient.SystemIntake.SendCreateGRBReviewerNotification(
	// 			ctx,
	// 			models.EmailNotificationRecipients{
	// 				RegularRecipientEmails: []models.EmailAddress{
	// 					models.EmailAddress(acct.Email),
	// 				},
	// 				ShouldNotifyITGovernance: false,
	// 				ShouldNotifyITInvestment: false,
	// 			},
	// 			intake.ID,
	// 			intake.ProjectName.String,
	// 			intake.Requester,
	// 		)
	// 		if err != nil {
	// 			appcontext.ZLogger(ctx).Error("unable to send create GRB member notification", zap.Error(err))
	// 		}
	// 	}
	//
	// 	return reviewer, err
	// })
}

func UpdateSystemIntakeGRBReviewer(
	ctx context.Context,
	store *storage.Store,
	input *models.UpdateSystemIntakeGRBReviewerInput,
) (*models.SystemIntakeGRBReviewer, error) {
	return sqlutils.WithTransactionRet(ctx, store, func(tx *sqlx.Tx) (*models.SystemIntakeGRBReviewer, error) {
		return store.UpdateSystemIntakeGRBReviewer(ctx, tx, input.ReviewerID, input.VotingRole, input.GrbRole)
	})
}

func DeleteSystemIntakeGRBReviewer(
	ctx context.Context,
	store *storage.Store,
	reviewerID uuid.UUID,
) error {
	return sqlutils.WithTransaction(ctx, store, func(tx *sqlx.Tx) error {
		return store.DeleteSystemIntakeGRBReviewer(ctx, tx, reviewerID)
	})
}

func SystemIntakeGRBReviewers(
	ctx context.Context,
	intakeID uuid.UUID,
) ([]*models.SystemIntakeGRBReviewer, error) {
	return dataloaders.GetSystemIntakeGRBReviewersBySystemIntakeID(ctx, intakeID)
}

func StartGRBReview(
	ctx context.Context,
	store *storage.Store,
	intakeID uuid.UUID,
) (*string, error) {
	return sqlutils.WithTransactionRet(ctx, store, func(tx *sqlx.Tx) (*string, error) {
		intake, err := store.FetchSystemIntakeByIDNP(ctx, tx, intakeID)
		if err != nil {
			return nil, err
		}
		intake.GRBReviewStartedAt = helpers.PointerTo(time.Now())
		intake, err = store.UpdateSystemIntakeNP(ctx, tx, intake)
		if err != nil {
			return nil, err
		}
		// TODO: Send notification emails to all reviewers
		return helpers.PointerTo("started GRB review"), nil
	})
}
