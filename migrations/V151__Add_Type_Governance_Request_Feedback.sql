CREATE TYPE feedback_type AS ENUM (
    'REQUESTER',
    'GRB'
);

-- should be ok to not set a default here; this table should be empty at the time it's added
ALTER TABLE governance_request_feedback ADD COLUMN type feedback_type NOT NULL;
