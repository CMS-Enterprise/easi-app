package models

import (
	"github.com/google/uuid"
	"github.com/samber/lo"
)

// SystemIntakeContactRole is the various roles that a user can have as a contact on a system intake
type SystemIntakeContactRole string

const (
	SystemIntakeContactRoleBusinessOwner                     SystemIntakeContactRole = "BUSINESS_OWNER"
	SystemIntakeContactRoleCloudNavigator                    SystemIntakeContactRole = "CLOUD_NAVIGATOR"
	SystemIntakeContactRoleContractingOfficersRepresentative SystemIntakeContactRole = "CONTRACTING_OFFICERS_REPRESENTATIVE"
	SystemIntakeContactRoleCyberRiskAdvisor                  SystemIntakeContactRole = "CYBER_RISK_ADVISOR"
	SystemIntakeContactRoleInformationSystemSecurityAdvisor  SystemIntakeContactRole = "INFORMATION_SYSTEM_SECURITY_ADVISOR"
	SystemIntakeContactRoleOther                             SystemIntakeContactRole = "OTHER"
	SystemIntakeContactRolePrivacyAdvisor                    SystemIntakeContactRole = "PRIVACY_ADVISOR"
	SystemIntakeContactRoleProductOwner                      SystemIntakeContactRole = "PRODUCT_OWNER"
	SystemIntakeContactRoleProductManager                    SystemIntakeContactRole = "PRODUCT_MANAGER"
	SystemIntakeContactRoleProjectManager                    SystemIntakeContactRole = "PROJECT_MANAGER"
	SystemIntakeContactRoleSubjectMatterExpert               SystemIntakeContactRole = "SUBJECT_MATTER_EXPERT"
	SystemIntakeContactRoleSystemMaintainer                  SystemIntakeContactRole = "SYSTEM_MAINTAINER"
	SystemIntakeContactRoleSystemOwner                       SystemIntakeContactRole = "SYSTEM_OWNER"
	// SystemIntakeContactRolePLACEHOLDER is the default role given. It is removed before returning the frontend, so they know a user needs to select a role
	SystemIntakeContactRolePLACEHOLDER SystemIntakeContactRole = "PLACE_HOLDER"
)

type SystemIntakeContactComponent string

const (
	SystemIntakeContactComponentCenterForClinicalStandardsAndQualityCcsq               SystemIntakeContactComponent = "CENTER_FOR_CLINICAL_STANDARDS_AND_QUALITY_CCSQ"
	SystemIntakeContactComponentCenterForConsumerInformationAndInsuranceOversightCciio SystemIntakeContactComponent = "CENTER_FOR_CONSUMER_INFORMATION_AND_INSURANCE_OVERSIGHT_CCIIO"
	SystemIntakeContactComponentCenterForMedicareCm                                    SystemIntakeContactComponent = "CENTER_FOR_MEDICARE_CM"
	SystemIntakeContactComponentCenterForMedicaidAndChipServicesCmcs                   SystemIntakeContactComponent = "CENTER_FOR_MEDICAID_AND_CHIP_SERVICES_CMCS"
	SystemIntakeContactComponentCenterForMedicareAndMedicaidInnovationCmmi             SystemIntakeContactComponent = "CENTER_FOR_MEDICARE_AND_MEDICAID_INNOVATION_CMMI"
	SystemIntakeContactComponentCenterForProgramIntegrityCpi                           SystemIntakeContactComponent = "CENTER_FOR_PROGRAM_INTEGRITY_CPI"
	SystemIntakeContactComponentCmsWide                                                SystemIntakeContactComponent = "CMS_WIDE"
	SystemIntakeContactComponentEmergencyPreparednessAndResponseOperationsEpro         SystemIntakeContactComponent = "EMERGENCY_PREPAREDNESS_AND_RESPONSE_OPERATIONS_EPRO"
	SystemIntakeContactComponentFederalCoordinatedHealthCareOffice                     SystemIntakeContactComponent = "FEDERAL_COORDINATED_HEALTH_CARE_OFFICE"
	SystemIntakeContactComponentOfficeOfAcquisitionAndGrantsManagementOagm             SystemIntakeContactComponent = "OFFICE_OF_ACQUISITION_AND_GRANTS_MANAGEMENT_OAGM"
	SystemIntakeContactComponentOfficeOfHealthcareExperienceAndInteroperability        SystemIntakeContactComponent = "OFFICE_OF_HEALTHCARE_EXPERIENCE_AND_INTEROPERABILITY"
	SystemIntakeContactComponentOfficeOfCommunicationsOc                               SystemIntakeContactComponent = "OFFICE_OF_COMMUNICATIONS_OC"
	SystemIntakeContactComponentOfficeOfEnterpriseDataAndAnalyticsOeda                 SystemIntakeContactComponent = "OFFICE_OF_ENTERPRISE_DATA_AND_ANALYTICS_OEDA"
	SystemIntakeContactComponentOfficeOfEqualOpportunityAndCivilRights                 SystemIntakeContactComponent = "OFFICE_OF_EQUAL_OPPORTUNITY_AND_CIVIL_RIGHTS"
	SystemIntakeContactComponentOfficeOfFinancialManagementOfm                         SystemIntakeContactComponent = "OFFICE_OF_FINANCIAL_MANAGEMENT_OFM"
	SystemIntakeContactComponentOfficeOfHumanCapital                                   SystemIntakeContactComponent = "OFFICE_OF_HUMAN_CAPITAL"
	SystemIntakeContactComponentOfficeOfInformationTechnologyOit                       SystemIntakeContactComponent = "OFFICE_OF_INFORMATION_TECHNOLOGY_OIT"
	SystemIntakeContactComponentOfficeOfLegislation                                    SystemIntakeContactComponent = "OFFICE_OF_LEGISLATION"
	SystemIntakeContactComponentOfficeOfMinorityHealthOmh                              SystemIntakeContactComponent = "OFFICE_OF_MINORITY_HEALTH_OMH"
	SystemIntakeContactComponentOfficeOfProgramOperationsAndLocalEngagementOpole       SystemIntakeContactComponent = "OFFICE_OF_PROGRAM_OPERATIONS_AND_LOCAL_ENGAGEMENT_OPOLE"
	SystemIntakeContactComponentOfficeOfSecurityFacilitiesAndLogisticsOperationsOsflo  SystemIntakeContactComponent = "OFFICE_OF_SECURITY_FACILITIES_AND_LOGISTICS_OPERATIONS_OSFLO"
	SystemIntakeContactComponentOfficeOfStrategicOperationsAndRegulatoryAffairsOsora   SystemIntakeContactComponent = "OFFICE_OF_STRATEGIC_OPERATIONS_AND_REGULATORY_AFFAIRS_OSORA"
	SystemIntakeContactComponentOfficeOfStrategyPerformanceAndResultsOspr              SystemIntakeContactComponent = "OFFICE_OF_STRATEGY_PERFORMANCE_AND_RESULTS_OSPR"
	SystemIntakeContactComponentOfficeOfTheActuaryOact                                 SystemIntakeContactComponent = "OFFICE_OF_THE_ACTUARY_OACT"
	SystemIntakeContactComponentOfficeOfTheAdministrator                               SystemIntakeContactComponent = "OFFICE_OF_THE_ADMINISTRATOR"
	SystemIntakeContactComponentOfficesOfHearingsAndInquiries                          SystemIntakeContactComponent = "OFFICES_OF_HEARINGS_AND_INQUIRIES"
	SystemIntakeContactComponentOther                                                  SystemIntakeContactComponent = "OTHER"
	// SystemIntakeContactRolePLACEHOLDER is the default role given. It is removed before returning the frontend, so they know a user needs to select a role
	SystemIntakeContactComponentPLACEHOLDER SystemIntakeContactComponent = "PLACE_HOLDER"

	// These are legacy options
	SystemIntakeContactComponentConsortiumForMedicaidAndChildrensHealth     SystemIntakeContactComponent = "CONSORTIUM_FOR_MEDICAID_AND_CHILDRENS_HEALTH"
	SystemIntakeContactComponentConsortiumForMedicareHealthPlansOperations  SystemIntakeContactComponent = "CONSORTIUM_FOR_MEDICARE_HEALTH_PLANS_OPERATIONS"
	SystemIntakeContactComponentOfficeOfBurdenReductionAndHealthInformatics SystemIntakeContactComponent = "OFFICE_OF_BURDEN_REDUCTION_AND_HEALTH_INFORMATICS"
	SystemIntakeContactComponentOfficeOfSupportServicesAndOperations        SystemIntakeContactComponent = "OFFICE_OF_SUPPORT_SERVICES_AND_OPERATIONS"
)

// SystemIntakeContact represents an EUA user's association with a system intake
type SystemIntakeContact struct {
	userIDRelation
	BaseStructUser
	SystemIntakeID uuid.UUID                          `json:"systemIntakeId" db:"system_intake_id"`
	Component      SystemIntakeContactComponent       `json:"component" db:"component"`
	Roles          EnumArray[SystemIntakeContactRole] `json:"roles" db:"roles"`
	IsRequester    bool                               `json:"isRequester" db:"is_requester"`
}

// FilteredComponent returns the component without the PLACEHOLDER component
func (r *SystemIntakeContact) FilteredComponent() *SystemIntakeContactComponent {
	if r.Component == SystemIntakeContactComponentPLACEHOLDER {
		return nil
	}
	return &r.Component
}

// FilteredRoles returns the roles without the PLACEHOLDER role
func (r *SystemIntakeContact) FilteredRoles() []SystemIntakeContactRole {
	return lo.Filter(r.Roles, func(role SystemIntakeContactRole, _ int) bool {
		return role != SystemIntakeContactRolePLACEHOLDER
	})
}

// NewSystemIntakeContact creates a new SystemIntakeContact with the related userAccount
func NewSystemIntakeContact(userID uuid.UUID, createdBy uuid.UUID) *SystemIntakeContact {
	return &SystemIntakeContact{
		BaseStructUser: NewBaseStructUser(createdBy),
		userIDRelation: NewUserIDRelation(userID),
	}
}

func (r SystemIntakeContact) GetMappingKey() uuid.UUID {
	return r.SystemIntakeID
}

func (r SystemIntakeContact) GetMappingVal() *SystemIntakeContact {
	return &r
}

// SystemIntakeContacts This is a convenience struct which surfaces information about the contacts associated with a system intake
type SystemIntakeContacts struct {

	// Returns all the raw contacts from the List of Contacts
	AllContacts []*SystemIntakeContact `json:"allContacts"`
}

// Requester returns the primary requester of a system intake. If none are found, it returns nil. This should be a very uncommon situation
func (info *SystemIntakeContacts) Requester() (*SystemIntakeContact, error) {
	if info == nil || info.AllContacts == nil || len(info.AllContacts) == 0 {
		return nil, nil
	}

	requester, _ := lo.Find(info.AllContacts, func(c *SystemIntakeContact) bool {
		return c.IsRequester
	})
	return requester, nil
}

// BusinessOwners returns the business owner from the List of Contacts
func (info *SystemIntakeContacts) BusinessOwners() ([]*SystemIntakeContact, error) {
	contacts := lo.Filter(info.AllContacts, func(c *SystemIntakeContact, index int) bool {
		return c.Roles != nil && lo.Contains(c.Roles, SystemIntakeContactRoleBusinessOwner)
	})
	return contacts, nil
}

// ProductManagers returns the product managers from the List of Contacts
func (info *SystemIntakeContacts) ProductManagers() ([]*SystemIntakeContact, error) {
	contacts := lo.Filter(info.AllContacts, func(c *SystemIntakeContact, index int) bool {
		return c.Roles != nil && lo.Contains(c.Roles, SystemIntakeContactRoleProductManager)
	})
	return contacts, nil
}

// AdditionalContacts Returns the additional contacts from the List of Contacts. These are all the contacts except for requester, businessOwners, productOwners
func (info *SystemIntakeContacts) AdditionalContacts() ([]*SystemIntakeContact, error) {
	contacts := lo.Filter(info.AllContacts, func(c *SystemIntakeContact, index int) bool {
		return !c.IsRequester && !lo.Some(c.Roles, []SystemIntakeContactRole{SystemIntakeContactRoleBusinessOwner, SystemIntakeContactRoleProductManager})
	})
	return contacts, nil
}
