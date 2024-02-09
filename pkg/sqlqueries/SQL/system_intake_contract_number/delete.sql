DELETE FROM system_intake_contract_numbers
WHERE contract_number <> ALL($1)
AND system_intake_id = $2;
