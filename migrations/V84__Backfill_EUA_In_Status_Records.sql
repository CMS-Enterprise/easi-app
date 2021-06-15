DO $$
DECLARE arow RECORD;
BEGIN
    FOR arow IN (SELECT * FROM accessibility_request_status_records WHERE eua_user_id IS NULL) LOOP
    	UPDATE accessibility_request_status_records SET eua_user_id =
    		(SELECT eua_user_id FROM accessibility_requests WHERE accessibility_requests.id = accessibility_request_status_records.request_id)
    		WHERE accessibility_request_status_records.id = arow.id;
    END LOOP;
END $$
