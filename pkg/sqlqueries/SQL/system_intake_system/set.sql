INSERT INTO system_intake_systems (
    id,
    system_intake_id,
    system_id,
    created_by,
    modified_by
)
VALUES (
    :id,
    :system_intake_id,
    :system_id,
    :created_by,
    :modified_by
) ON CONFLICT DO NOTHING;
