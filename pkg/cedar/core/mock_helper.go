package cedarcore

import (
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

func getMockSystems() ([]*models.CedarSystem, error) {
	var systems []*models.CedarSystem
	for _, v := range mockSystems {
		systems = append(systems, v)
	}
	return systems, nil
}

func getMockSystem(systemID string) (*models.CedarSystem, error) {
	system, ok := mockSystems[systemID]
	if !ok {
		return nil, nil
	}
	return system, nil
}
