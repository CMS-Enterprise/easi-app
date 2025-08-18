ALTER TABLE IF EXISTS system_intake_contacts
ADD COLUMN is_requester BOOLEAN NOT NULL DEFAULT FALSE;

-- create copy of table for safety and testing purposes
CREATE TABLE IF NOT EXISTS copy_system_intake_contacts AS TABLE system_intake_contacts;

-- insert everything from original table into copy
INSERT INTO copy_system_intake_contacts
SELECT *
FROM system_intake_contacts;

-- operate only on the copy table
