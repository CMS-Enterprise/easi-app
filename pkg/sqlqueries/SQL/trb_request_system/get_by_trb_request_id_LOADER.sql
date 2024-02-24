WITH queried_trb_request_ids AS (
    SELECT trb_request_id AS trb_request_id
    FROM JSON_TO_RECORDSET(:param_table_json)
        AS x("trb_request_id" UUID) --noqa

)
SELECT
    sis.id,
    sis.trb_request_id,
    sis.system_id,
    sis.created_by,
    sis.created_at,
    sis.modified_by,
    sis.modified_at
FROM queried_trb_request_ids qsid
INNER JOIN trb_request_systems sis ON sis.trb_request_id = qsid.trb_request_id;
