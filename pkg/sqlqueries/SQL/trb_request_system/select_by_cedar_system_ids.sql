SELECT
    tr.id,
    tr.name,
    tr.archived,
    tr.type,
    tr.state,
    tr.consult_meeting_time,
    tr.trb_lead,
    tr.contract_name,
    tr.system_relation_type,
    tr.created_by,
    tr.created_at,
    tr.modified_by,
    tr.modified_at,
    trs.system_id
FROM trb_request tr
LEFT JOIN trb_request_systems trs ON trs.trb_request_id = tr.id
WHERE
    (trs.system_id, tr.state) = ANY(SELECT UNNEST(CAST(:cedar_system_ids AS TEXT[])), UNNEST(CAST(:states AS TRB_REQUEST_STATUS[])));
