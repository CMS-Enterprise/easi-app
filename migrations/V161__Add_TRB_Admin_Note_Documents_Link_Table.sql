CREATE TABLE trb_admin_notes_trb_request_documents_links (
    id UUID PRIMARY KEY NOT NULL,
    trb_request_id uuid NOT NULL REFERENCES trb_request(id),

    -- we don't declare foreign key constraints here because that's taken care of by the constraints below
    trb_admin_note_id uuid NOT NULL,
    trb_request_document_id uuid NOT NULL,
    
    created_by TEXT NOT NULL CHECK (created_by ~ '^[A-Z0-9]{4}$'),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by TEXT CHECK (modified_by ~ '^[A-Z0-9]{4}$'),
    modified_at TIMESTAMP WITH TIME ZONE,

    UNIQUE(trb_admin_note_id, trb_request_document_id),

    -- these constraints check that the referenced admin notes and the referenced documents belong to the same TRB request as this record,
    -- which ensures that the admin note and document both belong to the same TRB request
    CONSTRAINT fk_admin_notes_have_same_request_id_as_doc_link
        FOREIGN KEY (trb_admin_note_id, trb_request_id)
        REFERENCES trb_admin_notes(id, trb_request_id),

    CONSTRAINT fk_documents_have_same_request_id_as_doc_link
        FOREIGN KEY (trb_request_document_id, trb_request_id)
        REFERENCES trb_request_documents(id, trb_request_id)
);
