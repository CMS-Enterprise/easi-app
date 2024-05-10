WITH queried_cedar_system_ids AS (
    SELECT cedar_system_id AS cedar_system_id, eua_user_id AS eua_user_id
    FROM JSON_TO_RECORDSET(:param_table_json)
        AS x("cedar_system_id" TEXT, "eua_user_id" TEXT) --noqa
)
SELECT
   csb.cedar_system_id,
   csb.eua_user_id,
   csb.created_at
FROM queried_cedar_system_ids qcsi
INNER JOIN cedar_system_bookmarks csb 
    ON csb.cedar_system_id = qcsi.cedar_system_id
    WHERE csb.eua_user_id = qcsi.eua_user_id;
