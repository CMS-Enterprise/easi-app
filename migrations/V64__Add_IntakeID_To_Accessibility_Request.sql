ALTER TABLE accessibility_request
    ADD COLUMN intake_id UUID NOT NULL REFERENCES system_intake (id);
