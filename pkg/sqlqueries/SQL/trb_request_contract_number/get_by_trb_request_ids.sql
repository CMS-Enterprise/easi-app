SELECT
    id,
    trb_request_id,
    contract_number,
    created_by,
    created_at,
    modified_by,
    modified_at
FROM trb_request_contract_numbers
WHERE trb_request_id = ANY(:trb_request_ids);
