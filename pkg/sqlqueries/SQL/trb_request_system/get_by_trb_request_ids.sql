SELECT
    id,
    trb_request_id,
    system_id,
    created_by,
    created_at,
    modified_by,
    modified_at
FROM trb_request_systems
WHERE trb_request_id = ANY(:trb_request_ids);
