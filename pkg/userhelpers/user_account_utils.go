package userhelpers

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"net/http"

	"github.com/google/uuid"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

// OktaAccountInfo represents the information you get if you query an account from Okta
// TODO Replace this with calls to the Okta API so we can use the same information we use in other places in the application
type OktaAccountInfo struct {
	Name              string `json:"name"`
	Locale            string `json:"locale"`
	Email             string `json:"email"`
	PreferredUsername string `json:"preferred_username"`
	GivenName         string `json:"given_name"`
	FamilyName        string `json:"family_name"`
	ZoneInfo          string `json:"zoneinfo"`
}

// AccountInfo represents information needed to make a UserAccount, independent of the source of the information
type AccountInfo OktaAccountInfo

// GetAccountInfoFunc represents a type of function which takes a context and username and returns AccountInfo
type GetAccountInfoFunc func(ctx context.Context, username string) (*AccountInfo, error)

// GetAccountInfosFunc represents a type of function which takes a context and username and returns AccountInfo
type GetAccountInfosFunc func(ctx context.Context, usernames []string) ([]*AccountInfo, error)

// GetOktaAccountInfoFunc represents a type of function which takes a context and username and returns OktaAccountInfo
type GetOktaAccountInfoFunc func(ctx context.Context, username string) (*OktaAccountInfo, error)

// GetUserInfoFunc represents a type of function which takes a context and username and returns UserInfo
type GetUserInfoFunc func(ctx context.Context, username string) (*models.UserInfo, error)

// GetUserInfosFunc represents a type of function which takes a context and username and returns UserInfo
type GetUserInfosFunc func(ctx context.Context, usernames []string) ([]*models.UserInfo, error)

// GetOrCreateUserAccountFullName will return an account if it exists after searching by Full Name, or create and return a new one if not
func GetOrCreateUserAccountFullName(
	ctx context.Context,
	np sqlutils.NamedPreparer,
	store *storage.Store,
	fullName string,
	hasLoggedIn bool,
	getAccountInformationFullName GetAccountInfoFunc) (*authentication.UserAccount, error) {
	userAccount, accErr := store.UserAccountGetByCommonName(fullName) //TODO: this could be expanded to check by either username or commonName
	if accErr != nil {
		return nil, errors.New("failed to get user information from the database")
	}
	if userAccount != nil && userAccount.HasLoggedIn {
		return userAccount, nil
	}
	accountInfo, err := getAccountInformationFullName(ctx, fullName)
	if err != nil {
		return nil, err
	}

	if userAccount == nil {
		userAccount = &authentication.UserAccount{}
	}
	userAccount.Username = accountInfo.PreferredUsername
	userAccount.CommonName = accountInfo.Name
	userAccount.Locale = accountInfo.Locale
	userAccount.Email = accountInfo.Email
	userAccount.GivenName = accountInfo.GivenName
	userAccount.FamilyName = accountInfo.FamilyName
	userAccount.ZoneInfo = accountInfo.ZoneInfo
	userAccount.HasLoggedIn = hasLoggedIn

	if userAccount.ID == uuid.Nil {
		newAccount, newErr := store.UserAccountCreate(ctx, np, userAccount)
		if newErr != nil {
			return nil, newErr
		}
		return newAccount, nil
	}

	updatedAccount, updateErr := store.UserAccountUpdate(ctx, np, userAccount)
	if updateErr != nil {
		return nil, updateErr
	}
	return updatedAccount, nil
}

// GetOrCreateUserAccount will return an account if it exists, or create and return a new one if not
func GetOrCreateUserAccount(
	ctx context.Context,
	np sqlutils.NamedPreparer,
	store *storage.Store,
	username string,
	hasLoggedIn bool,
	getAccountInformation GetAccountInfoFunc,
) (*authentication.UserAccount, error) {
	userAccount, accErr := store.UserAccountGetByUsername(ctx, np, username) //TODO: this could be expanded to check by either username or commonName
	if accErr != nil {
		return nil, errors.New("failed to get user information from the database")
	}
	if userAccount != nil && userAccount.HasLoggedIn {
		return userAccount, nil
	}
	accountInfo, err := getAccountInformation(ctx, username)
	if err != nil {
		return nil, err
	}

	shouldCreateAccount := false
	if userAccount == nil {
		userAccount = &authentication.UserAccount{}
		shouldCreateAccount = true
	}
	userAccount.Username = accountInfo.PreferredUsername
	userAccount.CommonName = accountInfo.Name
	userAccount.Locale = accountInfo.Locale
	userAccount.Email = accountInfo.Email
	userAccount.GivenName = accountInfo.GivenName
	userAccount.FamilyName = accountInfo.FamilyName
	userAccount.ZoneInfo = accountInfo.ZoneInfo
	userAccount.HasLoggedIn = hasLoggedIn

	if shouldCreateAccount {
		newAccount, newErr := store.UserAccountCreate(ctx, np, userAccount)
		if newErr != nil {
			return nil, newErr
		}
		return newAccount, nil
	}

	updatedAccount, updateErr := store.UserAccountUpdate(ctx, np, userAccount)
	if updateErr != nil {
		return nil, updateErr
	}
	return updatedAccount, nil
}

// GetOrCreateUserAccounts will return accounts if they exist, or create and return them if not
func GetOrCreateUserAccounts(
	ctx context.Context,
	np sqlutils.NamedPreparer,
	store *storage.Store,
	usernames []string,
	hasLoggedIn bool,
	getAccountInformation GetAccountInfosFunc,
) ([]*authentication.UserAccount, error) {
	existingUserAccounts, accErr := store.UserAccountGetByUsernames(ctx, np, usernames)
	if accErr != nil {
		return nil, errors.New("failed to get user information from the database")
	}

	// convert results into map keyed by username
	acctMap := map[string]*authentication.UserAccount{}
	for _, userAccount := range existingUserAccounts {
		if userAccount != nil {
			acctMap[userAccount.Username] = userAccount
		}
	}

	// skip fetching info on accounts that have logged in
	acctInfoToGet := []string{}
	for _, username := range usernames {
		if userAccount, ok := acctMap[username]; ok && userAccount.HasLoggedIn {
			continue
		}
		acctInfoToGet = append(acctInfoToGet, username)
	}

	accountInfos, err := getAccountInformation(ctx, acctInfoToGet)
	if err != nil {
		return nil, err
	}

	accountsToCreate := []*authentication.UserAccount{}
	accountsToUpdate := []*authentication.UserAccount{}
	for _, accountInfo := range accountInfos {
		// check if user account has been created, if not start one
		userAccount, isExistingAccount := acctMap[accountInfo.PreferredUsername]
		if !isExistingAccount {
			userAccount = &authentication.UserAccount{}
		}
		userAccount.Username = accountInfo.PreferredUsername
		userAccount.CommonName = accountInfo.Name
		userAccount.Locale = accountInfo.Locale
		userAccount.Email = accountInfo.Email
		userAccount.GivenName = accountInfo.GivenName
		userAccount.FamilyName = accountInfo.FamilyName
		userAccount.ZoneInfo = accountInfo.ZoneInfo
		userAccount.HasLoggedIn = hasLoggedIn

		if !isExistingAccount {
			accountsToCreate = append(accountsToCreate, userAccount)
			continue
		}
		accountsToUpdate = append(accountsToUpdate, userAccount)
	}

	createdAccts := []*authentication.UserAccount{}
	updatedAccts := []*authentication.UserAccount{}

	if len(accountsToCreate) > 0 {
		var err error
		createdAccts, err = store.UserAccountBulkCreate(ctx, np, accountsToCreate)
		if err != nil {
			return nil, err
		}
	}

	if len(accountsToUpdate) > 0 {
		var err error
		updatedAccts, err = store.UserAccountBulkUpdate(ctx, np, accountsToUpdate)
		if err != nil {
			return nil, err
		}
	}
	// combine created and updated accounts and update them in the map
	for _, acct := range append(createdAccts, updatedAccts...) {
		acctMap[acct.Username] = acct
	}

	// extract mapped accounts in the same order as the provided usernames
	rtnAccts := []*authentication.UserAccount{}
	for _, username := range usernames {
		rtnAccts = append(rtnAccts, acctMap[username])
	}

	return rtnAccts, nil
}

// GetUserInfoAccountInfoWrapperFunc returns a function that returns *AccountInfo with the input of a function that returns UserInfo
func GetUserInfoAccountInfoWrapperFunc(getUserInfo GetUserInfoFunc) GetAccountInfoFunc {

	wrapperFunc := func(ctx context.Context, username string) (*AccountInfo, error) {
		return GetUserInfoAccountInfoWrapper(ctx, username, getUserInfo)
	}
	return wrapperFunc
}

// GetUserInfoAccountInfosWrapperFunc returns a function that returns []*AccountInfo with the input of a function that returns UserInfos
func GetUserInfoAccountInfosWrapperFunc(getUserInfos GetUserInfosFunc) GetAccountInfosFunc {

	wrapperFunc := func(ctx context.Context, usernames []string) ([]*AccountInfo, error) {
		return GetUserInfoAccountInfosWrapper(ctx, usernames, getUserInfos)
	}
	return wrapperFunc
}

// GetUserInfoAccountInfoWrapper this function appends models.UserInfo with needed account info fields as UNKNOWN
func GetUserInfoAccountInfoWrapper(ctx context.Context, username string, getUserInfo GetUserInfoFunc) (*AccountInfo, error) {
	userInfo, err := getUserInfo(ctx, username)
	if err != nil {
		return nil, err
	}

	accountInfo := &AccountInfo{}
	accountInfo.Name = userInfo.DisplayName
	accountInfo.Locale = "UNKNOWN"
	accountInfo.Email = userInfo.Email.String() // TODO: EASI-3341, can this be an email address type instead of string
	accountInfo.PreferredUsername = userInfo.Username
	accountInfo.GivenName = userInfo.FirstName
	accountInfo.FamilyName = userInfo.LastName
	accountInfo.ZoneInfo = "UNKNOWN"

	return accountInfo, nil
}

// GetUserInfoAccountInfosWrapper this function appends models.UserInfo with needed account info fields as UNKNOWN
func GetUserInfoAccountInfosWrapper(ctx context.Context, usernames []string, getUserInfos GetUserInfosFunc) ([]*AccountInfo, error) {
	userInfos, err := getUserInfos(ctx, usernames)
	if err != nil {
		return nil, err
	}

	accountInfos := []*AccountInfo{}
	for _, userInfo := range userInfos {
		accountInfo := &AccountInfo{}
		accountInfo.Name = userInfo.DisplayName
		accountInfo.Locale = "UNKNOWN"
		accountInfo.Email = userInfo.Email.String() // TODO: EASI-3341, can this be an email address type instead of string
		accountInfo.PreferredUsername = userInfo.Username
		accountInfo.GivenName = userInfo.FirstName
		accountInfo.FamilyName = userInfo.LastName
		accountInfo.ZoneInfo = "UNKNOWN"
		accountInfos = append(accountInfos, accountInfo)
	}

	return accountInfos, nil
}

// GetOktaAccountInfoWrapperFunction returns a function that returns *AccountInfo with the input of a function that returns OktaAccountInfo
func GetOktaAccountInfoWrapperFunction(getAccountInformation GetOktaAccountInfoFunc) GetAccountInfoFunc {
	wrapperFunc := func(ctx context.Context, username string) (*AccountInfo, error) {
		return GetOktaAccountInfoWrapper(ctx, username, getAccountInformation)
	}
	return wrapperFunc
}

// GetOktaAccountInfoWrapper converts a returns OktaAccountInformation converted to AccountInformation
func GetOktaAccountInfoWrapper(ctx context.Context, username string, getAccountInformation GetOktaAccountInfoFunc) (*AccountInfo, error) {
	userinfo, err := getAccountInformation(ctx, username)
	if err != nil {
		return nil, err
	}

	accountInfo := &AccountInfo{}
	accountInfo.Name = userinfo.Name
	accountInfo.Locale = userinfo.Locale
	accountInfo.Email = userinfo.Email
	accountInfo.PreferredUsername = userinfo.PreferredUsername
	accountInfo.GivenName = userinfo.GivenName
	accountInfo.FamilyName = userinfo.FamilyName
	accountInfo.ZoneInfo = userinfo.ZoneInfo

	return accountInfo, nil
}

// GetOktaAccountInfo uses the Okta endpoint to retun OktaAccountInfo
func GetOktaAccountInfo(ctx context.Context, _ string) (*OktaAccountInfo, error) {
	userEndpoint := "/v1/userinfo" //TODO: it would be better to actually get the endpoint from the token, but not currently given to the front end
	authPrefix := "Bearer "
	enhancedJWT := appcontext.EnhancedJWT(ctx)
	oktaBaseURL, err := enhancedJWT.GetOktaBaseURL()
	if err != nil {
		return nil, err
	}
	url := *oktaBaseURL + userEndpoint
	authorization := authPrefix + enhancedJWT.AuthToken
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("content-type", "application/json")
	req.Header.Set("Authorization", authorization)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	jsonDataFromHTTP, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	ret := OktaAccountInfo{}
	err = json.Unmarshal([]byte(jsonDataFromHTTP), &ret)
	return &ret, err
}
