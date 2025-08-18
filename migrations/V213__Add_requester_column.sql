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
    SELECT eua_user_id, system_intake_id, ARRAY_AGG(DISTINCT role) AS roles
    FROM copy_system_intake_contacts
    GROUP BY eua_user_id, system_intake_id
) sub
WHERE
    c.eua_user_id = sub.eua_user_id
    AND c.system_intake_id = sub.system_intake_id;

DELETE
FROM copy_system_intake_contacts c
USING copy_system_intake_contacts dup
WHERE
    c.eua_user_id = dup.eua_user_id
    AND c.system_intake_id = dup.system_intake_id
    AND c.ctid > dup.ctid;

ALTER TABLE copy_system_intake_contacts
DROP COLUMN role;
