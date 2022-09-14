SELECT id,
    name,
    archived,
    type,
    status,
    created_by,
    created_at,
    modified_by,
    modified_at
    FROM trb_request
WHERE trb_request.id = :id
