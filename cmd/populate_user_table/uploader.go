package main

import (
	"context"
	"fmt"
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/authentication"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/oktaapi"
	"github.com/cmsgov/easi-app/pkg/storage"
	"github.com/cmsgov/easi-app/pkg/userhelpers"

	_ "embed"
)

//go:embed SQL/get_all_usernames.sql
var getAllUserNamesSQL string

//go:embed SQL/get_all_full_names.sql
var getAllFullNamesSQL string

// Uploader handles functionality for uploading data to the DB

var outputFolder = "cmd/populate_user_table/output"

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
	Use:   "fullname",
	Short: "Query unique fullname in the database and output to json file",
	Long:  "Query unique fullname in the database and output to json file",
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
	fmt.Printf("%d distinct fullnames found. \n", len(userNames))

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
	userAcountAttempts := uploader.GetOrCreateUserAccounts(ctx, userNames)
	for _, attempt := range userAcountAttempts {
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
	writeObjectToJSONFile(userAcountAttempts, fullPath) //TODO, figure out how to serialize the output better....

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
		return nil, fmt.Errorf(" unable to query fullnames %w", err)

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
