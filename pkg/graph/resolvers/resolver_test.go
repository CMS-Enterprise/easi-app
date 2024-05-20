package resolvers

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appconfig"
	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/authentication"
	cedarcore "github.com/cmsgov/easi-app/pkg/cedar/core"
	"github.com/cmsgov/easi-app/pkg/dataloaders"
	"github.com/cmsgov/easi-app/pkg/email"
	"github.com/cmsgov/easi-app/pkg/local"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
	"github.com/cmsgov/easi-app/pkg/upload"
	"github.com/cmsgov/easi-app/pkg/userhelpers"

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
func (suite *ResolverSuite) SetupTest() {
	// We need to set the *require.Assertions here, as we need to have already called suite.Run() to ensure the
	// test suite has been constructed before we call suite.Require()
	suite.Assertions = suite.Require()

	// Clean all tables before each test
	err := suite.testConfigs.Store.TruncateAllTablesDANGEROUS(suite.testConfigs.Logger)
	assert.NoError(suite.T(), err)

	// Get the user account from the DB fresh for each test
	princ := getTestPrincipal(suite.testConfigs.Store, suite.testConfigs.UserInfo.Username)
	suite.testConfigs.Principal = princ
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
	ctx = appcontext.WithPrincipal(ctx, getTestPrincipal(tc.Store, tc.UserInfo.Username))
	coreClient := cedarcore.NewClient(ctx, "", "", "", true, true)
	getCedarSystems := func(ctx context.Context) ([]*models.CedarSystem, error) {
		return coreClient.GetSystemSummary(ctx)
	}
	// Set up mocked dataloaders for the test context
	ctx = dataloaders.CTXWithLoaders(ctx, dataloaders.NewDataLoaders(
		tc.Store,
		func(ctx context.Context, s []string) ([]*models.UserInfo, error) { return nil, nil },
		getCedarSystems,
	))

	tc.Context = ctx

	emailClient := NewEmailClient()
	tc.EmailClient = emailClient

}

func NewEmailClient() *email.Client {
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
	localSender := local.NewSender()

	emailClient, _ := email.NewClient(emailConfig, localSender)
	return &emailClient

}

func getTestPrincipal(store *storage.Store, userName string) *authentication.EUAPrincipal {

	userAccount, _ := userhelpers.GetOrCreateUserAccount(context.Background(), store, store, userName, true, userhelpers.GetOktaAccountInfoWrapperFunction(userhelpers.GetUserInfoFromOktaLocal))

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
func (suite *ResolverSuite) createNewIntake() *models.SystemIntake {
	newIntake, err := suite.testConfigs.Store.CreateSystemIntake(suite.testConfigs.Context, &models.SystemIntake{
		// these fields are required by the SQL schema for the system_intakes table, and CreateSystemIntake() doesn't set them to defaults
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	suite.NoError(err)

	return newIntake
}
