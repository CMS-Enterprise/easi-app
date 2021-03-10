CREATE TABLE grt_feedback (
    id UUID NOT NULL PRIMARY KEY,
    intake_id UUID NOT NULL REFERENCES system_intakes(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    feedback TEXT NOT NULL
)