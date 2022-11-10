SELECT id,
    name,
    archived,
    type,
    status,
    feedback_status,
    created_by,
    created_at,
    modified_by,
    modified_at
    FROM trb_request
    WHERE archived = :archived
