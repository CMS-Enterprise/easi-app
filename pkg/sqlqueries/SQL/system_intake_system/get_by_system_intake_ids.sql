SELECT
    id,
    system_intake_id,
    system_id,
    created_by,
    created_at,
    modified_by,
    modified_at,
    relationship_type,
    other_system_relationship_description
FROM system_intake_systems
WHERE system_intake_id = ANY(:system_intake_ids);
