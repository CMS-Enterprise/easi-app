ALTER TABLE IF EXISTS system_intake_funding_sources
RENAME COLUMN funding_number TO project_number;

ALTER TABLE IF EXISTS system_intake_funding_sources
RENAME COLUMN source TO investment;
