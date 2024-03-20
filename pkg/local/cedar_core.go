package local

import (
	"fmt"
	"sort"
	"time"

	"github.com/guregu/null/zero"

	"github.com/cmsgov/easi-app/pkg/helpers"
	"github.com/cmsgov/easi-app/pkg/models"
)

var mockSystems = map[string]*models.CedarSystem{
	"{11AB1A00-1234-5678-ABC1-1A001B00CC0A}": {
		ID:                      zero.StringFrom("{11AB1A00-1234-5678-ABC1-1A001B00CC0A}"),
		Name:                    zero.StringFrom("Centers for Management Services"),
		Acronym:                 zero.StringFrom("CMS"),
		Description:             zero.StringFrom("Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis."),
		VersionID:               zero.StringFrom("{12A123B1-1A2B-1A23-1AB2-12A3456BC7D8}"),
		Status:                  zero.StringFrom(""),
		BusinessOwnerOrg:        zero.StringFrom("Information Systems Team"),
		BusinessOwnerOrgComp:    zero.StringFrom("IST"),
		SystemMaintainerOrg:     zero.StringFrom("Division of Quality Assurance"),
		SystemMaintainerOrgComp: zero.StringFrom("DQA"),
	},
	"{11AB1A00-1234-5678-ABC1-1A001B00CC1B}": {
		ID:                      zero.StringFrom("{11AB1A00-1234-5678-ABC1-1A001B00CC1B}"),
		Name:                    zero.StringFrom("Office of Funny Walks"),
		Acronym:                 zero.StringFrom("OFW"),
		Description:             zero.StringFrom("Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis."),
		VersionID:               zero.StringFrom("{12A123B1-1A2B-1A23-1AB2-12A3456BC7D8}"),
		Status:                  zero.StringFrom(""),
		BusinessOwnerOrg:        zero.StringFrom("Information Systems Team"),
		BusinessOwnerOrgComp:    zero.StringFrom("IST"),
		SystemMaintainerOrg:     zero.StringFrom("Division of Quality Assurance"),
		SystemMaintainerOrgComp: zero.StringFrom("DQA"),
	},
	"{11AB1A00-1234-5678-ABC1-1A001B00CC2C}": {
		ID:                      zero.StringFrom("{11AB1A00-1234-5678-ABC1-1A001B00CC2C}"),
		Name:                    zero.StringFrom("Quality Assurance Team"),
		Acronym:                 zero.StringFrom("QAT"),
		Description:             zero.StringFrom("Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis."),
		VersionID:               zero.StringFrom("{12A123B1-1A2B-1A23-1AB2-12A3456BC7D8}"),
		Status:                  zero.StringFrom(""),
		BusinessOwnerOrg:        zero.StringFrom("Information Systems Team"),
		BusinessOwnerOrgComp:    zero.StringFrom("IST"),
		SystemMaintainerOrg:     zero.StringFrom("Division of Quality Assurance"),
		SystemMaintainerOrgComp: zero.StringFrom("DQA"),
	},
	"{11AB1A00-1234-5678-ABC1-1A001B00CC3D}": {
		ID:                      zero.StringFrom("{11AB1A00-1234-5678-ABC1-1A001B00CC3D}"),
		Name:                    zero.StringFrom("Strategic Work Information Management System"),
		Acronym:                 zero.StringFrom("SWIMS"),
		Description:             zero.StringFrom("Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis."),
		VersionID:               zero.StringFrom("{12A123B1-1A2B-1A23-1AB2-12A3456BC7D8}"),
		Status:                  zero.StringFrom(""),
		BusinessOwnerOrg:        zero.StringFrom("Managerial Mission Management"),
		BusinessOwnerOrgComp:    zero.StringFrom("MMM"),
		SystemMaintainerOrg:     zero.StringFrom("Division of Divisive Divergence"),
		SystemMaintainerOrgComp: zero.StringFrom("DODD"),
	},
	"{11AB1A00-1234-5678-ABC1-1A001B00CC4E}": {
		ID:                      zero.StringFrom("{11AB1A00-1234-5678-ABC1-1A001B00CC4E}"),
		Name:                    zero.StringFrom("Center for Central Centrifugal Certainty"),
		Acronym:                 zero.StringFrom("CCCC"),
		Description:             zero.StringFrom("Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis."),
		VersionID:               zero.StringFrom("{12A123B1-1A2B-1A23-1AB2-12A3456BC7D8}"),
		Status:                  zero.StringFrom(""),
		BusinessOwnerOrg:        zero.StringFrom("Managerial Mission Management"),
		BusinessOwnerOrgComp:    zero.StringFrom("MMM"),
		SystemMaintainerOrg:     zero.StringFrom("Division of Divisive Divergence"),
		SystemMaintainerOrgComp: zero.StringFrom("DODD"),
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
		return systems[i].ID.String < systems[j].ID.String
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
		ID:          zero.StringFrom("{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID01}"),
		Application: zero.StringFrom("alfabet"),
		Name:        zero.StringFrom("API Contact"),
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          zero.StringFrom("{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID02}"),
		Application: zero.StringFrom("alfabet"),
		Name:        zero.StringFrom("Business Question Contact"),
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          zero.StringFrom("{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID03}"),
		Application: zero.StringFrom("alfabet"),
		Name:        zero.StringFrom("Survey Point of Contact"),
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          zero.StringFrom("{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID04}"),
		Application: zero.StringFrom("alfabet"),
		Name:        zero.StringFrom("Government Task Lead (GTL)"),
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          zero.StringFrom("{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID05}"),
		Application: zero.StringFrom("alfabet"),
		Name:        zero.StringFrom("Support Staff"),
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          zero.StringFrom("{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID06}"),
		Application: zero.StringFrom("alfabet"),
		Name:        zero.StringFrom("System Maintainer"),
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          zero.StringFrom("{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID07}"),
		Application: zero.StringFrom("alfabet"),
		Name:        zero.StringFrom("ISSO"),
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          zero.StringFrom("{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID08}"),
		Application: zero.StringFrom("alfabet"),
		Name:        zero.StringFrom("Contracting Officer's Representative (COR)"),
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          zero.StringFrom("{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID09}"),
		Application: zero.StringFrom("alfabet"),
		Name:        zero.StringFrom("Business Owner"),
		Description: zero.StringFrom("The organization or person in the business who owns the application and thus is typically responsible for managing the functional requirements."),
	},
	{
		ID:          zero.StringFrom("{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID10}"),
		Application: zero.StringFrom("alfabet"),
		Name:        zero.StringFrom("Subject Matter Expert (SME)"),
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          zero.StringFrom("{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID11}"),
		Application: zero.StringFrom("alfabet"),
		Name:        zero.StringFrom("Technical System Issues Contact"),
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          zero.StringFrom("{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID12}"),
		Application: zero.StringFrom("alfabet"),
		Name:        zero.StringFrom("Budget Analyst"),
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          zero.StringFrom("{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID13}"),
		Application: zero.StringFrom("alfabet"),
		Name:        zero.StringFrom("Data Center Contact"),
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          zero.StringFrom("{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID14}"),
		Application: zero.StringFrom("alfabet"),
		Name:        zero.StringFrom("Project Lead"),
		Description: zero.StringFromPtr(nil),
	},
	{
		ID:          zero.StringFrom("{FAKE12AB-12A3-12a1-1AB2-ROLETYPEID15}"),
		Application: zero.StringFrom("alfabet"),
		Name:        zero.StringFrom("AI Contact"),
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
		if rt.ID.String == roleTypeID {
			return rt
		}
	}
	return &models.CedarRoleType{}
}

// GetMockSystemRoles returns mocked roles for a single CEDAR system, filtered by role type ID
func GetMockSystemRoles(cedarSystemID string, roleTypeID *string) []*models.CedarRole {
	var roleTypeIDStr string
	if roleTypeID != nil {
		roleTypeIDStr = *roleTypeID
	}
	roleTypes := GetMockRoleTypes()
	users := getMockUserData()
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
			AssigneeEmail:     zero.StringFrom(fmt.Sprintf(`%s.%s@fake.local`, user.FirstName, user.LastName)),
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
