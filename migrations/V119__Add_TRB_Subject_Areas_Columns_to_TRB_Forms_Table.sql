CREATE TYPE trb_technical_reference_architecture_option AS ENUM (
    'GENERAL_TRA_INFORMATION',
    'TRA_GUIDING_PRINCIPLES',
    'CMS_PROCESSING_ENVIRONMENTS',
    'CMS_TRA_MULTI_ZONE_ARCHITECTURE',
    'CMS_TRA_BUSINESS_RULES',
    'ABOUT_THE_TRB',
    'ARCHITECTURE_CHANGE_REQUEST_PROCESS_FOR_THE_TRA',
    'OTHER'
);

CREATE TYPE trb_network_and_security_option AS ENUM (
    'GENERAL_NETWORK_AND_SECURITY_SERVICES_INFORMATION',
    'SECURITY_SERVICES',
    'CMS_CYBERSECURITY_INTEGRATION_CENTER_INTEGRATION',
    'WIDE_AREA_NETWORK_SERVICES',
    'ACCESS_CONTROL_AND_IDENTITY_MANAGEMENT',
    'DOMAIN_NAME_SYSTEM_SERVICES',
    'OTHER'
);

CREATE TYPE trb_cloud_and_infrastructure_option AS ENUM (
    'GENERAL_CLOUD_AND_INFRASTRUCTURE_SERVICES_INFORMATION',
    'VIRTUALIZATION',
    'CLOUD_IAAS_AND_PAAS_INFRASTRUCTURE',
    'IT_PERFORMANCE_MANAGEMENT',
    'FILE_TRANSFER',
    'DATA_STORAGE_SERVICES',
    'SOFTWARE_AS_A_SERVICE',
    'KEYS_AND_SECRETS_MANAGEMENT',
    'MOBILE_DEVICES_AND_APPLICATIONS',
    'CLOUD_MIGRATION',
    'DISASTER_RECOVERY',
    'OTHER'
);

CREATE TYPE trb_application_development_option AS ENUM (
    'GENERAL_APPLICATION_DEVELOPMENT_SERVICES_INFORMATION',
    'APPLICATION_DEVELOPMENT',
    'WEB_SERVICES_AND_WEB_APIS',
    'WEB_BASED_UI_SERVICES',
    'OPEN_SOURCE_SOFTWARE',
    'PORTAL_INTEGRATION',
    'ACCESSIBILITY_COMPLIANCE',
    'BUSINESS_INTELLIGENCE',
    'CONTAINERS_AND_MICROSERVICES',
    'ROBOTIC_PROCESS_AUTOMATION',
    'SYSTEM_ARCHITECTURE_REVIEW',
    'EMAIL_INTEGRATION',
    'CONFIGURATION_MANAGEMENT',
    'OTHER'
);

CREATE TYPE trb_data_and_data_management_option AS ENUM (
    'GENERAL_DATA_AND_DATA_MANAGEMENT_INFORMATION',
    'ENTERPRISE_DATA_ENVIRONMENT_REVIEW',
    'DATA_MART',
    'DATA_WAREHOUSING',
    'ANALYTIC_SANDBOXES',
    'APIS_AND_DATA_EXCHANGES',
    'FHIR',
    'OTHER'
);

CREATE TYPE trb_government_processes_and_policies_option AS ENUM (
    'GENERAL_INFORMATION_ABOUT_CMS_PROCESSES_AND_POLICIES',
    'OTHER_AVAILABLE_TRB_SERVICES',
    'SECTION_508_AND_ACCESSIBILITY_TESTING',
    'TARGET_LIFE_CYCLE',
    'SYSTEM_DISPOSITION_PLANNING',
    'INVESTMENT_AND_BUDGET_PLANNING',
    'LIFECYCLE_IDS',
    'CONTRACTING_AND_PROCUREMENT',
    'SECURITY_ASSESSMENTS',
    'INFRASTRUCTURE_AS_A_SERVICE',
    'OTHER'
);

CREATE TYPE trb_other_technical_topics_option AS ENUM (
    'ARTIFICIAL_INTELLIGENCE',
    'MACHINE_LEARNING',
    'ASSISTANCE_WITH_SYSTEM_CONCEPT_DEVELOPMENT',
    'OTHER'
);

ALTER TABLE trb_request_forms ADD COLUMN subject_area_technical_reference_architecture trb_technical_reference_architecture_option[];
ALTER TABLE trb_request_forms ADD COLUMN subject_area_network_and_security trb_network_and_security_option[];
ALTER TABLE trb_request_forms ADD COLUMN subject_area_cloud_and_infrastructure trb_cloud_and_infrastructure_option[];
ALTER TABLE trb_request_forms ADD COLUMN subject_area_application_development trb_application_development_option[];
ALTER TABLE trb_request_forms ADD COLUMN subject_area_data_and_data_management trb_data_and_data_management_option[];
ALTER TABLE trb_request_forms ADD COLUMN subject_area_government_processes_and_policies trb_government_processes_and_policies_option[];
ALTER TABLE trb_request_forms ADD COLUMN subject_area_other_technical_topics trb_other_technical_topics_option[];

ALTER TABLE trb_request_forms ALTER COLUMN collab_date_security TYPE TEXT;
ALTER TABLE trb_request_forms ALTER COLUMN collab_date_enterprise_architecture TYPE TEXT;
ALTER TABLE trb_request_forms ALTER COLUMN collab_date_cloud TYPE TEXT;
ALTER TABLE trb_request_forms ALTER COLUMN collab_date_privacy_advisor TYPE TEXT;
ALTER TABLE trb_request_forms ALTER COLUMN collab_date_governance_review_board TYPE TEXT;
ALTER TABLE trb_request_forms ALTER COLUMN collab_date_other TYPE TEXT;
