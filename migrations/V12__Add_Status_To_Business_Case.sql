CREATE TYPE business_case_status AS ENUM ('DRAFT', 'SUBMITTED', 'REVIEWED', 'REJECTED');
ALTER TABLE business_case ADD COLUMN status business_case_status NOT NULL DEFAULT 'DRAFT';
