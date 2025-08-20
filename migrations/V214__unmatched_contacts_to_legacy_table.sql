-- Move legacy records that aren't mapped to the user account table
INSERT INTO system_intake_contacts_legacy (
    id, eua_user_id, system_intake_id, component, role, created_at, updated_at, common_name
)
SELECT
    id, eua_user_id, system_intake_id, component, role, created_at, updated_at, common_name
FROM
    system_intake_contacts
WHERE
    user_id IS NULL;


-- Delete from contacts table now that they are in the legacy table
DELETE FROM system_intake_contacts
WHERE user_id IS NULL;

-- Update user_id column to be NOT NULL now that all NULL values have been moved
ALTER TABLE system_intake_contacts
ALTER COLUMN user_id SET NOT NULL;
