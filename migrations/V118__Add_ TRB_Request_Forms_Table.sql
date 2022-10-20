CREATE TYPE trb_where_in_process_option AS ENUM (
    'I_HAVE_AN_IDEA_AND_WANT_TO_BRAINSTORM',
    'CONTRACTING_WORK_HAS_STARTED',
    'DEVELOPMENT_HAS_RECENTLY_STARTED',
    'DEVELOPMENT_IS_SIGNIFICANTLY_UNDERWAY',
    'THE_SYSTEM_IS_IN_OPERATION_AND_MAINTENANCE',
    'OTHER'
);

CREATE TYPE trb_collab_group_option AS ENUM (
    'SECURITY',
    'ENTERPRISE_ARCHITECTURE',
    'CLOUD',
    'PRIVACY_ADVISOR',
    'GOVERNANCE_REVIEW_BOARD',
    'OTHER'
);

CREATE TYPE trb_form_status AS ENUM (
    'READY_TO_START',
    'IN_PROGRESS',
    'COMPLETED'
);

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


CREATE TABLE trb_request_forms (
    id UUID PRIMARY KEY NOT NULL,
    trb_request_id uuid NOT NULL REFERENCES trb_request(id),
    status trb_form_status NOT NULL DEFAULT 'READY_TO_START',
    component TEXT,
    needs_assistance_with TEXT,
    has_solution_in_mind BOOLEAN,
    proposed_solution TEXT,
    where_in_process trb_where_in_process_option,
    where_in_process_other TEXT,
    has_expected_start_end_dates BOOLEAN,
    expected_start_date TIMESTAMP,
    expected_end_date TIMESTAMP,
    collab_groups trb_collab_group_option[],
    collab_date_security TIMESTAMP,
    collab_date_enterprise_architecture TIMESTAMP,
    collab_date_cloud TIMESTAMP,
    collab_date_privacy_advisor TIMESTAMP,
    collab_date_governance_review_board TIMESTAMP,
    collab_date_other TIMESTAMP,
    collab_group_other TEXT,
    subject_area_technical_reference_architecture trb_technical_reference_architecture_option,
    subject_area_network_and_security trb_network_and_security_option,
    subject_area_cloud_and_infrastructure trb_cloud_and_infrastructure_option,
    subject_area_application_development trb_application_development_option,
    subject_area_data_and_data_management trb_data_and_data_management_option,
    subject_area_government_processes_and_policies trb_government_processes_and_policies_option,
    subject_area_other_technical_topics trb_other_technical_topics_option,

    created_by TEXT NOT NULL CHECK (created_by ~ '^[A-Z0-9]{4}$'),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by TEXT CHECK (modified_by ~ '^[A-Z0-9]{4}$'),
    modified_at TIMESTAMP WITH TIME ZONE
);

CREATE UNIQUE INDEX trb_request_forms_unique_idx ON trb_request_forms(trb_request_id);
