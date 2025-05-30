SELECT
    si.project_name,
    si.lcid,
    si.lcid_expires_at,
    si.lcid_issued_at,
    si.lcid_retires_at,
    ua.email
FROM system_intakes si
LEFT JOIN user_account ua ON ua.username = si.eua_user_id
WHERE ua.email IS NOT NULL;
