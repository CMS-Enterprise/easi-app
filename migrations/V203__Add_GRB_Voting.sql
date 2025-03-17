CREATE TYPE system_intake_grb_voting_option AS ENUM (
    'NO_OBJECTION',
    'OBJECTION'
);

ALTER TABLE IF EXISTS system_intake_grb_reviewers
ADD COLUMN vote SYSTEM_INTAKE_GRB_VOTING_OPTION DEFAULT NULL;

ALTER TABLE IF EXISTS system_intake_grb_reviewers
ADD COLUMN vote_comment TEXT DEFAULT NULL;

ALTER TABLE IF EXISTS system_intake_grb_reviewers
ADD COLUMN date_voted TIMESTAMP WITH TIME ZONE DEFAULT NULL;
