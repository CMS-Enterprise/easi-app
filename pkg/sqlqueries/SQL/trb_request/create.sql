INSERT INTO trb_request(
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
    modified_by
)
VALUES (
    :id,
    :name,
    :archived,
    :type,
    :state,
    :consult_meeting_time,
    :trb_lead,
    :contract_name,
    :system_relation_type,
    :created_by,
    :modified_by
)
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
