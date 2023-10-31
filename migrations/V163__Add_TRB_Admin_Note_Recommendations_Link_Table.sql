CREATE TABLE trb_admin_notes_trb_admin_note_recommendations_links (
    id UUID PRIMARY KEY NOT NULL,
    trb_request_id uuid NOT NULL REFERENCES trb_request(id),

    -- we don't declare foreign key constraints here because that's taken care of by the constraints below
    trb_admin_note_id uuid NOT NULL,
    trb_advice_letter_recommendation_id uuid NOT NULL,

    created_by TEXT NOT NULL CHECK (created_by ~ '^[A-Z0-9]{4}$'),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by TEXT CHECK (modified_by ~ '^[A-Z0-9]{4}$'),
    modified_at TIMESTAMP WITH TIME ZONE,

    UNIQUE(trb_admin_note_id, trb_advice_letter_recommendation_id),

    -- ensure that the admin note and recommendation are both attached to the same TRB request
    CONSTRAINT fk_admin_notes_have_same_request_id_as_recommendation_link
        FOREIGN KEY (trb_admin_note_id, trb_request_id)
        REFERENCES trb_admin_notes(id, trb_request_id),

    CONSTRAINT fk_recommendations_have_same_request_id_as_recommendation_link
        FOREIGN KEY (trb_advice_letter_recommendation_id, trb_request_id)
        REFERENCES trb_advice_letter_recommendations(id, trb_request_id)
);

COMMENT ON COLUMN trb_admin_notes_trb_admin_note_recommendations_links.trb_request_id IS 
    'Having this column allows creating the foreign key constraints that make sure the admin notes and recommendations both belong to the same TRB request';

COMMENT ON CONSTRAINT fk_admin_notes_have_same_request_id_as_recommendation_link ON trb_admin_notes_trb_admin_note_recommendations_links IS
    'This checks that the referenced admin note belongs to the same TRB request as this record';
COMMENT ON CONSTRAINT fk_recommendations_have_same_request_id_as_recommendation_link ON trb_admin_notes_trb_admin_note_recommendations_links IS
    'This checks that the referenced recommendation belongs to the same TRB request as this record';
COMMENT ON TABLE trb_admin_notes_trb_admin_note_recommendations_links IS
    'The combination of the two foreign key constraints on this table ensures that for each link, the admin note and recommendation both belong to the same TRB request as the link record, and thus both belong to the same TRB request';
