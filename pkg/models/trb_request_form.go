package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

// TRBFormStatus is an enumeration of the possible statuses of a TRBRequestForm
type TRBFormStatus string

// These are the possible statuses for a TRB request form
const (
	TRBFormStatusReadyToStart TRBFormStatus = "READY_TO_START"
	TRBFormStatusInProgress   TRBFormStatus = "IN_PROGRESS"
	TRBFormStatusCompleted    TRBFormStatus = "COMPLETED"
)

// TRBWhereInProcessOption is an enumeration of possible responses to the "Where are you in
// your process?" question on the TRB request form
type TRBWhereInProcessOption string

// These are the individual options for the response to the "Where are you in your process?"
// question on the TRB request form
const (
	TRBWhereInProcessOptionIHaveAnIdeaAndWantToBrainstorm       TRBWhereInProcessOption = "I_HAVE_AN_IDEA_AND_WANT_TO_BRAINSTORM"
	TRBWhereInProcessOptionContractingWorkHasStarted            TRBWhereInProcessOption = "CONTRACTING_WORK_HAS_STARTED"
	TRBWhereInProcessOptionDevelopmentHasRecentlyStarted        TRBWhereInProcessOption = "DEVELOPMENT_HAS_RECENTLY_STARTED"
	TRBWhereInProcessOptionDevelopmentIsSignificantlyUnderway   TRBWhereInProcessOption = "DEVELOPMENT_IS_SIGNIFICANTLY_UNDERWAY"
	TRBWhereInProcessOptionTheSystemIsInOperationAndMaintenance TRBWhereInProcessOption = "THE_SYSTEM_IS_IN_OPERATION_AND_MAINTENANCE"
	TRBWhereInProcessOptionOther                                TRBWhereInProcessOption = "OTHER"
	TRBWhereInProcessOptionUnknown                              TRBWhereInProcessOption = "UNKNOWN"
)

// TRBCollabGroupOption is an enumeration of the possible OIT collaboration groups that can be
// selected for a TRB request form
type TRBCollabGroupOption string

// These are the individual options for responses to the "Select any other OIT groups that you
// have met with or collaborated with" on the TRB request form
const (
	TRBCollabGroupOptionSecurity               TRBCollabGroupOption = "SECURITY"
	TRBCollabGroupOptionEnterpriseArchitecture TRBCollabGroupOption = "ENTERPRISE_ARCHITECTURE"
	TRBCollabGroupOptionCloud                  TRBCollabGroupOption = "CLOUD"
	TRBCollabGroupOptionPrivacyAdvisor         TRBCollabGroupOption = "PRIVACY_ADVISOR"
	TRBCollabGroupOptionGovernanceReviewBoard  TRBCollabGroupOption = "GOVERNANCE_REVIEW_BOARD"
	TRBCollabGroupOptionOther                  TRBCollabGroupOption = "OTHER"
)

// TRBTechnicalReferenceArchitectureOption is an enum of the possible answers to the "technical
// reference architecture" input on the TRB "Subject Areas" page
type TRBTechnicalReferenceArchitectureOption string

// These are the individual options for the "technical reference architecture" input
const (
	TRBTechnicalReferenceArchitectureOptionGeneralTraInformation                     TRBTechnicalReferenceArchitectureOption = "GENERAL_TRA_INFORMATION"
	TRBTechnicalReferenceArchitectureOptionTraGuidingPrinciples                      TRBTechnicalReferenceArchitectureOption = "TRA_GUIDING_PRINCIPLES"
	TRBTechnicalReferenceArchitectureOptionCmsProcessingEnvironments                 TRBTechnicalReferenceArchitectureOption = "CMS_PROCESSING_ENVIRONMENTS"
	TRBTechnicalReferenceArchitectureOptionCmsTraMultiZoneArchitecture               TRBTechnicalReferenceArchitectureOption = "CMS_TRA_MULTI_ZONE_ARCHITECTURE"
	TRBTechnicalReferenceArchitectureOptionCmsTraBusinessRules                       TRBTechnicalReferenceArchitectureOption = "CMS_TRA_BUSINESS_RULES"
	TRBTechnicalReferenceArchitectureOptionAboutTheTrb                               TRBTechnicalReferenceArchitectureOption = "ABOUT_THE_TRB"
	TRBTechnicalReferenceArchitectureOptionArchitectureChangeRequestProcessForTheTra TRBTechnicalReferenceArchitectureOption = "ARCHITECTURE_CHANGE_REQUEST_PROCESS_FOR_THE_TRA"
	TRBTechnicalReferenceArchitectureOptionOther                                     TRBTechnicalReferenceArchitectureOption = "OTHER"
)

// TRBNetworkAndSecurityOption is an enum of the possible answers to the "network and security"
// input on the TRB "Subject Areas" page
type TRBNetworkAndSecurityOption string

// These are the individual options for the "network and security" input
const (
	TRBNetworkAndSecurityOptionGeneralNetworkAndSecurityServicesInformation TRBNetworkAndSecurityOption = "GENERAL_NETWORK_AND_SECURITY_SERVICES_INFORMATION"
	TRBNetworkAndSecurityOptionSecurityServices                             TRBNetworkAndSecurityOption = "SECURITY_SERVICES"
	TRBNetworkAndSecurityOptionCmsCybersecurityIntegrationCenterIntegration TRBNetworkAndSecurityOption = "CMS_CYBERSECURITY_INTEGRATION_CENTER_INTEGRATION"
	TRBNetworkAndSecurityOptionWideAreaNetworkServices                      TRBNetworkAndSecurityOption = "WIDE_AREA_NETWORK_SERVICES"
	TRBNetworkAndSecurityOptionAccessControlAndIdentityManagement           TRBNetworkAndSecurityOption = "ACCESS_CONTROL_AND_IDENTITY_MANAGEMENT"
	TRBNetworkAndSecurityOptionDomainNameSystemServices                     TRBNetworkAndSecurityOption = "DOMAIN_NAME_SYSTEM_SERVICES"
	TRBNetworkAndSecurityOptionOther                                        TRBNetworkAndSecurityOption = "OTHER"
)

// TRBCloudAndInfrastructureOption is an enum of the possible answers to the "cloud and
// infrastructure" input on the TRB "Subject Areas" page
type TRBCloudAndInfrastructureOption string

// These are the individual options for the "cloud and infrastructure" input
const (
	TRBCloudAndInfrastructureOptionGeneralCloudAndInfrastructureServicesInformation TRBCloudAndInfrastructureOption = "GENERAL_CLOUD_AND_INFRASTRUCTURE_SERVICES_INFORMATION"
	TRBCloudAndInfrastructureOptionVirtualization                                   TRBCloudAndInfrastructureOption = "VIRTUALIZATION"
	TRBCloudAndInfrastructureOptionCloudIaasAndPaasInfrastructure                   TRBCloudAndInfrastructureOption = "CLOUD_IAAS_AND_PAAS_INFRASTRUCTURE"
	TRBCloudAndInfrastructureOptionItPerformanceManagement                          TRBCloudAndInfrastructureOption = "IT_PERFORMANCE_MANAGEMENT"
	TRBCloudAndInfrastructureOptionFileTransfer                                     TRBCloudAndInfrastructureOption = "FILE_TRANSFER"
	TRBCloudAndInfrastructureOptionDataStorageServices                              TRBCloudAndInfrastructureOption = "DATA_STORAGE_SERVICES"
	TRBCloudAndInfrastructureOptionSoftwareAsAService                               TRBCloudAndInfrastructureOption = "SOFTWARE_AS_A_SERVICE"
	TRBCloudAndInfrastructureOptionKeysAndSecretsManagement                         TRBCloudAndInfrastructureOption = "KEYS_AND_SECRETS_MANAGEMENT"
	TRBCloudAndInfrastructureOptionMobileDevicesAndApplications                     TRBCloudAndInfrastructureOption = "MOBILE_DEVICES_AND_APPLICATIONS"
	TRBCloudAndInfrastructureOptionCloudMigration                                   TRBCloudAndInfrastructureOption = "CLOUD_MIGRATION"
	TRBCloudAndInfrastructureOptionDisasterRecovery                                 TRBCloudAndInfrastructureOption = "DISASTER_RECOVERY"
	TRBCloudAndInfrastructureOptionOther                                            TRBCloudAndInfrastructureOption = "OTHER"
)

// TRBApplicationDevelopmentOption is an enum of the possible answers to the "application
// development" input on the TRB "Subject Areas" page
type TRBApplicationDevelopmentOption string

// These are the individual options for the "application development" input
const (
	TRBApplicationDevelopmentOptionGeneralApplicationDevelopmentServicesInformation TRBApplicationDevelopmentOption = "GENERAL_APPLICATION_DEVELOPMENT_SERVICES_INFORMATION"
	TRBApplicationDevelopmentOptionApplicationDevelopment                           TRBApplicationDevelopmentOption = "APPLICATION_DEVELOPMENT"
	TRBApplicationDevelopmentOptionWebServicesAndWebApis                            TRBApplicationDevelopmentOption = "WEB_SERVICES_AND_WEB_APIS"
	TRBApplicationDevelopmentOptionWeb                                              TRBApplicationDevelopmentOption = "WEB_BASED_UI_SERVICES"
	TRBApplicationDevelopmentOptionOpenSourceSoftware                               TRBApplicationDevelopmentOption = "OPEN_SOURCE_SOFTWARE"
	TRBApplicationDevelopmentOptionPortalIntegration                                TRBApplicationDevelopmentOption = "PORTAL_INTEGRATION"
	TRBApplicationDevelopmentOptionAccessibilityCompliance                          TRBApplicationDevelopmentOption = "ACCESSIBILITY_COMPLIANCE"
	TRBApplicationDevelopmentOptionBusinessIntelligence                             TRBApplicationDevelopmentOption = "BUSINESS_INTELLIGENCE"
	TRBApplicationDevelopmentOptionContainersAndMicroservices                       TRBApplicationDevelopmentOption = "CONTAINERS_AND_MICROSERVICES"
	TRBApplicationDevelopmentOptionRoboticProcessAutomation                         TRBApplicationDevelopmentOption = "ROBOTIC_PROCESS_AUTOMATION"
	TRBApplicationDevelopmentOptionSystemArchitectureReview                         TRBApplicationDevelopmentOption = "SYSTEM_ARCHITECTURE_REVIEW"
	TRBApplicationDevelopmentOptionEmailIntegration                                 TRBApplicationDevelopmentOption = "EMAIL_INTEGRATION"
	TRBApplicationDevelopmentOptionConfigurationManagement                          TRBApplicationDevelopmentOption = "CONFIGURATION_MANAGEMENT"
	TRBApplicationDevelopmentOptionOther                                            TRBApplicationDevelopmentOption = "OTHER"
)

// TRBDataAndDataManagementOption is an enum of the possible answers to the "data and data
// management" input on the TRB "Subject Areas" page
type TRBDataAndDataManagementOption string

// These are the individual options for the "data and data management" input
const (
	TRBDataAndDataManagementOptionGeneralDataAndDataManagementInformation TRBDataAndDataManagementOption = "GENERAL_DATA_AND_DATA_MANAGEMENT_INFORMATION"
	TRBDataAndDataManagementOptionEnterpriseDataEnvironmentReview         TRBDataAndDataManagementOption = "ENTERPRISE_DATA_ENVIRONMENT_REVIEW"
	TRBDataAndDataManagementOptionDataMart                                TRBDataAndDataManagementOption = "DATA_MART"
	TRBDataAndDataManagementOptionDataWarehousing                         TRBDataAndDataManagementOption = "DATA_WAREHOUSING"
	TRBDataAndDataManagementOptionAnalyticSandboxes                       TRBDataAndDataManagementOption = "ANALYTIC_SANDBOXES"
	TRBDataAndDataManagementOptionApisAndDataExchanges                    TRBDataAndDataManagementOption = "APIS_AND_DATA_EXCHANGES"
	TRBDataAndDataManagementOptionFhir                                    TRBDataAndDataManagementOption = "FHIR"
	TRBDataAndDataManagementOptionOther                                   TRBDataAndDataManagementOption = "OTHER"
)

// TRBGovernmentProcessesAndPoliciesOption is an enum of the possible answers to the "government
// processes and policies" input on the TRB "Subject Areas" page
type TRBGovernmentProcessesAndPoliciesOption string

// These are the individual options for the "government processes and policies" input
const (
	TRBGovernmentProcessesAndPoliciesOptionGeneralInformationAboutCmsProcessesAndPolicies TRBGovernmentProcessesAndPoliciesOption = "GENERAL_INFORMATION_ABOUT_CMS_PROCESSES_AND_POLICIES"
	TRBGovernmentProcessesAndPoliciesOptionOtherAvailableTrbServices                      TRBGovernmentProcessesAndPoliciesOption = "OTHER_AVAILABLE_TRB_SERVICES"
	TRBGovernmentProcessesAndPoliciesOptionSection508AndAccessibilityTesting              TRBGovernmentProcessesAndPoliciesOption = "SECTION_508_AND_ACCESSIBILITY_TESTING"
	TRBGovernmentProcessesAndPoliciesOptionTargetLifeCycle                                TRBGovernmentProcessesAndPoliciesOption = "TARGET_LIFE_CYCLE"
	TRBGovernmentProcessesAndPoliciesOptionSystemDispositionPlanning                      TRBGovernmentProcessesAndPoliciesOption = "SYSTEM_DISPOSITION_PLANNING"
	TRBGovernmentProcessesAndPoliciesOptionInvestmentAndBudgetPlanning                    TRBGovernmentProcessesAndPoliciesOption = "INVESTMENT_AND_BUDGET_PLANNING"
	TRBGovernmentProcessesAndPoliciesOptionLifecycleIds                                   TRBGovernmentProcessesAndPoliciesOption = "LIFECYCLE_IDS"
	TRBGovernmentProcessesAndPoliciesOptionContractingAndProcurement                      TRBGovernmentProcessesAndPoliciesOption = "CONTRACTING_AND_PROCUREMENT"
	TRBGovernmentProcessesAndPoliciesOptionSecurityAssessments                            TRBGovernmentProcessesAndPoliciesOption = "SECURITY_ASSESSMENTS"
	TRBGovernmentProcessesAndPoliciesOptionInfrastructureAsAService                       TRBGovernmentProcessesAndPoliciesOption = "INFRASTRUCTURE_AS_A_SERVICE"
	TRBGovernmentProcessesAndPoliciesOptionOther                                          TRBGovernmentProcessesAndPoliciesOption = "OTHER"
)

// TRBOtherTechnicalTopicsOption is an enum of the possible answers to the "other technical topics"
// input on the TRB "Subject Areas" page
type TRBOtherTechnicalTopicsOption string

// These are the individual options for the "other technical topics" input
const (
	TRBOtherTechnicalTopicsOptionArtificialIntelligence                 TRBOtherTechnicalTopicsOption = "ARTIFICIAL_INTELLIGENCE"
	TRBOtherTechnicalTopicsOptionMachineLearning                        TRBOtherTechnicalTopicsOption = "MACHINE_LEARNING"
	TRBOtherTechnicalTopicsOptionAssistanceWithSystemConceptDevelopment TRBOtherTechnicalTopicsOption = "ASSISTANCE_WITH_SYSTEM_CONCEPT_DEVELOPMENT"
	TRBOtherTechnicalTopicsOptionOther                                  TRBOtherTechnicalTopicsOption = "OTHER"
)

// TRBRequestForm represents the data entered into the TRB request form
type TRBRequestForm struct {
	baseStruct
	TRBRequestID                              uuid.UUID                `json:"trbRequestId" db:"trb_request_id"`
	Status                                    TRBFormStatus            `json:"status" db:"status"`
	Component                                 *string                  `json:"component" db:"component"`
	NeedsAssistanceWith                       *string                  `json:"needsAssistanceWith" db:"needs_assistance_with"`
	HasSolutionInMind                         *bool                    `json:"hasSolutionInMind" db:"has_solution_in_mind"`
	ProposedSolution                          *string                  `json:"proposedSolution" db:"proposed_solution"`
	WhereInProcess                            *TRBWhereInProcessOption `json:"whereInProcess" db:"where_in_process"`
	WhereInProcessOther                       *string                  `json:"whereInProcessOther" db:"where_in_process_other"`
	HasExpectedStartEndDates                  *bool                    `json:"hasExpectedStartEndDates" db:"has_expected_start_end_dates"`
	ExpectedStartDate                         *time.Time               `json:"expectedStartDate" db:"expected_start_date"`
	ExpectedEndDate                           *time.Time               `json:"expectedEndDate" db:"expected_end_date"`
	CollabGroups                              pq.StringArray           `json:"collabGroups" db:"collab_groups"`
	CollabDateSecurity                        *string                  `json:"collabDateSecurity" db:"collab_date_security"`
	CollabDateEnterpriseArchitecture          *string                  `json:"collabDateEnterpriseArchitecture" db:"collab_date_enterprise_architecture"`
	CollabDateCloud                           *string                  `json:"collabDateCloud" db:"collab_date_cloud"`
	CollabDatePrivacyAdvisor                  *string                  `json:"collabDatePrivacyAdvisor" db:"collab_date_privacy_advisor"`
	CollabDateGovernanceReviewBoard           *string                  `json:"collabDateGovernanceReviewBoard" db:"collab_date_governance_review_board"`
	CollabDateOther                           *string                  `json:"collabDateOther" db:"collab_date_other"`
	CollabGroupOther                          *string                  `json:"collabGroupOther" db:"collab_group_other"`
	SubjectAreaTechnicalReferenceArchitecture pq.StringArray           `json:"subjectAreaTechnicalReferenceArchitecture" db:"subject_area_technical_reference_architecture"`
	SubjectAreaNetworkAndSecurity             pq.StringArray           `json:"subjectAreaNetworkAndSecurity" db:"subject_area_network_and_security"`
	SubjectAreaCloudAndInfrastructure         pq.StringArray           `json:"subjectAreaCloudAndInfrastructure" db:"subject_area_cloud_and_infrastructure"`
	SubjectAreaApplicationDevelopment         pq.StringArray           `json:"subjectAreaApplicationDevelopment" db:"subject_area_application_development"`
	SubjectAreaDataAndDataManagement          pq.StringArray           `json:"subjectAreaDataAndDataManagement" db:"subject_area_data_and_data_management"`
	SubjectAreaGovernmentProcessesAndPolicies pq.StringArray           `json:"subjectAreaGovernmentProcessesAndPolicies" db:"subject_area_government_processes_and_policies"`
	SubjectAreaOtherTechnicalTopics           pq.StringArray           `json:"subjectAreaOtherTechnicalTopics" db:"subject_area_other_technical_topics"`
}
