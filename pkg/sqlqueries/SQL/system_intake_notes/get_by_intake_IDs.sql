SELECT *
FROM notes
WHERE system_intake =
  ANY(:system_intake_ids) AND is_archived=false
ORDER BY system_intake, created_at DESC
