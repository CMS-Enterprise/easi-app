package resolvers

import (
	"fmt"
	"slices"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/local"
	"github.com/cms-enterprise/easi-app/pkg/models"
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
			&models.CreateGRBReviewerInput{
				EuaUserID:  "ABCD",
				VotingRole: models.SystemIntakeGRBReviewerVotingRoleVoting,
				GrbRole:    models.SystemIntakeGRBReviewerRoleAca3021Rep,
			},
			&models.CreateGRBReviewerInput{
				EuaUserID:  "TEST",
				VotingRole: models.SystemIntakeGRBReviewerVotingRoleVoting,
				GrbRole:    models.SystemIntakeGRBReviewerRoleAca3021Rep,
			},
			&models.CreateGRBReviewerInput{
				EuaUserID:  "A11Y",
				VotingRole: models.SystemIntakeGRBReviewerVotingRoleVoting,
				GrbRole:    models.SystemIntakeGRBReviewerRoleAca3021Rep,
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
		originalVotingRole := models.SystemIntakeGRBReviewerVotingRoleAlternate
		originalGRBRole := models.SystemIntakeGRBReviewerRoleAca3021Rep
		newVotingRole := models.SIGRBRVRVoting
		newGRBRole := models.SIGRBRRCMCSRep

		userAcct := s.getOrCreateUserAcct(reviewerEUA)
		intake, reviewer := s.createIntakeAndAddReviewer(&models.CreateGRBReviewerInput{
			EuaUserID:  reviewerEUA,
			VotingRole: originalVotingRole,
			GrbRole:    originalGRBRole,
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
		originalVotingRole := models.SystemIntakeGRBReviewerVotingRoleVoting
		originalGRBRole := models.SystemIntakeGRBReviewerRoleAca3021Rep

		userAcct := s.getOrCreateUserAcct(reviewerEUA)
		intake, reviewer := s.createIntakeAndAddReviewer(&models.CreateGRBReviewerInput{
			EuaUserID:  reviewerEUA,
			VotingRole: originalVotingRole,
			GrbRole:    originalGRBRole,
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

func (s *ResolverSuite) TestSystemIntakeGRBReviewerComparison() {
	ctx := s.testConfigs.Context
	store := s.testConfigs.Store

	s.Run("compare GRB reviewers", func() {
		commonReviewerEua := "ABCD"
		uncommonReviewerEua := "A11Y"

		// create an intake without reviewers, should not get returned in comparisons
		s.createNewIntake()

		// intake to compare reviewers for
		intake1, reviewers1 := s.createIntakeAndAddReviewers(
			&models.CreateGRBReviewerInput{
				EuaUserID:  commonReviewerEua,
				VotingRole: models.SystemIntakeGRBReviewerVotingRoleVoting,
				GrbRole:    models.SystemIntakeGRBReviewerRoleFedAdminBdgChair,
			},
		)
		s.Len(reviewers1, 1)

		// intake to compare against, should get returned in comparison
		intake2, reviewers2 := s.createIntakeAndAddReviewers(
			&models.CreateGRBReviewerInput{
				EuaUserID:  commonReviewerEua,
				VotingRole: models.SystemIntakeGRBReviewerVotingRoleVoting,
				GrbRole:    models.SystemIntakeGRBReviewerRoleFedAdminBdgChair,
			},
			&models.CreateGRBReviewerInput{
				EuaUserID:  uncommonReviewerEua,
				VotingRole: models.SystemIntakeGRBReviewerVotingRoleVoting,
				GrbRole:    models.SystemIntakeGRBReviewerRoleFedAdminBdgChair,
			},
		)
		s.Len(reviewers2, 2)

		comparisons, err := SystemIntakeCompareGRBReviewers(ctx, store, intake1.ID)
		s.NoError(err)
		// returned comparison should be other intake
		s.Len(comparisons, 1)
		s.Equal(intake2.ID.String(), comparisons[0].ID.String())
		// should contain 2 reviewers, one of which is a current reviewer
		s.Len(comparisons[0].Reviewers, 2)
		for _, reviewer := range comparisons[0].Reviewers {
			if reviewer.EuaUserID == commonReviewerEua {
				s.True(reviewer.IsCurrentReviewer)
				continue
			}
			s.False(reviewer.IsCurrentReviewer)
		}

	})
}

func (s *ResolverSuite) createIntakeAndAddReviewer(reviewer *models.CreateGRBReviewerInput) (*models.SystemIntake, *models.SystemIntakeGRBReviewer) {
	intake, reviewers := s.createIntakeAndAddReviewers(reviewer)
	return intake, reviewers[0]
}

func (s *ResolverSuite) createIntakeAndAddReviewers(reviewers ...*models.CreateGRBReviewerInput) (*models.SystemIntake, []*models.SystemIntakeGRBReviewer) {
	ctx := s.testConfigs.Context
	store := s.testConfigs.Store
	okta := local.NewOktaAPIClient()

	intake := s.createNewIntake()
	createPayload, err := CreateSystemIntakeGRBReviewers(
		ctx,
		store,
		nil,
		userhelpers.GetUserInfoAccountInfosWrapperFunc(okta.FetchUserInfos),
		&models.CreateSystemIntakeGRBReviewersInput{
			SystemIntakeID: intake.ID,
			Reviewers:      reviewers,
		},
	)
	s.NoError(err)
	return intake, createPayload.Reviewers
}
