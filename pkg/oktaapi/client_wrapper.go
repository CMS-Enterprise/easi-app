package oktaapi

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/okta/okta-sdk-golang/v2/okta"
	"github.com/okta/okta-sdk-golang/v2/okta/query"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
)

// Client is a wrapper around github.com/okta/okta-sdk-golang/v2/okta Client type.
// The purpose of this package is to act as a drop-in replacement for the CEDAR LDAP API, so this package should implement the same
// methods that the Client interface defines in ./client.go
type clientWrapper struct {
	oktaClient *okta.Client
}

// NewClient creates a Client
func NewClient(url string, token string) (*clientWrapper, error) {
	// TODO Do we need the "Context" response from okta.NewClient??
	_, oktaClient, oktaClientErr := okta.NewClient(context.TODO(), okta.WithOrgUrl(url), okta.WithToken(token))
	if oktaClientErr != nil {
		return nil, oktaClientErr
	}
	return &clientWrapper{ //TODO: implement the next function
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

func (cw *clientWrapper) parseOktaProfileResponse(ctx context.Context, profile *okta.UserProfile) (*oktaUserResponse, error) {
	logger := appcontext.ZLogger(ctx)

	// Create an okaUserProfile to return
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
		// DisplayName: o.DisplayName,
		// Email:       o.Email,
		// Username:    o.Login,
		// FirstName:   o.FirstName,
		// LastName:    o.LastName,
	}
}

func (cw *clientWrapper) FetchUserInfos(ctx context.Context, usernames []string) ([]*models.UserInfo, error) {
	return nil, fmt.Errorf("not implemented")
}

func (cw *clientWrapper) FetchUserInfo(ctx context.Context, username string) (*models.UserInfo, error) {
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

func (cw *clientWrapper) SearchCommonNameContains(ctx context.Context, searchTerm string) ([]*models.UserInfo, error) {
	//TODO: verify this
	return cw.SearchByName(ctx, searchTerm)
}

const euaSourceType = "EUA"
const euaADSourceType = "EUA-AD"

func (cw *clientWrapper) SearchByName(ctx context.Context, searchTerm string) ([]*models.UserInfo, error) {
	logger := appcontext.ZLogger(ctx)

	// profile.SourceType can be EUA, EUA-AD, or cmsidm
	// the first 2 represent EUA users, the latter represents users created directly in IDM
	// status eq "ACTIVE" or status eq "STAGED" ensures we only get users who have EUAs (Staged means they just haven't logged in yet)
	// TODO: Searching on MAC users might be something like profile.cmsRolesArray eq "mint-medicare-admin-contractor"
	// TODO: If we need to search on MAC users, validate that this works even if the user has OTHER IDM roles (not _just_ this one)
	isFromEUA := fmt.Sprintf(`(profile.SourceType eq "%v" or profile.SourceType eq "%v")`, euaSourceType, euaADSourceType)
	isActiveOrStaged := `(status eq "ACTIVE" or status eq "STAGED")`
	nameSearch := fmt.Sprintf(`(profile.firstName sw "%v" or profile.lastName sw "%v" or profile.displayName sw "%v")`, searchTerm, searchTerm, searchTerm)
	searchString := fmt.Sprintf(`%v and %v and %v`, isFromEUA, isActiveOrStaged, nameSearch)
	search := query.NewQueryParams(query.WithSearch(searchString))

	searchedUsers, _, err := cw.oktaClient.User.ListUsers(ctx, search)
	if err != nil {
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
