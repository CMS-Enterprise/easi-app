UPDATE trb_request
SET id = :id,
    name = :name,
    archived = :archived,
    type = :type,
    status = :status,
    feedback_status = :feedback_status,
    modified_by = :modified_by,
    modified_at = CURRENT_TIMESTAMP
WHERE trb_request.id = :id
RETURNING
    id,
    name,
    archived,
    type,
    status,
    feedback_status,
    created_by,
    created_at,
    modified_by,
    modified_at;
