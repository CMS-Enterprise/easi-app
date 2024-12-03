SELECT *
FROM notes
WHERE system_intake=:system_intake_id AND is_archived=FALSE
ORDER BY created_at DESC
