CREATE TABLE IF NOT EXISTS trb_request_systems (
    id UUID PRIMARY KEY NOT NULL,
    trb_request_id UUID NOT NULL REFERENCES trb_request(id) ON DELETE CASCADE,
    system_id ZERO_STRING NOT NULL,
    created_by UUID NOT NULL REFERENCES user_account(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID NOT NULL REFERENCES user_account(id),
    modified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- allow one link between a unique trb request id and a unique system id
CREATE UNIQUE INDEX IF NOT EXISTS system_id_trb_id_unique_idx ON trb_request_systems (trb_request_id, system_id);
