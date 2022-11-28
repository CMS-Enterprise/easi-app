CREATE TYPE trb_feedback_action AS ENUM (
	'REQUEST_EDITS',
	'READY_FOR_CONSULT'
);

CREATE FUNCTION check_eua_array_regex (
    arr TEXT[], regex TEXT
) RETURNS BOOLEAN AS $$

    SELECT bool_and (n ~ regex)
    FROM unnest(arr) s(n);

$$ LANGUAGE SQL immutable;

CREATE TABLE trb_request_feedback (
    id UUID PRIMARY KEY NOT NULL,
    trb_request_id uuid NOT NULL REFERENCES trb_request(id),
    feedback_message TEXT NOT NULL,
    copy_trb_mailbox BOOLEAN NOT NULL,
    notify_eua_ids TEXT[] NOT NULL CHECK (check_eua_array_regex (notify_eua_ids, '^[A-Z0-9]{4}$')),
    action trb_feedback_action NOT NULL DEFAULT 'READY_FOR_CONSULT',
    created_by TEXT NOT NULL CHECK (created_by ~ '^[A-Z0-9]{4}$'),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by TEXT CHECK (modified_by ~ '^[A-Z0-9]{4}$'),
    modified_at TIMESTAMP WITH TIME ZONE
);
