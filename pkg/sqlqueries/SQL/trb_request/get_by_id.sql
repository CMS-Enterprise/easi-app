SELECT id,
    name,
    archived,
    type,
    state,
    consult_meeting_time,
    trb_lead,
    contract_name,
    system_relation_type,
    created_by,
    created_at,
    modified_by,
    modified_at
    FROM trb_request
WHERE trb_request.id = :id
