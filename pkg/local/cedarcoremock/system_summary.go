package cedarcoremock

import (
	"sort"

	"github.com/guregu/null/zero"

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

// GetSystems returns a mocked list of Cedar Systems
func GetSystems() []*models.CedarSystem {
	var systems []*models.CedarSystem
	for _, v := range mockSystems {
		systems = append(systems, v)
	}
	return systems
}

// GetFilteredSystems returns the first two mocked Cedar Systems, ordered by ID
func GetFilteredSystems() []*models.CedarSystem {
	systems := GetSystems()
	sort.Slice(systems, func(i, j int) bool {
		return systems[i].ID.String < systems[j].ID.String
	})

	if len(systems) >= 2 {
		return systems[:2]
	}

	return systems
}

// GetSystem returns a single mocked Cedar System by ID
func GetSystem(systemID string) *models.CedarSystem {
	system, ok := mockSystems[systemID]
	if !ok {
		return nil
	}
	return system
}

func isMockSystem(systemID string) bool {
	_, ok := mockSystems[systemID]
	return ok
}
