CREATE TYPE grb_reviewer_role_type AS ENUM (
  'CO_CHAIR_CIO',
  'CO_CHAIR_CFO',
  'CO_CHAIR_HCA',
  'ACA_3021_REP',
  'CCIIO_REP',
  'PROGRAM_OPERATIONS_BDG_CHAIR',
  'CMCS_REP',
  'FED_ADMIN_BDG_CHAIR',
  'PROGRAM_INTEGRITY_BDG_CHAIR',
  'QIO_REP',
  'SUBJECT_MATTER_EXPERT',
  'OTHER'
);

CREATE TYPE grb_reviewer_voting_role_type AS ENUM (
  'VOTING',
  'ALTERNATE',
  'NON_VOTING'
);

CREATE TABLE IF NOT EXISTS system_intake_grb_reviewers (
  id UUID PRIMARY KEY NOT NULL,
  user_id UUID NOT NULL REFERENCES user_account(id),
  system_intake_id UUID NOT NULL
    REFERENCES system_intakes(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  voting_role grb_reviewer_voting_role_type NOT NULL,
  grb_role grb_reviewer_role_type NOT NULL,
  created_by UUID NOT NULL REFERENCES user_account(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_by UUID NOT NULL REFERENCES user_account(id),
  modified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
