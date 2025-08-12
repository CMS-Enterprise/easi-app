WITH user_name_accounts AS (
    SELECT
        sic.id AS contact_id,
        u.common_name,
        sic.eua_user_id,
        sic.role,
        u.id AS user_id,
        sic.user_id AS contact_user_id


    FROM system_intake_contacts sic
    JOIN user_account u ON sic.eua_user_id = u.username AND sic.user_id IS NULL
    WHERE
        u.id IS NOT NULL AND  sic.eua_user_id IS NOT NULL
        AND sic.user_id IS NULL
-- Get entries where there is a user account, but not yet referenced on the contact table
),

common_name_accounts AS (
    
    SELECT
        sic.id AS contact_id,
        u.common_name,
        sic.eua_user_id,
        sic.role,
        u.id AS user_id,
        sic.user_id AS contact_user_id


    FROM system_intake_contacts sic
    JOIN user_account u
        ON
            LOWER(TRIM(u.common_name)) = LOWER(TRIM(sic.common_name))
            OR LOWER(TRIM(u.common_name)) = LOWER(TRIM(sic.common_name)) || ' (she/her)'
            OR LOWER(TRIM(u.common_name)) = LOWER(TRIM(sic.common_name)) || ' (he/him)'
            OR LOWER(TRIM(u.common_name)) = LOWER(TRIM(sic.common_name)) || ' (they/them)'
            OR LOWER(TRIM(u.common_name)) = LOWER(TRIM(sic.common_name)) || ' (she/they)'
            OR LOWER(TRIM(u.common_name)) = LOWER(TRIM(sic.common_name)) || ' (he/they)'
    WHERE
        u.id IS NOT NULL AND sic.common_name IS NOT NULL AND sic.eua_user_id IS NULL
        AND sic.user_id IS NULL
-- Get entries where there is a user account, but not yet referenced on the contact table
),

all_accounts AS (
    SELECT * FROM user_name_accounts
    UNION
    SELECT * FROM common_name_accounts
)

UPDATE system_intake_contacts
SET user_id = all_accounts.user_id
FROM all_accounts
WHERE system_intake_contacts.id = all_accounts.contact_id
