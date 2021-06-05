CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$
DECLARE arow RECORD;
BEGIN
    FOR arow IN (SELECT id, deleted_at FROM accessibility_requests WHERE deleted_at IS NULL) LOOP
        INSERT INTO accessibility_request_status_records(id, created_at, status, request_id)
        VALUES (uuid_generate_v4(), now(), 'OPEN', arow.id);
    END LOOP;

    FOR arow IN (SELECT id, deleted_at FROM accessibility_requests WHERE deleted_at IS NOT NULL) LOOP
        INSERT INTO accessibility_request_status_records(id, created_at, status, request_id)
                VALUES (uuid_generate_v4(), now(), 'CLOSED', arow.id);
    END LOOP;
END $$