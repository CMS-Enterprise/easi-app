package main

import (
	"context"
	"fmt"
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/oktaapi"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	"github.com/cms-enterprise/easi-app/pkg/userhelpers"

	_ "embed"
)

//go:embed sql/get_all_usernames.sql
var getAllUserNamesSQL string

//go:embed sql/get_all_full_names.sql
var getAllFullNamesSQL string

// Uploader handles functionality for uploading data to the DB

const outputFolder = "cmd/populate_user_table/output"

const contactCommonNamesFileName = "contact_common_names.JSON"
const contactUsernamesFileName = "contact_usernames.JSON"

const contactUsernamesPath = outputFolder + "/" + contactUsernamesFileName
const contactCommonNamesPath = outputFolder + `/` + contactCommonNamesFileName

// Uploader is a struct which holds relevant utilities for uploading data to the database
type Uploader struct {
	Store  *storage.Store
	DB     *sqlx.DB
	Logger zap.Logger
	Okta   *oktaapi.ClientWrapper //TODO, maybe this shouldn't be the wrapper, but the main instance?
}

var queryUserNameCmd = &cobra.Command{
	Use:   "username",
	Short: "Query unique usernames in the database and output to json file",
	Long:  "Query unique usernames in the database and output to json file",
	Run: func(cmd *cobra.Command, args []string) {

		QueryUserNamesAndExportToJSON()

	},
}
var queryFullNameCmd = &cobra.Command{
	Use:   "full_name",
	Short: "Query unique full name in the database and output to json file",
	Long:  "Query unique full name in the database and output to json file",
	Run: func(cmd *cobra.Command, args []string) {

		QueryFullNamesAndExportToJSON()

	},
}
var generateUserAccountByUsernameCmd = &cobra.Command{
	Use:   "generateUser",
	Short: "This command creates user accounts by the list of usernames stored in  usernames.JSON",
	Long:  "This command creates user accounts by the list of usernames stored in  usernames.JSON",
	Run: func(cmd *cobra.Command, args []string) {
		ReadUsernamesFromJSONAndCreateAccounts()
	},
}
var generateUserAccountByDisplayNameCmd = &cobra.Command{
	Use:   "generateUserFull",
	Short: "This command creates user accounts by the list of Full Names stored in  full_names.JSON",
	Long:  "This command creates user accounts by the list of Full Names stored in  full_names.JSON",
	Run: func(cmd *cobra.Command, args []string) {
		ReadFullNamesFromJSONAndCreateAccounts()
	},
}

// QueryUserNamesAndExportToJSON finds all distinct usernames in the database and exports to JSON
func QueryUserNamesAndExportToJSON() {
	// ctx := context.Background()
	config := viper.New()
	config.AutomaticEnv()
	uploader := NewUploader(config)
	fmt.Println("Querying usernames")

	userNames, err := uploader.QueryUsernames()
	if err != nil {
		fmt.Println(err)
	}
	fmt.Printf("%d distinct usernames found. \n", len(userNames))

	filePath := "usernames.JSON"
	fullPath := outputFolder + `/` + filePath
	// TODO: query args for a path if desired
	fmt.Printf("Outputting results to %s \n", fullPath)
	writeObjectToJSONFile(userNames, fullPath)
}

// QueryFullNamesAndExportToJSON finds all distinct full names in the database and exports to JSON
func QueryFullNamesAndExportToJSON() {
	// ctx := context.Background()
	config := viper.New()
	config.AutomaticEnv()
	uploader := NewUploader(config)
	fmt.Println("Querying usernames")

	userNames, err := uploader.QueryFullNames()
	if err != nil {
		fmt.Println(err)
	}
	fmt.Printf("%d distinct full names found. \n", len(userNames))

	filePath := "full_names.JSON"
	fullPath := outputFolder + `/` + filePath
	// TODO: query args for a path if desired
	fmt.Printf("Outputting results to %s \n", fullPath)
	writeObjectToJSONFile(userNames, fullPath)
}

// ReadUsernamesFromJSONAndCreateAccounts reads usernames and creates a user account in the db
func ReadUsernamesFromJSONAndCreateAccounts() {
	ctx := context.Background()
	config := viper.New()
	config.AutomaticEnv()
	uploader := NewUploader(config)
	ctx = appcontext.WithLogger(ctx, &uploader.Logger)

	filePath := outputFolder + `/` + "usernames.JSON"
	userNames := []string{}
	fmt.Printf("Attempting to read usernames from %s", filePath)

	err := readJSONFromFile(filePath, &userNames)
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
	filePathOutput := "usernames_accounts.JSON"
	fullPath := outputFolder + `/` + filePathOutput
	fmt.Printf("Outputting results to %s \n", fullPath)
	writeObjectToJSONFile(userAccountAttempts, fullPath) //TODO, figure out how to serialize the output better....

}

// ReadFullNamesFromJSONAndCreateAccounts opens a JSON file that has an array of full names and
func ReadFullNamesFromJSONAndCreateAccounts() {
	ctx := context.Background()
	config := viper.New()
	config.AutomaticEnv()
	uploader := NewUploader(config)
	ctx = appcontext.WithLogger(ctx, &uploader.Logger)

	filePath := outputFolder + `/` + "full_names.JSON"
	fullNames := []string{}
	fmt.Printf("Attempting to read full_names from %s", filePath)

	err := readJSONFromFile(filePath, &fullNames)
	if err != nil {
		log.Fatal(err)
	}
	userAccountAttempts := uploader.GetOrCreateUserAccountsByFullName(ctx, fullNames)
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
	filePathOutput := "full_names_accounts.JSON"
	fullPath := outputFolder + `/` + filePathOutput
	fmt.Printf("Outputting results to %s \n", fullPath)
	writeObjectToJSONFile(userAccountAttempts, fullPath) //TODO, figure out how to serialize the output better....

}

// NewUploader instantiates an Uploader
func NewUploader(config *viper.Viper) *Uploader { //TODO make this more configurable if needed
	// config := viper.New()
	// config.AutomaticEnv()

	db, store, logger, okta := getResolverDependencies(config)
	return &Uploader{
		Store:  store,
		DB:     db,
		Logger: *logger,
		Okta:   okta,
	}
}

// QueryUsernames returns an array of usernames from every spot in the database where they are referenced.
func (u *Uploader) QueryUsernames() ([]string, error) {
	usernames := []string{}

	err := u.DB.Select(&usernames, getAllUserNamesSQL)

	if err != nil {
		return nil, fmt.Errorf(" unable to query usernames %w", err)

	}

	return usernames, nil

}

// QueryFullNames queries the database for distinct references to a users full name in the database
func (u *Uploader) QueryFullNames() ([]string, error) {
	usernames := []string{}

	err := u.DB.Select(&usernames, getAllFullNamesSQL)

	if err != nil {
		return nil, fmt.Errorf(" unable to query full names %w", err)

	}

	return usernames, nil

}

// UserAccountAttempt represents the attempt to make a user account based on a given username
type UserAccountAttempt struct {
	Account      *authentication.UserAccount
	Username     string
	ErrorMessage error
	Message      string
	Success      bool
}

// GetOrCreateUserAccounts wraps the get or create user account functionality with information about if it successfully created an account or not
func (u *Uploader) GetOrCreateUserAccounts(ctx context.Context, userNames []string) []*UserAccountAttempt {
	attempts := []*UserAccountAttempt{}

	for _, username := range userNames {
		attempt := UserAccountAttempt{
			Username: username,
		}
		account, err := userhelpers.GetOrCreateUserAccount(ctx,
			u.Store,
			u.Store,
			username,
			false,
			userhelpers.GetUserInfoAccountInfoWrapperFunc(u.Okta.FetchUserInfo),
		)
		if err != nil {
			attempt.ErrorMessage = err
			attempt.Success = false
			attempt.Message = " failed to create or get user account"
		} else {
			attempt.Account = account
			attempt.Success = true
			attempt.Message = "success"

		}
		attempts = append(attempts, &attempt)

	}
	return attempts
}

// GetOrCreateUserAccountsByFullName wraps the get or create user account functionality by FullName with information about if it successfully created an account or not
func (u *Uploader) GetOrCreateUserAccountsByFullName(ctx context.Context, fullNames []string) []*UserAccountAttempt {
	attempts := []*UserAccountAttempt{}

	for _, fullName := range fullNames {
		attempt := UserAccountAttempt{ //TODO, make a different struct for this specifically so we can record the name
			Username: fullName,
		}
		account, err := userhelpers.GetOrCreateUserAccountFullName(ctx,
			u.Store,
			u.Store,
			fullName,
			false,
			userhelpers.GetUserInfoAccountInfoWrapperFunc(u.Okta.FetchUserInfoByCommonName), // TODO: update this to search by full name
		)
		if err != nil {
			attempt.ErrorMessage = err
			attempt.Success = false
			attempt.Message = " failed to create or get user account"
		} else {
			attempt.Account = account
			attempt.Success = true
			attempt.Message = "success"

		}
		attempts = append(attempts, &attempt)

	}
	return attempts
}

// SearchAllUserNamesIndividually fetches user info synchronously for a list of users
func (u *Uploader) SearchAllUserNamesIndividually(ctx context.Context, userNames []string) []*models.UserInfo {
	users := []*models.UserInfo{}
	for _, username := range userNames {
		userInfo, err := u.Okta.FetchUserInfo(ctx, username)
		if err != nil {
			fmt.Println(err)
		}
		if userInfo != nil {
			users = append(users, userInfo)
			fmt.Printf("\n User %s found \n", userInfo.DisplayName)
		}

	}
	return users
}

// SearchAllUserNamesConcurrently fetches user info concurrently for a list of users
func (u *Uploader) SearchAllUserNamesConcurrently(ctx context.Context, userNames []string) ([]*models.UserInfo, error) {
	userInfos, err := u.Okta.FetchUserInfos(ctx, userNames) // TODO, this isn't finding everyone... think about this some more.

	return userInfos, err
}
