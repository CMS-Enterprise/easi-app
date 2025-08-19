-- create copy of table for safety and testing purposes
CREATE TABLE IF NOT EXISTS copy_system_intake_contacts AS TABLE system_intake_contacts;

-- operate only on the copy table
ALTER TABLE IF EXISTS copy_system_intake_contacts
ADD COLUMN is_requester BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE IF EXISTS copy_system_intake_contacts
ADD COLUMN roles TEXT[] NOT NULL DEFAULT '{}';

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

-- set requester which is a special case (also remove from `roles` array)
UPDATE copy_system_intake_contacts
SET
    roles        = ARRAY_REMOVE(roles, 'Requester'),
    is_requester = roles @> ARRAY ['Requester'];

-- remove duplicate rows
DELETE
FROM copy_system_intake_contacts c
USING copy_system_intake_contacts c2
WHERE
    c.user_id = c2.user_id
    AND c.system_intake_id = c2.system_intake_id
    AND c.ctid > c2.ctid;

UPDATE copy_system_intake_contacts c
SET
    roles        = sub.roles,
    is_requester = sub.is_requester
FROM (SELECT
    user_id,
    system_intake_id,
    ARRAY_AGG(DISTINCT role) FILTER (WHERE role <> 'Requester') AS roles,
    BOOL_OR(role = 'Requester')                                 AS is_requester
FROM (
    SELECT user_id, system_intake_id, role
    FROM copy_system_intake_contacts
) t
GROUP BY user_id, system_intake_id) sub
WHERE
    c.user_id = sub.user_id
    AND c.system_intake_id = sub.system_intake_id;

ALTER TABLE copy_system_intake_contacts
DROP COLUMN role;

-- unique constraint between user_id and system_intake_id
ALTER TABLE copy_system_intake_contacts
ADD CONSTRAINT user_intake_unique UNIQUE (user_id, system_intake_id);
