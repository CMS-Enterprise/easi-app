package resolvers

import (
	"slices"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/cmsgov/easi-app/pkg/local"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/sqlutils"
	"github.com/cmsgov/easi-app/pkg/userhelpers"
)

func (s *ResolverSuite) TestSystemIntakeGRBReviewer() {
	ctx := s.testConfigs.Context
	store := s.testConfigs.Store
	okta := local.NewOktaAPIClient()

	s.Run("create GRB Reviewer and add to intake", func() {
		reviewerEUA := "ABCD"
		votingRole := models.SystemIntakeGRBReviewerVotingRoleVoting
		grbRole := models.SystemIntakeGRBReviewerRoleAca3021Rep

		intake := s.createNewIntake()
		userAcct := s.getOrCreateUserAcct(reviewerEUA)

		reviewer, err := CreateSystemIntakeGRBReviewer(
			ctx,
			store,
			userhelpers.GetUserInfoAccountInfoWrapperFunc(okta.FetchUserInfo),
			&models.CreateSystemIntakeGRBReviewerInput{
				SystemIntakeID: intake.ID,
				EuaUserID:      reviewerEUA,
				VotingRole:     votingRole,
				GrbRole:        grbRole,
			},
		)
		s.NoError(err)
		s.Equal(userAcct.ID, reviewer.UserID)
		s.Equal(string(votingRole), string(reviewer.VotingRole))
		s.Equal(string(grbRole), string(reviewer.GRBRole))
		s.Equal(intake.ID, reviewer.SystemIntakeID)
	})

	s.Run("fetch GRB reviewers", func() {
		intake, reviewers := s.createIntakeAndAddReviewers(
			reviewerToAdd{
				euaUserID:  "ABCD",
				votingRole: models.SIGRBRVRVoting,
				grbRole:    models.SIGRBRRACA3021Rep,
			},
			reviewerToAdd{
				euaUserID:  "TEST",
				votingRole: models.SIGRBRVRVoting,
				grbRole:    models.SIGRBRRACA3021Rep,
			},
			reviewerToAdd{
				euaUserID:  "A11Y",
				votingRole: models.SIGRBRVRVoting,
				grbRole:    models.SIGRBRRACA3021Rep,
			},
		)
		s.Len(reviewers, 3)
		fetchedReviewers, err := SystemIntakeGRBReviewers(ctx, intake.ID)
		s.NoError(err)
		s.Len(fetchedReviewers, 3)
		for _, eua := range []string{"ABCD", "TEST", "A11Y"} {
			s.True(slices.ContainsFunc(fetchedReviewers, func(reviewer *models.SystemIntakeGRBReviewer) bool {
				userAcct := s.getOrCreateUserAcct(eua)
				return reviewer.UserID == userAcct.ID
			}))
		}

	})

	s.Run("update GRB reviewer voting and GRB role", func() {
		reviewerEUA := "ABCD"
		originalVotingRole := models.SIGRBRVRAlternate
		originalGRBRole := models.SIGRBRRACA3021Rep
		newVotingRole := models.SIGRBRVRVoting
		newGRBRole := models.SIGRBRRCMCSRep

		userAcct := s.getOrCreateUserAcct(reviewerEUA)
		intake, reviewer := s.createIntakeAndAddReviewer(reviewerToAdd{
			euaUserID:  reviewerEUA,
			votingRole: originalVotingRole,
			grbRole:    originalGRBRole,
		})

		updatedReviewer, err := UpdateSystemIntakeGRBReviewer(
			ctx,
			store,
			&models.UpdateSystemIntakeGRBReviewerInput{
				ReviewerID: reviewer.ID,
				VotingRole: models.SystemIntakeGRBReviewerVotingRole(newVotingRole),
				GrbRole:    models.SystemIntakeGRBReviewerRole(newGRBRole),
			},
		)
		s.NoError(err)
		s.Equal(userAcct.ID, updatedReviewer.UserID)
		s.Equal(reviewer.ID, updatedReviewer.ID)
		s.Equal(reviewer.UserID, updatedReviewer.UserID)
		s.Equal(intake.ID, updatedReviewer.SystemIntakeID)
		s.Equal(newVotingRole, updatedReviewer.VotingRole)
		s.Equal(newGRBRole, updatedReviewer.GRBRole)
	})

	s.Run("delete GRB reviewer", func() {
		reviewerEUA := "ABCD"
		originalVotingRole := models.SIGRBRVRAlternate
		originalGRBRole := models.SIGRBRRACA3021Rep

		userAcct := s.getOrCreateUserAcct(reviewerEUA)
		intake, reviewer := s.createIntakeAndAddReviewer(reviewerToAdd{
			euaUserID:  reviewerEUA,
			votingRole: originalVotingRole,
			grbRole:    originalGRBRole,
		})
		reviewers, err := store.SystemIntakeGRBReviewersBySystemIntakeIDs(ctx, []uuid.UUID{intake.ID})
		s.NoError(err)
		s.Len(reviewers, 1)
		s.Equal(userAcct.ID, reviewers[0].UserID)

		err = DeleteSystemIntakeGRBReviewer(
			ctx,
			store,
			reviewer.ID,
		)
		s.NoError(err)

		updatedReviewers, err := store.SystemIntakeGRBReviewersBySystemIntakeIDs(ctx, []uuid.UUID{intake.ID})
		s.NoError(err)
		s.Len(updatedReviewers, 0)
	})
}

type reviewerToAdd struct {
	euaUserID  string
	votingRole models.SIGRBReviewerVotingRole
	grbRole    models.SIGRBReviewerRole
}

func (s *ResolverSuite) createIntakeAndAddReviewer(reviewer reviewerToAdd) (*models.SystemIntake, *models.SystemIntakeGRBReviewer) {
	intake, reviewers := s.createIntakeAndAddReviewers(reviewer)
	return intake, reviewers[0]
}

func (s *ResolverSuite) createIntakeAndAddReviewers(reviewers ...reviewerToAdd) (*models.SystemIntake, []*models.SystemIntakeGRBReviewer) {
	ctx := s.testConfigs.Context
	store := s.testConfigs.Store
	okta := local.NewOktaAPIClient()

	intake := s.createNewIntake()
	savedReviewers, err := sqlutils.WithTransactionRet(ctx, store, func(tx *sqlx.Tx) ([]*models.SystemIntakeGRBReviewer, error) {
		var createdReviewers []*models.SystemIntakeGRBReviewer
		for _, reviewer := range reviewers {
			user, err := userhelpers.GetOrCreateUserAccount(ctx, tx, store, reviewer.euaUserID, false, userhelpers.GetUserInfoAccountInfoWrapperFunc(okta.FetchUserInfo))
			if err != nil {
				return nil, err
			}
			createdReviewer := models.NewSystemIntakeGRBReviewer(user.ID, s.testConfigs.Principal.UserAccount.ID)
			createdReviewer.VotingRole = reviewer.votingRole
			createdReviewer.GRBRole = reviewer.grbRole
			createdReviewer.SystemIntakeID = intake.ID
			err = store.CreateSystemIntakeGRBReviewer(
				ctx,
				tx,
				intake.ID,
				createdReviewer,
			)
			if err != nil {
				return nil, err
			}
			createdReviewers = append(createdReviewers, createdReviewer)
		}
		return createdReviewers, nil
	})
	s.NoError(err)
	return intake, savedReviewers
}
