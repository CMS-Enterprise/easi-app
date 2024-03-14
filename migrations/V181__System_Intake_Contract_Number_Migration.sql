INSERT INTO system_intake_contract_numbers
(
    id,
    system_intake_id,
    contract_number,
    created_by,
    created_at,
    modified_by,
    modified_at
)
SELECT
    gen_random_uuid(),
    si.id,
    TRIM(si.contract_number),
    '00000001-0001-0001-0001-000000000001', -- EASI SYSTEM USER
    si.created_at,
    '00000001-0001-0001-0001-000000000001', -- EASI SYSTEM USER
    si.updated_at
FROM system_intakes si
WHERE si.contract_number IS NOT NULL
AND LENGTH(TRIM(si.contract_number)) > 0; -- skip contract numbers that are only whitespace
