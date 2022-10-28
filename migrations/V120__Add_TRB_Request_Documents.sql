CREATE TYPE trb_request_document_type AS ENUM (
  'ARCHITECTURE_DIAGRAM',
  'PRESENTATION_SLIDE_DECK',
  'BUSINESS_CASE',
  'OTHER'
);

-- TODO - possibly not needed
CREATE TYPE trb_request_document_status AS ENUM (
  'AVAILABLE',
  'UNAVAILABLE',
  'PENDING'
);

CREATE TABLE trb_request_documents (
    -- PK, FK
    id UUID PRIMARY KEY NOT NULL,
    trb_request_id uuid NOT NULL REFERENCES trb_request(id),

    -- user-visible info
    file_name TEXT NOT NULL,
    document_type trb_request_document_type NOT NULL,
    other_type TEXT, -- used to represent user-entered document types

    -- TODO - maybe get rid of, since we get this info from S3?
    -- status trb_request_document_status NOT NULL,

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
ALTER TABLE trb_request_documents
ADD CONSTRAINT trb_doc_other_type_is_null_unless_trb_doc_type_is_other
CHECK ((document_type = 'OTHER') = (other_type IS NOT NULL AND other_type != ''));
