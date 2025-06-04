INSERT INTO system_intake_systems (
    id,
    system_intake_id,
    system_id,
    created_by,
    modified_by,
    relationship_type,
    other_system_relationship
)
VALUES (
    :id,
    :system_intake_id,
    :system_id,
    :created_by,
    :modified_by,
    :relationship_type,
    :other_system_relationship
) ON CONFLICT DO NOTHING;
