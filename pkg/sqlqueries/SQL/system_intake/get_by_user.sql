SELECT *
FROM system_intakes
WHERE eua_user_id = :eua_user_id
  AND archived_at IS NULL
ORDER BY created_at DESC;
