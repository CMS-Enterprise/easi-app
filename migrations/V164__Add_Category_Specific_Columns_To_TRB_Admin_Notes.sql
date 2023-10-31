ALTER TABLE trb_admin_notes
  ADD COLUMN applies_to_basic_request_details BOOLEAN,
  ADD COLUMN applies_to_subject_areas BOOLEAN,
  ADD COLUMN applies_to_attendees BOOLEAN;

COMMENT ON COLUMN trb_admin_notes.applies_to_basic_request_details IS 'Used for the Initial Request Form category';
COMMENT ON COLUMN trb_admin_notes.applies_to_subject_areas IS 'Used for the Initial Request Form category';
COMMENT ON COLUMN trb_admin_notes.applies_to_attendees IS 'Used for the Initial Request Form category';

ALTER TABLE trb_admin_notes
  ADD COLUMN applies_to_meeting_summary BOOLEAN,
  ADD COLUMN applies_to_next_steps BOOLEAN;

COMMENT ON COLUMN trb_admin_notes.applies_to_meeting_summary IS 'Used for the Advice Letter category';
COMMENT ON COLUMN trb_admin_notes.applies_to_next_steps IS 'Used for the Advice Letter category';

-- populate columns for existing admin notes
UPDATE trb_admin_notes
SET
  applies_to_basic_request_details = FALSE,
  applies_to_subject_areas = FALSE,
  applies_to_attendees = FALSE
WHERE category = 'INITIAL_REQUEST_FORM';

UPDATE trb_admin_notes
SET
  applies_to_meeting_summary = FALSE,
  applies_to_next_steps = FALSE
WHERE category = 'ADVICE_LETTER';

-- add constraints so that only notes of the correct category can set category-specific columns

ALTER TABLE trb_admin_notes
  ADD CONSTRAINT only_initial_request_notes_set_columns
  CHECK (
    (
      -- initial request form notes must have these three columns set to non-null values
      category = 'INITIAL_REQUEST_FORM' AND
      applies_to_basic_request_details IS NOT NULL AND
      applies_to_subject_areas IS NOT NULL AND
      applies_to_attendees IS NOT NULL
    ) OR (
      -- notes in other categories must leave these three columns as null
      category != 'INITIAL_REQUEST_FORM' AND
      applies_to_basic_request_details IS NULL AND
      applies_to_subject_areas IS NULL AND
      applies_to_attendees IS NULL
    )
  );

ALTER TABLE trb_admin_notes
  ADD CONSTRAINT only_advice_letter_notes_set_columns
  CHECK (
    (
      -- advice letter notes must have these two columns set to non-null values
      category = 'ADVICE_LETTER' AND
      applies_to_meeting_summary IS NOT NULL AND
      applies_to_next_steps IS NOT NULL
    ) OR (
      -- notes in other categories must leave these two columns as null
      category != 'ADVICE_LETTER' AND
      applies_to_meeting_summary IS NULL AND
      applies_to_next_steps IS NULL
    )
  );
