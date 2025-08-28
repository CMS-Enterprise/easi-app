DELETE FROM system_intake_contacts
WHERE system_intake_contacts.id = :id
RETURNING
    id,
    system_intake_id,
    component,
    created_at,
    updated_at,
    user_id,
    roles,
    is_requester,
    created_by,
    modified_by
;
