CREATE TABLE system_intake_funding_sources (
    id uuid PRIMARY KEY NOT NULL,
    system_intake_id uuid NOT NULL REFERENCES system_intakes(id),
    source TEXT NOT NULL,
    funding_number TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);
