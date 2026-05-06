package resolvers

import (
	"context"
	"errors"
	"slices"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	cedarcore "github.com/cms-enterprise/easi-app/pkg/cedar/core"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

func (s *ResolverSuite) TestSystemIntakesQuery() {
	ctx := s.testConfigs.Context
	store := s.testConfigs.Store

	submittedAt := time.Now()

	// Create an open intake
	openIntake, err := storage.CreateSystemIntake(ctx, store, &models.SystemIntake{
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
	closedIntake, err := storage.CreateSystemIntake(ctx, store, &models.SystemIntake{
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
	openIntake, err := storage.CreateSystemIntake(ctx, store, &models.SystemIntake{
		State:       models.SystemIntakeStateOpen,
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(err)
	s.NotNil(openIntake)

	// Create a closed intake
	closedIntake, err := storage.CreateSystemIntake(ctx, store, &models.SystemIntake{
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
	openIntake, err := storage.CreateSystemIntake(ctx, store, &models.SystemIntake{
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
	closedIntake, err := storage.CreateSystemIntake(ctx, store, &models.SystemIntake{
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

func (s *ResolverSuite) TestSystemIntakeByIDLoaderReturnsPerKeyErrors() {
	intake := s.createNewIntake()
	missingID := uuid.New()

	coreClient := cedarcore.NewClient(s.testConfigs.Context, "", "", "", true, true)
	getCedarSystems := func(ctx context.Context) ([]*models.CedarSystem, error) {
		return coreClient.GetSystemSummary(ctx)
	}
	getMyCedarSystems := func(ctx context.Context, euaUserID string) ([]*models.CedarSystem, error) {
		return coreClient.GetSystemSummary(ctx, cedarcore.SystemSummaryOpts.WithEuaIDFilter(euaUserID))
	}

	loaders := dataloaders.NewDataloaders(
		s.testConfigs.Store,
		s.testConfigs.UserSearchClient.FetchUserInfos,
		getCedarSystems,
		getMyCedarSystems,
	)
	ctx := dataloaders.CTXWithLoaders(s.testConfigs.Context, func() *dataloaders.Dataloaders {
		return loaders
	})

	goodThunk := loaders.SystemIntakeByID.LoadThunk(ctx, intake.ID)
	missingThunk := loaders.SystemIntakeByID.LoadThunk(ctx, missingID)

	goodIntake, err := goodThunk()
	s.NoError(err)
	s.NotNil(goodIntake)
	s.Equal(intake.ID, goodIntake.ID)

	missingIntake, err := missingThunk()
	s.Error(err)
	s.Nil(missingIntake)
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
	store := s.testConfigs.Store

	submittedAt := time.Now()

	openIntake := s.createNewIntakeWithResolver(func(intake *models.SystemIntake) {
		intake.State = models.SystemIntakeStateOpen
		intake.RequestType = models.SystemIntakeRequestTypeNEW
		intake.SubmittedAt = &submittedAt
	})
	s.NotNil(openIntake)
	s.Equal(models.SystemIntakeRequestTypeNEW, openIntake.RequestType)

	// Update the request type to SystemIntakeRequestTypeMAJORCHANGES
	ctx, _ := s.getTestContextWithPrincipal("TEST", false)
	intakeWithNewType, err := UpdateSystemIntakeRequestType(ctx, store, openIntake.ID, models.SystemIntakeRequestTypeMAJORCHANGES)
	s.NoError(err)
	s.NotNil(intakeWithNewType)
	s.Equal(models.SystemIntakeRequestTypeMAJORCHANGES, intakeWithNewType.RequestType)
}

func (s *ResolverSuite) TestGetRequesterUpdateEmailData() {
	ctx := s.testConfigs.Context
	store := s.testConfigs.Store

	_, err := GetRequesterUpdateEmailData(ctx, store, func(ctx context.Context, strings []string) ([]*models.UserInfo, error) {
		return nil, nil
	})
	s.NoError(err)
}

func (s *ResolverSuite) TestRequesterUpdateEmailDataAuthorization() {
	store := s.testConfigs.Store

	resolver := &queryResolver{&Resolver{
		store: store,
		service: ResolverService{
			FetchUserInfos: func(ctx context.Context, euaIDs []string) ([]*models.UserInfo, error) {
				return nil, nil
			},
		},
	}}

	nonAdminCtx, _ := s.getTestContextWithPrincipal("USR1", false)
	_, err := resolver.RequesterUpdateEmailData(nonAdminCtx)
	s.Error(err)

	var unauthorizedErr *apperrors.UnauthorizedError
	s.True(errors.As(err, &unauthorizedErr))

	adminCtx, _ := s.getTestContextWithPrincipal("ABCD", true)
	_, err = resolver.RequesterUpdateEmailData(adminCtx)
	s.NoError(err)
}
