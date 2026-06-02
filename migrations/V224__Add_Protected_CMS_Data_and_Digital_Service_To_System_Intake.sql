-- Add digital_service_interaction and digital_service_interaction_description columns to system_intakes table
-- These fields capture whether a project enables digital service interaction

-- Add protected_cms_data_accessed_outside and protected_cms_data_accessed_outside_description columns to system_intakes table
-- These fields capture whether a project accesses protected CMS data outside CMS-controlled information systems or environments

ALTER TABLE system_intakes
ADD COLUMN digital_service_interaction TEXT,
ADD COLUMN digital_service_interaction_description TEXT;
ADD COLUMN protected_cms_data_accessed_outside TEXT,
ADD COLUMN protected_cms_data_accessed_outside_description TEXT;
