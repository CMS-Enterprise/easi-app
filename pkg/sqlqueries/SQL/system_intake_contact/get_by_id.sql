SELECT
    id,
    eua_user_id,
    system_intake_id,
    role,
    component,
    created_at,
    updated_at,
    user_id
FROM system_intake_contacts
WHERE id=$1 AND eua_user_id IS NOT NULL
