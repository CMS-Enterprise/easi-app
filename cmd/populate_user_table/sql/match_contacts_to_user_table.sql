WITH user_name_accounts AS (
    SELECT
        sic.id AS contact_id,
        u.common_name,
        sic.eua_user_id,
        sic.role,
        u.id


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
        u.id


    FROM system_intake_contacts sic
    JOIN user_account u ON sic.common_name = u.common_name
    WHERE u.id IS NULL AND sic.eua_user_id IS NOT NULL

)

SELECT * FROM common_name_accounts
UNION
SELECT * FROM user_name_accounts
