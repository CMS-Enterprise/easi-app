ALTER TABLE business_case ADD COLUMN initial_submitted_at timestamp with time zone;
ALTER TABLE business_case ADD COLUMN last_submitted_at timestamp with time zone;
-- The update likely doesn't do anything because we weren't updating submitted at date
-- in the storage package.
UPDATE business_case
    SET initial_submitted_at = submitted_at, last_submitted_at = submitted_at
    WHERE submitted_at IS NOT NULL;
