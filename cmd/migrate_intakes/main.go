package main

import (
	"context"
	"fmt"
	"os"

	"github.com/spf13/cobra"
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"
	"gopkg.in/launchdarkly/go-server-sdk.v5/ldcomponents"
	"gopkg.in/launchdarkly/go-server-sdk.v5/testhelpers/ldtestdata"

	"github.com/cms-enterprise/easi-app/pkg/appconfig"
	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	"github.com/cms-enterprise/easi-app/pkg/testhelpers"
)

func noErr(err error) {
	if err != nil {
		fmt.Println("Error!")
		fmt.Println(err)
		panic("Aborting")
	}
}

func makeStore(ldClient *ld.LDClient) *storage.Store {
	config := testhelpers.NewConfig()

	dbConfig := storage.DBConfig{
		Host:           config.GetString(appconfig.DBHostConfigKey),
		Port:           config.GetString(appconfig.DBPortConfigKey),
		Database:       config.GetString(appconfig.DBNameConfigKey),
		Username:       config.GetString(appconfig.DBUsernameConfigKey),
		Password:       config.GetString(appconfig.DBPasswordConfigKey),
		SSLMode:        config.GetString(appconfig.DBSSLModeConfigKey),
		MaxConnections: config.GetInt(appconfig.DBMaxConnections),
	}

	store, storeErr := storage.NewStore(dbConfig, ldClient)
	if storeErr != nil {
		panic(storeErr)
	}
	return store
}

func migrateIntakes() {
	zapLogger, err := zap.NewDevelopment()
	noErr(err)

	ctx := appcontext.WithLogger(context.Background(), zapLogger)

	td := ldtestdata.DataSource()
	config := ld.Config{
		DataSource: td,
		Events:     ldcomponents.NoEvents(),
	}

	ldClient, err := ld.MakeCustomClient("fake", config, 0)
	if err != nil {
		fmt.Println(err)
		panic("Error initializing ldClient")
	}

	store := makeStore(ldClient)

	// Fetch all intakes
	fmt.Println("Fetching all system intakes")
	fmt.Println("=======================================")
	allIntakes, err := store.FetchSystemIntakes(ctx)
	noErr(err)

	totalNum := len(allIntakes)
	for idx, i := range allIntakes {
		fmt.Println("Processing intake", idx+1, "of", totalNum)
		intake := i // prevent gosec's G601 -- Implicit memory aliasing in for loop.
		fmt.Println("Preparing to update system intake", intake.ID.String())

		bizCase, err := store.GetBusinessCaseBySystemIntakeID(ctx, intake.ID)
		noErr(err)
		if bizCase != nil {
			fmt.Println("Found biz case for intake", intake.ID.String())
			if intake.Step == models.SystemIntakeStepDECISION {
				intake.FinalBusinessCaseState = models.SIRFSSubmitted
			} else {
				intake.DraftBusinessCaseState = models.SIRFSInProgress
			}
		}

		_, err = store.UpdateSystemIntake(ctx, &intake)
		noErr(err)
		fmt.Println("Updated system intake", intake.ID.String())
		fmt.Println("=======================================")
	}
}

var submitCmd = &cobra.Command{
	Use:   "migrate",
	Short: "Migrate V1 System Intakes to V2 by setting V2-specific fields",
	Run: func(cmd *cobra.Command, args []string) {
		migrateIntakes()
	},
}

var rootCmd = &cobra.Command{
	Use:   "migrate_intakes",
	Short: "Utility for migrating V1 Intakes to V2",
}

func init() {
	rootCmd.AddCommand(submitCmd)
}

func execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func main() {
	execute()
}
