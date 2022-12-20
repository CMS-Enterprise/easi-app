ALTER TABLE trb_request ADD COLUMN consult_meeting_time TIMESTAMP;
ALTER TABLE trb_request ADD COLUMN trb_lead TEXT CHECK (created_by ~ '^[A-Z0-9]{4}$');
