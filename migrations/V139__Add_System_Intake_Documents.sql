CREATE TYPE system_intake_document_type AS ENUM (
  'SOO_SOW',
  'DRAFT_ICGE',
  'OTHER'
);

CREATE TABLE system_intake_documents (
    -- PK, FK
    id UUID PRIMARY KEY NOT NULL,
    system_intake_id uuid NOT NULL REFERENCES system_intakes(id),

    -- user-visible info
    file_name TEXT NOT NULL,
    document_type system_intake_document_type NOT NULL,
    other_type TEXT, -- used to represent user-entered document types

    -- storage info
    bucket TEXT NOT NULL,
    s3_key TEXT NOT NULL, -- key inside bucket; does *not* include bucket name

    -- general metadata
    created_by TEXT NOT NULL CHECK (created_by ~ '^[A-Z0-9]{4}$'),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, -- use for upload date in frontend
    modified_by TEXT CHECK (modified_by ~ '^[A-Z0-9]{4}$'),
    modified_at TIMESTAMP WITH TIME ZONE
);

/* Don't allow other_type to be set unless document_type is 'OTHER'. */
ALTER TABLE system_intake_documents
ADD CONSTRAINT system_intake_doc_other_type_is_null_unless_system_intake_doc_type_is_other
CHECK ((document_type = 'OTHER') = (other_type IS NOT NULL AND other_type != ''));
