-- Must be done outside of a transactional migration
ALTER TYPE system_intake_status ADD VALUE 'ARCHIVED';
ALTER TYPE business_case_status ADD VALUE 'ARCHIVED';
