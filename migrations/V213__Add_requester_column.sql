ALTER TABLE IF EXISTS system_intake_contacts
ADD COLUMN is_requester BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE IF EXISTS system_intake_contacts
ADD COLUMN roles TEXT[] NOT NULL DEFAULT '{}';

-- create copy of table for safety and testing purposes
CREATE TABLE IF NOT EXISTS copy_system_intake_contacts AS TABLE system_intake_contacts;

-- operate only on the copy table
UPDATE copy_system_intake_contacts c
SET roles = sub.roles
FROM (
    SELECT user_id, system_intake_id, ARRAY_AGG(DISTINCT role) AS roles
    FROM copy_system_intake_contacts
    GROUP BY user_id, system_intake_id
) sub
WHERE
    c.user_id = sub.user_id
    AND c.system_intake_id = sub.system_intake_id;

-- remove duplicate rows
DELETE
FROM copy_system_intake_contacts c
USING copy_system_intake_contacts dup
WHERE
    c.user_id = dup.user_id
    AND c.system_intake_id = dup.system_intake_id
    AND c.ctid > dup.ctid;

ALTER TABLE copy_system_intake_contacts
DROP COLUMN role;

-- unique constraint between user_id and system_intake_id
ALTER TABLE copy_system_intake_contacts
ADD CONSTRAINT user_intake_unique UNIQUE (user_id, system_intake_id);
