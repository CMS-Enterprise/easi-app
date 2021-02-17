ALTER TABLE accessibility_request_files
    ADD COLUMN request_id UUID NOT NULL REFERENCES accessibility_requests (id);
