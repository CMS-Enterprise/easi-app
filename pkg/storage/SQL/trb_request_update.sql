UPDATE trb_request
SET id = :id,
    name = :name,
    archived = :archived,
    type = :type,
    status = :status,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE trb_request.id = :id
RETURNING
    id,
    name,
    archived,
    type,
    status,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
