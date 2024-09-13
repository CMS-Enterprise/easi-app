package resolvers

import (
	"fmt"
	"slices"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/easi-app/pkg/local"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
	"github.com/cms-enterprise/easi-app/pkg/userhelpers"
)

func (s *ResolverSuite) TestSystemIntakeGRBReviewer() {
	ctx := s.testConfigs.Context
	store := s.testConfigs.Store
	okta := local.NewOktaAPIClient()

	s.Run("create GRB Reviewer and add to intake", func() {
		reviewerEUA1 := "ABCD"
		votingRole1 := models.SystemIntakeGRBReviewerVotingRoleVoting
		grbRole1 := models.SystemIntakeGRBReviewerRoleAca3021Rep
		reviewerEUA2 := "A11Y"
		votingRole2 := models.SystemIntakeGRBReviewerVotingRoleAlternate
		grbRole2 := models.SystemIntakeGRBReviewerRoleFedAdminBdgChair

		intake := s.createNewIntake()
		userAccts := s.getOrCreateUserAccts([]string{reviewerEUA1, reviewerEUA2})

		payload, err := CreateSystemIntakeGRBReviewers(
			ctx,
			store,
			s.testConfigs.EmailClient,
			userhelpers.GetUserInfoAccountInfosWrapperFunc(okta.FetchUserInfos),
			&models.CreateSystemIntakeGRBReviewersInput{
				SystemIntakeID: intake.ID,
				Reviewers: []*models.CreateGRBReviewerInput{
					{
						EuaUserID:  reviewerEUA1,
						VotingRole: votingRole1,
						GrbRole:    grbRole1,
					},
					{
						EuaUserID:  reviewerEUA2,
						VotingRole: votingRole2,
						GrbRole:    grbRole2,
					},
				},
			},
		)
		reviewers := payload.Reviewers
		s.NoError(err)
		s.Equal(userAccts[0].ID, reviewers[0].UserID)
		s.Equal(string(votingRole1), string(reviewers[0].VotingRole))
		s.Equal(string(grbRole1), string(reviewers[0].GRBRole))
		s.Equal(intake.ID, reviewers[0].SystemIntakeID)
		s.Equal(userAccts[1].ID, reviewers[1].UserID)
		s.Equal(string(votingRole2), string(reviewers[1].VotingRole))
		s.Equal(string(grbRole2), string(reviewers[1].GRBRole))
		s.Equal(intake.ID, reviewers[1].SystemIntakeID)
		s.Contains(s.testConfigs.Sender.toAddresses, models.EmailAddress(userAccts[0].Email))
		s.Contains(s.testConfigs.Sender.toAddresses, models.EmailAddress(userAccts[1].Email))
		s.Contains(s.testConfigs.Sender.body, fmt.Sprintf("Requester: %s", intake.Requester))
		s.Contains(s.testConfigs.Sender.body, fmt.Sprintf("Project name: %s", intake.ProjectName.String))
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
		fetchedReviewers, err := SystemIntakeGRBReviewers(s.ctxWithNewDataloaders(), intake.ID)
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
			_, err = store.CreateSystemIntakeGRBReviewer(
				ctx,
				tx,
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
