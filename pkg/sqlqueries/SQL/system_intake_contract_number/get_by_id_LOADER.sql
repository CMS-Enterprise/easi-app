WITH queried_ids AS (
    SELECT id AS id
    FROM JSON_TO_RECORDSET(:paramTableJSON)
        AS x("id" UUID) --noqa
)
SELECT
    sicn.id,
    sicn.system_intake_id,
    sicn.contract_number,
    sicn.created_by,
    sicn.created_at,
    sicn.modified_by,
    sicn.modified_at
FROM queried_ids qid
INNER JOIN system_intake_contract_numbers sicn ON sicn.id = qid.id;
