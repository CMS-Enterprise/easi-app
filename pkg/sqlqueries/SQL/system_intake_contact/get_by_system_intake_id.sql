SELECT
    id,
    system_intake_id,
    component,
    user_id,
    roles,
    is_requester,
    created_by,
    created_at,
    modified_by,
    modified_at
FROM system_intake_contacts
WHERE system_intake_id=$1 AND eua_user_id IS NOT NULL
