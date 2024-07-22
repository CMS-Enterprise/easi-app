ALTER TABLE system_intake_grb_reviewers
  ALTER COLUMN modified_by DROP NOT NULL;
ALTER TABLE system_intake_grb_reviewers
  ALTER COLUMN modified_at DROP NOT NULL;

ALTER TABLE system_intake_systems
  ALTER COLUMN modified_by DROP NOT NULL;
ALTER TABLE system_intake_systems
  ALTER COLUMN modified_at DROP NOT NULL;

ALTER TABLE trb_request_systems
  ALTER COLUMN modified_by DROP NOT NULL;
ALTER TABLE trb_request_systems
  ALTER COLUMN modified_at DROP NOT NULL;

ALTER TABLE system_intake_contract_numbers
  ALTER COLUMN modified_by DROP NOT NULL;
ALTER TABLE system_intake_contract_numbers
  ALTER COLUMN modified_at DROP NOT NULL;

ALTER TABLE trb_request_contract_numbers
  ALTER COLUMN modified_by DROP NOT NULL;
ALTER TABLE trb_request_contract_numbers
  ALTER COLUMN modified_at DROP NOT NULL;
