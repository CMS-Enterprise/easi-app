CREATE TABLE trb_lead_options (
    id UUID PRIMARY KEY NOT NULL,
    eua_user_id TEXT UNIQUE NOT NULL CHECK (eua_user_id ~ '^[A-Z0-9]{4}$'),
    
    created_by TEXT NOT NULL CHECK (created_by ~ '^[A-Z0-9]{4}$'),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by TEXT CHECK (modified_by ~ '^[A-Z0-9]{4}$'),
    modified_at TIMESTAMP WITH TIME ZONE
);
