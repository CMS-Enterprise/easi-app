CREATE TABLE trb_request (
    id UUID PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    archived BOOL NOT NULL DEFAULT FALSE,
    type TEXT NOT NULL, --add as a type
    status TEXT NOT NULL, --add as a type
    created_by TEXT NOT NULL CHECK (created_by ~ '^[A-Z0-9]{4}$'),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by TEXT CHECK (modified_by ~ '^[A-Z0-9]{4}$'),
    modified_dts TIMESTAMP WITH TIME ZONE
);
