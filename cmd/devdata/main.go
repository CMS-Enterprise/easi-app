package main

import (
	"context"

	"github.com/guregu/null"
	_ "github.com/lib/pq" // required for postgres driver in sql
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cmsgov/easi-app/pkg/appconfig"
	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func main() {
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

	ldClient, ldErr := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	if ldErr != nil {
		panic(ldErr)
	}

	store, storeErr := storage.NewStore(logger, dbConfig, ldClient)
	if storeErr != nil {
		panic(storeErr)
	}

	ctx := context.Background()

	intake := models.SystemIntake{
		Status:                 models.SystemIntakeStatusLCIDISSUED,
		RequestType:            models.SystemIntakeRequestTypeNEW,
		ProjectName:            null.StringFrom("LCID Issued"),
		BusinessOwner:          null.StringFrom("Shane Clark"),
		BusinessOwnerComponent: null.StringFrom("OIT"),
		LifecycleID:            null.StringFrom("123456"),
	}
	must(store.CreateSystemIntake(ctx, &intake))
	must(store.UpdateSystemIntake(ctx, &intake)) // required to set lifecycle id

	must(store.CreateAccessibilityRequest(ctx, &model.AccessibilityRequest{
		Name:     "Never shown",
		IntakeID: intake.ID,
	}))
}

func must(_ interface{}, err error) {
	if err != nil {
		panic(err)
	}
}
