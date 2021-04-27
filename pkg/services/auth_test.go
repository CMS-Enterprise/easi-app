package services

import (
	"context"

	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/authn"
	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
)

func (s ServicesTestSuite) TestAuthorizeUserIsIntakeRequester() {
	authorizeSaveSystemIntake := NewAuthorizeUserIsIntakeRequester()

	s.Run("No EASi job code fails auth", func() {
		ctx := context.Background()
		ctx = appcontext.WithPrincipal(ctx, &authn.EUAPrincipal{JobCodeEASi: false})

		ok, err := authorizeSaveSystemIntake(ctx, &models.SystemIntake{})

		s.False(ok)
		s.NoError(err)
	})

	s.Run("Mismatched EUA ID fails auth", func() {
		ctx := context.Background()
		ctx = appcontext.WithPrincipal(ctx, &authn.EUAPrincipal{EUAID: "ZYXW", JobCodeEASi: true})

		intake := models.SystemIntake{
			EUAUserID: null.StringFrom("ABCD"),
		}

		ok, err := authorizeSaveSystemIntake(ctx, &intake)

		s.False(ok)
		s.NoError(err)
	})

	s.Run("Matched EUA ID passes auth", func() {
		ctx := context.Background()
		ctx = appcontext.WithPrincipal(ctx, &authn.EUAPrincipal{EUAID: "ABCD", JobCodeEASi: true})

		intake := models.SystemIntake{
			EUAUserID: null.StringFrom("ABCD"),
		}

		ok, err := authorizeSaveSystemIntake(ctx, &intake)

		s.True(ok)
		s.NoError(err)
	})
}

func (s ServicesTestSuite) TestAuthorizeUserIsBusinessCaseRequester() {
	authorizeSaveBizCase := NewAuthorizeUserIsBusinessCaseRequester()

	s.Run("No EASi job code fails auth", func() {
		ctx := context.Background()
		ctx = appcontext.WithPrincipal(ctx, &authn.EUAPrincipal{JobCodeEASi: false})

		ok, err := authorizeSaveBizCase(ctx, &models.BusinessCase{})

		s.False(ok)
		s.NoError(err)
	})

	s.Run("Mismatched EUA ID fails auth", func() {
		ctx := context.Background()
		ctx = appcontext.WithPrincipal(ctx, &authn.EUAPrincipal{EUAID: "ZYXW", JobCodeEASi: true})

		bizCase := models.BusinessCase{
			EUAUserID: "ABCD",
		}

		ok, err := authorizeSaveBizCase(ctx, &bizCase)

		s.False(ok)
		s.NoError(err)
	})

	s.Run("Matched EUA ID passes auth", func() {
		ctx := context.Background()
		ctx = appcontext.WithPrincipal(ctx, &authn.EUAPrincipal{EUAID: "ABCD", JobCodeEASi: true})

		bizCase := models.BusinessCase{
			EUAUserID: "ABCD",
		}

		ok, err := authorizeSaveBizCase(ctx, &bizCase)

		s.True(ok)
		s.NoError(err)
	})
}

func (s ServicesTestSuite) TestHasRole() {
	fnAuth := HasRole
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
			ok, err := fnAuth(tc.ctx, model.RoleEasiGovteam)
			s.NoError(err)
			s.Equal(tc.allowed, ok)
		})
	}
}

func (s ServicesTestSuite) TestAuthorizeUserIsIntakeRequesterOrHasGRTJobCode() {
	fnAuth := AuthorizeUserIsIntakeRequesterOrHasGRTJobCode
	nonEASI := authn.EUAPrincipal{EUAID: "FAKE", JobCodeEASi: false, JobCodeGRT: false}
	nonGRT := authn.EUAPrincipal{EUAID: "FAKE", JobCodeEASi: true, JobCodeGRT: false}
	yesGRT := authn.EUAPrincipal{EUAID: "FAKE", JobCodeEASi: true, JobCodeGRT: true}

	testCases := map[string]struct {
		ctx     context.Context
		intake  *models.SystemIntake
		allowed bool
	}{
		"anonymous": {
			ctx:     context.Background(),
			intake:  &models.SystemIntake{},
			allowed: false,
		},
		"non easi": {
			ctx:     appcontext.WithPrincipal(context.Background(), &nonEASI),
			intake:  &models.SystemIntake{},
			allowed: false,
		},
		"is not grt, is not author": {
			ctx:     appcontext.WithPrincipal(context.Background(), &nonGRT),
			intake:  &models.SystemIntake{EUAUserID: null.StringFrom("NOPE")},
			allowed: false,
		},
		"is author, is not grt": {
			ctx:     appcontext.WithPrincipal(context.Background(), &nonGRT),
			intake:  &models.SystemIntake{EUAUserID: null.StringFrom("FAKE")},
			allowed: true,
		},
		"is grt, is not author": {
			ctx:     appcontext.WithPrincipal(context.Background(), &yesGRT),
			intake:  &models.SystemIntake{EUAUserID: null.StringFrom("NOPE")},
			allowed: true,
		},
	}

	for name, tc := range testCases {
		s.Run(name, func() {
			ok, err := fnAuth(tc.ctx, tc.intake)
			s.NoError(err)
			s.Equal(tc.allowed, ok)
		})
	}
}

func (s ServicesTestSuite) TestAuthorizeUserIsRequestOwnerOr508Team() {
	fnAuth := AuthorizeUserIsRequestOwnerOr508Team
	nonEASI := authn.EUAPrincipal{EUAID: "FAKE", JobCodeEASi: false, JobCodeGRT: false}
	non508 := authn.EUAPrincipal{EUAID: "FAKE", JobCodeEASi: true, JobCode508Tester: false, JobCode508User: false}
	yes508tester := authn.EUAPrincipal{EUAID: "FAKE", JobCodeEASi: true, JobCode508Tester: true, JobCode508User: false}

	testCases := map[string]struct {
		ctx     context.Context
		intake  *models.SystemIntake
		allowed bool
	}{
		"anonymous": {
			ctx:     context.Background(),
			intake:  &models.SystemIntake{},
			allowed: false,
		},
		"non easi": {
			ctx:     appcontext.WithPrincipal(context.Background(), &nonEASI),
			intake:  &models.SystemIntake{},
			allowed: false,
		},
		"is not 508, is not author": {
			ctx:     appcontext.WithPrincipal(context.Background(), &non508),
			intake:  &models.SystemIntake{EUAUserID: null.StringFrom("NOPE")},
			allowed: false,
		},
		"is author, is not 508": {
			ctx:     appcontext.WithPrincipal(context.Background(), &non508),
			intake:  &models.SystemIntake{EUAUserID: null.StringFrom("FAKE")},
			allowed: true,
		},
		"is 508, is not author": {
			ctx:     appcontext.WithPrincipal(context.Background(), &yes508tester),
			intake:  &models.SystemIntake{EUAUserID: null.StringFrom("NOPE")},
			allowed: true,
		},
	}

	for name, tc := range testCases {
		s.Run(name, func() {
			ok, err := fnAuth(tc.ctx, tc.intake)
			s.NoError(err)
			s.Equal(tc.allowed, ok)
		})
	}
}
