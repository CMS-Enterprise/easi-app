DO $$
DECLARE arow RECORD;
BEGIN
    FOR arow IN (SELECT * FROM system_intakes WHERE funding_source IS NOT NULL and existing_funding = TRUE) LOOP
    	INSERT INTO system_intake_funding_sources VALUES(uuid_generate_v4(), arow.ID, arow.funding_number, NOW(), NOW());
    END LOOP;
END $$
