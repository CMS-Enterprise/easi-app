WITH queried_trb_request_ids AS (
    SELECT trb_request_id AS trb_request_id
    FROM JSON_TO_RECORDSET(:param_table_json)
        AS x("trb_request_id" UUID) --noqa
    
)
SELECT
    sicn.id,
    sicn.trb_request_id,
    sicn.contract_number,
    sicn.created_by,
    sicn.created_at,
    sicn.modified_by,
    sicn.modified_at
FROM queried_trb_request_ids qtid
INNER JOIN trb_request_contract_numbers trcn ON trcn.trb_request_id = qtid.trb_request_id;
