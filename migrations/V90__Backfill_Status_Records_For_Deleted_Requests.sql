DO $$
DECLARE arow RECORD;
BEGIN
    FOR arow IN (SELECT * FROM accessibility_requests WHERE deleted_at IS NOT NULL) LOOP
    	INSERT INTO accessibility_request_status_records VALUES(uuid_generate_v4(), arow.ID, 'DELETED', arow.deleted_at, arow.eua_user_id);
    END LOOP;
END $$
