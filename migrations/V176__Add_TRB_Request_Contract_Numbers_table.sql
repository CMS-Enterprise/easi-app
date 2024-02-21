CREATE TABLE IF NOT EXISTS trb_request_contract_numbers (
    id UUID PRIMARY KEY NOT NULL,
    trb_request_id UUID NOT NULL REFERENCES trb_request(id) ON DELETE CASCADE,
    contract_number ZERO_STRING NOT NULL,
    created_by UUID NOT NULL REFERENCES user_account(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID NOT NULL REFERENCES user_account(id),
    modified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- allow one link between a unique trb request id and a unique contract number
CREATE UNIQUE INDEX IF NOT EXISTS contract_number_trb_request_id_unique_idx ON trb_request_contract_numbers (trb_request_id, contract_number);
