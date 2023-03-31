CREATE TABLE trb_request_funding_sources (
    id uuid PRIMARY KEY NOT NULL,
    trb_request_id uuid NOT NULL REFERENCES trb_request_forms(trb_request_id),
    source TEXT NOT NULL,
    funding_number TEXT NOT NULL,

    created_by TEXT NOT NULL CHECK (created_by ~ '^[A-Z0-9]{4}$'),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by TEXT CHECK (modified_by ~ '^[A-Z0-9]{4}$'),
    modified_at TIMESTAMP WITH TIME ZONE
);
