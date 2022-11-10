CREATE TABLE trb_request_consult_sessions (
    id UUID PRIMARY KEY NOT NULL,
    trb_request_id uuid NOT NULL REFERENCES trb_request(id),
    session_time TIMESTAMP,
    notes TEXT,
    created_by TEXT NOT NULL CHECK (created_by ~ '^[A-Z0-9]{4}$'),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by TEXT CHECK (modified_by ~ '^[A-Z0-9]{4}$'),
    modified_at TIMESTAMP WITH TIME ZONE
);

CREATE UNIQUE INDEX trb_request_consult_sessions_unique_idx ON trb_request_consult_sessions(trb_request_id);
