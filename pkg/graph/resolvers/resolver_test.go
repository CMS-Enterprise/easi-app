package resolvers

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appconfig"
	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/authentication"
	"github.com/cmsgov/easi-app/pkg/email"
	"github.com/cmsgov/easi-app/pkg/local"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
	"github.com/cmsgov/easi-app/pkg/upload"

	ld "gopkg.in/launchdarkly/go-server-sdk.v5"
)

// ResolverSuite is the testify suite for the resolver package
type ResolverSuite struct {
	suite.Suite
	testConfigs       *TestConfigs
	fetchUserInfoStub func(context.Context, string) (*models.UserInfo, error)
}

// SetupTest clears the database between each test
func (suite *ResolverSuite) SetupTest() {
	err := suite.testConfigs.Store.TruncateAllTablesDANGEROUS(suite.testConfigs.Logger)
	assert.NoError(suite.T(), err)
}

// TestResolverSuite runs the resolver test suite
func TestResolverSuite(t *testing.T) {
	rs := new(ResolverSuite)
	rs.testConfigs = GetDefaultTestConfigs()
	rs.fetchUserInfoStub = func(context.Context, string) (*models.UserInfo, error) {
		return &models.UserInfo{
			EuaUserID:  "ANON",
			CommonName: "Anonymous",
			Email:      models.NewEmailAddress("anon@local.fake"),
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
		CommonName: "Test User",
		Email:      "testuser@test.com",
		EuaUserID:  "TEST",
	}
	tc.Store, _ = storage.NewStore(tc.DBConfig, tc.LDClient)

	tc.Principal = &authentication.EUAPrincipal{
		EUAID:            tc.UserInfo.EuaUserID,
		JobCodeEASi:      true,
		JobCodeGRT:       true,
		JobCode508User:   true,
		JobCode508Tester: true,
	}
	ctx := appcontext.WithLogger(context.Background(), tc.Logger)
	ctx = appcontext.WithPrincipal(ctx, tc.Principal)
	tc.Context = ctx

	emailClient := NewEmailClient()
	tc.EmailClient = emailClient

}

func NewEmailClient() *email.Client {
	config := testhelpers.NewConfig()
	emailConfig := email.Config{
		GRTEmail:               models.NewEmailAddress(config.GetString(appconfig.GRTEmailKey)),
		ITInvestmentEmail:      models.NewEmailAddress(config.GetString(appconfig.ITInvestmentEmailKey)),
		AccessibilityTeamEmail: models.NewEmailAddress(config.GetString(appconfig.AccessibilityTeamEmailKey)),
		TRBEmail:               models.NewEmailAddress(config.GetString(appconfig.TRBEmailKey)),
		EASIHelpEmail:          models.NewEmailAddress(config.GetString(appconfig.EASIHelpEmailKey)),
		URLHost:                config.GetString(appconfig.ClientHostKey),
		URLScheme:              config.GetString(appconfig.ClientProtocolKey),
		TemplateDirectory:      config.GetString(appconfig.EmailTemplateDirectoryKey),
	}
	localSender := local.NewSender()

	emailClient, _ := email.NewClient(emailConfig, localSender)
	return &emailClient

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
