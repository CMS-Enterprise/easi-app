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

// Uploader handles functionality for uploading data to the DB
type Uploader struct {
	Store  *storage.Store
	DB     *sqlx.DB
	Logger zap.Logger
	Okta   *oktaapi.ClientWrapper //TODO, maybe this shouldn't be the wrapper, but the main instance?
}

var queryUserNameCmd = &cobra.Command{
	Use:   "query",
	Short: "Query unique usernames in the database and output to json file",
	Long:  "Query unique usernames in the database and output to json file",
	Run: func(cmd *cobra.Command, args []string) {
		// ctx := context.Background()
		config := viper.New()
		config.AutomaticEnv()
		uploader := NewUploader(config)

		// ctx = appcontext.WithLogger(ctx, &uploader.Logger)
		_ = rootCmd //TODO, do we even want to bother with cobra?
		userNames, err := uploader.QueryUsernames()
		if err != nil {
			fmt.Println(err)
		}

		filePath := "usernames.JSON"
		// TODO: query args for a path if desired
		writeObjectToJSONFile(userNames, filePath)

	},
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

	//TODO wire this up to use the Fetch User Info func
	//  getAccountInfoFunc := func u.Okta.FetchUserInfo
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
			// userhelpers.GetOktaAccountInfoWrapperFunction(getAccountInfoFunc),
			// userhelpers.GetOktaAccountInfoWrapperFunction(u.Okta.FetchUserInfo),
			// userhelpers.GetOktaAccountInfoWrapperFunction(userhelpers.GetOktaAccountInfo), // This function is for logged in users
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
