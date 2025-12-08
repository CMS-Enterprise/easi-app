package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path"
	"path/filepath"

	"github.com/google/uuid"
	"github.com/spf13/cobra"
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"
	"gopkg.in/launchdarkly/go-server-sdk.v5/ldcomponents"
	"gopkg.in/launchdarkly/go-server-sdk.v5/testhelpers/ldtestdata"

	"github.com/cms-enterprise/easi-app/pkg/appconfig"
	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/cedar/intake/translation"
	"github.com/cms-enterprise/easi-app/pkg/dataloaders"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	"github.com/cms-enterprise/easi-app/pkg/testhelpers"
)

func noErr(err error) {
	if err != nil {
		panic(err)
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

func run() {
	zapLogger, err := zap.NewDevelopment()
	noErr(err)

	td := ldtestdata.DataSource()
	config := ld.Config{
		DataSource: td,
		Events:     ldcomponents.NoEvents(),
	}

	ldClient, err := ld.MakeCustomClient("fake", config, 0)
	noErr(err)

	if ldClient == nil {
		panic("unexpected nil ldClient")
	}

	defer func(ldClient *ld.LDClient) {
		noErr(ldClient.Close())
	}(ldClient)

	store := makeStore(ldClient)

	ctx := appcontext.WithLogger(context.Background(), zapLogger)

	buildDataloaders := func() *dataloaders.Dataloaders {
		return dataloaders.NewDataloaders(
			store,
			func(ctx context.Context, s []string) ([]*models.UserInfo, error) { return nil, nil },
			func(ctx context.Context) ([]*models.CedarSystem, error) { return nil, nil },
		)
	}

	ctx = dataloaders.CTXWithLoaders(ctx, buildDataloaders)

	// Fetch all intakes
	fmt.Println("Fetching all system intakes")
	fmt.Println("=======================================")
	allIntakes, err := store.FetchSystemIntakes(ctx)
	noErr(err)
	fmt.Println("Found", len(allIntakes), "intakes")

	var (
		intakeModels  []translation.TranslatableSystemIntake
		bizCaseModels []translation.TranslatableBusinessCase
	)

	for _, systemIntake := range allIntakes {
		intakeModels = append(intakeModels, translation.TranslatableSystemIntake(systemIntake))
		if systemIntake.BusinessCaseID == nil || *systemIntake.BusinessCaseID == uuid.Nil {
			continue
		}

		// get associated biz cases
		bizCase, err := store.FetchBusinessCaseByID(ctx, *systemIntake.BusinessCaseID)
		noErr(err)
		if bizCase == nil {
			continue
		}

		bizCaseModels = append(bizCaseModels, translation.TranslatableBusinessCase(*bizCase))
	}

	fmt.Printf("model intake total: %d\n", len(intakeModels))
	fmt.Printf("biz case total: %d\n", len(bizCaseModels))

	dir, err := os.Getwd()
	noErr(err)

	p := filepath.Clean(path.Join(dir, "cmd", "pull_all_intakes", "output"))

	noErr(os.MkdirAll(filepath.Clean(p), 0700))

	intakeFile, err := os.Create(filepath.Clean(path.Join(p, "intakes.json")))
	noErr(err)
	defer func(intakeFile *os.File) {
		noErr(intakeFile.Close())
	}(intakeFile)

	bizCaseFile, err := os.Create(filepath.Clean(path.Join(p, "biz_cases.json")))
	noErr(err)
	defer func(bizCaseFile *os.File) {
		noErr(bizCaseFile.Close())
	}(bizCaseFile)

	marshalledIntakes, err := json.Marshal(intakeModels)
	noErr(err)

	_, err = intakeFile.Write(marshalledIntakes)
	noErr(err)

	marshalledBizCases, err := json.Marshal(bizCaseModels)
	noErr(err)

	_, err = bizCaseFile.Write(marshalledBizCases)
	noErr(err)
}

var runCmd = &cobra.Command{
	Use:   "run",
	Short: "Generate json file",
	Long:  "Generate json file of all intakes and related business cases",
	Run: func(*cobra.Command, []string) {
		run()
	},
}

var rootCmd = &cobra.Command{
	Use:   "get_all_intakes",
	Short: "Pull all intakes in the format CEDAR expects",
	Long:  "Generates json file of all intakes and related business cases in a format CEDAR can ingest",
}

func init() {
	rootCmd.AddCommand(runCmd)
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
