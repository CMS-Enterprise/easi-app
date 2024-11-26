INSERT INTO trb_request_contract_numbers (
    id,
    trb_request_id,
    contract_number,
    created_by,
    modified_by
)
VALUES (
    :id,
    :trb_request_id,
    :contract_number,
    :created_by,
    :modified_by
) ON CONFLICT DO NOTHING;
