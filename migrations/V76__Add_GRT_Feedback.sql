CREATE TYPE grt_feedback_type AS ENUM ('BUSINESS_OWNER', 'GRB');

CREATE TABLE grt_feedback (
    id UUID NOT NULL PRIMARY KEY,
    intake_id UUID NOT NULL REFERENCES system_intakes(id),
    feedback_type grt_feedback_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    feedback TEXT NOT NULL
)
