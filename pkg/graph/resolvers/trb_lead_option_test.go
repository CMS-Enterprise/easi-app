package resolvers

import (
	"context"
	"errors"

	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// TestTRBLeadOptions tests the TRBLeadOption creation/deletion/retrieval
func (s *ResolverSuite) TestTRBLeadOptions() {
	ctx := s.testConfigs.Context
	leadUsers := map[string]*models.UserInfo{
		"ABCD": {
			DisplayName: "Adeline Aarons",
			Email:       "adeline.aarons@local.fake",
			Username:    "ABCD",
		},
		"TEST": {
			DisplayName: "Terry Thompson",
			Email:       "terry.thompson@local.fake",
			Username:    "TEST",
		},
		"A11Y": {
			DisplayName: "Ally Anderson",
			Email:       "ally.anderson@local.fake",
			Username:    "A11Y",
		},
		"GRTB": {
			DisplayName: "Gary Gordon",
			Email:       "gary.gordon@local.fake",
			Username:    "GRTB",
		},
	}

	stubFetchUserInfo := func(ctx context.Context, euaID string) (*models.UserInfo, error) {
		if userInfo, ok := leadUsers[euaID]; ok {
			return userInfo, nil
		}
		return nil, nil
	}

	stubFetchUserInfos := func(ctx context.Context, euaIDs []string) ([]*models.UserInfo, error) {
		userInfos := []*models.UserInfo{}

		for _, euaID := range euaIDs {
			if userInfo, ok := leadUsers[euaID]; ok {
				userInfos = append(userInfos, userInfo)
			} else {
				userInfos = append(userInfos, nil)
			}
		}

		return userInfos, nil
	}

	store := s.testConfigs.Store

	s.Run("create/delete/fetch TRB lead options", func() {
		for euaID := range leadUsers {
			_, err := CreateTRBLeadOption(ctx, store, stubFetchUserInfo, euaID)
			s.NoError(err)
		}

		userInfos, err := GetTRBLeadOptions(ctx, store, stubFetchUserInfos)
		s.NoError(err)
		s.True(len(userInfos) == 4)

		_, err = DeleteTRBLeadOption(ctx, store, "TEST")
		s.NoError(err)

		userInfos, err = GetTRBLeadOptions(ctx, store, stubFetchUserInfos)
		s.NoError(err)
		s.True(len(userInfos) == 3)
	})
}

func (s *ResolverSuite) TestTRBLeadOptionsAuthorization() {
	ctx := s.testConfigs.Context
	store := s.testConfigs.Store

	stubFetchUserInfo := func(ctx context.Context, euaID string) (*models.UserInfo, error) {
		return &models.UserInfo{
			DisplayName: euaID + " User",
			Email:       models.NewEmailAddress(euaID + "@local.fake"),
			Username:    euaID,
		}, nil
	}

	stubFetchUserInfos := func(ctx context.Context, euaIDs []string) ([]*models.UserInfo, error) {
		userInfos := make([]*models.UserInfo, 0, len(euaIDs))

		for _, euaID := range euaIDs {
			userInfos = append(userInfos, &models.UserInfo{
				DisplayName: euaID + " User",
				Email:       models.NewEmailAddress(euaID + "@local.fake"),
				Username:    euaID,
			})
		}

		return userInfos, nil
	}

	_, err := CreateTRBLeadOption(ctx, store, stubFetchUserInfo, "LEAD")
	s.NoError(err)

	resolver := &queryResolver{&Resolver{
		store: store,
		service: ResolverService{
			FetchUserInfos: stubFetchUserInfos,
		},
	}}

	otherCtx, _ := s.getTestContextWithPrincipal("USR2", false)
	_, err = resolver.TrbLeadOptions(otherCtx)
	s.Error(err)

	var unauthorizedErr *apperrors.UnauthorizedError
	s.True(errors.As(err, &unauthorizedErr))

	adminCtx, _ := s.getTestContextWithPrincipal("TRBA", true)
	leadOptions, err := resolver.TrbLeadOptions(adminCtx)
	s.NoError(err)
	s.Len(leadOptions, 1)
	s.Equal("LEAD", leadOptions[0].Username)
}
