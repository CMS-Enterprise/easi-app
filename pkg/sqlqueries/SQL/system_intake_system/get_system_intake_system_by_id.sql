SELECT
    id,
    system_id,
    system_intake_id,
    relationship_type,
    other_system_relationship_description
FROM system_intake_systems
WHERE 
    id = :id;
