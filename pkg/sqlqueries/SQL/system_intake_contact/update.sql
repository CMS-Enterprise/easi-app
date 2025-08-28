UPDATE system_intake_contacts
SET
    eua_user_id = :eua_user_id,
    system_intake_id = :system_intake_id,
    role = :role,
    component = :component,
    user_id = :user_id,
    updated_at = :updated_at
WHERE system_intake_contacts.id = :id
RETURNING
    id,
    system_intake_id,
    component,
    user_id,
    roles,
    is_requester,
    created_by,
    created_at,
    modified_by,
    updated_at
