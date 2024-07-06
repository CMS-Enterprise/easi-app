package resolvers

import (
	"context"
	"testing"

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
	princ := getTestPrincipal(s.testConfigs.Context, s.testConfigs.Store, s.testConfigs.UserInfo.Username)
	s.testConfigs.Principal = princ

	// get new dataloaders to clear any existing cached data
	s.testConfigs.Context = s.ctxWithNewDataloaders()
}

// TestResolverSuite runs the resolver test suite
func TestResolverSuite(t *testing.T) {
	rs := new(ResolverSuite)
	rs.testConfigs = GetDefaultTestConfigs()
	rs.fetchUserInfoStub = func(context.Context, string) (*models.UserInfo, error) {
		return &models.UserInfo{
			Username:    "ANON",
			DisplayName: "Anonymous",
			Email:       models.NewEmailAddress("anon@local.fake"),
		}, nil
	}
	suite.Run(t, rs)
}

// TestConfigs is a struct that contains all the dependencies needed to run a test
type TestConfigs struct {
	DBConfig    storage.DBConfig
	LDClient    *ld.LDClient
	S3Client    *upload.S3Client
	Logger      *zap.Logger
	UserInfo    *models.UserInfo
	Store       *storage.Store
	Principal   *authentication.EUAPrincipal
	Context     context.Context
	EmailClient *email.Client
	Sender      *mockSender
}

type mockSender struct {
	toAddresses []models.EmailAddress
	ccAddresses []models.EmailAddress
	subject     string
	body        string
}

func (s *mockSender) Send(ctx context.Context, toAddresses []models.EmailAddress, ccAddresses []models.EmailAddress, subject string, body string) error {
	s.toAddresses = toAddresses
	s.ccAddresses = ccAddresses
	s.subject = subject
	s.body = body
	return nil
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

	// create the test context
	// principal is fetched between each test in SetupTest()
	ctx := appcontext.WithLogger(context.Background(), tc.Logger)
	ctx = appcontext.WithPrincipal(ctx, getTestPrincipal(ctx, tc.Store, tc.UserInfo.Username))

	tc.Context = ctx

	localSender := mockSender{}
	tc.Sender = &localSender
	emailClient := NewEmailClient(&localSender)
	tc.EmailClient = emailClient
}

func NewEmailClient(sender *mockSender) *email.Client {
	config := testhelpers.NewConfig()
	emailConfig := email.Config{
		GRTEmail:          models.NewEmailAddress(config.GetString(appconfig.GRTEmailKey)),
		ITInvestmentEmail: models.NewEmailAddress(config.GetString(appconfig.ITInvestmentEmailKey)),
		TRBEmail:          models.NewEmailAddress(config.GetString(appconfig.TRBEmailKey)),
		EASIHelpEmail:     models.NewEmailAddress(config.GetString(appconfig.EASIHelpEmailKey)),
		URLHost:           config.GetString(appconfig.ClientHostKey),
		URLScheme:         config.GetString(appconfig.ClientProtocolKey),
		TemplateDirectory: config.GetString(appconfig.EmailTemplateDirectoryKey),
	}

	emailClient, _ := email.NewClient(emailConfig, sender)
	return &emailClient
}

func getTestPrincipal(ctx context.Context, store *storage.Store, userName string) *authentication.EUAPrincipal {

	userAccount, _ := userhelpers.GetOrCreateUserAccount(ctx, store, store, userName, true, userhelpers.GetOktaAccountInfoWrapperFunction(userhelpers.GetUserInfoFromOktaLocal))

	princ := &authentication.EUAPrincipal{
		EUAID:       userName,
		JobCodeEASi: true,
		JobCodeGRT:  true,
		UserAccount: userAccount,
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
func (s *ResolverSuite) createNewIntake() *models.SystemIntake {
	newIntake, err := s.testConfigs.Store.CreateSystemIntake(s.testConfigs.Context, &models.SystemIntake{
		// these fields are required by the SQL schema for the system_intakes table, and CreateSystemIntake() doesn't set them to defaults
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(err)

	return newIntake
}

// utility method for creating a valid new system intake, checking for any errors
func (s *ResolverSuite) createNewTRBRequest() *models.TRBRequest {
	newTRBRequest, err := CreateTRBRequest(s.testConfigs.Context, models.TRBTBrainstorm, s.testConfigs.Store)
	s.NoError(err)

	return newTRBRequest
}

// utility method to get userAcct in resolver tests
func (s *ResolverSuite) getOrCreateUserAcct(euaUserID string) *authentication.UserAccount {
	ctx := s.testConfigs.Context
	store := s.testConfigs.Store
	okta := local.NewOktaAPIClient()
	userAcct, err := sqlutils.WithTransactionRet(ctx, store, func(tx *sqlx.Tx) (*authentication.UserAccount, error) {
		user, err := userhelpers.GetOrCreateUserAccount(ctx, tx, store, euaUserID, false, userhelpers.GetUserInfoAccountInfoWrapperFunc(okta.FetchUserInfo))
		if err != nil {
			return nil, err
		}
		return user, nil
	})
	s.NoError(err)
	return userAcct
}

// ctxWithNewDataloaders sets new Dataloaders on the test suite's existing context and returns that context.
// this is necessary in order to avoid the caching feature of the dataloadgen library.
// that caching feature is great for app code, but in test code, where we often load something,
// update that thing, and load it again to confirm updates worked, caching the first version breaks that flow
func (s *ResolverSuite) ctxWithNewDataloaders() context.Context {
	fetchUserInfos := func(ctx context.Context, euaUserIDs []string) ([]*models.UserInfo, error) {
		return nil, nil
	}

	coreClient := cedarcore.NewClient(s.testConfigs.Context, "", "", "", true, true)
	getCedarSystems := func(ctx context.Context) ([]*models.CedarSystem, error) {
		return coreClient.GetSystemSummary(ctx)
	}

	buildDataloaders := func() *dataloaders.Dataloaders {
		return dataloaders.NewDataloaders(s.testConfigs.Store, fetchUserInfos, getCedarSystems)
	}

	// Set up mocked dataloaders for the test context
	s.testConfigs.Context = dataloaders.CTXWithLoaders(s.testConfigs.Context, buildDataloaders)
	return s.testConfigs.Context
}
