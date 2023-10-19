ALTER TABLE trb_admin_notes

-- columns for Initial Request Form category
ADD COLUMN applies_to_basic_request_details BOOLEAN,
ADD COLUMN applies_to_subject_areas BOOLEAN,
ADD COLUMN applies_to_attendees BOOLEAN,

-- columns for Advice Letter category
ADD COLUMN applies_to_meeting_summary BOOLEAN,
ADD COLUMN applies_to_next_steps BOOLEAN;

-- TODO - constraints, populating columns for existing admin notes (either in this migration or in another one)
