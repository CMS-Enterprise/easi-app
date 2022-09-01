UPDATE trb_request
SET id = :id,
    name = :name,
    archived = :archived,
    type = :type,
    status = :status,
    created_by = :created_by,
    created_dts = :created_dts,
    modified_by = :modified_by,
    modified_dts = :modified_dts
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
