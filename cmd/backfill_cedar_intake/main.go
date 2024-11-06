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
	"github.com/cms-enterprise/easi-app/pkg/cedar/intake"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	"github.com/cms-enterprise/easi-app/pkg/testhelpers"
)

func noErr(err error) {
	if err != nil {
		fmt.Println("Error!")
		panic("Aborting")
	}
}

func makeCedarIntakeClient(ldClient *ld.LDClient) *intake.Client {
	cedarAPIHost := os.Getenv(appconfig.CEDARAPIURL)
	cedarAPIKey := os.Getenv(appconfig.CEDARAPIKey)

	client := intake.NewClient(cedarAPIHost, cedarAPIKey, true)
	return client
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

func submitToCEDAR() {
	zapLogger, err := zap.NewDevelopment()
	noErr(err)

	ctx := appcontext.WithLogger(context.Background(), zapLogger)

	td := ldtestdata.DataSource()
	td.Update(td.Flag("emit-to-cedar").BooleanFlag().VariationForAll(true))
	config := ld.Config{
		DataSource: td,
		Events:     ldcomponents.NoEvents(),
	}

	ldClient, err := ld.MakeCustomClient("fake", config, 0)
	if err != nil {
		fmt.Println(err)
		panic("Error initializing ldClient")
	}

	client := makeCedarIntakeClient(ldClient)
	store := makeStore(ldClient)

	// Fetch all intakes
	fmt.Println("Fetching all system intakes")
	fmt.Println("=======================================")
	allIntakes, err := store.FetchSystemIntakes(ctx)
	noErr(err)
	fmt.Println("Found", len(allIntakes), "intakes")

	errors := []error{}
	for _, intake := range allIntakes {
		fmt.Println("Sending system intake", intake.ID.String())
		err = client.PublishSystemIntake(ctx, intake)
		if err != nil {
			errors = append(errors, err)
			fmt.Println("Error sending system intake", err)
		}
		fmt.Println("Successfully sent system intake", intake.ID.String())
		fmt.Println("=======================================")

		fmt.Println("Fetching business case for intake", intake.ID.String())
		businessCase, err := store.FetchBusinessCaseByID(ctx, *intake.BusinessCaseID)
		noErr(err)
		if businessCase == nil {
			fmt.Println("No business case found for intake", intake.ID.String(), ". Skipping")
		} else {
			fmt.Println("Sending business case", businessCase.ID.String(), "with intake ID", intake.ID.String())
			err = client.PublishBusinessCase(ctx, *businessCase)
			if err != nil {
				errors = append(errors, err)
				fmt.Println("Error sending business case", err)
			}
		}
		fmt.Println("=======================================")

		// fmt.Println("Fetching actions for intake", intake.ID.String())
		// actions, err := store.GetActionsByRequestID(ctx, intake.ID)
		// if !errors.Is(err, sql.ErrNoRows) {
		// 	noErr(err)
		// }
		// for _, action := range actions {
		// 	fmt.Println("Sending action", action.ID.String(), "with intake ID", intake.ID.String())
		// 	err = client.PublishAction(ctx, action)
		// 	noErr(err)
		// 	fmt.Println("Successfully sent action", action.ID.String())
		// 	fmt.Println("=======================================")
		// }

		// fmt.Println("Fetching GRT feedback for intake", intake.ID.String())
		// feedbacks, err := store.FetchGRTFeedbacksByIntakeID(ctx, intake.ID)
		// if !errors.Is(err, sql.ErrNoRows) {
		// 	noErr(err)
		// }
		// for _, feedback := range feedbacks {
		// 	fmt.Println("Sending feedback", feedback.ID.String(), "with intake ID", intake.ID.String())
		// 	err = client.PublishGRTFeedback(ctx, *feedback)
		// 	noErr(err)
		// 	fmt.Println("Successfully sent feedback", feedback.ID.String())
		// 	fmt.Println("=======================================")
		// }

		// fmt.Println("Fetching notes for intake", intake.ID.String())
		// notes, err := store.FetchNotesBySystemIntakeID(ctx, intake.ID)
		// if !errors.Is(err, sql.ErrNoRows) {
		// 	noErr(err)
		// }
		// for _, note := range notes {
		// 	fmt.Println("Sending note", note.ID.String(), "with intake ID", intake.ID.String())
		// 	err = client.PublishNote(ctx, *note)
		// 	noErr(err)
		// 	fmt.Println("Successfully sent note", note.ID.String())
		// 	fmt.Println("=======================================")
		// }
	}

	fmt.Println("Finished!")
	fmt.Println("Errors:", errors)
}

var submitCmd = &cobra.Command{
	Use:   "submit",
	Short: "Submit real data to CEDAR Intake",
	Long:  "Submit real data to CEDAR Intake",
	Run: func(cmd *cobra.Command, args []string) {
		submitToCEDAR()
	},
}

var rootCmd = &cobra.Command{
	Use:   "backfill_cedar_intake",
	Short: "Utility for testing functionality related to the CEDAR Intake API",
	Long:  `Utility for either submitting test data to the CEDAR Intake API or dumping the JSON payload that would be submitted to a local file`,
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
