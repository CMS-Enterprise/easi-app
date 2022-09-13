CREATE TABLE trb_request_attendees (
    id UUID PRIMARY KEY NOT NULL,
    trb_request_id uuid NOT NULL REFERENCES trb_request(id),
    eua_user_id TEXT NOT NULL CHECK (eua_user_id ~ '^[A-Z0-9]{4}$'),
    component TEXT NOT NULL,
    role TEXT NOT NULL,
    created_by TEXT NOT NULL CHECK (created_by ~ '^[A-Z0-9]{4}$'),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by TEXT CHECK (modified_by ~ '^[A-Z0-9]{4}$'),
    modified_at TIMESTAMP WITH TIME ZONE
);
