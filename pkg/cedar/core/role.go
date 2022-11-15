package cedarcore

import (
	"context"
	"fmt"

	"github.com/guregu/null"
	"github.com/guregu/null/zero"
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
	userEUAID  string
	roleTypeID string
}

// returns list of role IDs if successful
func (c *Client) addRoles(ctx context.Context, cedarSystemID string, newRoles []newRole) ([]string, error) {
	if !c.cedarCoreEnabled(ctx) {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		return []string{}, nil
	}

	cedarSystem, err := c.GetSystem(ctx, cedarSystemID)
	if err != nil {
		return []string{}, err
	}

	// Construct the body
	rolesToCreate := []*apimodels.Role{}

	for _, newRole := range newRoles {
		roleToCreate := &apimodels.Role{
			Application:      cedarRoleApplicationPtr(),
			ObjectID:         &cedarSystem.VersionID,
			AssigneeUserName: newRole.userEUAID,
			RoleTypeID:       &newRole.roleTypeID,
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
		return []string{}, err
	}

	if resp.Payload == nil {
		return []string{}, fmt.Errorf("no body received")
	}

	if resp.Payload.Result == "error" {
		if len(resp.Payload.Message) > 0 {
			return []string{}, fmt.Errorf(resp.Payload.Message[0]) // should be "Role assignment(s) could not be found"
		}
		return []string{}, fmt.Errorf("unknown error")
	}

	// return list of IDs of created roles
	return resp.Payload.Message, nil
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
