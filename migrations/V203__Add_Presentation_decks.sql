CREATE TABLE presentation_decks (
    id UUID PRIMARY KEY NOT NULL,
    file_name TEXT NOT NULL,

    -- storage info
    bucket TEXT NOT NULL,
    s3_key TEXT NOT NULL, -- key inside bucket; does *not* include bucket name

    -- general metadata
    created_by TEXT NOT NULL CHECK (created_by ~ '^[A-Z0-9]{4}$'),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, -- use for upload date in frontend
    modified_by TEXT CHECK (modified_by ~ '^[A-Z0-9]{4}$'),
    modified_at TIMESTAMP WITH TIME ZONE
);
