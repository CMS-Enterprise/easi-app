SELECT
    id,
    system_intake_id,
    contract_number,
    created_by,
    created_at,
    modified_by,
    modified_at
FROM
    system_intake_contract_numbers HWERE system_intake_id = ANY($1);
