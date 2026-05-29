-- Add protected_cms_data_accessed_outside and protected_cms_data_accessed_outside_description columns to system_intakes table
-- These fields capture whether a project accesses protected CMS data outside CMS-controlled information systems or environments

ALTER TABLE system_intakes
ADD COLUMN protected_cms_data_accessed_outside TEXT,
ADD COLUMN protected_cms_data_accessed_outside_description TEXT;
