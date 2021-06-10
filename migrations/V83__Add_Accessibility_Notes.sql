CREATE TABLE accessibility_notes (
    id uuid PRIMARY KEY NOT NULL,
    request_id uuid REFERENCES accessibility_requests(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    note text NOT NULL
)