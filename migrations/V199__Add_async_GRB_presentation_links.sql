CREATE TABLE IF NOT EXISTS system_intake_grb_presentation_links (
    id UUID PRIMARY KEY NOT NULL,
    created_by UUID NOT NULL REFERENCES user_account(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    system_intake_id UUID NOT NULL UNIQUE REFERENCES system_intakes(id),
    recording_link TEXT,
    recording_passcode TEXT,
    transcript_link TEXT,
    transcript_s3_key TEXT,
    transcript_file_name TEXT,
    presentation_deck_s3_key TEXT,
    presentation_deck_file_name TEXT,
    CONSTRAINT transcript_link_or_doc_null_check CHECK (
      (
        transcript_link IS NULL AND
        transcript_s3_key IS NULL AND
        transcript_file_name IS NULL
      ) OR
      (
        transcript_link IS NOT NULL AND
        transcript_s3_key IS NULL AND
        transcript_file_name IS NULL
      ) OR
      (
        transcript_link IS NULL AND
        transcript_s3_key IS NOT NULL AND
        transcript_file_name IS NOT NULL
      )
    ),
    CONSTRAINT presentation_deck_null_check CHECK (
      (
        presentation_deck_s3_key IS NULL AND
        presentation_deck_file_name IS NULL
      ) OR
      (
        presentation_deck_s3_key IS NOT NULL AND
        presentation_deck_file_name IS NOT NULL
      )
    )
);

COMMENT ON CONSTRAINT transcript_link_or_doc_null_check ON system_intake_grb_presentation_links IS 'Ensures either a transcript link OR document is inserted and that the file name and s3 key are present if transcript is a document';

COMMENT ON CONSTRAINT presentation_deck_null_check ON system_intake_grb_presentation_links IS 'Ensures presentation deck file name and s3 key are both present or both null';
