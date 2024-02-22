WITH queried_system_intake_ids AS (
    SELECT system_intake_id AS system_intake_id
    FROM JSON_TO_RECORDSET(:param_table_json)
        AS x("system_intake_id" UUID) --noqa

)
SELECT
    sis.id,
    sis.system_intake_id,
    sis.system_id,
    sis.created_by,
    sis.created_at,
    sis.modified_by,
    sis.modified_at
FROM queried_system_intake_ids qsid
INNER JOIN system_intake_systems sis ON sis.system_intake_id = qsid.system_intake_id;
