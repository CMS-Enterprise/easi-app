CREATE TABLE trb_request_system_intakes (
    id UUID PRIMARY KEY NOT NULL,
    trb_request_id uuid NOT NULL REFERENCES trb_request(id),
    system_intake_id uuid NOT NULL REFERENCES system_intakes(id),
    
    created_by TEXT NOT NULL CHECK (created_by ~ '^[A-Z0-9]{4}$'),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by TEXT CHECK (modified_by ~ '^[A-Z0-9]{4}$'),
    modified_at TIMESTAMP WITH TIME ZONE
);

CREATE UNIQUE INDEX trb_request_system_intake_idx ON trb_request_system_intakes(trb_request_id, system_intake_id);
