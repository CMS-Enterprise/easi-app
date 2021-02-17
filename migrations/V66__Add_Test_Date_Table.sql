CREATE TYPE test_date_test_type AS ENUM ('INITIAL', 'REMEDIATION');

CREATE TABLE test_dates (
    id UUID PRIMARY KEY NOT NULL,
    request_id UUID NOT NULL REFERENCES accessibility_requests(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    score INT CHECK (score >= 0 AND score <= 1000),
    test_type test_date_test_type NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);
