CREATE TYPE grb_review_type AS ENUM (
  'STANDARD',
  'ASYNC'
  );

ALTER TABLE system_intakes
  ADD COLUMN grb_review_type grb_review_type;

UPDATE system_intakes
  SET grb_review_type = 'STANDARD'
  WHERE grb_review_type IS NULL;
