package cedarcoremock

import (
	"context"
	"fmt"

	"github.com/guregu/null/zero"

	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/local"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

var mockRoleTypes = []*models.CedarRoleType{
	{
		ID:          zero.StringFrom("{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID01}"),
		Application: zero.StringFrom("alfabet"),
		Name:        zero.StringFrom(models.APIContactRole.String()),
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          zero.StringFrom("{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID02}"),
		Application: zero.StringFrom("alfabet"),
		Name:        zero.StringFrom(models.SystemBusinessQuestionContactRole.String()),
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          zero.StringFrom("{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID03}"),
		Application: zero.StringFrom("alfabet"),
		Name:        zero.StringFrom(models.SurveyPointOfContactRole.String()),
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          zero.StringFrom("{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID04}"),
		Application: zero.StringFrom("alfabet"),
		Name:        zero.StringFrom(models.GovernmentTaskLeadRole.String()),
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          zero.StringFrom("{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID05}"),
		Application: zero.StringFrom("alfabet"),
		Name:        zero.StringFrom(models.SupportStaffRole.String()),
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          zero.StringFrom("{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID06}"),
		Application: zero.StringFrom("alfabet"),
		Name:        zero.StringFrom(models.SystemMaintainerRole.String()),
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          zero.StringFrom("{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID07}"),
		Application: zero.StringFrom("alfabet"),
		Name:        zero.StringFrom(models.ISSORole.String()),
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          zero.StringFrom("{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID08}"),
		Application: zero.StringFrom("alfabet"),
		Name:        zero.StringFrom(models.CORRole.String()),
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          zero.StringFrom("{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID09}"),
		Application: zero.StringFrom("alfabet"),
		Name:        zero.StringFrom(models.BusinessOwnerRole.String()),
		Description: zero.StringFrom("The organization or person in the business who owns the application and thus is typically responsible for managing the functional requirements."),
	},
	{
		ID:          zero.StringFrom("{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID10}"),
		Application: zero.StringFrom("alfabet"),
		Name:        zero.StringFrom(models.SubjectMatterExpertRole.String()),
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          zero.StringFrom("{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID11}"),
		Application: zero.StringFrom("alfabet"),
		Name:        zero.StringFrom(models.TechnicalSystemIssuesContactRole.String()),
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          zero.StringFrom("{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID12}"),
		Application: zero.StringFrom("alfabet"),
		Name:        zero.StringFrom(models.BudgetAnalystRole.String()),
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          zero.StringFrom("{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID13}"),
		Application: zero.StringFrom("alfabet"),
		Name:        zero.StringFrom(models.DataCenterContactRole.String()),
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          zero.StringFrom("{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID14}"),
		Application: zero.StringFrom("alfabet"),
		Name:        zero.StringFrom(models.ProjectLeadRole.String()),
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          zero.StringFrom("{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID15}"),
		Application: zero.StringFrom("alfabet"),
		Name:        zero.StringFrom(models.AIContactRole.String()),
		Description: zero.StringFromPtr(nil),
	},
}

// GetRoleTypes returns a list of mocked role types
func GetRoleTypes() []*models.CedarRoleType {
	return mockRoleTypes
}

// GetRoleTypeByRoleTypeID returns a single role type by ID
func GetRoleTypeByRoleTypeID(roleTypeID string) *models.CedarRoleType {
	for _, rt := range mockRoleTypes {
		if rt.ID.String == roleTypeID {
			return rt
		}
	}
	return &models.CedarRoleType{}
}

// GetSystemRoles returns mocked roles for a single CEDAR system, filtered by role type ID
func GetSystemRoles(cedarSystemID string, roleTypeID *string) []*models.CedarRole {
	var roleTypeIDStr string
	if roleTypeID != nil {
		roleTypeIDStr = *roleTypeID
	}
	roleTypes := GetRoleTypes()

	oktaClient := local.NewOktaAPIClient()
	//swallow error for mocking
	users, _ := oktaClient.FetchUserInfos(context.Background(), local.GetMockUsernames())

	mockSystemRoles := []*models.CedarRole{}

	makeMockRoleFromUserAndRoleType := func(
		roleID string,
		user *models.UserInfo,
		rt *models.CedarRoleType,
	) *models.CedarRole {
		return &models.CedarRole{
			Application:       zero.StringFrom("alfabet"), // should always be "alfabet"
			ObjectID:          zero.StringFrom(cedarSystemID),
			AssigneeType:      helpers.PointerTo(models.PersonAssignee),
			AssigneeUsername:  zero.StringFrom(user.Username),
			AssigneeEmail:     zero.StringFrom(string(user.Email)),
			AssigneeFirstName: zero.StringFrom(user.FirstName),
			AssigneeLastName:  zero.StringFrom(user.LastName),
			AssigneePhone:     zero.StringFrom("123-456-7890"),
			RoleTypeName:      rt.Name,
			RoleTypeDesc:      rt.Description,
			RoleTypeID:        rt.ID,
			RoleID:            zero.StringFrom(roleID),
		}
	}
	for i, rt := range roleTypes {
		// if role type ID was provided and does not match current role type ID, don't add it to results
		if roleTypeIDStr != "" && roleTypeIDStr != rt.ID.String {
			continue
		}
		role := makeMockRoleFromUserAndRoleType(
			fmt.Sprintf(`{FAKE12AB-12A3-12a1-1AB2-AB12ROLEID%02d}`, i),
			users[i],
			rt,
		)
		mockSystemRoles = append(mockSystemRoles, role)
	}

	fakeBusinessOwnerRoleTypeID := "{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID09}"
	fakeBusinessOwnerRoleType := GetRoleTypeByRoleTypeID(fakeBusinessOwnerRoleTypeID)

	// add extra Business Owners if roleTypeID was not provided or the provided type ID was for Biz Owner
	if roleTypeIDStr == "" || roleTypeIDStr == fakeBusinessOwnerRoleTypeID {
		mockSystemRoles = append(
			mockSystemRoles,
			makeMockRoleFromUserAndRoleType(
				fmt.Sprintf(`{FAKE12AB-12A3-12a1-1AB2-AB12ROLEID%02d}`, len(mockSystemRoles)+1),
				users[len(mockSystemRoles)+1],
				fakeBusinessOwnerRoleType,
			),
			makeMockRoleFromUserAndRoleType(
				fmt.Sprintf(`{FAKE12AB-12A3-12a1-1AB2-AB12ROLEID%02d}`, len(mockSystemRoles)+2),
				users[len(mockSystemRoles)+2],
				fakeBusinessOwnerRoleType,
			),
		)
	}
	return mockSystemRoles
}
