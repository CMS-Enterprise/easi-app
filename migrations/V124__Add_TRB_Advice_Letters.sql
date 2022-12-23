CREATE TYPE trb_advice_letter_status AS ENUM (
    'IN_PROGRESS',
    'READY_FOR_REVIEW',
    'COMPLETED'
);

CREATE TABLE trb_advice_letters (
    -- PK, FK
    id UUID PRIMARY KEY NOT NULL,
    trb_request_id uuid NOT NULL REFERENCES trb_request(id),

    -- general metadata
    created_by TEXT NOT NULL CHECK (created_by ~ '^[A-Z0-9]{4}$'),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by TEXT CHECK (modified_by ~ '^[A-Z0-9]{4}$'),
    modified_at TIMESTAMP WITH TIME ZONE,

    -- advice letter-specific fields
    status trb_advice_letter_status NOT NULL DEFAULT 'IN_PROGRESS',
    meeting_summary TEXT,
    next_steps TEXT,
    is_followup_recommended BOOLEAN,
    followup_point TEXT, -- not necessarily a firm date; can be something like "In 6 months or when development is complete"
    date_sent TIMESTAMP WITH TIME ZONE
);
