package main

import (
	"context"
	"fmt"

	"github.com/jmoiron/sqlx"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"go.uber.org/zap"

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

		// fmt.Printf("Args: %v \n", args)
		QueryUserNamesAndExportToJSON()

	},
}
var queryFullNameCmd = &cobra.Command{
	Use:   "fullname",
	Short: "Query unique fullname in the database and output to json file",
	Long:  "Query unique fullname in the database and output to json file",
	Run: func(cmd *cobra.Command, args []string) {

		// fmt.Printf("Args: %v \n", args)
		QueryFullNamesAndExportToJSON()

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
	// TODO: query args for a path if desired
	fmt.Printf("Outputting results to %s \n", filePath)
	writeObjectToJSONFile(userNames, filePath)
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
	// TODO: query args for a path if desired
	fmt.Printf("Outputting results to %s \n", filePath)
	writeObjectToJSONFile(userNames, filePath)
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
	account      *authentication.UserAccount
	username     string
	errorMessage error
	message      string
	success      bool
}

// GetOrCreateUserAccounts wraps the get or create user account functionality with information about if it successfully created an account or not
func (u *Uploader) GetOrCreateUserAccounts(ctx context.Context, userNames []string) []*UserAccountAttempt {
	attempts := []*UserAccountAttempt{}

	for _, username := range userNames {
		attempt := UserAccountAttempt{
			username: username,
		}
		account, err := userhelpers.GetOrCreateUserAccount(ctx,
			u.Store,
			u.Store,
			username,
			false,
			userhelpers.GetUserInfoAccountInfoWrapperFunc(u.Okta.FetchUserInfo),
		)
		if err != nil {
			attempt.errorMessage = err
			attempt.success = false
			attempt.message = " failed to create or get user account"
		} else {
			attempt.account = account
			attempt.success = true
			attempt.message = "success"

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
