DELETE FROM trb_request_contract_numbers
WHERE contract_number <> ALL(:contract_numbers)
AND trb_request_id = :trb_request_id;
