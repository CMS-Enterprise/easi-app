CREATE TYPE intake_request_type AS ENUM ('NEW', 'MAJOR_CHANGES', 'RECOMPETE', 'SHUTDOWN');
ALTER TABLE system_intake ADD COLUMN request_type intake_request_type NOT NULL DEFAULT 'NEW';
