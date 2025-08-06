WITH user_name_accounts AS (
    SELECT
        sic.id AS contact_id,
        u.common_name,
        sic.eua_user_id,
        sic.role,
        u.id AS user_id


    FROM system_intake_contacts sic
    JOIN user_account u ON sic.eua_user_id = u.username AND sic.user_id IS NULL
    WHERE u.id IS NOT NULL AND  sic.eua_user_id IS NOT NULL
),

common_name_accounts AS (
    
    SELECT
        sic.id AS contact_id,
        u.common_name,
        sic.eua_user_id,
        sic.role,
        u.id AS user_id


    FROM system_intake_contacts sic
    JOIN user_account u ON sic.common_name = u.common_name
    WHERE u.id IS NULL AND sic.eua_user_id IS NOT NULL

),

all_accounts AS (
    SELECT * FROM user_name_accounts
    UNION
    SELECT * FROM common_name_accounts
)
-- TODO update the contacts table

UPDATE system_intake_contacts
SET user_id = all_accounts.user_id
FROM all_accounts
WHERE system_intake_contacts.id = all_accounts.contact_id
