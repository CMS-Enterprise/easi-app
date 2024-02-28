WITH queried_trb_request_ids AS (
    SELECT trb_request_id AS trb_request_id
    FROM JSON_TO_RECORDSET(:param_table_json)
        AS x("trb_request_id" UUID) --noqa

)
SELECT
    trbsys.id,
    trbsys.trb_request_id,
    trbsys.system_id,
    trbsys.created_by,
    trbsys.created_at,
    trbsys.modified_by,
    trbsys.modified_at
FROM queried_trb_request_ids qtid
INNER JOIN trb_request_systems trbsys ON trbsys.trb_request_id = qtid.trb_request_id;
