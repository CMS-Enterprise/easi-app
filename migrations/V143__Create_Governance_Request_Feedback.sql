CREATE TYPE feedback_source_action AS ENUM (
    'REQUEST_EDITS',
    'PROGRESS_TO_NEW_STEP'
);

CREATE TYPE feedback_target_form AS ENUM (
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
    source_action feedback_source_action NOT NULL,
    target_form feedback_target_form NOT NULL,

    -- general metadata
    -- use created_by to denote who the feedback is from
    created_by TEXT NOT NULL CHECK (created_by ~ '^[A-Z0-9]{4}$'),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by TEXT CHECK (modified_by ~ '^[A-Z0-9]{4}$'),
    modified_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE governance_request_feedback
ADD CONSTRAINT valid_governance_request_feedback_source_target_combinations
CHECK (
    CASE WHEN source_action = 'PROGRESS_TO_NEW_STEP' THEN target_form IN ('NO_TARGET_PROVIDED')
         WHEN source_action = 'REQUEST_EDITS' THEN target_form IN ('INTAKE_REQUEST', 'DRAFT_BUSINESS_CASE', 'FINAL_BUSINESS_CASE')
         ELSE false
    END
);
