package main

import (
	"context"
	_ "embed"
	"fmt"
	"log"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
)

//go:embed sql/get_system_intake_contact_names.sql
var getAllNamesSQL string

//go:embed sql/get_system_intake_contact_username.sql
var getAllUsernamesSQL string

var queryContactCommonNameCmd = &cobra.Command{
	Use:   "contactCommonName",
	Short: "Query unique common names in the database and output to json file",
	Long:  "Query unique common names in the database and output to json file",
	Run: func(cmd *cobra.Command, args []string) {
		QuerySystemIntakeContactCommonNamesAndExportToJSON()
	},
}

var queryContactUsernameCmd = &cobra.Command{
	Use:   "contactUsername",
	Short: "Query unique usernames in the system intake contacts table and output to json file",
	Long:  "Query unique usernames in the system intake contacts table and output to json file",
	Run: func(cmd *cobra.Command, args []string) {
		QuerySystemIntakeContactUsernamesAndExportToJSON()
	},
}

var generateUserAccountsByContactUsernamesCmd = &cobra.Command{
	Use:   "generateUserFromContactUsernames",
	Short: "Create user accounts from contact_usernames.JSON",
	Long:  "This command creates user accounts by the list of usernames stored in contact_usernames.JSON exported from system intake contacts.",
	Run: func(cmd *cobra.Command, args []string) {
		ReadContactUsernamesFromJSONAndCreateAccounts()
	},
}

var generateUserAccountsByContactCommonNamesCmd = &cobra.Command{
	Use:   "generateUserFromContactCommonNames",
	Short: "Create user accounts from contact_common_names.JSON",
	Long:  "This command creates user accounts by the list of common names stored in contact_common_names.JSON exported from system intake contacts.",
	Run: func(cmd *cobra.Command, args []string) {
		ReadContactCommonNamesFromJSONAndCreateAccounts()
	},
}

func (u *Uploader) QuerySystemIntakeContactCommonNames() ([]string, error) {
	names := []string{}
	err := u.DB.Select(&names, getAllNamesSQL)
	if err != nil {
		return nil, fmt.Errorf("unable to query common names %w", err)
	}
	return names, nil
}

func (u *Uploader) QuerySystemIntakeContactUsernames() ([]string, error) {
	usernames := []string{}
	err := u.DB.Select(&usernames, getAllUsernamesSQL)
	if err != nil {
		return nil, fmt.Errorf("unable to query usernames %w", err)
	}
	return usernames, nil
}

func QuerySystemIntakeContactCommonNamesAndExportToJSON() {
	config := viper.New()
	config.AutomaticEnv()
	uploader := NewUploader(config)
	fmt.Println("Querying common names for system intake contacts...")
	commonNames, err := uploader.QuerySystemIntakeContactCommonNames()
	if err != nil {
		fmt.Printf("Error querying common names: %v\n", err)
		return
	}
	writeObjectToJSONFile(commonNames, contactCommonNamesPath)
}

func QuerySystemIntakeContactUsernamesAndExportToJSON() {
	config := viper.New()
	config.AutomaticEnv()
	uploader := NewUploader(config)
	fmt.Println("Querying usernames for system intake contacts...")
	usernames, err := uploader.QuerySystemIntakeContactUsernames()
	if err != nil {
		fmt.Printf("Error querying usernames: %v\n", err)
		return
	}
	writeObjectToJSONFile(usernames, contactUsernamesPath)
}

// ReadContactUsernamesFromJSONAndCreateAccounts reads contact_usernames.JSON and creates user accounts
func ReadContactUsernamesFromJSONAndCreateAccounts() {
	ctx := context.Background()
	config := viper.New()
	config.AutomaticEnv()
	uploader := NewUploader(config)
	ctx = appcontext.WithLogger(ctx, &uploader.Logger)

	userNames := []string{}
	fmt.Printf("Attempting to read usernames from %s\n", contactUsernamesPath)
	err := readJSONFromFile(contactUsernamesPath, &userNames)
	if err != nil {
		log.Fatal(err)
	}
	userAccountAttempts := uploader.GetOrCreateUserAccounts(ctx, userNames)
	for _, attempt := range userAccountAttempts {
		fmt.Printf("\n Println for %s. Success: %v", attempt.Username, attempt.Success)
		CommonName := ""
		if attempt.Account != nil {
			CommonName = attempt.Account.CommonName
		}
		uploader.Logger.Info("attempt made for "+attempt.Username,
			zap.String("UserName", attempt.Username),
			zap.Bool("Success", attempt.Success),
			zap.String("Message", attempt.Message),
			zap.String("CommonName", CommonName),
			zap.Error(attempt.ErrorMessage),
		)
	}

	fmt.Printf("Outputting results to %s \n", contactUsernamesAccountsPath)
	writeObjectToJSONFile(userAccountAttempts, contactUsernamesAccountsPath)
}

// ReadContactCommonNamesFromJSONAndCreateAccounts reads contact_common_names.JSON and creates user accounts
func ReadContactCommonNamesFromJSONAndCreateAccounts() {
	ctx := context.Background()
	config := viper.New()
	config.AutomaticEnv()
	uploader := NewUploader(config)
	ctx = appcontext.WithLogger(ctx, &uploader.Logger)

	commonNames := []string{}
	fmt.Printf("Attempting to read common names from %s\n", contactCommonNamesPath)
	err := readJSONFromFile(contactCommonNamesPath, &commonNames)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Names read successfully. Proceeding to attempt to create accounts")
	userAccountAttempts := uploader.GetOrCreateUserAccountsByFullName(ctx, commonNames, true)
	for _, attempt := range userAccountAttempts {
		fmt.Printf("\n Println for %s. Success: %v", attempt.Username, attempt.Success)
		CommonName := ""
		if attempt.Account != nil {
			CommonName = attempt.Account.CommonName
		}
		uploader.Logger.Info("attempt made for "+attempt.Username,
			zap.String("UserName", attempt.Username),
			zap.Bool("Success", attempt.Success),
			zap.String("Message", attempt.Message),
			zap.String("CommonName", CommonName),
			zap.Error(attempt.ErrorMessage),
		)
	}

	fmt.Printf("Outputting results to %s \n", contactCommonNamesAccountsPath)
	writeObjectToJSONFile(userAccountAttempts, contactCommonNamesAccountsPath)
}
