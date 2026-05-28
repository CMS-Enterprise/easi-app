-- Add digital_service_interaction and digital_service_interaction_description columns to system_intakes table
-- These fields capture whether a project enables digital service interaction

ALTER TABLE system_intakes
ADD COLUMN digital_service_interaction TEXT,
ADD COLUMN digital_service_interaction_description TEXT;
