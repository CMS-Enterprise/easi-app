

CREATE TYPE system_intake_form_state AS ENUM (
    'NOT_STARTED',
    'IN_PROGRESS',
    'EDITS_REQUESTED',
    'SUBMITTED'
);

CREATE TYPE system_intake_decision_state AS ENUM (
    'NO_DECISION',
    'LCID_ISSUED',
    'NOT_APPROVED',
    'NO_GOVERNANCE'
);


ALTER TABLE system_intakes
 ADD COLUMN request_form_state system_intake_form_state NOT NULL DEFAULT 'NOT_STARTED',
 ADD COLUMN draft_business_case_state system_intake_form_state NOT NULL DEFAULT 'NOT_STARTED',
 ADD COLUMN final_business_case_state system_intake_form_state NOT NULL DEFAULT 'NOT_STARTED',
 ADD COLUMN decision_state system_intake_decision_state NOT NULL DEFAULT 'NO_DECISION';
