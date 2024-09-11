package resolvers

import (
	"context"

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
