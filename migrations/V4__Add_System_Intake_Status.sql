CREATE TYPE system_intake_status AS ENUM ('DRAFT', 'SUBMITTED', 'REVIEWED', 'REJECTED');
ALTER TABLE system_intake
ADD COLUMN status system_intake_status NOT NULL DEFAULT 'DRAFT';
