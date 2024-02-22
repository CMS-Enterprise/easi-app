WITH queried_trb_request_ids AS (
    SELECT trb_request_id AS trb_request_id
    FROM JSON_TO_RECORDSET(:param_table_json)
        AS x("trb_request_id" UUID) --noqa
    
)
SELECT
    trcn.id,
    trcn.trb_request_id,
    trcn.contract_number,
    trcn.created_by,
    trcn.created_at,
    trcn.modified_by,
    trcn.modified_at
FROM queried_trb_request_ids qtid
INNER JOIN trb_request_contract_numbers trcn ON trcn.trb_request_id = qtid.trb_request_id;
