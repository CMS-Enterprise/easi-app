INSERT INTO system_intake_contacts (
    id,
    system_intake_id,
    component,
    user_id,
    roles,
    is_requester,
    created_by

)
VALUES (
    :id,
    :system_intake_id,
    :component,
    :user_id,
    :roles,
    :is_requester,
    :created_by
)
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
;
