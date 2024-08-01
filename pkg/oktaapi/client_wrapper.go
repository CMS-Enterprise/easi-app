package oktaapi

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"regexp"
	"strings"
	"time"

	"github.com/okta/okta-sdk-golang/v2/okta"
	"github.com/okta/okta-sdk-golang/v2/okta/query"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

const maxEUAIDLength = 4

// ClientWrapper is a wrapper around github.com/okta/okta-sdk-golang/v2/okta Client type.
// The purpose of this package is to act as a simplified client for the Okta API. The methods expected to be used for that client are
// defined in the Client interface in pkg/usersearch.
type ClientWrapper struct {
	oktaClient *okta.Client
}

// NewClient creates a Client
func NewClient(url string, token string) (*ClientWrapper, error) {
	// TODO Do we need the "Context" response from okta.NewClient??
	_, oktaClient, oktaClientErr := okta.NewClient(context.TODO(), okta.WithOrgUrl(url), okta.WithToken(token))
	if oktaClientErr != nil {
		return nil, oktaClientErr
	}
	return &ClientWrapper{ //TODO: implement the next function
		oktaClient: oktaClient,
	}, nil
}

// oktaUserResponse is used to marshal the JSON response from Okta into a struct
type oktaUserResponse struct {
	FirstName   string `json:"firstName"`
	LastName    string `json:"lastName"`
	DisplayName string `json:"displayName"`
	Email       string `json:"email"`
	Login       string `json:"login"`
	SourceType  string `json:"SourceType"`
}

// Converts the generic JSON type of okta.UserProfile into oktaUserResponse
// This also will auto-capitalize the EUA
func (cw *ClientWrapper) parseOktaProfileResponse(ctx context.Context, profile *okta.UserProfile) (*oktaUserResponse, error) {
	logger := appcontext.ZLogger(ctx)

	// Create an oktaUserProfile to return
	parsedProfile := &oktaUserResponse{}

	// Marshal the profile into a string so we can later unmarshal it into a struct
	responseString, err := json.Marshal(profile)
	if err != nil {
		logger.Error("error marshalling okta response", zap.Error(err))
		return nil, err
	}

	// Unmarshal the string into the oktaUserProfile type
	err = json.Unmarshal(responseString, parsedProfile)
	if err != nil {
		logger.Error("error unmarshalling okta response", zap.Error(err))
		return nil, err
	}

	// This only works because we know that ALL logins are EUAs. If we ever support non-EUA login, we need to conditional this
	parsedProfile.Login = strings.ToUpper(parsedProfile.Login)

	return parsedProfile, nil
}

func (o *oktaUserResponse) toUserInfo() *models.UserInfo {
	return &models.UserInfo{
		FirstName:   o.FirstName,
		LastName:    o.LastName,
		DisplayName: o.DisplayName,
		Email:       models.NewEmailAddress(o.Email),
		Username:    o.Login,
	}
}

// FetchUserInfos fetches users from Okta by EUA ID
func (cw *ClientWrapper) FetchUserInfos(ctx context.Context, usernames []string) ([]*models.UserInfo, error) {
	logger := appcontext.ZLogger(ctx).With(
		zap.String("service", "okta"),
		zap.String("method", "FetchUserInfos"),
	)
	users := []*models.UserInfo{}
	if len(usernames) == 0 {
		return users, nil
	}

	var euaSearches []string
	for _, username := range usernames {
		euaSearches = append(euaSearches, fmt.Sprintf(`profile.login eq "%v"`, username))
	}
	euaSearch := strings.Join(euaSearches, " or ")
	searchString := fmt.Sprintf(`(%v)`, euaSearch)
	search := query.NewQueryParams(query.WithSearch(searchString))

	// Make the call to Okta, tracking how much time it took so we can log it
	start := time.Now()
	searchedUsers, _, err := cw.oktaClient.User.ListUsers(ctx, search)

	// Log response time information
	logger.Info("FetchUserInfos okta call", zap.Int64("response-time-ms", time.Since(start).Milliseconds()))
	if err != nil {
		// If it's also not a context cancellation, log and return the error
		if !errors.Is(err, context.Canceled) {
			logger.Error("Error searching Okta users", zap.Error(err), zap.String("usernames", strings.Join(usernames, ", ")))
			return nil, err
		}
		// err is a context cancellation error, log and return early
		logger.Warn("Context cancelled while searching Okta users", zap.Error(err))
		return nil, nil
	}

	// API call was a success, but no users were found.
	// We consider this an error, since we're expecting to find users
	// since this isn't a "search", but a lookup by EUA ID
	if len(searchedUsers) == 0 {
		appcontext.ZLogger(ctx).Error("no users found when calling FetchUserInfos", zap.String("usernames", strings.Join(usernames, ",")))
		return users, fmt.Errorf("no users found")
	}

	for _, user := range searchedUsers {
		profile, err := cw.parseOktaProfileResponse(ctx, user.Profile)
		if err != nil {
			return nil, err
		}
		users = append(users, profile.toUserInfo())
	}
	return users, nil
}

// FetchUserInfo fetches a single user from Okta by EUA ID
func (cw *ClientWrapper) FetchUserInfo(ctx context.Context, username string) (*models.UserInfo, error) {
	logger := appcontext.ZLogger(ctx).With(
		zap.String("service", "okta"),
		zap.String("method", "FetchUserInfos"),
	)

	// Make the call to Okta, tracking how much time it took so we can log it
	start := time.Now()
	user, _, err := cw.oktaClient.User.GetUser(ctx, username)

	// Log response time information
	logger.Info("FetchUserInfo okta call", zap.Int64("response-time-ms", time.Since(start).Milliseconds()))
	if err != nil {
		// Only log the error if it's not a context cancellation, we don't really care about these (but still pass it up the call stack)
		if !errors.Is(err, context.Canceled) {
			logger.Error("Error fetching Okta user", zap.Error(err), zap.String("username", username))
		}
		return nil, err
	}

	profile, err := cw.parseOktaProfileResponse(ctx, user.Profile)
	if err != nil {
		return nil, err
	}

	return profile.toUserInfo(), nil
}

// FetchUserInfoByCommonName fetches a single user from Okta by commonName
// It will error if no users are found, and will also error if there are more than one result for that user
// It is possible that users would share a name, but other functions must be used for to return the array.
func (cw *ClientWrapper) FetchUserInfoByCommonName(ctx context.Context, commonName string) (*models.UserInfo, error) {
	users, err := cw.SearchCommonNameContainsExhaustive(ctx, commonName)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		// Only log the error if it's not a context cancellation, we don't really care about these (but still pass it up the call stack)
		if !errors.Is(err, context.Canceled) {
			logger.Error("Error fetching Okta user", zap.Error(err), zap.String("commonName", commonName))
		}
		return nil, err
	}
	userNum := len(users)
	if userNum < 1 {
		return nil, fmt.Errorf("unable to find user by common name: %s", commonName)
	} else if userNum > 1 {
		return nil, fmt.Errorf("multiple users found by common name: %s", commonName)
	}
	// There is only one user
	return users[0], nil
}

const euaSourceType = "EUA"
const euaADSourceType = "EUA-AD"

// SearchCommonNameContains searches for a user by their First/Last name in Okta
func (cw *ClientWrapper) SearchCommonNameContains(ctx context.Context, searchTerm string) ([]*models.UserInfo, error) {
	logger := appcontext.ZLogger(ctx)

	// Sanitize searchTerm for \ and ". These characters cause Okta to error.
	filterRegex := regexp.MustCompile(`[\\"]`)
	searchTerm = filterRegex.ReplaceAllString(searchTerm, "")

	// profile.SourceType can be EUA, EUA-AD, or cmsidm
	// the first 2 represent EUA users, the latter represents users created directly in IDM
	// status eq "ACTIVE" or status eq "STAGED" ensures we only get users who have EUAs (Staged means they just haven't logged in yet)
	// Okta API only supports matching by "starts with" (sw) or strict equality and not wildcards or "ends with"
	isFromEUA := fmt.Sprintf(`(profile.SourceType eq "%v" or profile.SourceType eq "%v")`, euaSourceType, euaADSourceType)
	isActiveOrStaged := `(status eq "ACTIVE" or status eq "STAGED")`
	nameSearch := fmt.Sprintf(`(profile.firstName sw "%v" or profile.lastName sw "%v" or profile.displayName sw "%v")`, searchTerm, searchTerm, searchTerm)
	searchString := fmt.Sprintf(`%v and %v and %v`, isFromEUA, isActiveOrStaged, nameSearch)
	search := query.NewQueryParams(query.WithSearch(searchString))

	searchedUsers, _, err := cw.oktaClient.User.ListUsers(ctx, search)
	if err != nil && !errors.Is(err, context.Canceled) {
		logger.Error("Error searching Okta users", zap.Error(err), zap.String("searchTerm", searchTerm))
		return nil, err
	}

	users := []*models.UserInfo{}
	for _, user := range searchedUsers {
		profile, err := cw.parseOktaProfileResponse(ctx, user.Profile)
		if err != nil {
			return nil, err
		}

		// If we find EUA users that have logins longer than 4 characters, they're a test user (don't add them to the array)
		if (profile.SourceType == euaSourceType || profile.SourceType == euaADSourceType) && len(profile.Login) > maxEUAIDLength {
			continue
		}
		users = append(users, profile.toUserInfo())
	}
	return users, nil
}

// SearchCommonNameContainsExhaustive searches for a user by their First/Last name in Okta.
// It doesn't validate if a user is currently active, which allows us to search for users no longer at CMS
func (cw *ClientWrapper) SearchCommonNameContainsExhaustive(ctx context.Context, searchTerm string) ([]*models.UserInfo, error) {
	logger := appcontext.ZLogger(ctx)

	// Sanitize searchTerm for \ and ". These characters cause Okta to error.
	filterRegex := regexp.MustCompile(`[\\"]`)
	searchTerm = filterRegex.ReplaceAllString(searchTerm, "")

	// profile.SourceType can be EUA, EUA-AD, or cmsidm
	// the first 2 represent EUA users, the latter represents users created directly in IDM
	// Okta API only supports matching by "starts with" (sw) or strict equality and not wildcards or "ends with"
	isFromEUA := fmt.Sprintf(`(profile.SourceType eq "%v" or profile.SourceType eq "%v")`, euaSourceType, euaADSourceType)
	nameSearch := fmt.Sprintf(`(profile.firstName sw "%v" or profile.lastName sw "%v" or profile.displayName sw "%v")`, searchTerm, searchTerm, searchTerm)
	searchString := fmt.Sprintf(`%v and %v`, isFromEUA, nameSearch)
	search := query.NewQueryParams(query.WithSearch(searchString))

	searchedUsers, _, err := cw.oktaClient.User.ListUsers(ctx, search)
	if err != nil && !errors.Is(err, context.Canceled) {
		logger.Error("Error searching Okta users", zap.Error(err), zap.String("searchTerm", searchTerm))
		return nil, err
	}

	users := []*models.UserInfo{}
	for _, user := range searchedUsers {
		profile, err := cw.parseOktaProfileResponse(ctx, user.Profile)
		if err != nil {
			return nil, err
		}

		// If we find EUA users that have logins longer than 4 characters, they're a test user (don't add them to the array)
		if (profile.SourceType == euaSourceType || profile.SourceType == euaADSourceType) && len(profile.Login) > maxEUAIDLength {
			continue
		}
		users = append(users, profile.toUserInfo())
	}
	return users, nil
}
