-- TODO - upgrade migration number when I'm finished testing

ALTER TABLE trb_admin_notes
  -- columns for Initial Request Form category
  ADD COLUMN applies_to_basic_request_details BOOLEAN,
  ADD COLUMN applies_to_subject_areas BOOLEAN,
  ADD COLUMN applies_to_attendees BOOLEAN,

  -- columns for Advice Letter category
  ADD COLUMN applies_to_meeting_summary BOOLEAN,
  ADD COLUMN applies_to_next_steps BOOLEAN;

-- TODO - category-specific constraints

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
