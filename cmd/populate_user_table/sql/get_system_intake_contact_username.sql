SELECT DISTINCT
    eua_user_id
FROM system_intake_contacts
WHERE eua_user_id IS NOT NULL
ORDER BY eua_user_id;
