INSERT INTO system_intake_systems (
    id,
    system_intake_id,
    system_id,
    created_by,
    modified_by,
    modified_at,
    relationship_type,
    other_system_relationship_description
)
VALUES (
    :id,
    :system_intake_id,
    :system_id,
    :created_by,
    :modified_by,
    NOW(),
    :relationship_type,
    :other_system_relationship_description
)
RETURNING 
    id,
    system_intake_id,
    system_id,
    relationship_type,
    other_system_relationship_description;
