package graph

import (
	"context"
	"fmt"
	"testing"

	"github.com/99designs/gqlgen/client"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/guregu/null"
	_ "github.com/lib/pq" // required for postgres driver in sql
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cmsgov/easi-app/pkg/appconfig"
	"github.com/cmsgov/easi-app/pkg/graph/generated"
	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

type GraphQLTestSuite struct {
	suite.Suite
	logger *zap.Logger
	store  *storage.Store
	client *client.Client
}

func TestGraphQLTestSuite(t *testing.T) {
	config := testhelpers.NewConfig()

	logger, loggerErr := zap.NewDevelopment()
	if loggerErr != nil {
		panic(loggerErr)
	}

	dbConfig := storage.DBConfig{
		Host:     config.GetString(appconfig.DBHostConfigKey),
		Port:     config.GetString(appconfig.DBPortConfigKey),
		Database: config.GetString(appconfig.DBNameConfigKey),
		Username: config.GetString(appconfig.DBUsernameConfigKey),
		Password: config.GetString(appconfig.DBPasswordConfigKey),
		SSLMode:  config.GetString(appconfig.DBSSLModeConfigKey),
	}

	ldClient, err := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	assert.NoError(t, err)

	store, err := storage.NewStore(logger, dbConfig, ldClient)
	if err != nil {
		fmt.Printf("Failed to get new database: %v", err)
		t.Fail()
	}

	graphQLClient := client.New(handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: NewResolver(store)})))

	storeTestSuite := &GraphQLTestSuite{
		Suite:  suite.Suite{},
		logger: logger,
		store:  store,
		client: graphQLClient,
	}

	suite.Run(t, storeTestSuite)
}

func (s GraphQLTestSuite) TestQueries() {
	ctx := context.Background()

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		ProjectName: null.StringFrom("Big Project"),
		Status:      models.SystemIntakeStatusLCIDISSUED,
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(intakeErr)

	// Can't set a lifecycle ID when creating system intake, so we need to do this to set that
	// so we can then query for the system within the resolver
	lifecycleID, lcidErr := s.store.GenerateLifecycleID(ctx)
	s.NoError(lcidErr)
	intake.LifecycleID = null.StringFrom(lifecycleID)
	_, updateErr := s.store.UpdateSystemIntake(ctx, intake)
	s.NoError(updateErr)

	accessibilityRequest, requestErr := s.store.CreateAccessibilityRequest(ctx, &model.AccessibilityRequest{
		IntakeID: intake.ID,
	})
	s.NoError(requestErr)

	var resp struct {
		AccessibilityRequest struct {
			ID     string
			System struct {
				ID   string
				Name string
			}
		}
	}

	fmt.Println(intake.ID)
	fmt.Println(accessibilityRequest.ID)
	// runtime.Breakpoint()

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(fmt.Sprintf(
		`query {
			accessibilityRequest(id: "%s") {
				id
				system {
					id
					name
				}
			}
		}`, accessibilityRequest.ID), &resp)

	s.Equal(accessibilityRequest.ID.String(), resp.AccessibilityRequest.ID)
	s.Equal(intake.ID.String(), resp.AccessibilityRequest.System.ID)
	s.Equal(intake.ProjectName.String, resp.AccessibilityRequest.System.Name)
}
