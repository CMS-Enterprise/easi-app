SELECT id,
       system_intake_id,
       system_id,
       created_by,
       created_at,
       modified_by,
       modified_at
FROM system_intake_systems
WHERE system_intake_id = ANY (:system_intake_ids);
