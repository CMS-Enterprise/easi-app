package cedarcore

import (
	"context"
	"fmt"

	"github.com/guregu/null"
	"github.com/guregu/null/zero"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	apiroles "github.com/cmsgov/easi-app/pkg/cedar/core/gen/client/role"
	"github.com/cmsgov/easi-app/pkg/models"
)

const (
	cedarRoleApplication = "alfabet" // used for queries to GET /role endpoint
)

func decodeAssigneeType(rawAssigneeType string) (models.CedarAssigneeType, bool) {
	if rawAssigneeType == string(models.PersonAssignee) {
		return models.PersonAssignee, true
	} else if rawAssigneeType == string(models.OrganizationAssignee) {
		return models.OrganizationAssignee, true
	} else if rawAssigneeType == "" {
		return "", true
	} else {
		return "", false
	}
}

// GetRolesBySystem makes a GET call to the /role endpoint using a system ID and an optional role type ID
// we don't currently have a use case for querying /role by role ID, so that's not implemented
func (c *Client) GetRolesBySystem(ctx context.Context, systemID string, roleTypeID null.String) ([]*models.CedarRole, error) {
	if !c.cedarCoreEnabled(ctx) {
		appcontext.ZLogger(ctx).Info("CEDAR Core is disabled")
		return []*models.CedarRole{}, nil
	}

	// Construct the parameters
	params := apiroles.NewRoleFindByIDParams()
	params.SetApplication(cedarRoleApplication)
	params.SetObjectID(&systemID)
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

	if len(resp.Payload.Roles) == 0 {
		return nil, &apperrors.ResourceNotFoundError{Err: fmt.Errorf("no roles found"), Resource: []*models.CedarRole{}}
	}

	// Convert the auto-generated struct to our own pkg/models struct
	retVal := []*models.CedarRole{}

	for _, role := range resp.Payload.Roles {
		if role.Application == nil {
			appcontext.ZLogger(ctx).Error("Error decoding role; role Application was null", zap.String("systemID", systemID))
			continue
		}

		if role.ObjectID == nil {
			appcontext.ZLogger(ctx).Error("Error decoding role; role ObjectID was null", zap.String("systemID", systemID))
			continue
		}

		if role.RoleTypeID == nil {
			appcontext.ZLogger(ctx).Error("Error decoding role; role type ID was null", zap.String("systemID", systemID))
			continue
		}

		assigneeType, validAssigneeType := decodeAssigneeType(role.AssigneeType)
		if !validAssigneeType {
			appcontext.ZLogger(ctx).Error("Error decoding role; role assignee type didn't match possible values from Swagger", zap.String("systemID", systemID))
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
