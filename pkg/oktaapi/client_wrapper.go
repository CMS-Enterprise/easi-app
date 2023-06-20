package oktaapi

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"strings"

	"github.com/okta/okta-sdk-golang/v2/okta"
	"github.com/okta/okta-sdk-golang/v2/okta/query"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

// ClientWrapper is a wrapper around github.com/okta/okta-sdk-golang/v2/okta Client type.
// The purpose of this package is to act as a drop-in replacement for the CEDAR LDAP API, so this package should implement the same
// methods that the Client interface defined in package usersearch
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

	return parsedProfile, nil
}

func (o *oktaUserResponse) toUserInfo() *models.UserInfo {
	return &models.UserInfo{
		CommonName: o.DisplayName,
		Email:      models.NewEmailAddress(o.Email),
		EuaUserID:  o.Login,
	}
}

// FetchUserInfos fetches users from Okta by EUA ID
func (cw *ClientWrapper) FetchUserInfos(ctx context.Context, usernames []string) ([]*models.UserInfo, error) {
	logger := appcontext.ZLogger(ctx)
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

	searchedUsers, _, err := cw.oktaClient.User.ListUsers(ctx, search)
	if err != nil {
		logger.Error("Error searching Okta users", zap.Error(err), zap.String("usernames", strings.Join(usernames, ", ")))
		return nil, err
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
	logger := appcontext.ZLogger(ctx)

	user, _, err := cw.oktaClient.User.GetUser(ctx, username)
	if err != nil {
		logger.Error("Error fetching Okta user", zap.Error(err), zap.String("username", username))
		return nil, err
	}

	profile, err := cw.parseOktaProfileResponse(ctx, user.Profile)
	if err != nil {
		return nil, err
	}

	return profile.toUserInfo(), nil
}

const euaSourceType = "EUA"
const euaADSourceType = "EUA-AD"

// SearchCommonNameContains searches for a user by their First/Last name in Okta
func (cw *ClientWrapper) SearchCommonNameContains(ctx context.Context, searchTerm string) ([]*models.UserInfo, error) {
	logger := appcontext.ZLogger(ctx)

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
		if (profile.SourceType == euaSourceType || profile.SourceType == euaADSourceType) && len(profile.Login) > 4 {
			continue
		}
		users = append(users, profile.toUserInfo())
	}
	return users, nil
}
