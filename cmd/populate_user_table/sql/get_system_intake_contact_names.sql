SELECT DISTINCT
    common_name
FROM system_intake_contacts
WHERE common_name IS NOT NULL
ORDER BY common_name
