package services

import (
	"context"

	"github.com/guregu/null"
	"github.com/stretchr/testify/assert"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	"github.com/cms-enterprise/easi-app/pkg/userhelpers"
)

// SetupTest clears the database between each test
func (s *ServicesTestSuite) SetupTest() {
	// Clean all tables before each test
	err := s.store.TruncateAllTablesDANGEROUS(s.logger)
	assert.NoError(s.T(), err)
}

func (s *ServicesTestSuite) TestAuthorizeUserIsIntakeRequester() {
	authorizeSaveSystemIntake := AuthorizeUserIsIntakeRequester

	// Setup function to create context with logger and dataloaders
	setupCtx := func() context.Context {
		ctx := context.Background()
		ctx = appcontext.WithLogger(ctx, s.logger)

		// Setup dataloaders similar to how resolver tests do it
		buildDataloaders := func() *dataloaders.Dataloaders {
			return dataloaders.NewDataloaders(
				s.store,
				func(ctx context.Context, s []string) ([]*models.UserInfo, error) { return nil, nil },
				func(ctx context.Context) ([]*models.CedarSystem, error) { return nil, nil },
			)
		}
		ctx = dataloaders.CTXWithLoaders(ctx, buildDataloaders)
		return ctx
	}

	s.Run("No EASi job code fails auth", func() {
		ctx := setupCtx()
		ctx = appcontext.WithPrincipal(ctx, &authentication.EUAPrincipal{JobCodeEASi: false})

		ok := authorizeSaveSystemIntake(ctx, &models.SystemIntake{})
		s.False(ok)
	})

	s.Run("Mismatched EUA ID fails auth", func() {
		ctx := setupCtx()

		// Create user accounts
		requesterEUA := "ABCD"
		otherUserEUA := "ZYXW"

		requesterAccount, err := userhelpers.GetOrCreateUserAccount(
			ctx,
			s.store,
			requesterEUA,
			true,
			userhelpers.GetUserInfoAccountInfoWrapperFunc(func(ctx context.Context, euaID string) (*models.UserInfo, error) {
				return &models.UserInfo{
					Username:    euaID,
					FirstName:   euaID,
					LastName:    "User",
					DisplayName: euaID + " User",
					Email:       models.NewEmailAddress(euaID + "@local.fake"),
				}, nil
			}),
		)
		s.NoError(err)

		// Create intake with requester contact
		intake, err := storage.CreateSystemIntake(ctx, s.store, &models.SystemIntake{
			EUAUserID:   null.StringFrom(requesterEUA),
			RequestType: models.SystemIntakeRequestTypeNEW,
		})
		s.NoError(err)

		// Create requester contact
		contact := models.NewSystemIntakeContact(requesterAccount.ID, requesterAccount.ID)
		contact.SystemIntakeID = intake.ID
		contact.Component = models.SystemIntakeContactComponentCmsWide
		contact.Roles = []models.SystemIntakeContactRole{models.SystemIntakeContactRoleBusinessOwner}
		contact.IsRequester = true
		_, err = storage.CreateSystemIntakeContact(ctx, s.store, contact)
		s.NoError(err)

		// Create other user account
		otherUserAccount, err := userhelpers.GetOrCreateUserAccount(
			ctx,
			s.store,
			otherUserEUA,
			true,
			userhelpers.GetUserInfoAccountInfoWrapperFunc(func(ctx context.Context, euaID string) (*models.UserInfo, error) {
				return &models.UserInfo{
					Username:    euaID,
					FirstName:   euaID,
					LastName:    "User",
					DisplayName: euaID + " User",
					Email:       models.NewEmailAddress(euaID + "@local.fake"),
				}, nil
			}),
		)
		s.NoError(err)

		// Try to authorize as different user
		ctx = appcontext.WithPrincipal(ctx, &authentication.EUAPrincipal{
			EUAID:       otherUserEUA,
			JobCodeEASi: true,
			UserAccount: otherUserAccount,
		})

		ok := authorizeSaveSystemIntake(ctx, intake)
		s.False(ok)
	})

	s.Run("Matched EUA ID passes auth", func() {
		ctx := setupCtx()

		// Create user account
		requesterEUA := "ABCD"
		requesterAccount, err := userhelpers.GetOrCreateUserAccount(
			ctx,
			s.store,
			requesterEUA,
			true,
			userhelpers.GetUserInfoAccountInfoWrapperFunc(func(ctx context.Context, euaID string) (*models.UserInfo, error) {
				return &models.UserInfo{
					Username:    euaID,
					FirstName:   euaID,
					LastName:    "User",
					DisplayName: euaID + " User",
					Email:       models.NewEmailAddress(euaID + "@local.fake"),
				}, nil
			}),
		)
		s.NoError(err)

		// Create intake with requester contact
		intake, err := storage.CreateSystemIntake(ctx, s.store, &models.SystemIntake{
			EUAUserID:   null.StringFrom(requesterEUA),
			RequestType: models.SystemIntakeRequestTypeNEW,
		})
		s.NoError(err)

		// Create requester contact
		contact := models.NewSystemIntakeContact(requesterAccount.ID, requesterAccount.ID)
		contact.SystemIntakeID = intake.ID
		contact.Component = models.SystemIntakeContactComponentCmsWide
		contact.Roles = []models.SystemIntakeContactRole{models.SystemIntakeContactRoleBusinessOwner}
		contact.IsRequester = true
		_, err = storage.CreateSystemIntakeContact(ctx, s.store, contact)
		s.NoError(err)

		// Authorize as the same user
		ctx = appcontext.WithPrincipal(ctx, &authentication.EUAPrincipal{
			EUAID:       requesterEUA,
			JobCodeEASi: true,
			UserAccount: requesterAccount,
		})

		ok := authorizeSaveSystemIntake(ctx, intake)
		s.True(ok)
	})
}

func (s *ServicesTestSuite) TestAuthorizeUserIsBusinessCaseRequester() {
	authorizeSaveBizCase := AuthorizeUserIsBusinessCaseRequester

	// Setup function to create context with logger and dataloaders
	setupCtx := func() context.Context {
		ctx := context.Background()
		ctx = appcontext.WithLogger(ctx, s.logger)

		// Setup dataloaders similar to how resolver tests do it
		buildDataloaders := func() *dataloaders.Dataloaders {
			return dataloaders.NewDataloaders(
				s.store,
				func(ctx context.Context, s []string) ([]*models.UserInfo, error) { return nil, nil },
				func(ctx context.Context) ([]*models.CedarSystem, error) { return nil, nil },
			)
		}
		ctx = dataloaders.CTXWithLoaders(ctx, buildDataloaders)
		return ctx
	}

	s.Run("No EASi job code fails auth", func() {
		ctx := setupCtx()
		ctx = appcontext.WithPrincipal(ctx, &authentication.EUAPrincipal{JobCodeEASi: false})

		ok := authorizeSaveBizCase(ctx, &models.BusinessCase{})

		s.False(ok)
	})

	s.Run("Mismatched EUA ID fails auth", func() {
		ctx := setupCtx()

		// Create user accounts
		requesterEUA := "ABCD"
		otherUserEUA := "ZYXW"

		requesterAccount, err := userhelpers.GetOrCreateUserAccount(
			ctx,
			s.store,
			requesterEUA,
			true,
			userhelpers.GetUserInfoAccountInfoWrapperFunc(func(ctx context.Context, euaID string) (*models.UserInfo, error) {
				return &models.UserInfo{
					Username:    euaID,
					FirstName:   euaID,
					LastName:    "User",
					DisplayName: euaID + " User",
					Email:       models.NewEmailAddress(euaID + "@local.fake"),
				}, nil
			}),
		)
		s.NoError(err)

		// Create intake with requester contact
		intake, err := storage.CreateSystemIntake(ctx, s.store, &models.SystemIntake{
			EUAUserID:   null.StringFrom(requesterEUA),
			RequestType: models.SystemIntakeRequestTypeNEW,
		})
		s.NoError(err)

		// Create requester contact
		contact := models.NewSystemIntakeContact(requesterAccount.ID, requesterAccount.ID)
		contact.SystemIntakeID = intake.ID
		contact.Component = models.SystemIntakeContactComponentCmsWide
		contact.Roles = []models.SystemIntakeContactRole{models.SystemIntakeContactRoleBusinessOwner}
		contact.IsRequester = true
		_, err = storage.CreateSystemIntakeContact(ctx, s.store, contact)
		s.NoError(err)

		// Create other user account
		otherUserAccount, err := userhelpers.GetOrCreateUserAccount(
			ctx,
			s.store,
			otherUserEUA,
			true,
			userhelpers.GetUserInfoAccountInfoWrapperFunc(func(ctx context.Context, euaID string) (*models.UserInfo, error) {
				return &models.UserInfo{
					Username:    euaID,
					FirstName:   euaID,
					LastName:    "User",
					DisplayName: euaID + " User",
					Email:       models.NewEmailAddress(euaID + "@local.fake"),
				}, nil
			}),
		)
		s.NoError(err)

		// Create business case
		bizCase := &models.BusinessCase{
			SystemIntakeID: intake.ID,
			EUAUserID:      requesterEUA,
		}

		// Try to authorize as different user
		ctx = appcontext.WithPrincipal(ctx, &authentication.EUAPrincipal{
			EUAID:       otherUserEUA,
			JobCodeEASi: true,
			UserAccount: otherUserAccount,
		})

		ok := authorizeSaveBizCase(ctx, bizCase)

		s.False(ok)
	})

	s.Run("Matched EUA ID passes auth", func() {
		ctx := setupCtx()

		// Create user account
		requesterEUA := "ABCD"
		requesterAccount, err := userhelpers.GetOrCreateUserAccount(
			ctx,
			s.store,
			requesterEUA,
			true,
			userhelpers.GetUserInfoAccountInfoWrapperFunc(func(ctx context.Context, euaID string) (*models.UserInfo, error) {
				return &models.UserInfo{
					Username:    euaID,
					FirstName:   euaID,
					LastName:    "User",
					DisplayName: euaID + " User",
					Email:       models.NewEmailAddress(euaID + "@local.fake"),
				}, nil
			}),
		)
		s.NoError(err)

		// Create intake with requester contact
		intake, err := storage.CreateSystemIntake(ctx, s.store, &models.SystemIntake{
			EUAUserID:   null.StringFrom(requesterEUA),
			RequestType: models.SystemIntakeRequestTypeNEW,
		})
		s.NoError(err)

		// Create requester contact
		contact := models.NewSystemIntakeContact(requesterAccount.ID, requesterAccount.ID)
		contact.SystemIntakeID = intake.ID
		contact.Component = models.SystemIntakeContactComponentCmsWide
		contact.Roles = []models.SystemIntakeContactRole{models.SystemIntakeContactRoleBusinessOwner}
		contact.IsRequester = true
		_, err = storage.CreateSystemIntakeContact(ctx, s.store, contact)
		s.NoError(err)

		// Create business case
		bizCase := &models.BusinessCase{
			SystemIntakeID: intake.ID,
			EUAUserID:      requesterEUA,
		}

		// Authorize as the same user
		ctx = appcontext.WithPrincipal(ctx, &authentication.EUAPrincipal{
			EUAID:       requesterEUA,
			JobCodeEASi: true,
			UserAccount: requesterAccount,
		})

		ok := authorizeSaveBizCase(ctx, bizCase)

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
			ctx:     appcontext.WithLogger(context.Background(), s.logger),
			allowed: false,
		},
		"non grt": {
			ctx:     appcontext.WithPrincipal(appcontext.WithLogger(context.Background(), s.logger), &nonGRT),
			allowed: false,
		},
		"has grt": {
			ctx:     appcontext.WithPrincipal(appcontext.WithLogger(context.Background(), s.logger), &yesGRT),
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
