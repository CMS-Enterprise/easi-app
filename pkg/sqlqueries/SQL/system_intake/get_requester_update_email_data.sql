SELECT
    si.eua_user_id,
    si.project_name,
    si.lcid,
    si.lcid_expires_at,
    si.lcid_issued_at,
    si.lcid_retires_at
FROM system_intakes si;
