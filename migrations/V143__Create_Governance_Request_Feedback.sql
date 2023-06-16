CREATE TYPE feedback_target AS ENUM (
    'NO_TARGET_PROVIDED',
    'INTAKE_REQUEST',
    'DRAFT_BUSINESS_CASE',
    'FINAL_BUSINESS_CASE'
);

CREATE TABLE governance_request_feedback (
    -- PK
    id UUID PRIMARY KEY NOT NULL,

    -- FK
    intake_id UUID NOT NULL REFERENCES system_intakes(id),

    -- required fields
    feedback TEXT NOT NULL,
    target feedback_target NOT NULL,

    -- general metadata
    -- use created_by to denote who the feedback is from
    created_by TEXT NOT NULL CHECK (created_by ~ '^[A-Z0-9]{4}$'),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by TEXT CHECK (modified_by ~ '^[A-Z0-9]{4}$'),
    modified_at TIMESTAMP WITH TIME ZONE
);
