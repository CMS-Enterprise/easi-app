CREATE TYPE accessibility_request_status AS ENUM ('OPEN', 'IN_REMEDIATION', 'CLOSED');

CREATE TABLE accessibility_request_status_records (
    id uuid PRIMARY KEY not null,
    request_id uuid REFERENCES accessibility_requests(id) NOT NULL,
    status accessibility_request_status NOT NULL DEFAULT 'OPEN',
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
