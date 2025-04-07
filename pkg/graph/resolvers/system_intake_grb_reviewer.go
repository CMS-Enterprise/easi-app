package resolvers

import (
	"context"
	"errors"
	"slices"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	"github.com/cms-enterprise/easi-app/pkg/userhelpers"
)

func SystemIntakeGRBDiscussions(
	ctx context.Context,
	intakeID uuid.UUID,
) ([]*models.SystemIntakeGRBReviewDiscussion, error) {
	posts, err := dataloaders.GetSystemIntakeGRBDiscussionPostsBySystemIntakeID(ctx, intakeID)
	if err != nil {
		return nil, err
	}
	return models.CreateGRBDiscussionsFromPosts(posts)
}

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
		euas := lo.Map(input.Reviewers, func(reviewer *models.CreateGRBReviewerInput, _ int) string {
			return reviewer.EuaUserID
		})
		reviewersByEUAMap := lo.KeyBy(input.Reviewers, func(reviewer *models.CreateGRBReviewerInput) string {
			return reviewer.EuaUserID
		})
		accts, err := userhelpers.GetOrCreateUserAccounts(ctx, tx, store, euas, false, fetchUsers)
		if err != nil {
			return nil, err
		}
		createdByID := appcontext.Principal(ctx).Account().ID

		reviewersToCreate := []*models.SystemIntakeGRBReviewer{}
		for _, acct := range accts {
			reviewerInput := reviewersByEUAMap[acct.Username]
			reviewer := models.NewSystemIntakeGRBReviewer(acct.ID, createdByID)
			reviewer.GRBVotingRole = reviewerInput.VotingRole
			reviewer.GRBReviewerRole = reviewerInput.GrbRole
			reviewer.SystemIntakeID = input.SystemIntakeID
			reviewersToCreate = append(reviewersToCreate, reviewer)
		}
		createdReviewers, err := store.CreateSystemIntakeGRBReviewers(ctx, tx, reviewersToCreate)
		if err != nil {
			return nil, err
		}

		// send notification email to reviewer
		// Note: GRB review cannot be set to future date currently
		if emailClient != nil && intake.GRBReviewStartedAt != nil && intake.GRBReviewStartedAt.Before(time.Now()) {
			emails := []models.EmailAddress{}
			for _, reviewer := range accts {
				emails = append(emails, models.EmailAddress(reviewer.Email))
			}
			err = emailClient.SystemIntake.SendCreateGRBReviewerNotification(
				ctx,
				emails,
				intake.ID,
				intake.ProjectName.String,
				intake.Requester,
				intake.Component.String,
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
		return store.UpdateSystemIntakeGRBReviewer(ctx, tx, input)
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

func CastSystemIntakeGRBReviewerVote(ctx context.Context, store *storage.Store, input models.CastSystemIntakeGRBReviewerVoteInput) (*models.SystemIntakeGRBReviewer, error) {
	// first, if "OBJECT" is the vote selection, confirm there is a comment (required for objections)
	if input.Vote == models.SystemIntakeAsyncGRBVotingOptionObjection && (input.VoteComment == nil || len(*input.VoteComment) < 1) {
		return nil, errors.New("vote comment is required with an `Objection` vote")
	}

	// only allow GRB reviewers with the voting role to vote
	userID := appcontext.Principal(ctx).Account().ID
	grbReviewers, err := dataloaders.GetSystemIntakeGRBReviewersBySystemIntakeID(ctx, input.SystemIntakeID)
	if err != nil {
		return nil, err
	}

	canVote := false
	for _, grbReviewer := range grbReviewers {
		if grbReviewer.UserID == userID && grbReviewer.GRBVotingRole == models.SystemIntakeGRBReviewerVotingRoleVoting {
			canVote = true
			break
		}
	}

	if !canVote {
		return nil, errors.New("user is not allowed to vote on this GRB review")
	}

	// then, check if the GRB review is in a state where votes are allowed - do this second to avoid a db round trip
	// if the above condition isn't met
	// get system intake
	systemIntake, err := store.FetchSystemIntakeByID(ctx, input.SystemIntakeID)
	if err != nil {
		return nil, err
	}

	// this can happen if the user making the request is not a reviewer
	if systemIntake == nil {
		return nil, errors.New("no system intake found for this GRB reviewer")
	}

	// confirm we are between GRB start date and GRB Async end date
	// if either are nil, disallow votes
	if systemIntake.GRBReviewStartedAt == nil || systemIntake.GrbReviewAsyncEndDate == nil {
		return nil, errors.New("GRB review times not yet available")
	}

	now := time.Now()
	// if `now` is before the review starts or if `now` is after the review ends, we are not in the voting window
	// TODO: it may be possible to submit votes even after the end date - address if needed
	if now.Before(*systemIntake.GRBReviewStartedAt) || now.After(*systemIntake.GrbReviewAsyncEndDate) {
		return nil, errors.New("GRB review is not currently accepting votes")
	}

	// set vote
	return store.CastSystemIntakeGRBReviewerVote(ctx, input)
}

func SystemIntakeGRBReviewers(
	ctx context.Context,
	intakeID uuid.UUID,
) ([]*models.SystemIntakeGRBReviewer, error) {
	return dataloaders.GetSystemIntakeGRBReviewersBySystemIntakeID(ctx, intakeID)
}

func SystemIntakeCompareGRBReviewers(
	ctx context.Context,
	store *storage.Store,
	intakeID uuid.UUID,
) ([]*models.GRBReviewerComparisonIntake, error) {
	comparisons, err := store.CompareSystemIntakeGRBReviewers(ctx, intakeID)
	if err != nil {
		return nil, err
	}
	// Organize reviewers into a map by intake IDs
	intakeComparisons := map[uuid.UUID]*models.GRBReviewerComparisonIntake{}
	for _, comparison := range comparisons {
		// Create the struct for a reviewer comparison
		reviewer := &models.GRBReviewerComparison{
			ID: comparison.ID,
			UserAccount: &authentication.UserAccount{
				ID:          comparison.UserID,
				Username:    comparison.EuaID,
				CommonName:  comparison.CommonName,
				Locale:      comparison.Locale,
				Email:       comparison.Email,
				GivenName:   comparison.GivenName,
				FamilyName:  comparison.FamilyName,
				ZoneInfo:    comparison.ZoneInfo,
				HasLoggedIn: comparison.HasLoggedIn,
			},
			EuaUserID:         comparison.EuaID,
			VotingRole:        models.SystemIntakeGRBReviewerVotingRole(comparison.GRBVotingRole),
			GrbRole:           models.SystemIntakeGRBReviewerRole(comparison.GRBReviewerRole),
			IsCurrentReviewer: comparison.IsCurrentReviewer,
		}
		// Add the reviewer to the slice if an entry exists
		if _, ok := intakeComparisons[comparison.SystemIntakeID]; ok {
			intakeComparisons[comparison.SystemIntakeID].Reviewers = append(
				intakeComparisons[comparison.SystemIntakeID].Reviewers,
				reviewer,
			)
		} else {
			// Create the entry if this system intake ID isn't in the map
			intakeComparisons[comparison.SystemIntakeID] = &models.GRBReviewerComparisonIntake{
				ID:              comparison.SystemIntakeID,
				RequestName:     comparison.RequestName,
				Reviewers:       []*models.GRBReviewerComparison{reviewer},
				IntakeCreatedAt: comparison.IntakeCreatedAt,
			}
		}
	}

	var response []*models.GRBReviewerComparisonIntake
	for _, intakeComparison := range intakeComparisons {
		response = append(response, intakeComparison)
	}
	slices.SortFunc(response, func(i *models.GRBReviewerComparisonIntake, j *models.GRBReviewerComparisonIntake) int {
		return j.IntakeCreatedAt.Compare(*i.IntakeCreatedAt)
	})
	return response, nil
}

func StartGRBReview(
	ctx context.Context,
	store *storage.Store,
	emailClient *email.Client,
	intakeID uuid.UUID,
) (*string, error) {
	return sqlutils.WithTransactionRet(ctx, store, func(tx *sqlx.Tx) (*string, error) {
		intake, err := store.FetchSystemIntakeByIDNP(ctx, tx, intakeID)
		if err != nil {
			return nil, err
		}

		if intake.GRBReviewStartedAt != nil {
			return nil, errors.New("review already started")
		}

		intake.GRBReviewStartedAt = helpers.PointerTo(time.Now())
		intake.GrbReviewAsyncManualEndDate = nil
		_, err = store.UpdateSystemIntakeNP(ctx, tx, intake)
		if err != nil {
			return nil, err
		}

		reviewers, err := dataloaders.GetSystemIntakeGRBReviewersBySystemIntakeID(ctx, intakeID)
		if err != nil {
			return nil, err
		}

		userIDs := lo.Map(reviewers, func(reviewer *models.SystemIntakeGRBReviewer, _ int) uuid.UUID {
			return reviewer.UserID
		})

		userAccounts, err := store.UserAccountsByIDs(ctx, userIDs)
		if err != nil {
			return nil, err
		}

		emails := lo.Map(userAccounts, func(userAccount *authentication.UserAccount, _ int) models.EmailAddress {
			return models.EmailAddress(userAccount.Email)
		})

		if emailClient != nil {
			err = emailClient.SystemIntake.SendCreateGRBReviewerNotification(
				ctx,
				emails,
				intake.ID,
				intake.ProjectName.String,
				intake.Requester,
				intake.Component.String,
			)
			if err != nil {
				appcontext.ZLogger(ctx).Error("unable to send create GRB member notification", zap.Error(err))
			}
		}
		return helpers.PointerTo("started GRB review"), nil
	})
}

func GetPrincipalAsGRBReviewerBySystemIntakeID(ctx context.Context, systemIntakeID uuid.UUID) (*models.SystemIntakeGRBReviewer, error) {
	principalUserAcctID := appcontext.Principal(ctx).Account().ID
	grbReviewers, err := dataloaders.GetSystemIntakeGRBReviewersBySystemIntakeID(ctx, systemIntakeID)
	if err != nil {
		return nil, err
	}
	for _, reviewer := range grbReviewers {
		if reviewer != nil && reviewer.UserID == principalUserAcctID {
			return reviewer, nil
		}
	}
	return nil, nil
}
