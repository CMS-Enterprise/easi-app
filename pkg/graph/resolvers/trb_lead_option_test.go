package resolvers

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/models"
)

// TestTRBLeadOptions tests the TRBLeadOption creation/deletion/retrieval
func (s *ResolverSuite) TestTRBLeadOptions() {
	ctx := context.Background()
	leadUsers := map[string]*models.UserInfo{
		"ABCD": {
			CommonName: "Adeline Aarons",
			Email:      "adeline.aarons@local.fake",
			EuaUserID:  "ABCD",
		},
		"TEST": {
			CommonName: "Terry Thompson",
			Email:      "terry.thompson@local.fake",
			EuaUserID:  "TEST",
		},
		"A11Y": {
			CommonName: "Ally Anderson",
			Email:      "ally.anderson@local.fake",
			EuaUserID:  "A11Y",
		},
		"GRTB": {
			CommonName: "Gary Gordon",
			Email:      "gary.gordon@local.fake",
			EuaUserID:  "GRTB",
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
