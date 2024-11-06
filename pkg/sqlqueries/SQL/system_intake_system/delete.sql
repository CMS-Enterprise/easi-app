DELETE FROM system_intake_systems
WHERE system_id <> ALL(:system_ids)
AND system_intake_id = :system_intake_id;
