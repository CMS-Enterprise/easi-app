WITH queried_system_intake_ids AS (
    SELECT system_intake_id AS id
    FROM JSON_TO_RECORDSET(:paramTableJSON)
        AS x("system_intake_id" UUID) --noqa
    
)
    SELECT
        sicn.contract_number
    FROM queried_system_intake_ids qsid
    INNER JOIN system_intake_contract_numbers sicn ON sicn.system_intake_id = qsid.id;
