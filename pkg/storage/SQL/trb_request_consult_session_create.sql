INSERT INTO trb_request_consult_sessions (
    id,
    trb_request_id,
    session_time,
    notes,
    created_by,
    modified_by
)
VALUES (
    :id,
    :trb_request_id,
    :session_time,
    :notes,
    :created_by,
    :modified_by
)
RETURNING *;
