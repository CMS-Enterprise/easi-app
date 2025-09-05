package resolvers

import (
	"context"
	"errors"
	"fmt"
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
	boardType models.SystemIntakeGRBDiscussionBoardType,
) ([]*models.SystemIntakeGRBReviewDiscussion, error) {
	posts, err := dataloaders.GetSystemIntakeGRBDiscussionPostsBySystemIntakeID(ctx, intakeID)
	if err != nil {
		return nil, err
	}
	return models.CreateGRBDiscussionsFromPosts(posts, boardType)
}

// CreateSystemIntakeGRBReviewers creates GRB Reviewers for a System Intake
func CreateSystemIntakeGRBReviewers(ctx context.Context, store *storage.Store, emailClient *email.Client, fetchUsers userhelpers.GetAccountInfosFunc, input *models.CreateSystemIntakeGRBReviewersInput) (*models.CreateSystemIntakeGRBReviewersPayload, error) {
	return sqlutils.WithTransactionRet(ctx, store, func(tx *sqlx.Tx) (*models.CreateSystemIntakeGRBReviewersPayload, error) {
		// Fetch intake by ID
		intake, err := storage.FetchSystemIntakeByIDNP(ctx, tx, input.SystemIntakeID)
		if err != nil {
			return nil, err
		}
		if intake == nil {
			return nil, errors.New("system intake not found")
		}

		isGRBReviewComplete, err := isGRBReviewCompleted(ctx, intake)
		if err != nil {
			return nil, err
		}

		if isGRBReviewComplete {
			return nil, errors.New("cannot create GRB reviewers for completed GRB review")
		}

		euas := lo.Map(input.Reviewers, func(reviewer *models.CreateGRBReviewerInput, _ int) string {
			return reviewer.EuaUserID
		})
		reviewersByEUAMap := lo.KeyBy(input.Reviewers, func(reviewer *models.CreateGRBReviewerInput) string {
			return reviewer.EuaUserID
		})
		accts, err := userhelpers.GetOrCreateUserAccounts(ctx, tx, euas, false, fetchUsers)
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

		if emailClient == nil || intake.GRBReviewStartedAt == nil || !intake.GRBReviewStartedAt.Before(time.Now()) {
			return &models.CreateSystemIntakeGRBReviewersPayload{
				Reviewers: createdReviewers,
			}, nil
		}

		// send notification email to reviewer
		// Note: GRB review cannot be set to future date currently
		if intake.GrbReviewType == models.SystemIntakeGRBReviewTypeStandard {
			var emails []models.EmailAddress
			for _, reviewer := range accts {
				emails = append(emails, models.EmailAddress(reviewer.Email))
			}

			if err := emailClient.SystemIntake.SendCreateGRBReviewerNotification(
				ctx,
				emails,
				intake.ID,
				intake.ProjectName.String,
				intake.Requester,
				intake.Component.String,
			); err != nil {
				appcontext.ZLogger(ctx).Error("unable to send create GRB member notification", zap.Error(err))
			}
		} else {
			if intake.GrbReviewAsyncEndDate != nil {
				for _, reviewer := range accts {
					if err := emailClient.SystemIntake.SendGRBReviewerInvitedToVoteEmail(
						ctx,
						email.SendGRBReviewerInvitedToVoteInput{
							Recipient:          models.EmailAddress(reviewer.Email),
							StartDate:          *intake.GRBReviewStartedAt,
							EndDate:            *intake.GrbReviewAsyncEndDate,
							SystemIntakeID:     intake.ID,
							ProjectName:        intake.ProjectName.String,
							RequesterName:      intake.Requester,
							RequesterComponent: intake.Component.String,
						},
					); err != nil {
						appcontext.ZLogger(ctx).Error("problem sending invite to vote email to GRB reviewer", zap.Error(err), zap.String("user.email", reviewer.Email))
						// don't exit, we can send out the rest
						continue
					}
				}
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
	intake, err := store.GetSystemIntakeByGRBReviewerID(ctx, input.ReviewerID)
	if err != nil {
		return nil, err
	}

	isGRBReviewComplete, err := isGRBReviewCompleted(ctx, intake)
	if err != nil {
		return nil, err
	}

	if isGRBReviewComplete {
		return nil, errors.New("cannot update GRB reviewer for completed GRB review")
	}

	return sqlutils.WithTransactionRet(ctx, store, func(tx *sqlx.Tx) (*models.SystemIntakeGRBReviewer, error) {
		return store.UpdateSystemIntakeGRBReviewer(ctx, tx, input)
	})
}

func DeleteSystemIntakeGRBReviewer(
	ctx context.Context,
	store *storage.Store,
	reviewerID uuid.UUID,
) error {
	intake, err := store.GetSystemIntakeByGRBReviewerID(ctx, reviewerID)
	if err != nil {
		return err
	}

	isGRBReviewComplete, err := isGRBReviewCompleted(ctx, intake)
	if err != nil {
		return err
	}

	if isGRBReviewComplete {
		return errors.New("cannot delete GRB reviewer for completed GRB review")
	}

	return sqlutils.WithTransaction(ctx, store, func(tx *sqlx.Tx) error {
		return store.DeleteSystemIntakeGRBReviewer(ctx, tx, reviewerID)
	})
}

func CastSystemIntakeGRBReviewerVote(ctx context.Context, store *storage.Store, emailClient *email.Client, input models.CastSystemIntakeGRBReviewerVoteInput) (*models.SystemIntakeGRBReviewer, error) {
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

	var (
		existingReviewer *models.SystemIntakeGRBReviewer
		canVote          = false
	)
	for _, grbReviewer := range grbReviewers {
		if grbReviewer.UserID == userID && grbReviewer.GRBVotingRole == models.SystemIntakeGRBReviewerVotingRoleVoting {
			canVote = true
			existingReviewer = grbReviewer
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

	isGRBReviewComplete, err := isGRBReviewCompleted(ctx, systemIntake)
	if err != nil {
		return nil, err
	}

	if isGRBReviewComplete {
		return nil, errors.New("GRB review is not currently accepting votes")
	}

	// set vote
	reviewer, err := store.CastSystemIntakeGRBReviewerVote(ctx, input)
	if err != nil {
		return nil, err
	}

	// send email here
	if emailClient != nil && systemIntake.GRBReviewStartedAt != nil && systemIntake.GrbReviewAsyncEndDate != nil && reviewer.Vote != nil {
		// get email
		userAccount, err := store.UserAccountsByIDs(ctx, []uuid.UUID{reviewer.UserID})
		if err != nil {
			appcontext.ZLogger(ctx).Error("problem getting user account when sending vote submitted email", zap.Error(err), zap.String("intake.id", systemIntake.ID.String()), zap.String("user.id", reviewer.UserID.String()))

			// don't err here
			return reviewer, nil
		}

		if len(userAccount) < 1 {
			appcontext.ZLogger(ctx).Error("no user accounts found when sending vote submitted email", zap.String("intake.id", systemIntake.ID.String()), zap.String("user.id", reviewer.UserID.String()))

			// don't err here
			return reviewer, nil
		}

		user := userAccount[0]

		// send email to user making the vote
		if err := emailClient.SystemIntake.SendGRBReviewVoteSubmitted(ctx, email.SendGRBReviewVoteSubmittedInput{
			Recipient:          models.EmailAddress(user.Email),
			SystemIntakeID:     systemIntake.ID,
			ProjectTitle:       systemIntake.ProjectName.String,
			RequesterName:      systemIntake.Requester,
			RequesterComponent: systemIntake.Component.String,
			StartDate:          *systemIntake.GRBReviewStartedAt,
			EndDate:            *systemIntake.GrbReviewAsyncEndDate,
			Vote:               *reviewer.Vote,
		}); err != nil {
			appcontext.ZLogger(ctx).Error("problem sending vote submitted email", zap.Error(err), zap.String("intake.id", systemIntake.ID.String()), zap.String("user.id", reviewer.UserID.String()))

			// don't err here
		}

		votingInformation := models.GRBVotingInformation{
			SystemIntake: systemIntake,
			GRBReviewers: grbReviewers,
		}

		// check existing reviewer to see if this is the initial vote or a changed vote
		// send email to admin
		if existingReviewer.Vote != nil && *existingReviewer.Vote != input.Vote {
			// this is a changed vote
			if err := emailClient.SystemIntake.SendGRBReviewVoteChangedAdmin(ctx, email.SendGRBReviewVoteChangedAdminInput{
				SystemIntakeID:     systemIntake.ID,
				GRBMemberName:      fmt.Sprintf("%[1]s %[2]s", user.GivenName, user.FamilyName),
				ProjectTitle:       systemIntake.ProjectName.String,
				RequesterName:      systemIntake.Requester,
				RequesterComponent: systemIntake.Component.String,
				StartDate:          *systemIntake.GRBReviewStartedAt,
				EndDate:            *systemIntake.GrbReviewAsyncEndDate,
				Vote:               *reviewer.Vote,
				AdditionalComments: reviewer.VoteComment.String,
				NoObjectionVotes:   votingInformation.NumberOfNoObjection(),
				ObjectionVotes:     votingInformation.NumberOfObjection(),
				NotYetVoted:        votingInformation.NumberOfNotVoted(),
			}); err != nil {
				appcontext.ZLogger(ctx).Error("problem sending grb review vote changed admin email", zap.Error(err), zap.String("intake.id", systemIntake.ID.String()), zap.String("user.id", reviewer.UserID.String()))

				// don't err here
			}
		} else {
			// this is an initial vote
			if err := emailClient.SystemIntake.SendGRBReviewVoteSubmittedAdmin(ctx, email.SendGRBReviewVoteSubmittedAdminInput{
				SystemIntakeID:     systemIntake.ID,
				GRBMemberName:      fmt.Sprintf("%[1]s %[2]s", user.GivenName, user.FamilyName),
				ProjectTitle:       systemIntake.ProjectName.String,
				RequesterName:      systemIntake.Requester,
				RequesterComponent: systemIntake.Component.String,
				StartDate:          *systemIntake.GRBReviewStartedAt,
				EndDate:            *systemIntake.GrbReviewAsyncEndDate,
				Vote:               *reviewer.Vote,
				AdditionalComments: reviewer.VoteComment.String,
				NoObjectionVotes:   votingInformation.NumberOfNoObjection(),
				ObjectionVotes:     votingInformation.NumberOfObjection(),
				NotYetVoted:        votingInformation.NumberOfNotVoted(),
			}); err != nil {
				appcontext.ZLogger(ctx).Error("problem sending grb review vote submitted admin email", zap.Error(err), zap.String("intake.id", systemIntake.ID.String()), zap.String("user.id", reviewer.UserID.String()))

				// don't err here
			}
		}

	}

	return reviewer, nil
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
		intake, err := storage.FetchSystemIntakeByIDNP(ctx, tx, intakeID)
		if err != nil {
			return nil, err
		}

		if intake.GRBReviewStartedAt != nil {
			return nil, errors.New("review already started")
		}

		intake.GRBReviewStartedAt = helpers.PointerTo(time.Now())
		intake.GrbReviewAsyncManualEndDate = nil
		if _, err := store.UpdateSystemIntakeNP(ctx, tx, intake); err != nil {
			return nil, err
		}

		if emailClient != nil {
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

			if err := emailClient.SystemIntake.SendCreateGRBReviewerNotification(
				ctx,
				emails,
				intake.ID,
				intake.ProjectName.String,
				intake.Requester,
				intake.Component.String,
			); err != nil {
				appcontext.ZLogger(ctx).Error("unable to send create GRB member notification", zap.Error(err))
			}
		}
		return helpers.PointerTo("started GRB review"), nil
	})
}

func getPrincipalAsGRBReviewerBySystemIntakeID(ctx context.Context, systemIntakeID uuid.UUID) (*models.SystemIntakeGRBReviewer, error) {
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

// SendSystemIntakeGRBReviewerReminder sends out individual emails to GRB reviewers who have not yet voted (only send to those with voting role)
func SendSystemIntakeGRBReviewerReminder(ctx context.Context, store *storage.Store, emailClient *email.Client, systemIntakeID uuid.UUID) (*models.SendSystemIntakeGRBReviewReminderPayload, error) {
	// first, confirm a reminder wasn't sent in last 24 hours
	systemIntake, err := store.FetchSystemIntakeByID(ctx, systemIntakeID)
	if err != nil {
		return nil, fmt.Errorf("problem getting system intake when attempting to send reminder")
	}

	if err := validateCanSendReminder(systemIntake); err != nil {
		return nil, fmt.Errorf("invalid reminder request: %w", err)
	}

	// find GRB reviewers who haven't voted yet
	grbReviewers, err := store.SystemIntakeGRBReviewersBySystemIntakeIDs(ctx, []uuid.UUID{systemIntakeID})
	if err != nil {
		return nil, fmt.Errorf("problem getting GRB reviewers when attempting to send reminder: %w", err)
	}

	// find reviewers who have a voting role
	var votingReviewerIDs []uuid.UUID
	for _, reviewer := range grbReviewers {
		if reviewer == nil {
			continue
		}

		// skip if user has already voted
		if reviewer.Vote != nil {
			continue
		}

		// only send to those with voting roles
		if reviewer.GRBVotingRole == models.SystemIntakeGRBReviewerVotingRoleVoting {
			votingReviewerIDs = append(votingReviewerIDs, reviewer.UserID)
		}
	}

	if len(votingReviewerIDs) < 1 {
		return nil, errors.New("no reviewers to remind")
	}

	// find the emails associated with these users
	userAccounts, err := store.UserAccountsByIDs(ctx, votingReviewerIDs)
	if err != nil {
		return nil, fmt.Errorf("problem getting user accounts when attempting to send reminder: %w", err)
	}

	if len(userAccounts) < 1 {
		return nil, errors.New("no user accounts found when attempting to when attempting to send reminder")
	}

	// send out emails
	for _, userAccount := range userAccounts {
		if userAccount == nil {
			continue
		}

		// send each email individually
		if err := emailClient.SystemIntake.SendSystemIntakeGRBReviewerReminder(ctx, email.SendSystemIntakeGRBReviewerReminderInput{
			Recipient:          models.EmailAddress(userAccount.Email),
			SystemIntakeID:     systemIntakeID,
			RequestName:        systemIntake.ProjectName.String,
			RequesterName:      systemIntake.Requester,
			RequesterComponent: systemIntake.Component.String,
			StartDate:          *systemIntake.GRBReviewStartedAt,
			EndDate:            *systemIntake.GrbReviewAsyncEndDate,
		}); err != nil {
			appcontext.ZLogger(ctx).Error("failed to send reminder email to user", zap.String("user.email", userAccount.Email))
			// don't exit here, we can send out the rest
			continue
		}
	}

	// update system intake for last reminder time
	sentTime := time.Now()
	if err := storage.SetSystemIntakeGRBReviewerReminderSent(ctx, store, systemIntakeID, sentTime); err != nil {
		return nil, fmt.Errorf("problem setting last reminder sent timestamp when sending reminder: %w", err)
	}

	return &models.SendSystemIntakeGRBReviewReminderPayload{
		TimeSent: sentTime,
	}, nil
}

func validateCanSendReminder(systemIntake *models.SystemIntake) error {
	if systemIntake == nil {
		return errors.New("unexpected nil system intake when attempting to send reminder")
	}

	if systemIntake.GRBReviewStartedAt == nil {
		return errors.New("grb review not yet started when attempting to send reminder")
	}

	if systemIntake.GrbReviewAsyncEndDate == nil {
		return errors.New("grb end date missing when attempting to send reminder")
	}

	if systemIntake.GrbReviewAsyncManualEndDate != nil {
		return errors.New("grb review found to be manually ended when attempting to send reminder")
	}

	return nil
}
