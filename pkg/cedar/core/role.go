package cedarcore

import (
	"context"
	"errors"
	"fmt"
	"net/url"
	"strings"

	"github.com/guregu/null/zero"
	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	apiroles "github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/client/role"
	apimodels "github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/models"
	"github.com/cms-enterprise/easi-app/pkg/local/cedarcoremock"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

const (
	cedarRoleApplication = "alfabet" // used for queries to GET /role endpoint

	// these need to be separate constants from the CedarAssigneeType enums defined in pkg/models/cedar_role.go;
	// these values correspond to what's returned from CEDAR
	// the enums in pkg/models/cedar_role.go represent what's returned by our GraphQL API to our frontend
	cedarPersonAssignee       = "person"
	cedarOrganizationAssignee = "organization"

	// the name of the business owner role in the CEDAR role/role types responses
	cedarBusinessOwnerRoleName = "Business Owner"
)

// TODO: cache this properly
var cedarBusinessOwnerRoleTypeID string

// getCedarBusinessOwnerRoleTypeID is a helper for fetching the business owner role type ID because role type IDs will differ per ENV
func getCedarBusinessOwnerRoleTypeID(ctx context.Context, c *Client) (string, error) {
	// grab global and return role ID to prevent additional calls to CEDAR
	if cedarBusinessOwnerRoleTypeID != "" {
		return cedarBusinessOwnerRoleTypeID, nil
	}
	roleTypes, err := c.GetRoleTypes(ctx)
	if err != nil {
		return "", err
	}
	for _, role := range roleTypes {
		if role.Name.String == cedarBusinessOwnerRoleName {
			cedarBusinessOwnerRoleTypeID = role.ID.String
			return role.ID.String, nil
		}
	}
	return "", errors.New("no business owner role type found")
}

func cedarRoleApplicationPtr() *string {
	str := cedarRoleApplication
	return &str
}

func decodeAssigneeType(rawAssigneeType string) (models.CedarAssigneeType, bool) {
	lowered := strings.ToLower(rawAssigneeType)

	if lowered == cedarPersonAssignee {
		return models.PersonAssignee, true
	} else if lowered == cedarOrganizationAssignee {
		return models.OrganizationAssignee, true
	} else if lowered == "" {
		return "", true
	} else {
		return "", false
	}
}

// GetBusinessOwnerRolesBySystem makes a GET call to the /role endpoint using a system ID and a business owner role type ID
func (c *Client) GetBusinessOwnerRolesBySystem(ctx context.Context, cedarSystemID string) ([]*models.CedarRole, error) {
	businessOwnerRoleID, err := getCedarBusinessOwnerRoleTypeID(ctx, c)
	if err != nil {
		return nil, err
	}
	return c.GetRolesBySystem(ctx, cedarSystemID, &businessOwnerRoleID)
}

// GetRolesBySystem makes a GET call to the /role endpoint using a system ID and an optional role type ID
// we don't currently have a use case for querying /role by role ID, so that's not implemented
func (c *Client) GetRolesBySystem(ctx context.Context, cedarSystemID string, roleTypeID *string) ([]*models.CedarRole, error) {
	if c.mockEnabled {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		if cedarcoremock.IsMockSystem(cedarSystemID) {
			return cedarcoremock.GetSystemRoles(cedarSystemID, roleTypeID), nil
		}
		return nil, cedarcoremock.NoSystemFoundError()
	}

	cedarSystem, err := c.GetSystem(ctx, cedarSystemID)
	if err != nil {
		return nil, err
	}

	// Construct the parameters
	params := apiroles.NewRoleFindByIDParams()
	params.SetApplication(cedarRoleApplication)
	params.SetObjectID(cedarSystem.VersionID.Ptr())
	params.HTTPClient = c.hc

	if roleTypeID != nil {
		params.SetRoleTypeID(roleTypeID)
	}

	// Make the API call
	resp, err := c.sdk.Role.RoleFindByID(params, c.auth)
	if err != nil {
		return []*models.CedarRole{}, err
	}

	if resp.Payload == nil {
		return []*models.CedarRole{}, fmt.Errorf("no body received")
	}

	// Convert the auto-generated struct to our own pkg/models struct
	retVal := []*models.CedarRole{}

	for _, role := range resp.Payload.Roles {
		if role.Application == nil {
			appcontext.ZLogger(ctx).Error("Error decoding role; role Application was null", zap.String("systemID", cedarSystemID))
			continue
		}

		if role.ObjectID == nil {
			appcontext.ZLogger(ctx).Error("Error decoding role; role ObjectID was null", zap.String("systemID", cedarSystemID))
			continue
		}

		if role.RoleTypeID == nil {
			appcontext.ZLogger(ctx).Error("Error decoding role; role type ID was null", zap.String("systemID", cedarSystemID))
			continue
		}

		assigneeType, validAssigneeType := decodeAssigneeType(role.AssigneeType)
		if !validAssigneeType {
			appcontext.ZLogger(ctx).Error("Error decoding role; role assignee type didn't match possible values from Swagger", zap.String("systemID", cedarSystemID))
			continue
		}

		// generated swagger client turns JSON nulls into Go zero values, so use null/zero package to convert them back to nullable values
		retRole := &models.CedarRole{
			Application: zero.StringFromPtr(role.Application),
			ObjectID:    zero.StringFromPtr(role.ObjectID),
			RoleTypeID:  zero.StringFromPtr(role.RoleTypeID),

			AssigneeUsername:  zero.StringFrom(role.AssigneeUserName),
			AssigneeEmail:     zero.StringFrom(role.AssigneeEmail),
			AssigneeOrgID:     zero.StringFrom(role.AssigneeOrgID),
			AssigneeOrgName:   zero.StringFrom(role.AssigneeOrgName),
			AssigneeFirstName: zero.StringFrom(role.AssigneeFirstName),
			AssigneeLastName:  zero.StringFrom(role.AssigneeLastName),
			AssigneePhone:     zero.StringFrom(role.AssigneePhone),
			AssigneeDesc:      zero.StringFrom(role.AssigneeDesc),

			RoleTypeName: zero.StringFrom(role.RoleTypeName),
			RoleTypeDesc: zero.StringFrom(role.RoleTypeDesc),
			RoleID:       zero.StringFrom(role.RoleID),
			ObjectType:   zero.StringFrom(role.ObjectType),
		}

		if assigneeType != models.CedarAssigneeType("") {
			retRole.AssigneeType = &assigneeType
		}

		retVal = append(retVal, retRole)
	}

	return retVal, nil
}

func (c *Client) PurgeRoleCache(ctx context.Context, cedarSystemID string) error {
	return c.PurgeCacheByPath(ctx, "/role?application="+cedarRoleApplication+"&objectId="+url.QueryEscape(cedarSystemID))
}

// GetRoleTypes queries CEDAR for the list of supported role types
func (c *Client) GetRoleTypes(ctx context.Context) ([]*models.CedarRoleType, error) {
	if c.mockEnabled {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		return cedarcoremock.GetRoleTypes(), nil
	}

	// Construct the parameters
	params := apiroles.NewRoleTypeFindParams()
	params.SetApplication(cedarRoleApplication)
	params.HTTPClient = c.hc

	// Make the API call
	resp, err := c.sdk.Role.RoleTypeFind(params, c.auth)
	if err != nil {
		return []*models.CedarRoleType{}, err
	}

	if resp.Payload == nil {
		return []*models.CedarRoleType{}, fmt.Errorf("no body received")
	}

	// Convert the auto-generated struct to our own pkg/models struct
	retVal := []*models.CedarRoleType{}

	for _, roleType := range resp.Payload.RoleTypes {
		if roleType.Application == nil {
			appcontext.ZLogger(ctx).Error("Error decoding role type; role type Application was null")
			continue
		}

		if roleType.ID == nil {
			appcontext.ZLogger(ctx).Error("Error decoding role type; role type ID was null")
			continue
		}

		if roleType.Name == nil {
			appcontext.ZLogger(ctx).Error("Error decoding role type; role type Name was null")
			continue
		}

		retRoleType := &models.CedarRoleType{
			ID:          zero.StringFromPtr(roleType.ID),
			Application: zero.StringFromPtr(roleType.Application),
			Name:        zero.StringFromPtr(roleType.Name),

			Description: zero.StringFrom(roleType.Description),
		}

		retVal = append(retVal, retRoleType)
	}

	return retVal, nil
}

type newRole struct {
	euaUserID  string
	roleTypeID string
}

// SetRoleResponseMetadata contains metadata about the role assignment operation
type SetRoleResponseMetadata struct {
	DidAdd              bool
	DidDelete           bool
	IsNewUser           bool
	RoleTypeNamesBefore []string
	RoleTypeNamesAfter  []string
	SystemName          string
}

// SetRolesForUser sets the desired roles for a user on a given system to *exactly* the requested role types, adding and deleting role assignments in CEDAR as necessary
func (c *Client) SetRolesForUser(ctx context.Context, cedarSystemID string, euaUserID string, desiredRoleTypeIDs []string) (*SetRoleResponseMetadata, error) {
	if c.mockEnabled {
		// all the client methods this method depends on will return mocked data and not call out to CEDAR if mocking enabled
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
	}

	roleTypesBefore := []models.CedarRoleType{}
	roleTypesAfter := []models.CedarRoleType{}

	allRoleTypes, err := c.GetRoleTypes(ctx)
	if err != nil {
		return nil, err
	}
	roleTypesByID := lo.SliceToMap(allRoleTypes, func(roleType *models.CedarRoleType) (string, *models.CedarRoleType) {
		return roleType.ID.String, roleType
	})

	allRolesForSystem, err := c.GetRolesBySystem(ctx, cedarSystemID, nil)
	if err != nil {
		return nil, err
	}

	currentRolesForUser := lo.Filter(allRolesForSystem, func(role *models.CedarRole, _ int) bool {
		// the check for !currentRole.RoleID.IsZero() shouldn't be necessary - all roles should have IDs assigned - but check's there just in case CEDAR has bad data
		return role.AssigneeUsername.ValueOrZero() == euaUserID && !role.RoleID.IsZero()
	})

	for _, role := range currentRolesForUser {
		roleType, ok := roleTypesByID[role.RoleTypeID.String]
		if !ok || roleType == nil {
			appcontext.ZLogger(ctx).Warn("error decoding role; role type ID not found in role types map")
			continue
		}
		roleTypesBefore = append(roleTypesBefore, *roleType)
	}

	for _, roleTypeID := range desiredRoleTypeIDs {
		roleType, ok := roleTypesByID[roleTypeID]
		if !ok || roleType == nil {
			appcontext.ZLogger(ctx).Warn("error decoding role; role type ID not found in role types map")
			continue
		}
		roleTypesAfter = append(roleTypesAfter, *roleType)
	}

	currentRolesForUserByRoleTypes := lo.SliceToMap(currentRolesForUser, func(role *models.CedarRole) (string, *models.CedarRole) {
		return role.RoleTypeID.String, role
	})

	// first return value from lo.Difference is the role types to add;
	// second return would be the role types to delete, but we ignore that and calculate it later because we need the *role* IDs
	roleTypesToAdd, _ := lo.Difference(desiredRoleTypeIDs, lo.Keys(currentRolesForUserByRoleTypes))

	// augment the list of role type IDs to add with the user's EUA ID
	newRoles := lo.Map(roleTypesToAdd, func(roleTypeID string, _ int) newRole {
		return newRole{
			euaUserID:  euaUserID,
			roleTypeID: roleTypeID,
		}
	})

	// here is where we find the roles we want to delete; lo.OmitByKeys() removes any currently-assigned role type IDs that aren't in desiredRoleTypeIDs,
	// then we use lo.Values() to extract the roles, and lo.Map() to pull out those roles' IDs
	rolesToDelete := lo.OmitByKeys(currentRolesForUserByRoleTypes, desiredRoleTypeIDs)
	roleIDsToDelete := lo.Map(lo.Values(rolesToDelete), func(role *models.CedarRole, _ int) string {
		return role.RoleID.ValueOrZero()
	})

	// addRoles() and deleteRoles() each take several hundred milliseconds for CEDAR to respond; calling them concurrently noticeably helps

	// length check is necessary because CEDAR will error if we call addRoles() with no role type IDs
	if len(newRoles) > 0 {
		err = c.addRoles(ctx, cedarSystemID, newRoles)
		if err != nil {
			return nil, err
		}
	}

	// length check is necessary because CEDAR will error if we call deleteRoles() with no role IDs
	if len(roleIDsToDelete) > 0 {
		err = c.deleteRoles(ctx, roleIDsToDelete)
		if err != nil {
			return nil, err
		}
	}

	roleResponse := &SetRoleResponseMetadata{
		DidAdd:    len(newRoles) > 0,
		DidDelete: len(roleIDsToDelete) > 0,
		IsNewUser: len(currentRolesForUser) == 0 && len(newRoles) > 0,
	}

	roleResponse.RoleTypeNamesBefore = lo.Map(roleTypesBefore, func(roleType models.CedarRoleType, _ int) string {
		return roleType.Name.String
	})
	roleResponse.RoleTypeNamesAfter = lo.Map(roleTypesAfter, func(roleType models.CedarRoleType, _ int) string {
		return roleType.Name.String
	})

	err = c.PurgeRoleCache(ctx, cedarSystemID)
	if err != nil {
		return nil, err
	}
	err = c.PurgeSystemCacheByEUA(ctx, euaUserID)
	if err != nil {
		return nil, err
	}
	// re-populate the cache for "My Systems"
	_, err = c.GetSystemSummary(ctx, SystemSummaryOpts.WithEuaIDFilter(euaUserID))
	if err != nil {
		appcontext.ZLogger(ctx).Warn("error refreshing my systems for user")
	}
	// fetch the system name (likely from cache) and add it to the response
	system, getSystemErr := c.GetSystem(ctx, cedarSystemID)
	if getSystemErr != nil {
		return nil, getSystemErr
	}
	roleResponse.SystemName = system.Name.String

	return roleResponse, nil
}

// private utility method for creating roles for a given system in CEDAR
func (c *Client) addRoles(ctx context.Context, cedarSystemID string, newRoles []newRole) error {
	if c.mockEnabled {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		return nil
	}

	cedarSystem, err := c.GetSystem(ctx, cedarSystemID)
	if err != nil {
		return err
	}

	// Construct the body
	rolesToCreate := []*apimodels.Role{}

	for _, newRole := range newRoles {
		// create by-value copy of roleTypeID so it doesn't change as newRole iterates through newRoles
		roleTypeID := newRole.roleTypeID

		roleToCreate := &apimodels.Role{
			Application:      cedarRoleApplicationPtr(),
			ObjectID:         cedarSystem.VersionID.Ptr(),
			AssigneeUserName: newRole.euaUserID,
			RoleTypeID:       &roleTypeID,
		}
		rolesToCreate = append(rolesToCreate, roleToCreate)
	}

	body := &apimodels.RoleAddRequest{
		Application: cedarRoleApplicationPtr(),
		Roles:       rolesToCreate,
	}

	// construct the parameters
	params := apiroles.NewRoleAddParams()
	params.SetBody(body)
	params.HTTPClient = c.hc

	// Make the API call
	resp, err := c.sdk.Role.RoleAdd(params, c.auth)
	if err != nil {
		return err
	}

	if resp.Payload == nil {
		return fmt.Errorf("no body received")
	}

	if resp.Payload.Result == "error" {
		if len(resp.Payload.Message) > 0 {
			return errors.New(resp.Payload.Message[0]) // message from CEDAR should be "Role assignment(s) could not be found"
		}
		return fmt.Errorf("unknown error")
	}
	err = c.PurgeRoleCache(ctx, cedarSystemID)
	if err != nil {
		return err
	}

	return nil
}

// private utility method for deleting roles from CEDAR
func (c *Client) deleteRoles(ctx context.Context, roleIDsToDelete []string) error {
	if c.mockEnabled {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		return nil
	}

	// construct the parameters
	params := apiroles.NewRoleDeleteListParams()
	params.SetApplication(cedarRoleApplication)
	params.SetID(roleIDsToDelete)
	params.HTTPClient = c.hc

	// Make the API call
	resp, err := c.sdk.Role.RoleDeleteList(params, c.auth)
	if err != nil {
		return err
	}

	if resp.Payload == nil {
		return fmt.Errorf("no body received")
	}

	if resp.Payload.Result == "error" {
		if len(resp.Payload.Message) > 0 {
			return errors.New(resp.Payload.Message[0]) // should be "Role assignment(s) could not be found"
		}
		return fmt.Errorf("unknown error")
	}

	return nil
}
