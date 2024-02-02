CREATE TABLE IF NOT EXISTS system_intake_contract_numbers (
    id UUID PRIMARY KEY NOT NULL,
    intake_id UUID REFERENCES system_intakes(id) ON DELETE CASCADE,
    contract_number ZERO_STRING NOT NULL,
    created_by UUID REFERENCES user_account(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- allow one link between a unique intake id and a unique contract number
CREATE UNIQUE INDEX IF NOT EXISTS contract_number_intake_id_unique_idx ON system_intake_contract_numbers (intake_id, contract_number);
