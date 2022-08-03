INSERT INTO system_intake_funding_sources (id, system_intake_id, source, funding_number, created_at)
SELECT uuid_generate_v4(), id, funding_source, funding_number, NOW()
FROM system_intakes
WHERE funding_source IS NOT NULL
AND existing_funding = TRUE;
