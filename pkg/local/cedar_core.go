package local

import (
	"fmt"
	"sort"
	"time"

	"github.com/guregu/null"
	"github.com/guregu/null/zero"

	"github.com/cmsgov/easi-app/pkg/helpers"
	"github.com/cmsgov/easi-app/pkg/models"
)

var mockSystems = map[string]*models.CedarSystem{
	"{11AB1A00-1234-5678-ABC1-1A001B00CC0A}": {
		ID:                      "{11AB1A00-1234-5678-ABC1-1A001B00CC0A}",
		Name:                    "Centers for Management Services",
		Acronym:                 "CMS",
		Description:             "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.",
		VersionID:               "{12A123B1-1A2B-1A23-1AB2-12A3456BC7D8}",
		Status:                  "",
		BusinessOwnerOrg:        "Information Systems Team",
		BusinessOwnerOrgComp:    "IST",
		SystemMaintainerOrg:     "Division of Quality Assurance",
		SystemMaintainerOrgComp: "DQA",
	},
	"{11AB1A00-1234-5678-ABC1-1A001B00CC1B}": {
		ID:                      "{11AB1A00-1234-5678-ABC1-1A001B00CC1B}",
		Name:                    "Office of Funny Walks",
		Acronym:                 "OFW",
		Description:             "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.",
		VersionID:               "{12A123B1-1A2B-1A23-1AB2-12A3456BC7D8}",
		Status:                  "",
		BusinessOwnerOrg:        "Information Systems Team",
		BusinessOwnerOrgComp:    "IST",
		SystemMaintainerOrg:     "Division of Quality Assurance",
		SystemMaintainerOrgComp: "DQA",
	},
	"{11AB1A00-1234-5678-ABC1-1A001B00CC2C}": {
		ID:                      "{11AB1A00-1234-5678-ABC1-1A001B00CC2C}",
		Name:                    "Quality Assurance Team",
		Acronym:                 "QAT",
		Description:             "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.",
		VersionID:               "{12A123B1-1A2B-1A23-1AB2-12A3456BC7D8}",
		Status:                  "",
		BusinessOwnerOrg:        "Information Systems Team",
		BusinessOwnerOrgComp:    "IST",
		SystemMaintainerOrg:     "Division of Quality Assurance",
		SystemMaintainerOrgComp: "DQA",
	},
	"{11AB1A00-1234-5678-ABC1-1A001B00CC3D}": {
		ID:                      "{11AB1A00-1234-5678-ABC1-1A001B00CC3D}",
		Name:                    "Strategic Work Information Management System",
		Acronym:                 "SWIMS",
		Description:             "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.",
		VersionID:               "{12A123B1-1A2B-1A23-1AB2-12A3456BC7D8}",
		Status:                  "",
		BusinessOwnerOrg:        "Managerial Mission Management",
		BusinessOwnerOrgComp:    "MMM",
		SystemMaintainerOrg:     "Division of Divisive Divergence",
		SystemMaintainerOrgComp: "DODD",
	},
	"{11AB1A00-1234-5678-ABC1-1A001B00CC4E}": {
		ID:                      "{11AB1A00-1234-5678-ABC1-1A001B00CC4E}",
		Name:                    "Center for Central Centrifugal Certainty",
		Acronym:                 "CCCC",
		Description:             "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.",
		VersionID:               "{12A123B1-1A2B-1A23-1AB2-12A3456BC7D8}",
		Status:                  "",
		BusinessOwnerOrg:        "Managerial Mission Management",
		BusinessOwnerOrgComp:    "MMM",
		SystemMaintainerOrg:     "Division of Divisive Divergence",
		SystemMaintainerOrgComp: "DODD",
	},
}

// GetMockSystems returns a mocked list of Cedar Systems
func GetMockSystems() []*models.CedarSystem {
	var systems []*models.CedarSystem
	for _, v := range mockSystems {
		systems = append(systems, v)
	}
	return systems
}

// GetFilteredMockSystems returns the first two mocked Cedar Systems, ordered by ID
func GetFilteredMockSystems() []*models.CedarSystem {
	systems := GetMockSystems()
	sort.Slice(systems, func(i, j int) bool {
		return systems[i].ID < systems[j].ID
	})

	if len(systems) >= 2 {
		return systems[:2]
	}

	return systems
}

// GetMockSystem returns a single mocked Cedar System by ID
func GetMockSystem(systemID string) *models.CedarSystem {
	system, ok := mockSystems[systemID]
	if !ok {
		return nil
	}
	return system
}

var mockRoleTypes = []*models.CedarRoleType{
	{
		ID:          "{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID01}",
		Application: "alfabet",
		Name:        "API Contact",
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          "{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID02}",
		Application: "alfabet",
		Name:        "Business Question Contact",
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          "{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID03}",
		Application: "alfabet",
		Name:        "Survey Point of Contact",
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          "{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID04}",
		Application: "alfabet",
		Name:        "Government Task Lead (GTL)",
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          "{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID05}",
		Application: "alfabet",
		Name:        "Support Staff",
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          "{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID06}",
		Application: "alfabet",
		Name:        "System Maintainer",
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          "{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID07}",
		Application: "alfabet",
		Name:        "ISSO",
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          "{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID08}",
		Application: "alfabet",
		Name:        "Contracting Officer's Representative (COR)",
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          "{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID09}",
		Application: "alfabet",
		Name:        "Business Owner",
		Description: zero.StringFrom("The organization or person in the business who owns the application and thus is typically responsible for managing the functional requirements."),
	},
	{
		ID:          "{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID10}",
		Application: "alfabet",
		Name:        "Subject Matter Expert (SME)",
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          "{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID11}",
		Application: "alfabet",
		Name:        "Technical System Issues Contact",
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          "{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID12}",
		Application: "alfabet",
		Name:        "Budget Analyst",
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          "{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID13}",
		Application: "alfabet",
		Name:        "Data Center Contact",
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          "{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID14}",
		Application: "alfabet",
		Name:        "Project Lead",
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          "{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID15}",
		Application: "alfabet",
		Name:        "AI Contact",
		Description: zero.StringFromPtr(nil),
	},
}

// GetMockRoleTypes returns a list of mocked role types
func GetMockRoleTypes() []*models.CedarRoleType {
	return mockRoleTypes
}

// GetMockRoleTypeByRoleTypeID returns a single role type by ID
func GetMockRoleTypeByRoleTypeID(roleTypeID string) *models.CedarRoleType {
	for _, rt := range mockRoleTypes {
		if rt.ID == roleTypeID {
			return rt
		}
	}
	return &models.CedarRoleType{}
}

// GetMockSystemRoles returns mocked roles for a single CEDAR system, filtered by role type ID
func GetMockSystemRoles(cedarSystemID string, roleTypeID null.String) []*models.CedarRole {
	roleTypeIDStr := roleTypeID.String
	roleTypes := GetMockRoleTypes()
	users := getMockUserData()
	mockSystemRoles := []*models.CedarRole{}

	makeMockRoleFromUserAndRoleType := func(
		roleID string,
		user *models.UserInfo,
		rt *models.CedarRoleType,
	) *models.CedarRole {
		return &models.CedarRole{
			Application:       "alfabet", // should always be "alfabet"
			ObjectID:          cedarSystemID,
			AssigneeType:      helpers.PointerTo(models.PersonAssignee),
			AssigneeUsername:  zero.StringFrom(user.Username),
			AssigneeEmail:     zero.StringFrom(fmt.Sprintf(`%s.%s@fake.local`, user.FirstName, user.LastName)),
			AssigneeFirstName: zero.StringFrom(user.FirstName),
			AssigneeLastName:  zero.StringFrom(user.LastName),
			AssigneePhone:     zero.StringFrom("123-456-7890"),
			RoleTypeName:      zero.StringFrom(rt.Name),
			RoleTypeDesc:      rt.Description,
			RoleTypeID:        rt.ID,
			RoleID:            zero.StringFrom(roleID),
		}
	}
	for i, rt := range roleTypes {
		// if role type ID was provided and does not match current role type ID, don't add it to results
		if roleTypeIDStr != "" && roleTypeIDStr != rt.ID {
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
	fakeBusinessOwnerRoleType := GetMockRoleTypeByRoleTypeID(fakeBusinessOwnerRoleTypeID)

	// add extra business owners if roleTypeID was not provided or the provided type ID was for Biz Owner
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

var mockContracts = []*models.CedarContract{
	{
		EndDate:         zero.TimeFrom(time.Now().AddDate(1, 0, 0)),
		StartDate:       zero.TimeFrom(time.Now().AddDate(-1, 0, 0)),
		ContractName:    zero.StringFrom("AB-12C-3456 / 12ABCD34E0001 Trendy Nano ABC"),
		ContractNumber:  zero.StringFrom("12ABCD34E0001").Ptr(),
		Description:     zero.StringFrom("Strategic partners acquisition readiness"),
		IsDeliveryOrg:   false,
		ServiceProvided: zero.StringFromPtr(nil),
	},
	{
		EndDate:         zero.TimeFrom(time.Time{}),
		StartDate:       zero.TimeFrom(time.Time{}),
		ContractName:    zero.StringFrom("Cloud Arcade Cabinet & Pinball Services (Cloud ACAPS)"),
		ContractNumber:  zero.StringFrom("12ABCD34E0002").Ptr(),
		Description:     zero.StringFromPtr(nil),
		IsDeliveryOrg:   false,
		ServiceProvided: zero.StringFromPtr(nil),
	},
	{
		EndDate:         zero.TimeFrom(time.Time{}),
		StartDate:       zero.TimeFrom(time.Time{}),
		ContractName:    zero.StringFrom("Mediocre Entertainment Division (MED)"),
		ContractNumber:  zero.StringFrom("12ABCD34E0003").Ptr(),
		Description:     zero.StringFromPtr(nil),
		IsDeliveryOrg:   true,
		ServiceProvided: zero.StringFrom("this is a mock data string"),
	},
	{
		EndDate:         zero.TimeFrom(time.Now().AddDate(0, 3, 0)),
		StartDate:       zero.TimeFrom(time.Now().AddDate(0, -6, 0)),
		ContractName:    zero.StringFrom("Cool Products & Tools"),
		ContractNumber:  zero.StringFrom("12ABCD34E0004").Ptr(),
		Description:     zero.StringFrom("All the best tools and products are found here."),
		IsDeliveryOrg:   false,
		ServiceProvided: zero.StringFromPtr(nil),
	},
	{
		EndDate:         zero.TimeFrom(time.Time{}),
		StartDate:       zero.TimeFrom(time.Time{}),
		ContractName:    zero.StringFrom("Cautionary Security Occurences and Training (Cloud SecOops)"),
		ContractNumber:  zero.StringFrom("12ABCD34E0005").Ptr(),
		Description:     zero.StringFromPtr(nil),
		IsDeliveryOrg:   false,
		ServiceProvided: zero.StringFromPtr(nil),
	},
}

func GetMockContractsBySystem(cedarSystemID string) []*models.CedarContract {
	contracts := []*models.CedarContract{}
	for i := range mockContracts {
		contract := *mockContracts[i]
		contract.SystemID = zero.StringFrom(cedarSystemID)
		contracts = append(contracts, &contract)
	}
	return contracts
}
