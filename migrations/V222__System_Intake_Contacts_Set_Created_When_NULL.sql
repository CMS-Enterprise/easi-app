-- Set any NULL created_at to modified_at or epoch, then set column NOT NULL
-- Use modified_at if available, otherwise use the Unix epoch (1970-01-01 00:00:00+00)
UPDATE system_intake_contacts
SET created_at = COALESCE(modified_at, TO_TIMESTAMP(0))
WHERE created_at IS NULL;

-- Ensure no NULLs remain, then enforce NOT NULL constraint
ALTER TABLE system_intake_contacts
ALTER COLUMN created_at SET NOT NULL;
