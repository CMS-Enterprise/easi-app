CREATE TYPE system_intake_step AS ENUM (
  'INITIAL_REQUEST_FORM',
  'DRAFT_BUSINESS_CASE',
  'GRT_MEETING',
  'GRB_MEETING',
  'FINAL_BUSINESS_CASE',
  'DECISION_AND_NEXT_STEPS'
);

CREATE TYPE system_intake_state AS ENUM (
  'OPEN',
  'CLOSED'
);

ALTER TABLE system_intakes ADD COLUMN step system_intake_step;
ALTER TABLE system_intakes ALTER COLUMN step SET DEFAULT 'INITIAL_REQUEST_FORM';
ALTER TABLE system_intakes ALTER COLUMN step SET NOT NULL;

ALTER TABLE system_intakes ADD COLUMN state system_intake_state;
ALTER TABLE system_intakes ALTER COLUMN state SET DEFAULT 'OPEN';
ALTER TABLE system_intakes ALTER COLUMN state SET NOT NULL;
