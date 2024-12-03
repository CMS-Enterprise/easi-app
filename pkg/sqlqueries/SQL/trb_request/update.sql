UPDATE trb_request
SET
    id = :id,
    name = :name,
    archived = :archived,
    type = :type,
    state = :state,
    consult_meeting_time = :consult_meeting_time,
    trb_lead = :trb_lead,
    contract_name = :contract_name,
    system_relation_type = :system_relation_type,
    modified_by = :modified_by,
    modified_at = CURRENT_TIMESTAMP
WHERE trb_request.id = :id
RETURNING
    id,
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
    modified_at;
