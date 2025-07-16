UPDATE system_intake_systems
SET
    system_id = :system_id,
    relationship_type = :relationship_type,
    other_system_relationship_description = :other_system_relationship_description,
    modified_at = NOW()
WHERE
    id = :id
RETURNING *;
