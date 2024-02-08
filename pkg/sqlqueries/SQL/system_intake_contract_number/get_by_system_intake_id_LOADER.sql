WITH queried_system_intake_ids AS (
    SELECT system_intake_id AS system_intake_id
    FROM JSON_TO_RECORDSET(:paramTableJSON)
        AS x("system_intake_id" UUID) --noqa
    
)
SELECT
    sicn.id,
    sicn.system_intake_id,
    sicn.contract_number,
    sicn.created_by,
    sicn.created_at,
    sicn.modified_by,
    sicn.modified_at
FROM queried_system_intake_ids qsid
INNER JOIN system_intake_contract_numbers sicn ON sicn.system_intake_id = qsid.system_intake_id;
