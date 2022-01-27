ALTER TABLE business_case ADD COLUMN preferred_hosting_type text;
ALTER TABLE business_case ADD COLUMN preferred_hosting_location text;
ALTER TABLE business_case ADD COLUMN preferred_hosting_cloud_service_type text;
ALTER TABLE business_case ADD COLUMN preferred_has_ui text;

ALTER TABLE business_case ADD COLUMN alternative_a_hosting_type text;
ALTER TABLE business_case ADD COLUMN alternative_a_hosting_location text;
ALTER TABLE business_case ADD COLUMN alternative_a_hosting_cloud_service_type text;
ALTER TABLE business_case ADD COLUMN alternative_a_has_ui text;

ALTER TABLE business_case ADD COLUMN alternative_b_hosting_type text;
ALTER TABLE business_case ADD COLUMN alternative_b_hosting_location text;
ALTER TABLE business_case ADD COLUMN alternative_b_hosting_cloud_service_type text;
ALTER TABLE business_case ADD COLUMN alternative_b_has_ui text;
