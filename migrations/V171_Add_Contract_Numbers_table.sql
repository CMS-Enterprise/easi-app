CREATE TABLE IF NOT EXISTS contract_numbers (
    id UUID PRIMARY KEY NOT NULL,
    intake_id UUID REFERENCES system_intakes(id) ON DELETE CASCADE,
    trb_id UUID REFERENCES trb_request(id) ON DELETE CASCADE,
    contract_number ZERO_STRING NOT NULL,
    created_by TEXT NOT NULL CHECK (created_by ~ '^[A-Z0-9]{4}$'),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by TEXT CHECK (modified_by ~ '^[A-Z0-9]{4}$'),
    modified_at TIMESTAMP WITH TIME ZONE
);

CREATE UNIQUE INDEX IF NOT EXISTS
    contract_number_intake_id_unique_idx ON contract_numbers
        USING btree (intake_id, contract_number);

CREATE UNIQUE INDEX IF NOT EXISTS
    contract_number_trb_id_unique_idx ON contract_numbers
        USING btree (trb_id, contract_number);

ALTER TABLE IF EXISTS contract_numbers ADD CONSTRAINT exactly_one_fkey check (
    ((intake_id IS NOT NULL) AND (trb_id IS NULL))
    OR
    ((intake_id IS NULL) AND (trb_id IS NOT NULL))
);
