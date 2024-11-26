DELETE FROM system_intake_contract_numbers
WHERE
    contract_number <> ALL(:contract_numbers)
    AND system_intake_id = :system_intake_id;
