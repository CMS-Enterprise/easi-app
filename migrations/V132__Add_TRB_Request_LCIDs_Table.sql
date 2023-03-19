CREATE TABLE trb_request_lcids (
    id UUID PRIMARY KEY NOT NULL,
    trb_request_id uuid NOT NULL REFERENCES trb_request(id),
    lcid TEXT NOT NULL CHECK (lcid ~ '^[A-Z]?[0-9]{6}$'),
    
    created_by TEXT NOT NULL CHECK (created_by ~ '^[A-Z0-9]{4}$'),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by TEXT CHECK (modified_by ~ '^[A-Z0-9]{4}$'),
    modified_at TIMESTAMP WITH TIME ZONE
);

CREATE UNIQUE INDEX trb_request_id_lcid_idx ON trb_request_lcids(trb_request_id, lcid);
