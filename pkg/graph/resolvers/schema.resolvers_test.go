package resolvers

import (
	"context"
	"fmt"
	"net/url"
	"testing"
	"time"

	"github.com/99designs/gqlgen/client"
	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/client/metadata"
	"github.com/aws/aws-sdk-go/aws/request"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3iface"
	_ "github.com/lib/pq" // required for postgres driver in sql
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"github.com/vektah/gqlparser/v2/ast"
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cms-enterprise/easi-app/pkg/appconfig"
	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
	cedarcore "github.com/cms-enterprise/easi-app/pkg/cedar/core"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/graph/generated"
	"github.com/cms-enterprise/easi-app/pkg/local"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	"github.com/cms-enterprise/easi-app/pkg/testhelpers"
	"github.com/cms-enterprise/easi-app/pkg/upload"
)

type GraphQLTestSuite struct {
	suite.Suite
	logger   *zap.Logger
	store    *storage.Store
	client   *client.Client
	s3Client *mockS3Client
	resolver *Resolver
	context  context.Context
}

func (s *GraphQLTestSuite) BeforeTest() {
	s.s3Client.AVStatus = ""
}

type mockS3Client struct {
	s3iface.S3API
	AVStatus string
}

func (m mockS3Client) PutObjectRequest(input *s3.PutObjectInput) (*request.Request, *s3.PutObjectOutput) {

	newRequest := request.New(
		aws.Config{},
		metadata.ClientInfo{},
		request.Handlers{},
		nil,
		&request.Operation{},
		nil,
		nil,
	)

	newRequest.Handlers.Sign.PushFront(func(r *request.Request) {
		r.HTTPRequest.URL = &url.URL{Host: "signed.example.com", Path: "signed/put/123", Scheme: "https"}
	})
	return newRequest, &s3.PutObjectOutput{}
}

func (m mockS3Client) GetObjectRequest(input *s3.GetObjectInput) (*request.Request, *s3.GetObjectOutput) {
	newRequest := request.New(
		aws.Config{},
		metadata.ClientInfo{},
		request.Handlers{},
		nil,
		&request.Operation{},
		nil,
		nil,
	)

	newRequest.Handlers.Sign.PushFront(func(r *request.Request) {
		r.HTTPRequest.URL = &url.URL{Host: "signed.example.com", Path: "signed/get/123", Scheme: "https"}
	})
	return newRequest, &s3.GetObjectOutput{}
}

func (m mockS3Client) GetObjectTagging(input *s3.GetObjectTaggingInput) (*s3.GetObjectTaggingOutput, error) {
	if m.AVStatus == "" {
		return &s3.GetObjectTaggingOutput{}, nil
	}

	return &s3.GetObjectTaggingOutput{
		TagSet: []*s3.Tag{{
			Key:   aws.String(upload.AVStatusTagName),
			Value: aws.String(m.AVStatus),
		}},
	}, nil
}

func TestGraphQLTestSuite(t *testing.T) {
	config := testhelpers.NewConfig()

	logger, loggerErr := zap.NewDevelopment()
	if loggerErr != nil {
		panic(loggerErr)
	}

	dbConfig := storage.DBConfig{
		Host:           config.GetString(appconfig.DBHostConfigKey),
		Port:           config.GetString(appconfig.DBPortConfigKey),
		Database:       config.GetString(appconfig.DBNameConfigKey),
		Username:       config.GetString(appconfig.DBUsernameConfigKey),
		Password:       config.GetString(appconfig.DBPasswordConfigKey),
		SSLMode:        config.GetString(appconfig.DBSSLModeConfigKey),
		MaxConnections: config.GetInt(appconfig.DBMaxConnections),
	}

	ldClient, err := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	assert.NoError(t, err)

	store, err := storage.NewStore(dbConfig, ldClient)
	if err != nil {
		fmt.Printf("Failed to get new database: %v", err)
		t.FailNow()
	}

	s3Config := upload.Config{Bucket: "easi-test-bucket", Region: "us-west", IsLocal: false}
	mockClient := mockS3Client{}
	s3Client := upload.NewS3ClientUsingClient(&mockClient, s3Config)

	// set up Email Client
	emailConfig := email.Config{
		GRTEmail:          models.NewEmailAddress(config.GetString(appconfig.GRTEmailKey)),
		URLHost:           config.GetString(appconfig.ClientHostKey),
		URLScheme:         config.GetString(appconfig.ClientProtocolKey),
		TemplateDirectory: config.GetString(appconfig.EmailTemplateDirectoryKey),
	}

	env, _ := appconfig.NewEnvironment("test") // hardcoding here rather than using real env vars so we can have predictable the output in our tests

	localSender := local.NewSender(env)
	emailClient, err := email.NewClient(emailConfig, localSender)
	if err != nil {
		t.FailNow()
	}

	oktaAPIClient := local.NewOktaAPIClient()
	cedarCoreClient := cedarcore.NewClient(appcontext.WithLogger(context.Background(), logger), "fake", "fake", "1.0.0", false, true)

	directives := generated.DirectiveRoot{HasRole: func(ctx context.Context, obj interface{}, next graphql.Resolver, role models.Role) (res interface{}, err error) {
		return next(ctx)
	}}

	submitIntake := func(ctx context.Context, intake *models.SystemIntake, action *models.Action) error {
		_, err := store.CreateAction(ctx, action)
		if err != nil {
			return err
		}

		_, err = store.UpdateSystemIntake(ctx, intake)
		if err != nil {
			return err
		}
		return nil
	}

	var resolverService ResolverService
	resolverService.SubmitIntake = submitIntake
	resolverService.FetchUserInfo = oktaAPIClient.FetchUserInfo
	resolverService.SearchCommonNameContains = oktaAPIClient.SearchCommonNameContains

	resolver := NewResolver(store, resolverService, &s3Client, &emailClient, ldClient, cedarCoreClient)
	schema := generated.NewExecutableSchema(generated.Config{Resolvers: resolver, Directives: directives})

	buildDataloaders := func() *dataloaders.Dataloaders {
		return dataloaders.NewDataloaders(
			store,
			oktaAPIClient.FetchUserInfos,
			func(ctx context.Context) ([]*models.CedarSystem, error) { return nil, nil },
		)
	}

	graphQLClient := client.New(
		newTestGQLServer(schema),
		addDataloadersToGraphQLClientTest(buildDataloaders),
	)

	ctx := context.Background()
	ctx = dataloaders.CTXWithLoaders(ctx, buildDataloaders)

	storeTestSuite := &GraphQLTestSuite{
		Suite:    suite.Suite{},
		logger:   logger,
		store:    store,
		client:   graphQLClient,
		s3Client: &mockClient,
		resolver: resolver,
		context:  ctx,
	}

	suite.Run(t, storeTestSuite)
}

func newTestGQLServer(es graphql.ExecutableSchema) *handler.Server {
	srv := handler.New(es)

	srv.AddTransport(transport.Websocket{
		KeepAlivePingInterval: 10 * time.Second,
	})
	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})
	srv.AddTransport(transport.MultipartForm{})

	srv.SetQueryCache(lru.New[*ast.QueryDocument](1000))

	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New[string](100),
	})

	return srv
}

// addDataloadersToGraphQLClientTest adds all dataloaders into the test context for use in tests
func addDataloadersToGraphQLClientTest(buildDataloaders dataloaders.BuildDataloaders) func(*client.Request) {
	return func(request *client.Request) {
		ctx := request.HTTP.Context()
		ctx = dataloaders.CTXWithLoaders(ctx, buildDataloaders)
		request.HTTP = request.HTTP.WithContext(ctx)
	}
}

// addAuthWithAllJobCodesToGraphQLClientTest adds authentication for all job codes
func addAuthWithAllJobCodesToGraphQLClientTest(euaID string) func(*client.Request) {
	return func(request *client.Request) {
		ctx := appcontext.WithPrincipal(request.HTTP.Context(), &authentication.EUAPrincipal{
			EUAID:       euaID,
			JobCodeEASi: true,
			JobCodeGRT:  true,
		})

		request.HTTP = request.HTTP.WithContext(ctx)
	}
}
