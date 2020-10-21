package services

import (
	"context"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/authn"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (s ServicesTestSuite) TestAuthorizeUserIsIntakeRequester() {
	authorizeSaveSystemIntake := NewAuthorizeUserIsIntakeRequester()

	s.Run("No EUA ID fails auth", func() {
		ctx := context.Background()

		ok, err := authorizeSaveSystemIntake(ctx, &models.SystemIntake{})

		s.False(ok)
		s.IsType(&apperrors.ContextError{}, err)
	})

	s.Run("Mismatched EUA ID fails auth", func() {
		ctx := context.Background()
		ctx = appcontext.WithPrincipal(ctx, &authn.EUAPrincipal{EUAID: "ZYXW", JobCodeEASi: true})

		intake := models.SystemIntake{
			EUAUserID: "ABCD",
		}

		ok, err := authorizeSaveSystemIntake(ctx, &intake)

		s.False(ok)
		s.NoError(err)
	})

	s.Run("Matched EUA ID passes auth", func() {
		ctx := context.Background()
		ctx = appcontext.WithPrincipal(ctx, &authn.EUAPrincipal{EUAID: "ABCD", JobCodeEASi: true})

		intake := models.SystemIntake{
			EUAUserID: "ABCD",
		}

		ok, err := authorizeSaveSystemIntake(ctx, &intake)

		s.True(ok)
		s.NoError(err)
	})
}

func (s ServicesTestSuite) TestAuthorizeRequireGRTJobCode() {
	fnAuth := NewAuthorizeRequireGRTJobCode()
	nonGRT := authn.EUAPrincipal{EUAID: "FAKE", JobCodeEASi: true, JobCodeGRT: false}
	yesGRT := authn.EUAPrincipal{EUAID: "FAKE", JobCodeEASi: true, JobCodeGRT: true}

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
			ok, err := fnAuth(tc.ctx)
			s.NoError(err)
			s.Equal(tc.allowed, ok)
		})
	}
}
