SELECT *
FROM notes
WHERE system_intake=:system_intake_id AND is_archived=false
ORDER BY created_at DESC
