SELECT DISTINCT
    eua_user_id AS username
FROM system_intake_contacts
WHERE eua_user_id IS NOT NULL
ORDER BY username;
