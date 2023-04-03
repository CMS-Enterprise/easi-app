ALTER TABLE trb_request_forms DROP COLUMN subject_area_technical_reference_architecture;
ALTER TABLE trb_request_forms DROP COLUMN subject_area_technical_reference_architecture_other;
ALTER TABLE trb_request_forms DROP COLUMN subject_area_network_and_security;
ALTER TABLE trb_request_forms DROP COLUMN subject_area_network_and_security_other;
ALTER TABLE trb_request_forms DROP COLUMN subject_area_cloud_and_infrastructure;
ALTER TABLE trb_request_forms DROP COLUMN subject_area_cloud_and_infrastructure_other;
ALTER TABLE trb_request_forms DROP COLUMN subject_area_application_development;
ALTER TABLE trb_request_forms DROP COLUMN subject_area_application_development_other;
ALTER TABLE trb_request_forms DROP COLUMN subject_area_data_and_data_management;
ALTER TABLE trb_request_forms DROP COLUMN subject_area_data_and_data_management_other;
ALTER TABLE trb_request_forms DROP COLUMN subject_area_government_processes_and_policies;
ALTER TABLE trb_request_forms DROP COLUMN subject_area_government_processes_and_policies_other;
ALTER TABLE trb_request_forms DROP COLUMN subject_area_other_technical_topics;
ALTER TABLE trb_request_forms DROP COLUMN subject_area_other_technical_topics_other;

CREATE TYPE subject_area_option AS ENUM (
  'ACCESS_CONTROL_AND_IDENTITY_MANAGEMENT',
  'ACCESSIBILITY_COMPLIANCE',
  'ASSISTANCE_WITH_SYSTEM_CONCEPT_DEVELOPMENT',
  'BUSINESS_INTELLIGENCE',
  'CLOUD_MIGRATION',
  'CONTAINERS_AND_MICROSERVICES',
  'DISASTER_RECOVERY',
  'EMAIL_INTEGRATION',
  'ENTERPRISE_DATA_LAKE_INTEGRATION',
  'FRAMEWORK_OR_TOOL_ALTERNATIVES',
  'OPEN_SOURCE_SOFTWARE',
  'PORTAL_INTEGRATION',
  'TECHNICAL_REFERENCE_ARCHITECTURE',
  'SYSTEM_ARCHITECTURE_REVIEW',
  'SYSTEM_DISPOSITION_PLANNING',
  'WEB_SERVICES_AND_APIS',
  'WEB_BASED_UI_SERVICES'
);

ALTER TABLE trb_request_forms ADD COLUMN subject_area_options subject_area_option[];
ALTER TABLE trb_request_forms ADD COLUMN subject_area_option_other TEXT;
