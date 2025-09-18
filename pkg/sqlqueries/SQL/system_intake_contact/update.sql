UPDATE system_intake_contacts
SET
    roles = :roles,
    component = :component,
    is_requester = :is_requester,
    modified_by = :modified_by,
    modified_at = NOW()
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
    modified_at
