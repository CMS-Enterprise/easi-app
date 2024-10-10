package resolvers

import (
	"slices"
	"time"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *ResolverSuite) TestSystemIntakesQuery() {
	ctx := s.testConfigs.Context
	store := s.testConfigs.Store

	submittedAt := time.Now()

	// Create an open intake
	openIntake, err := store.CreateSystemIntake(ctx, &models.SystemIntake{
		State:       models.SystemIntakeStateOpen,
		RequestType: models.SystemIntakeRequestTypeNEW,
		SubmittedAt: &submittedAt,
	})
	s.NoError(err)
	s.NotNil(openIntake)
	// set submitted_at
	openIntake.SubmittedAt = &submittedAt
	openIntake, err = store.UpdateSystemIntake(ctx, openIntake)
	s.NoError(err)
	s.NotNil(openIntake)

	// Create a closed intake
	closedIntake, err := store.CreateSystemIntake(ctx, &models.SystemIntake{
		State:       models.SystemIntakeStateClosed,
		RequestType: models.SystemIntakeRequestTypeNEW,
		SubmittedAt: &submittedAt,
	})
	s.NoError(err)
	s.NotNil(closedIntake)
	// set submitted_at
	closedIntake.SubmittedAt = &submittedAt
	closedIntake, err = store.UpdateSystemIntake(ctx, closedIntake)
	s.NoError(err)
	s.NotNil(closedIntake)

	// Check open intakes
	openIntakes, err := SystemIntakes(ctx, store, true)
	s.NoError(err)
	s.Len(openIntakes, 1)
	s.Equal(openIntakes[0].ID, openIntake.ID)

	// Check closed intakes
	closedIntakes, err := SystemIntakes(ctx, store, false)
	s.NoError(err)
	s.Len(closedIntakes, 1)
	s.Equal(closedIntakes[0].ID, closedIntake.ID)
}

func (s *ResolverSuite) TestSystemIntakesQueryUnsubmitted() {
	ctx := s.testConfigs.Context
	store := s.testConfigs.Store

	// Create an open intake
	openIntake, err := store.CreateSystemIntake(ctx, &models.SystemIntake{
		State:       models.SystemIntakeStateOpen,
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(err)
	s.NotNil(openIntake)

	// Create a closed intake
	closedIntake, err := store.CreateSystemIntake(ctx, &models.SystemIntake{
		State:       models.SystemIntakeStateClosed,
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(err)
	s.NotNil(closedIntake)

	// Check open intakes
	openIntakes, err := SystemIntakes(ctx, store, true)
	s.NoError(err)
	s.Len(openIntakes, 0)

	// Check closed intakes
	closedIntakes, err := SystemIntakes(ctx, store, false)
	s.NoError(err)
	s.Len(closedIntakes, 0)
}

func (s *ResolverSuite) TestSystemIntakesQueryArchived() {
	ctx := s.testConfigs.Context
	store := s.testConfigs.Store

	archivedAt := time.Now()

	// Create an open intake with an `archived_at`
	openIntake, err := store.CreateSystemIntake(ctx, &models.SystemIntake{
		State:       models.SystemIntakeStateOpen,
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(err)
	s.NotNil(openIntake)
	// set archived_at
	openIntake.ArchivedAt = &archivedAt
	openIntake, err = store.UpdateSystemIntake(ctx, openIntake)
	s.NoError(err)
	s.NotNil(openIntake)

	// Create a closed intake with an `archived_at`
	closedIntake, err := store.CreateSystemIntake(ctx, &models.SystemIntake{
		State:       models.SystemIntakeStateClosed,
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(err)
	s.NotNil(closedIntake)
	// set archived_at
	closedIntake.ArchivedAt = &archivedAt
	closedIntake, err = store.UpdateSystemIntake(ctx, closedIntake)
	s.NoError(err)
	s.NotNil(closedIntake)

	// Check open intakes
	openIntakes, err := SystemIntakes(ctx, store, true)
	s.NoError(err)
	s.Len(openIntakes, 0)

	// Check closed intakes
	closedIntakes, err := SystemIntakes(ctx, store, false)
	s.NoError(err)
	s.Len(closedIntakes, 0)
}

func (s *ResolverSuite) TestSystemIntakeWithReviewRequested() {
	ctx := s.testConfigs.Context
	store := s.testConfigs.Store

	s.Run("fetch GRB reviewers", func() {
		intake, reviewers := s.createIntakeAndAddReviewers(
			&models.CreateGRBReviewerInput{
				// should be "TEST"
				EuaUserID:  appcontext.Principal(ctx).Account().Username,
				VotingRole: models.SystemIntakeGRBReviewerVotingRoleVoting,
				GrbRole:    models.SystemIntakeGRBReviewerRoleAca3021Rep,
			},
			&models.CreateGRBReviewerInput{
				EuaUserID:  "ABCD",
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

		closedIntake, reviewers := s.createIntakeAndAddReviewers(
			&models.CreateGRBReviewerInput{
				// should be "TEST"
				EuaUserID:  appcontext.Principal(ctx).Account().Username,
				VotingRole: models.SystemIntakeGRBReviewerVotingRoleVoting,
				GrbRole:    models.SystemIntakeGRBReviewerRoleAca3021Rep,
			},
			&models.CreateGRBReviewerInput{
				EuaUserID:  "ABCD",
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
		closedIntake.State = models.SystemIntakeStateClosed

		_, err := store.UpdateSystemIntake(ctx, closedIntake)
		s.NoError(err)

		noReviewersIntake := s.createNewIntake()

		allIntakes, err := store.FetchSystemIntakes(s.ctxWithNewDataloaders())
		s.NoError(err)
		s.Len(allIntakes, 3)

		intakesWhereReviewIsRequested, err := SystemIntakesWithReviewRequested(ctx, store)
		s.NoError(err)
		// should not return intakes that are closed or where user not requested
		s.Len(intakesWhereReviewIsRequested, 1)
		s.Equal(intake.ID, intakesWhereReviewIsRequested[0].ID)
		s.False(slices.ContainsFunc(intakesWhereReviewIsRequested, func(i *models.SystemIntake) bool {
			return i.ID == noReviewersIntake.ID || i.ID == closedIntake.ID
		}))
	})
}

func (s *ResolverSuite) TestUpdateSystemIntakeRequestType() {
	ctx := s.testConfigs.Context
	store := s.testConfigs.Store

	submittedAt := time.Now()

	// Create a "new request" type system intake
	openIntake, err := store.CreateSystemIntake(ctx, &models.SystemIntake{
		State:       models.SystemIntakeStateOpen,
		RequestType: models.SystemIntakeRequestTypeNEW,
		SubmittedAt: &submittedAt,
	})
	s.NoError(err)
	s.NotNil(openIntake)
	s.Equal(models.SystemIntakeRequestTypeNEW, openIntake.RequestType)

	// Update the request type to SystemIntakeRequestTypeMAJORCHANGES
	intakeWithNewType, err := UpdateSystemIntakeRequestType(ctx, store, openIntake.ID, models.SystemIntakeRequestTypeMAJORCHANGES)
	s.NoError(err)
	s.NotNil(intakeWithNewType)
	s.Equal(models.SystemIntakeRequestTypeMAJORCHANGES, intakeWithNewType.RequestType)
}
