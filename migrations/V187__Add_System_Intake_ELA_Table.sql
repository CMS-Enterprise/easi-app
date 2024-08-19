CREATE TABLE system_intake_ela_info (
    id uuid PRIMARY KEY NOT NULL,
    system_intake_id uuid NOT NULL REFERENCES system_intakes(id),
    ela_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE
);

-- estimated_license_count TEXT NOT NULL,
