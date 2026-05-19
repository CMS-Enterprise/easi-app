SELECT
    id,
    lcid,
    project_name AS request_name
FROM system_intakes
WHERE lcid IS NOT NULL
ORDER BY lcid;
