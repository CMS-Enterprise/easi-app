package cedarcore

import (
	"context"
	"fmt"

	"github.com/guregu/null"
	"github.com/guregu/null/zero"
	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	apiroles "github.com/cmsgov/easi-app/pkg/cedar/core/gen/client/role"
	apimodels "github.com/cmsgov/easi-app/pkg/cedar/core/gen/models"
	"github.com/cmsgov/easi-app/pkg/models"
)

const (
	cedarRoleApplication = "alfabet" // used for queries to GET /role endpoint

	// these need to be separate constants from the CedarAssigneeType enums defined in pkg/models/cedar_role.go;
	// these values correspond to what's returned from CEDAR
	// the enums in pkg/models/cedar_role.go represent what's returned by our GraphQL API to our frontend
	cedarPersonAssignee       = "person"
	cedarOrganizationAssignee = "organization"
)

func cedarRoleApplicationPtr() *string {
	str := cedarRoleApplication
	return &str
}

func decodeAssigneeType(rawAssigneeType string) (models.CedarAssigneeType, bool) {
	if rawAssigneeType == cedarPersonAssignee {
		return models.PersonAssignee, true
	} else if rawAssigneeType == cedarOrganizationAssignee {
		return models.OrganizationAssignee, true
	} else if rawAssigneeType == "" {
		return "", true
	} else {
		return "", false
	}
}

// GetRolesBySystem makes a GET call to the /role endpoint using a system ID and an optional role type ID
// we don't currently have a use case for querying /role by role ID, so that's not implemented
func (c *Client) GetRolesBySystem(ctx context.Context, cedarSystemID string, roleTypeID null.String) ([]*models.CedarRole, error) {
	if !c.cedarCoreEnabled(ctx) {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		return []*models.CedarRole{}, nil
	}

	cedarSystem, err := c.GetSystem(ctx, cedarSystemID)
	if err != nil {
		return nil, err
	}

	// Construct the parameters
	params := apiroles.NewRoleFindByIDParams()
	params.SetApplication(cedarRoleApplication)
	params.SetObjectID(&cedarSystem.VersionID)
	params.HTTPClient = c.hc

	if roleTypeID.Ptr() != nil {
		params.SetRoleTypeID(roleTypeID.Ptr())
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
			Application: *role.Application,
			ObjectID:    *role.ObjectID,
			RoleTypeID:  *role.RoleTypeID,

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

// GetRoleTypes queries CEDAR for the list of supported role types
func (c *Client) GetRoleTypes(ctx context.Context) ([]*models.CedarRoleType, error) {
	if !c.cedarCoreEnabled(ctx) {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		return []*models.CedarRoleType{}, nil
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
			ID:          *roleType.ID,
			Application: *roleType.Application,
			Name:        *roleType.Name,

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

// SetRolesForUser sets the desired roles for a user on a given system to *exactly* the requested role types, adding and deleting role assignments in CEDAR as necessary
func (c *Client) SetRolesForUser(ctx context.Context, cedarSystemID string, euaUserID string, desiredRoleTypeIDs []string) error {
	if !c.cedarCoreEnabled(ctx) {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		return nil
	}

	allRolesForSystem, err := c.GetRolesBySystem(ctx, cedarSystemID, null.String{})
	if err != nil {
		return err
	}

	currentRolesForUser := lo.Filter(allRolesForSystem, func(role *models.CedarRole, _ int) bool {
		// the check for !currentRole.RoleID.IsZero() shouldn't be necessary - all roles should have IDs assigned - but check's there just in case CEDAR has bad data
		return role.AssigneeUsername.ValueOrZero() == euaUserID && !role.RoleID.IsZero()
	})

	currentRolesForUserByRoleTypes := lo.SliceToMap(currentRolesForUser, func(role *models.CedarRole) (string, *models.CedarRole) {
		return role.RoleTypeID, role
	})

	roleTypesToAdd, _ := lo.Difference(desiredRoleTypeIDs, lo.Keys(currentRolesForUserByRoleTypes))
	newRoles := lo.Map(roleTypesToAdd, func(roleTypeID string, _ int) newRole {
		return newRole{
			euaUserID:  euaUserID,
			roleTypeID: roleTypeID,
		}
	})

	rolesToDelete := lo.OmitByKeys(currentRolesForUserByRoleTypes, desiredRoleTypeIDs)
	roleIDsToDelete := lo.Map(lo.Values(rolesToDelete), func(role *models.CedarRole, _ int) string {
		return role.RoleID.ValueOrZero()
	})

	// length check is necessary because CEDAR will error if we call addRoles() with no role type IDs
	if len(newRoles) > 0 {
		err = c.addRoles(ctx, cedarSystemID, newRoles)
		if err != nil {
			return err
		}
	}

	// length check is necessary because CEDAR will error if we call deleteRoles() with no role  IDs
	if len(roleIDsToDelete) > 0 {
		err = c.deleteRoles(ctx, roleIDsToDelete)
		if err != nil {
			return err
		}
	}

	return nil
}

// returns list of role IDs if successful
func (c *Client) addRoles(ctx context.Context, cedarSystemID string, newRoles []newRole) error {
	if !c.cedarCoreEnabled(ctx) {
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
			ObjectID:         &cedarSystem.VersionID,
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
			return fmt.Errorf(resp.Payload.Message[0]) // should be "Role assignment(s) could not be found"
		}
		return fmt.Errorf("unknown error")
	}

	return nil
}

func (c *Client) deleteRoles(ctx context.Context, roleIDsToDelete []string) error {
	if !c.cedarCoreEnabled(ctx) {
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
			return fmt.Errorf(resp.Payload.Message[0]) // should be "Role assignment(s) could not be found"
		}
		return fmt.Errorf("unknown error")
	}

	return nil
}
