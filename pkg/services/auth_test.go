package services

import (
	"context"

	"github.com/guregu/null"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func (s *ServicesTestSuite) TestAuthorizeUserIsIntakeRequester() {
	authorizeSaveSystemIntake := AuthorizeUserIsIntakeRequester

	s.Run("No EASi job code fails auth", func() {
		ctx := context.Background()
		ctx = appcontext.WithPrincipal(ctx, &authentication.EUAPrincipal{JobCodeEASi: false})

		ok := authorizeSaveSystemIntake(ctx, &models.SystemIntake{})
		s.False(ok)
	})

	s.Run("Mismatched EUA ID fails auth", func() {
		ctx := context.Background()
		ctx = appcontext.WithPrincipal(ctx, &authentication.EUAPrincipal{EUAID: "ZYXW", JobCodeEASi: true})

		intake := models.SystemIntake{
			EUAUserID: null.StringFrom("ABCD"),
		}

		ok := authorizeSaveSystemIntake(ctx, &intake)
		s.False(ok)
	})

	s.Run("Matched EUA ID passes auth", func() {
		ctx := context.Background()
		ctx = appcontext.WithPrincipal(ctx, &authentication.EUAPrincipal{EUAID: "ABCD", JobCodeEASi: true})

		intake := models.SystemIntake{
			EUAUserID: null.StringFrom("ABCD"),
		}

		ok := authorizeSaveSystemIntake(ctx, &intake)
		s.True(ok)
	})
}

func (s *ServicesTestSuite) TestAuthorizeUserIsBusinessCaseRequester() {
	authorizeSaveBizCase := AuthorizeUserIsBusinessCaseRequester

	s.Run("No EASi job code fails auth", func() {
		ctx := context.Background()
		ctx = appcontext.WithPrincipal(ctx, &authentication.EUAPrincipal{JobCodeEASi: false})

		ok := authorizeSaveBizCase(ctx, &models.BusinessCase{})

		s.False(ok)
	})

	s.Run("Mismatched EUA ID fails auth", func() {
		ctx := context.Background()
		ctx = appcontext.WithPrincipal(ctx, &authentication.EUAPrincipal{EUAID: "ZYXW", JobCodeEASi: true})

		bizCase := models.BusinessCase{
			EUAUserID: "ABCD",
		}

		ok := authorizeSaveBizCase(ctx, &bizCase)

		s.False(ok)
	})

	s.Run("Matched EUA ID passes auth", func() {
		ctx := context.Background()
		ctx = appcontext.WithPrincipal(ctx, &authentication.EUAPrincipal{EUAID: "ABCD", JobCodeEASi: true})

		bizCase := models.BusinessCase{
			EUAUserID: "ABCD",
		}

		ok := authorizeSaveBizCase(ctx, &bizCase)

		s.True(ok)
	})
}

func (s *ServicesTestSuite) TestHasRole() {
	fnAuth := HasRole
	nonGRT := authentication.EUAPrincipal{EUAID: "FAKE", JobCodeEASi: true, JobCodeGRT: false}
	yesGRT := authentication.EUAPrincipal{EUAID: "FAKE", JobCodeEASi: true, JobCodeGRT: true}

	testCases := map[string]struct {
		ctx     context.Context
		allowed bool
	}{
		"anonymous": {
			ctx:     context.Background(),
			allowed: false,
		},
		"non grt": {
			ctx:     appcontext.WithPrincipal(context.Background(), &nonGRT),
			allowed: false,
		},
		"has grt": {
			ctx:     appcontext.WithPrincipal(context.Background(), &yesGRT),
			allowed: true,
		},
	}

	for name, tc := range testCases {
		s.Run(name, func() {
			ok := fnAuth(tc.ctx, models.RoleEasiGovteam)
			s.Equal(tc.allowed, ok)
		})
	}
}
