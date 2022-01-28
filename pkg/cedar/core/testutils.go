package cedarcore

import (
	"github.com/go-openapi/runtime"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"
	"gopkg.in/launchdarkly/go-server-sdk.v5/testhelpers/ldtestdata"

	"github.com/cmsgov/easi-app/pkg/cedar/core/gen/client"
	"github.com/cmsgov/easi-app/pkg/cedar/core/gen/client/role"
	genmodels "github.com/cmsgov/easi-app/pkg/cedar/core/gen/models"
)

func enabledLdClient() (*ld.LDClient, error) {
	td := ldtestdata.DataSource()
	td.Update(td.Flag(cedarCoreEnabledKey).BooleanFlag().VariationForAllUsers(true))

	return ld.MakeCustomClient("fake", ld.Config{
		DataSource: td,
	}, 0)
}

// MockClientRoleService mocks ClientService from pkg/cedar/core/gen/client/role
type MockClientRoleService struct {
	MockRoleFindByID func(*role.RoleFindByIDParams, runtime.ClientAuthInfoWriter, ...role.ClientOption) (*role.RoleFindByIDOK, error)
}

// RoleAdd is a mock implementation of calling CEDAR to add a role
func (mock *MockClientRoleService) RoleAdd(params *role.RoleAddParams, authInfo runtime.ClientAuthInfoWriter, opts ...role.ClientOption) (*role.RoleAddOK, error) {
	panic("Not implemented")
}

// RoleDeleteList is a mock implementation of calling CEDAR to delete a list of roles
func (mock *MockClientRoleService) RoleDeleteList(params *role.RoleDeleteListParams, authInfo runtime.ClientAuthInfoWriter, opts ...role.ClientOption) (*role.RoleDeleteListOK, error) {
	panic("Not implemented")
}

// RoleFindByID is a (modifiable) mock implementation of calling CEDAR to find a role
func (mock *MockClientRoleService) RoleFindByID(params *role.RoleFindByIDParams, authInfo runtime.ClientAuthInfoWriter, opts ...role.ClientOption) (*role.RoleFindByIDOK, error) {
	return mock.MockRoleFindByID(params, authInfo, opts...)
}

// RoleTypeFind is a mock implementation of calling CEDAR to find a role type
func (mock *MockClientRoleService) RoleTypeFind(params *role.RoleTypeFindParams, authInfo runtime.ClientAuthInfoWriter, opts ...role.ClientOption) (*role.RoleTypeFindOK, error) {
	panic("Not implemented")
}

// SetTransport is a mock implementation of setting the transport for the client
func (mock *MockClientRoleService) SetTransport(transport runtime.ClientTransport) {
	panic("Not implemented")
}

func strPtr(s string) *string {
	return &s
}

func newMockReturnRole(assigneeType string) genmodels.Role {
	return genmodels.Role{
		Application: strPtr("fakeApplication"),
		ObjectID:    strPtr("fakeObjectID"),
		RoleTypeID:  strPtr("fakeRoleTypeID"),

		AssigneeType: assigneeType,
	}
}

func newMockSdkForRoleQueries(assigneeType string) *client.CEDARCoreAPI {
	mockReturnRole := newMockReturnRole(assigneeType)
	mockReturnRoles := []*genmodels.Role{}
	mockReturnRoles = append(mockReturnRoles, &mockReturnRole)

	mockClientService := MockClientRoleService{
		MockRoleFindByID: func(params *role.RoleFindByIDParams, authInfo runtime.ClientAuthInfoWriter, opts ...role.ClientOption) (*role.RoleFindByIDOK, error) {
			resp := &role.RoleFindByIDOK{
				Payload: &genmodels.RoleFindResponse{
					Roles: mockReturnRoles,
				},
			}
			return resp, nil
		},
	}

	return &client.CEDARCoreAPI{
		Role: &mockClientService,
	}
}
