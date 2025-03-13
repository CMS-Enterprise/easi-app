CREATE TYPE grb_review_type AS ENUM (
    'STANDARD',
    'ASYNC'
);

ALTER TABLE system_intakes
ADD COLUMN grb_review_type GRB_REVIEW_TYPE NOT NULL DEFAULT 'STANDARD';
