SELECT *
FROM system_intakes
WHERE
    
    AND archived_at IS NULL
ORDER BY created_at DESC;
