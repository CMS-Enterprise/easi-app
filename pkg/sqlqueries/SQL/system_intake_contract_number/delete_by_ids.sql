DELETE FROM system_intake_contract_numbers
WHERE id = ANY($1)
RETURNING contract_number;