CREATE TYPE trb_admin_note_category AS ENUM (
  'GENERAL_REQUEST',
  'INITIAL_REQUEST_FORM',
  'SUPPORTING_DOCUMENTS',
  'CONSULT_SESSION',
  'ADVICE_LETTER'
);

CREATE TABLE trb_admin_notes (
    -- PK, FK
    id UUID PRIMARY KEY NOT NULL,
    trb_request_id uuid NOT NULL REFERENCES trb_request(id),

    -- general metadata
    created_by TEXT NOT NULL CHECK (created_by ~ '^[A-Z0-9]{4}$'),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by TEXT CHECK (modified_by ~ '^[A-Z0-9]{4}$'),
    modified_at TIMESTAMP WITH TIME ZONE,

    -- note-specific fields
    category trb_admin_note_category NOT NULL,
    note_text TEXT NOT NULL,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE
);
