DELETE FROM system_intake_systems
WHERE
    id = :system_intake_system_id
RETURNING *;
