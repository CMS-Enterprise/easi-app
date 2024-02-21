CREATE TABLE IF NOT EXISTS system_intake_systems (
    id UUID PRIMARY KEY NOT NULL,
    system_intake_id UUID NOT NULL REFERENCES system_intakes(id) ON DELETE CASCADE,
    system_id ZERO_STRING NOT NULL,
    created_by UUID NOT NULL REFERENCES user_account(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID NOT NULL REFERENCES user_account(id),
    modified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- allow one link between a unique intake id and a unique system id
CREATE UNIQUE INDEX IF NOT EXISTS system_id_intake_id_unique_idx ON system_intake_systems (system_intake_id, system_id);
