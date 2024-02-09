DELETE FROM system_intake_contract_numbers
WHERE contract_number NOT IN ($1)
AND system_intake_id = $2;
