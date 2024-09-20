package resolvers

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	"github.com/cms-enterprise/easi-app/pkg/userhelpers"
)

// CreateSystemIntakeGRBReviewers creates GRB Reviewers for a System Intake
func CreateSystemIntakeGRBReviewers(
	ctx context.Context,
	store *storage.Store,
	emailClient *email.Client,
	fetchUsers userhelpers.GetAccountInfosFunc,
	input *models.CreateSystemIntakeGRBReviewersInput,
) (*models.CreateSystemIntakeGRBReviewersPayload, error) {
	return sqlutils.WithTransactionRet(ctx, store, func(tx *sqlx.Tx) (*models.CreateSystemIntakeGRBReviewersPayload, error) {
		// Fetch intake by ID
		intake, err := store.FetchSystemIntakeByIDNP(ctx, tx, input.SystemIntakeID)
		if err != nil {
			return nil, err
		}
		if intake == nil {
			return nil, errors.New("system intake not found")
		}
		euas := []string{}
		reviewersByEUAMap := map[string]*models.CreateGRBReviewerInput{}
		for _, reviewer := range input.Reviewers {
			euas = append(euas, reviewer.EuaUserID)
			reviewersByEUAMap[reviewer.EuaUserID] = reviewer
		}
		accts, err := userhelpers.GetOrCreateUserAccounts(ctx, tx, store, euas, false, fetchUsers)
		if err != nil {
			return nil, err
		}
		createdByID := appcontext.Principal(ctx).Account().ID

		reviewersToCreate := []*models.SystemIntakeGRBReviewer{}
		for _, acct := range accts {
			reviewerInput := reviewersByEUAMap[acct.Username]
			reviewer := models.NewSystemIntakeGRBReviewer(acct.ID, createdByID)
			reviewer.VotingRole = models.SIGRBReviewerVotingRole(reviewerInput.VotingRole)
			reviewer.GRBRole = models.SIGRBReviewerRole(reviewerInput.GrbRole)
			reviewer.SystemIntakeID = input.SystemIntakeID
			reviewersToCreate = append(reviewersToCreate, reviewer)
		}
		createdReviewers, err := store.CreateSystemIntakeGRBReviewers(ctx, tx, reviewersToCreate)
		if err != nil {
			return nil, err
		}

		// send notification email to reviewer
		if emailClient != nil {
			emails := []models.EmailAddress{}
			for _, reviewer := range accts {
				emails = append(emails, models.EmailAddress(reviewer.Email))
			}
			err = emailClient.SystemIntake.SendCreateGRBReviewerNotification(
				ctx,
				models.EmailNotificationRecipients{
					RegularRecipientEmails:   emails,
					ShouldNotifyITGovernance: false,
					ShouldNotifyITInvestment: false,
				},
				intake.ID,
				intake.ProjectName.String,
				intake.Requester,
			)
			if err != nil {
				appcontext.ZLogger(ctx).Error("unable to send create GRB member notification", zap.Error(err))
			}
		}

		return &models.CreateSystemIntakeGRBReviewersPayload{
			Reviewers: createdReviewers,
		}, nil
	})
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
		_, err = store.UpdateSystemIntakeNP(ctx, tx, intake)
		if err != nil {
			return nil, err
		}
		// TODO: Send notification emails to all reviewers
		return helpers.PointerTo("started GRB review"), nil
	})
}
