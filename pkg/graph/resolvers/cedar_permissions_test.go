package resolvers

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	cedarcore "github.com/cms-enterprise/easi-app/pkg/cedar/core"
	"github.com/cms-enterprise/easi-app/pkg/local"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/pubsub"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
	"github.com/cms-enterprise/easi-app/pkg/userhelpers"
)

func (s *ResolverSuite) cedarMutationResolver() *mutationResolver {
	okta := local.NewOktaAPIClient()
	cedarCoreClient := cedarcore.NewClient(
		appcontext.WithLogger(context.Background(), s.testConfigs.Logger),
		"fake",
		"fake",
		"1.0.0",
		false,
		true,
	)

	return &mutationResolver{
		&Resolver{
			service: ResolverService{
				FetchUserInfos: okta.FetchUserInfos,
			},
			cedarCoreClient: cedarCoreClient,
			emailClient:     s.testConfigs.EmailClient,
			pubsub:          pubsub.NewServicePubSub(),
		},
	}
}

func (s *ResolverSuite) cedarQueryResolver() *queryResolver {
	cedarCoreClient := cedarcore.NewClient(
		appcontext.WithLogger(context.Background(), s.testConfigs.Logger),
		"fake",
		"fake",
		"1.0.0",
		false,
		true,
	)

	return &queryResolver{
		&Resolver{
			cedarCoreClient: cedarCoreClient,
		},
	}
}

func (s *ResolverSuite) cedarTypeResolver() *cedarSystemResolver {
	cedarCoreClient := cedarcore.NewClient(
		appcontext.WithLogger(context.Background(), s.testConfigs.Logger),
		"fake",
		"fake",
		"1.0.0",
		false,
		true,
	)

	return &cedarSystemResolver{
		&Resolver{
			store:           s.testConfigs.Store,
			cedarCoreClient: cedarCoreClient,
		},
	}
}

func (s *ResolverSuite) TestCEDARSystemTeamManagementPermissions() {
	resolver := s.cedarMutationResolver()
	queryResolver := s.cedarQueryResolver()
	cedarSystemID := uuid.MustParse("{11AB1A00-1234-5678-ABC1-1A001B00CC0A}")
	addedRoleID := "{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID03}"

	teamMemberCtx, _ := s.getTestContextWithPrincipal("ABCD", false)
	otherUserCtx, _ := s.getTestContextWithPrincipal("ZZZZ", false)

	s.NoError(authorizeUserCanAccessCEDARTeamMetadata(teamMemberCtx, resolver.cedarCoreClient))
	s.NoError(authorizeUserCanAccessCEDARSystemWorkspace(teamMemberCtx, resolver.cedarCoreClient, cedarSystemID))
	s.NoError(authorizeUserCanManageCEDARSystemTeam(teamMemberCtx, resolver.cedarCoreClient, cedarSystemID))

	var unauthorizedErr *apperrors.UnauthorizedError
	err := authorizeUserCanAccessCEDARTeamMetadata(otherUserCtx, resolver.cedarCoreClient)
	s.Error(err)
	s.True(errors.As(err, &unauthorizedErr))
	unauthorizedErr = nil

	roleTypes, err := queryResolver.RoleTypes(teamMemberCtx)
	s.NoError(err)
	s.NotNil(roleTypes)

	roles, err := queryResolver.Roles(teamMemberCtx, cedarSystemID, nil)
	s.NoError(err)
	s.NotNil(roles)

	_, err = queryResolver.RoleTypes(otherUserCtx)
	s.Error(err)
	s.True(errors.As(err, &unauthorizedErr))
	unauthorizedErr = nil

	_, err = queryResolver.Roles(otherUserCtx, cedarSystemID, nil)
	s.Error(err)
	s.True(errors.As(err, &unauthorizedErr))
	unauthorizedErr = nil

	err = authorizeUserCanAccessCEDARSystemWorkspace(otherUserCtx, resolver.cedarCoreClient, cedarSystemID)
	s.Error(err)
	s.True(errors.As(err, &unauthorizedErr))
	unauthorizedErr = nil

	err = authorizeUserCanManageCEDARSystemTeam(otherUserCtx, resolver.cedarCoreClient, cedarSystemID)
	s.Error(err)
	s.True(errors.As(err, &unauthorizedErr))
	unauthorizedErr = nil

	resp, err := resolver.SetRolesForUserOnSystem(teamMemberCtx, models.SetRolesForUserOnSystemInput{
		CedarSystemID:      cedarSystemID,
		EuaUserID:          "USR1",
		DesiredRoleTypeIDs: []string{addedRoleID},
	})
	s.NoError(err)
	s.NotNil(resp)

	_, err = resolver.SetRolesForUserOnSystem(otherUserCtx, models.SetRolesForUserOnSystemInput{
		CedarSystemID:      cedarSystemID,
		EuaUserID:          "USR1",
		DesiredRoleTypeIDs: []string{addedRoleID},
	})
	s.Error(err)
	s.True(errors.As(err, &unauthorizedErr))
}

func (s *ResolverSuite) TestCEDARSystemProfileLockPermissions() {
	mutationResolver := s.cedarMutationResolver()
	queryResolver := s.cedarQueryResolver()
	cedarSystemID := uuid.MustParse("{11AB1A00-1234-5678-ABC1-1A001B00CC0A}")
	section := models.SystemProfileLockableSectionTeam

	teamMemberCtx, _ := s.getTestContextWithPrincipal("ABCD", false)
	otherUserCtx, _ := s.getTestContextWithPrincipal("ZZZZ", false)

	locked, err := mutationResolver.LockSystemProfileSection(teamMemberCtx, cedarSystemID, section)
	s.NoError(err)
	s.True(locked)

	locks, err := queryResolver.SystemProfileSectionLocks(teamMemberCtx, cedarSystemID)
	s.NoError(err)
	s.Len(locks, 1)

	var unauthorizedErr *apperrors.UnauthorizedError
	_, err = queryResolver.SystemProfileSectionLocks(otherUserCtx, cedarSystemID)
	s.Error(err)
	s.True(errors.As(err, &unauthorizedErr))
	unauthorizedErr = nil

	_, err = mutationResolver.LockSystemProfileSection(otherUserCtx, cedarSystemID, section)
	s.Error(err)
	s.True(errors.As(err, &unauthorizedErr))
	unauthorizedErr = nil

	_, err = mutationResolver.UnlockSystemProfileSection(otherUserCtx, cedarSystemID, section)
	s.Error(err)
	s.True(errors.As(err, &unauthorizedErr))
	unauthorizedErr = nil

	_, err = mutationResolver.UnlockAllSystemProfileSections(otherUserCtx, cedarSystemID)
	s.Error(err)
	s.True(errors.As(err, &unauthorizedErr))
}

func (s *ResolverSuite) TestCEDARLinkedRequestVisibility() {
	resolver := s.cedarTypeResolver()
	cedarSystem := &models.CedarSystem{ID: uuid.MustParse("{11AB1A00-1234-5678-ABC1-1A001B00CC0A}")}

	teamMemberCtx, _ := s.getTestContextWithPrincipal("ABCD", false)
	ownerCtx, _ := s.getTestContextWithPrincipal("USR2", false)
	outsiderCtx, _ := s.getTestContextWithPrincipal("ZZZZ", false)

	trbRequest, err := CreateTRBRequest(ownerCtx, models.TRBTBrainstorm, s.testConfigs.Store)
	s.NoError(err)
	s.NotNil(trbRequest)

	err = sqlutils.WithTransaction(s.testConfigs.Context, s.testConfigs.Store, func(tx *sqlx.Tx) error {
		return s.testConfigs.Store.SetTRBRequestSystems(s.testConfigs.Context, tx, trbRequest.ID, []uuid.UUID{cedarSystem.ID})
	})
	s.NoError(err)

	intake, err := CreateSystemIntake(
		ownerCtx,
		s.testConfigs.Store,
		models.CreateSystemIntakeInput{
			Requester:   &models.SystemIntakeRequesterInput{Name: "User Two"},
			RequestType: models.SystemIntakeRequestTypeNEW,
		},
		userhelpers.GetUserInfoAccountInfoWrapperFunc(s.testConfigs.UserSearchClient.FetchUserInfo),
	)
	s.NoError(err)
	s.NotNil(intake)

	linkedSystems := []*models.SystemRelationshipInput{
		{
			CedarSystemID:          &cedarSystem.ID,
			SystemRelationshipType: []models.SystemRelationshipType{models.SystemRelationshipTypePrimarySupport},
		},
	}

	err = sqlutils.WithTransaction(s.testConfigs.Context, s.testConfigs.Store, func(tx *sqlx.Tx) error {
		return s.testConfigs.Store.SetSystemIntakeSystems(s.testConfigs.Context, tx, intake.ID, linkedSystems)
	})
	s.NoError(err)

	teamTRBResults, err := resolver.LinkedTrbRequests(teamMemberCtx, cedarSystem, models.TRBRequestStateOpen)
	s.NoError(err)
	s.Len(teamTRBResults, 1)
	s.Equal(trbRequest.ID, teamTRBResults[0].ID)

	ownerTRBResults, err := resolver.LinkedTrbRequests(ownerCtx, cedarSystem, models.TRBRequestStateOpen)
	s.NoError(err)
	s.Len(ownerTRBResults, 1)
	s.Equal(trbRequest.ID, ownerTRBResults[0].ID)

	outsiderTRBResults, err := resolver.LinkedTrbRequests(outsiderCtx, cedarSystem, models.TRBRequestStateOpen)
	s.NoError(err)
	s.Empty(outsiderTRBResults)

	teamIntakeResults, err := resolver.LinkedSystemIntakes(teamMemberCtx, cedarSystem, models.SystemIntakeStateOpen)
	s.NoError(err)
	s.Len(teamIntakeResults, 1)
	s.Equal(intake.ID, teamIntakeResults[0].ID)

	ownerIntakeResults, err := resolver.LinkedSystemIntakes(ownerCtx, cedarSystem, models.SystemIntakeStateOpen)
	s.NoError(err)
	s.Len(ownerIntakeResults, 1)
	s.Equal(intake.ID, ownerIntakeResults[0].ID)

	outsiderIntakeResults, err := resolver.LinkedSystemIntakes(outsiderCtx, cedarSystem, models.SystemIntakeStateOpen)
	s.NoError(err)
	s.Empty(outsiderIntakeResults)
}
