package resolvers

import (
	"context"
	"testing"

	"github.com/guregu/null"
	"github.com/jmoiron/sqlx"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appconfig"
	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
	cedarcore "github.com/cms-enterprise/easi-app/pkg/cedar/core"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/local"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	"github.com/cms-enterprise/easi-app/pkg/testhelpers"
	"github.com/cms-enterprise/easi-app/pkg/upload"
	"github.com/cms-enterprise/easi-app/pkg/userhelpers"
	"github.com/cms-enterprise/easi-app/pkg/usersearch"

	ld "gopkg.in/launchdarkly/go-server-sdk.v5"
)

// ResolverSuite is the testify suite for the resolver package
type ResolverSuite struct {
	suite.Suite
	*require.Assertions // included so that calls to things like ResolverSuite.NoError or ResolverSuite.Equal() use the "require" version instead of "assert"
	testConfigs         *TestConfigs
	fetchUserInfoStub   func(context.Context, string) (*models.UserInfo, error)
}

// SetupTest clears the database between each test
func (s *ResolverSuite) SetupTest() {
	// We need to set the *require.Assertions here, as we need to have already called suite.Run() to ensure the
	// test suite has been constructed before we call suite.Require()
	s.Assertions = s.Require()

	// Clean all tables before each test
	err := s.testConfigs.Store.TruncateAllTablesDANGEROUS(s.testConfigs.Logger)
	assert.NoError(s.T(), err)

	// Get the user account from the DB fresh for each test
	princ := s.getTestPrincipal(s.testConfigs.Context, s.testConfigs.Store, s.testConfigs.UserInfo.Username, true)
	s.testConfigs.Principal = princ

	// get new dataloaders to clear any existing cached data
	s.testConfigs.Context = s.ctxWithNewDataloaders()

	// Since we are recreating the context we need to wrap all expected values on the context (like the principal)
	s.testConfigs.Context = appcontext.WithLogger(s.testConfigs.Context, s.testConfigs.Logger)
	s.testConfigs.Context = appcontext.WithPrincipal(s.testConfigs.Context, princ)

	// Clear email data between tests
	s.testConfigs.Sender.Clear()
}

func (s *ResolverSuite) getTestContextWithPrincipal(euaID string, isAdmin bool) (context.Context, *authentication.EUAPrincipal) {
	princ := s.getTestPrincipal(s.testConfigs.Context, s.testConfigs.Store, euaID, isAdmin)
	return appcontext.WithPrincipal(s.testConfigs.Context, princ), princ
}

// TestResolverSuite runs the resolver test suite
func TestResolverSuite(t *testing.T) {
	rs := new(ResolverSuite)
	rs.testConfigs = GetDefaultTestConfigs()
	rs.fetchUserInfoStub = func(ctx context.Context, username string) (*models.UserInfo, error) {
		return &models.UserInfo{
			Username:    username,
			FirstName:   username,
			LastName:    "Doe",
			DisplayName: username + " Doe",
			Email:       models.NewEmailAddress(username + ".doe@local.fake"),
		}, nil
	}
	suite.Run(t, rs)
}

// TestConfigs is a struct that contains all the dependencies needed to run a test
type TestConfigs struct {
	DBConfig         storage.DBConfig
	LDClient         *ld.LDClient
	S3Client         *upload.S3Client
	Logger           *zap.Logger
	UserInfo         *models.UserInfo
	Store            *storage.Store
	Principal        *authentication.EUAPrincipal
	Context          context.Context
	EmailClient      *email.Client
	Sender           *mockSender
	UserSearchClient usersearch.Client
}

type mockSender struct {
	toAddresses  []models.EmailAddress
	ccAddresses  []models.EmailAddress
	bccAddresses []models.EmailAddress
	subject      string
	body         string
	emailWasSent bool
	sentEmails   []email.Email
}

func (s *mockSender) Send(ctx context.Context, emailData email.Email) error {
	s.toAddresses = emailData.ToAddresses
	s.ccAddresses = emailData.CcAddresses
	s.bccAddresses = emailData.BccAddresses
	s.subject = emailData.Subject
	s.body = emailData.Body
	s.emailWasSent = true
	s.sentEmails = append(s.sentEmails, emailData)
	return nil
}

func (s *mockSender) Clear() {
	s.toAddresses = []models.EmailAddress{}
	s.ccAddresses = []models.EmailAddress{}
	s.bccAddresses = []models.EmailAddress{}
	s.subject = ""
	s.body = ""
	s.emailWasSent = false
	s.sentEmails = []email.Email{}
}

// GetDefaultTestConfigs returns a TestConfigs struct with all the dependencies needed to run a test
func GetDefaultTestConfigs() *TestConfigs {
	tc := TestConfigs{}
	tc.GetDefaults()
	return &tc
}

// GetDefaults sets the dependencies for the TestConfigs struct
func (tc *TestConfigs) GetDefaults() {
	tc.DBConfig = NewDBConfig()
	tc.LDClient, _ = ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)

	s3Client := upload.NewS3Client(newS3Config())
	tc.S3Client = &s3Client

	tc.Logger = zap.NewNop()
	tc.UserInfo = &models.UserInfo{
		DisplayName: "Test User",
		Email:       "testuser@test.com",
		Username:    "TEST",
	}
	tc.Store, _ = storage.NewStore(tc.DBConfig, tc.LDClient)

	localOktaClient := local.NewOktaAPIClient()
	tc.UserSearchClient = localOktaClient

	// create the test context, note because of the data loaders, the context gets recreated before each test.
	tc.Context = context.Background()

	emailClient, localSender := NewEmailClient()
	tc.Sender = localSender
	tc.EmailClient = emailClient
}

func getTestEmailConfig() email.Config {
	config := testhelpers.NewConfig()
	return email.Config{
		GRTEmail:          models.NewEmailAddress(config.GetString(appconfig.GRTEmailKey)),
		ITInvestmentEmail: models.NewEmailAddress(config.GetString(appconfig.ITInvestmentEmailKey)),
		TRBEmail:          models.NewEmailAddress(config.GetString(appconfig.TRBEmailKey)),
		EASIHelpEmail:     models.NewEmailAddress(config.GetString(appconfig.EASIHelpEmailKey)),
		URLHost:           config.GetString(appconfig.ClientHostKey),
		URLScheme:         config.GetString(appconfig.ClientProtocolKey),
		TemplateDirectory: config.GetString(appconfig.EmailTemplateDirectoryKey),
	}
}

func NewEmailClient() (*email.Client, *mockSender) {
	sender := &mockSender{}
	emailConfig := getTestEmailConfig()
	emailClient, _ := email.NewClient(emailConfig, sender)
	return &emailClient, sender
}

// getTestPrincipal gets a user principal from database
func (s *ResolverSuite) getTestPrincipal(ctx context.Context, store *storage.Store, userName string, isAdmin bool) *authentication.EUAPrincipal {

	userAccount, _ := userhelpers.GetOrCreateUserAccount(ctx, store, userName, true, userhelpers.GetUserInfoAccountInfoWrapperFunc(s.testConfigs.UserSearchClient.FetchUserInfo))

	princ := &authentication.EUAPrincipal{
		EUAID:           userName,
		JobCodeEASi:     true,
		JobCodeGRT:      isAdmin,
		JobCodeTRBAdmin: isAdmin,
		UserAccount:     userAccount,
	}
	return princ

}

// NewDBConfig returns a DBConfig struct with values from appconfig
func NewDBConfig() storage.DBConfig {
	config := testhelpers.NewConfig()

	return storage.DBConfig{
		Host:           config.GetString(appconfig.DBHostConfigKey),
		Port:           config.GetString(appconfig.DBPortConfigKey),
		Database:       config.GetString(appconfig.DBNameConfigKey),
		Username:       config.GetString(appconfig.DBUsernameConfigKey),
		Password:       config.GetString(appconfig.DBPasswordConfigKey),
		SSLMode:        config.GetString(appconfig.DBSSLModeConfigKey),
		MaxConnections: config.GetInt(appconfig.DBMaxConnections),
	}
}

func newS3Config() upload.Config {
	config := testhelpers.NewConfig()
	return upload.Config{
		IsLocal: true,
		Bucket:  config.GetString(appconfig.AWSS3FileUploadBucket),
		Region:  config.GetString(appconfig.AWSRegion),
	}
}

// utility method for creating a valid new system intake, checking for any errors
func (s *ResolverSuite) createNewIntake(ops ...func(*models.SystemIntake)) *models.SystemIntake {
	// Future Enhancement:  this should refactored to use a resolver and not a store method look at createNewIntakeWithResolver
	newIntake, err := storage.CreateSystemIntake(s.testConfigs.Context, s.testConfigs.Store, &models.SystemIntake{
		ProjectName: null.StringFrom("TEST"),
		// these fields are required by the SQL schema for the system_intakes table, and CreateSystemIntake() doesn't set them to defaults
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(err)
	for _, op := range ops {
		op(newIntake)
	}
	if len(ops) > 0 {
		newIntake, err = s.testConfigs.Store.UpdateSystemIntake(s.testConfigs.Context, newIntake)
		s.NoError(err)
	}

	return newIntake
}

// createNewIntakeWithResolver creates a new system intake using the CreateSystemIntake resolver function, which will also create a requester contact
func (s *ResolverSuite) createNewIntakeWithResolver(callbacks ...func(*models.SystemIntake)) *models.SystemIntake {

	CreateSystemIntakeInput := models.CreateSystemIntakeInput{
		Requester: &models.SystemIntakeRequesterInput{
			Name: "Test User Common Name",
		},
		// ProjectName: null.StringFrom("TEST"),
		RequestType: models.SystemIntakeRequestTypeNEW,
	}
	intake, err := CreateSystemIntake(s.ctxWithNewDataloaders(), s.testConfigs.Store, CreateSystemIntakeInput, userhelpers.GetUserInfoAccountInfoWrapperFunc(s.testConfigs.UserSearchClient.FetchUserInfo))
	s.NoError(err)
	s.NotNil(intake)

	for _, hook := range callbacks {
		hook(intake)
	}
	if len(callbacks) > 0 {
		intake, err = s.testConfigs.Store.UpdateSystemIntake(s.testConfigs.Context, intake)
		s.NoError(err)
	}
	return intake

}

// utility method for creating a valid new TRB Request, checking for any errors
func (s *ResolverSuite) createNewTRBRequest(ops ...func(*models.TRBRequest)) *models.TRBRequest {
	newTRBRequest, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, s.testConfigs.Store)
	s.NoError(err)

	for _, op := range ops {
		op(newTRBRequest)
	}
	if len(ops) > 0 {
		newTRBRequest, err = s.testConfigs.Store.UpdateTRBRequest(s.testConfigs.Context, newTRBRequest)
		s.NoError(err)
	}
	return newTRBRequest
}

// utility method to get userAcct in resolver tests
func (s *ResolverSuite) getOrCreateUserAcct(euaUserID string) *authentication.UserAccount {
	ctx := s.testConfigs.Context
	store := s.testConfigs.Store
	okta := local.NewOktaAPIClient()
	userAcct, err := sqlutils.WithTransactionRet(ctx, store, func(tx *sqlx.Tx) (*authentication.UserAccount, error) {
		user, err := userhelpers.GetOrCreateUserAccount(ctx, tx, euaUserID, false, userhelpers.GetUserInfoAccountInfoWrapperFunc(okta.FetchUserInfo))
		if err != nil {
			return nil, err
		}
		return user, nil
	})
	s.NoError(err)
	return userAcct
}

// utility method to get userAcct in resolver tests
func (s *ResolverSuite) getOrCreateUserAccts(euaUserIDs ...string) []*authentication.UserAccount {
	ctx := s.testConfigs.Context
	store := s.testConfigs.Store
	okta := local.NewOktaAPIClient()
	userAccts, err := sqlutils.WithTransactionRet(ctx, store, func(tx *sqlx.Tx) ([]*authentication.UserAccount, error) {
		users, err := userhelpers.GetOrCreateUserAccounts(ctx, tx, euaUserIDs, false, userhelpers.GetUserInfoAccountInfosWrapperFunc(okta.FetchUserInfos))
		if err != nil {
			return nil, err
		}
		return users, nil
	})
	s.NoError(err)
	return userAccts
}

// ctxWithNewDataloaders sets new Dataloaders on the test suite's existing context and returns that context.
// this is necessary in order to avoid the caching feature of the dataloadgen library.
// that caching feature is great for app code, but in test code, where we often load something,
// update that thing, and load it again to confirm updates worked, caching the first version breaks that flow
func (s *ResolverSuite) ctxWithNewDataloaders() context.Context {

	coreClient := cedarcore.NewClient(s.testConfigs.Context, "", "", "", true, true)
	getCedarSystems := func(ctx context.Context) ([]*models.CedarSystem, error) {
		return coreClient.GetSystemSummary(ctx)
	}

	buildDataloaders := func() *dataloaders.Dataloaders {
		return dataloaders.NewDataloaders(s.testConfigs.Store, s.testConfigs.UserSearchClient.FetchUserInfos, getCedarSystems)
	}

	// Set up mocked dataloaders for the test context
	s.testConfigs.Context = dataloaders.CTXWithLoaders(s.testConfigs.Context, buildDataloaders)
	return s.testConfigs.Context
}
