ALTER TYPE action_type ADD VALUE 'PROGRESS_TO_NEW_STEP' BEFORE 'SUBMIT_INTAKE';

-- temporary; remove once EASI-2888 is merged
ALTER TABLE actions ADD COLUMN step system_intake_step;
