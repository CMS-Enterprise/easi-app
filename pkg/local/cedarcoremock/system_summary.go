package cedarcoremock

import (
	"fmt"
	"sort"
	"time"

	"github.com/guregu/null/zero"
	"github.com/samber/lo"

	"github.com/cms-enterprise/easi-app/pkg/apperrors"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

var now = time.Now()

var mockSystems = map[string]*models.CedarSystem{
	"{11AB1A00-1234-5678-ABC1-1A001B00CC0A}": {
		ID:                      zero.StringFrom("{11AB1A00-1234-5678-ABC1-1A001B00CC0A}"),
		Name:                    zero.StringFrom("Centers for Management Services"),
		Description:             zero.StringFrom("Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis."),
		Acronym:                 zero.StringFrom("CMS"),
		ATOEffectiveDate:        zero.TimeFrom(now.AddDate(-1, 0, 0)),
		ATOExpirationDate:       zero.TimeFrom(now.AddDate(0, -1, 0)),
		State:                   zero.StringFrom("active"),
		Status:                  zero.StringFrom(""),
		BusinessOwnerOrg:        zero.StringFrom("Information Systems Team"),
		BusinessOwnerOrgComp:    zero.StringFrom("IST"),
		SystemMaintainerOrg:     zero.StringFrom("Division of Quality Assurance"),
		SystemMaintainerOrgComp: zero.StringFrom("DQA"),
		VersionID:               zero.StringFrom("{12A123B1-1A2B-1A23-1AB2-12A3456BC7D8}"),
		UUID:                    zero.StringFrom("f5172597-1f9d-4930-9db1-a565a2994c61"),
	},
	"{11AB1A00-1234-5678-ABC1-1A001B00CC1B}": {
		ID:                      zero.StringFrom("{11AB1A00-1234-5678-ABC1-1A001B00CC1B}"),
		Name:                    zero.StringFrom("Office of Funny Walks"),
		Acronym:                 zero.StringFrom("OFW"),
		ATOEffectiveDate:        zero.TimeFrom(now.AddDate(-1, 0, 0)),
		ATOExpirationDate:       zero.TimeFrom(now.AddDate(1, 0, 0)),
		Description:             zero.StringFrom("Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis."),
		VersionID:               zero.StringFrom("{12A123B1-1A2B-1A23-1AB2-12A3456BC7D8}"),
		State:                   zero.StringFrom("active"),
		Status:                  zero.StringFrom(""),
		BusinessOwnerOrg:        zero.StringFrom("Information Systems Team"),
		BusinessOwnerOrgComp:    zero.StringFrom("IST"),
		SystemMaintainerOrg:     zero.StringFrom("Division of Quality Assurance"),
		SystemMaintainerOrgComp: zero.StringFrom("DQA"),
		UUID:                    zero.StringFrom("44feed75-a837-4fe6-94f2-f9d24e56697b"),
	},
	"{11AB1A00-1234-5678-ABC1-1A001B00CC2C}": {
		ID:                      zero.StringFrom("{11AB1A00-1234-5678-ABC1-1A001B00CC2C}"),
		Name:                    zero.StringFrom("Quality Assurance Team"),
		Acronym:                 zero.StringFrom("QAT"),
		ATOEffectiveDate:        zero.TimeFrom(now),
		ATOExpirationDate:       zero.TimeFrom(now.AddDate(0, 0, 1)),
		Description:             zero.StringFrom("Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis."),
		VersionID:               zero.StringFrom("{12A123B1-1A2B-1A23-1AB2-12A3456BC7D8}"),
		State:                   zero.StringFrom("active"),
		Status:                  zero.StringFrom(""),
		BusinessOwnerOrg:        zero.StringFrom("Information Systems Team"),
		BusinessOwnerOrgComp:    zero.StringFrom("IST"),
		SystemMaintainerOrg:     zero.StringFrom("Division of Quality Assurance"),
		SystemMaintainerOrgComp: zero.StringFrom("DQA"),
		UUID:                    zero.StringFrom("81b4638f-fbb3-4bb0-a0a4-d16f03eb8cc0"),
	},
	"{11AB1A00-1234-5678-ABC1-1A001B00CC3D}": {
		ID:                      zero.StringFrom("{11AB1A00-1234-5678-ABC1-1A001B00CC3D}"),
		Name:                    zero.StringFrom("Strategic Work Information Management System"),
		Acronym:                 zero.StringFrom("SWIMS"),
		ATOEffectiveDate:        zero.TimeFrom(now.AddDate(-2, 0, 0)),
		ATOExpirationDate:       zero.TimeFrom(now.AddDate(1, 0, 0)),
		Description:             zero.StringFrom("Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis."),
		VersionID:               zero.StringFrom("{12A123B1-1A2B-1A23-1AB2-12A3456BC7D8}"),
		State:                   zero.StringFrom("active"),
		Status:                  zero.StringFrom(""),
		BusinessOwnerOrg:        zero.StringFrom("Managerial Mission Management"),
		BusinessOwnerOrgComp:    zero.StringFrom("MMM"),
		SystemMaintainerOrg:     zero.StringFrom("Division of Divisive Divergence"),
		SystemMaintainerOrgComp: zero.StringFrom("DODD"),
		UUID:                    zero.StringFrom("3d167844-8f36-49f4-a5d7-8c55c9d7621c"),
	},
	"{11AB1A00-1234-5678-ABC1-1A001B00CC4E}": {
		ID:                      zero.StringFrom("{11AB1A00-1234-5678-ABC1-1A001B00CC4E}"),
		Name:                    zero.StringFrom("Center for Central Centrifugal Certainty"),
		Acronym:                 zero.StringFrom("CCCC"),
		ATOEffectiveDate:        zero.TimeFrom(time.Time{}),
		ATOExpirationDate:       zero.TimeFrom(time.Time{}),
		Description:             zero.StringFrom("Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis."),
		VersionID:               zero.StringFrom("{12A123B1-1A2B-1A23-1AB2-12A3456BC7D8}"),
		State:                   zero.StringFrom("active"),
		Status:                  zero.StringFrom(""),
		BusinessOwnerOrg:        zero.StringFrom("Managerial Mission Management"),
		BusinessOwnerOrgComp:    zero.StringFrom("MMM"),
		SystemMaintainerOrg:     zero.StringFrom("Division of Divisive Divergence"),
		SystemMaintainerOrgComp: zero.StringFrom("DODD"),
		UUID:                    zero.StringFrom("46434d7c-5193-4a9d-82b1-0c4d3ceb4237"),
	},
	"{11AB1A00-1234-5678-ABC1-1A001B00CC5F}": {
		ID:                      zero.StringFrom("{11AB1A00-1234-5678-ABC1-1A001B00CC5F}"),
		Name:                    zero.StringFrom("Office of Official Obfuscation"),
		Acronym:                 zero.StringFrom("OOO"),
		ATOEffectiveDate:        zero.TimeFrom(now),
		ATOExpirationDate:       zero.TimeFrom(now.AddDate(1, 0, 0)),
		Description:             zero.StringFrom("Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis."),
		VersionID:               zero.StringFrom("{12A123B1-1A2B-1A23-1AB2-12A3456BC7D8}"),
		State:                   zero.StringFrom("deactivated"),
		Status:                  zero.StringFrom(""),
		BusinessOwnerOrg:        zero.StringFrom("Managerial Mission Management"),
		BusinessOwnerOrgComp:    zero.StringFrom("MMM"),
		SystemMaintainerOrg:     zero.StringFrom("Division of Divisive Divergence"),
		SystemMaintainerOrgComp: zero.StringFrom("DODD"),
		UUID:                    zero.StringFrom("1cd0e318-7a30-4fc9-8e28-388019f56851"),
	},
	"{11AB1A00-1234-5678-ABC1-1A001B00CC6G}": {
		ID:                      zero.StringFrom("{11AB1A00-1234-5678-ABC1-1A001B00CC6G}"),
		Name:                    zero.StringFrom("Artificial Intelligence Task Force"),
		Acronym:                 zero.StringFrom("AITF"),
		ATOEffectiveDate:        zero.TimeFrom(time.Time{}),
		ATOExpirationDate:       zero.TimeFrom(time.Time{}),
		Description:             zero.StringFrom("Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis."),
		VersionID:               zero.StringFrom("{12A123B1-1A2B-1A23-1AB2-12A3456BC7D8}"),
		State:                   zero.StringFrom("deactivated"),
		Status:                  zero.StringFrom(""),
		BusinessOwnerOrg:        zero.StringFrom("Managerial Mission Management"),
		BusinessOwnerOrgComp:    zero.StringFrom("MMM"),
		SystemMaintainerOrg:     zero.StringFrom("Division of Divisive Divergence"),
		SystemMaintainerOrgComp: zero.StringFrom("DODD"),
		UUID:                    zero.StringFrom("a967ad28-4a69-4031-b53f-687396b87fa5"),
	},
}

// GetAllSystems returns a mocked list of Cedar Systems
func GetAllSystems() []*models.CedarSystem {
	return lo.Values(mockSystems)
}

// GetActiveSystems returns only active systems
func GetActiveSystems() []*models.CedarSystem {
	var systems []*models.CedarSystem
	for _, v := range mockSystems {
		if v.State.String == "active" {
			systems = append(systems, v)
		}
	}
	return systems
}

// GetFilteredSystems returns the first two mocked Cedar Systems, ordered by ID
func GetFilteredSystems() []*models.CedarSystem {
	systems := GetActiveSystems()
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

func IsMockSystem(systemID string) bool {
	_, ok := mockSystems[systemID]
	return ok
}

// NoSystemFoundError returns the error generated from the CEDAR core client's GetSystem method
func NoSystemFoundError() *apperrors.ResourceNotFoundError {
	return &apperrors.ResourceNotFoundError{Err: fmt.Errorf("no system found"), Resource: models.CedarSystem{}}
}
