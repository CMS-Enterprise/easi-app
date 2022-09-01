SELECT id,
    name,
    archived,
    type,
    status,
    created_by,
    created_dts,
    modified_by,
    modified_dts,
    FROM trb_request
WHERE trb_request.id = :id
