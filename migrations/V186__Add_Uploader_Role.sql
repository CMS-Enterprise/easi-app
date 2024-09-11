CREATE TYPE document_uploader_role AS ENUM ('REQUESTER', 'ADMIN');

-- add column without NOT NULL
ALTER TABLE IF EXISTS system_intake_documents
  ADD COLUMN IF NOT EXISTS uploader_role document_uploader_role;
-- update all rows
UPDATE system_intake_documents
SET uploader_role = 'REQUESTER';
-- add NOT NULL for new rows
ALTER TABLE IF EXISTS system_intake_documents
  ALTER COLUMN uploader_role SET NOT NULL;
