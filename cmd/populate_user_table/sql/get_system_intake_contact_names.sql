SELECT DISTINCT
    common_name
FROM system_intake_contacts
WHERE
    common_name IS NOT NULL
    AND user_id IS NULL AND eua_user_id IS NULL
ORDER BY common_name
