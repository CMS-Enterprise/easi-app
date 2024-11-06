SELECT *
FROM actions
WHERE actions.intake_id = ANY(:system_intake_ids)
ORDER BY actions.intake_id, created_at DESC
