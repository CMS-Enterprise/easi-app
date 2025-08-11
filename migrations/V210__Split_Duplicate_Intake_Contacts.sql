/*
This sanitizes data, splitting duplicate contact names into separate records for better matching and validation.
It also removes extra glyphs that are archives from sharepoint
*/


WITH split_contacts AS (
    SELECT
        id AS original_contact_id,
        system_intake_id,
        component,
        role,
        created_at,
        updated_at,
        -- Replace & with ;# to unify delimiters, then remove SharePoint glyphs, then split
        TRIM(
            REGEXP_REPLACE(
                UNNEST(
                    STRING_TO_ARRAY(
                        REGEXP_REPLACE(
                            REGEXP_REPLACE(common_name, '&', ';#', 'g'),
                            ';#\d+|#\d+', '', 'g'
                        ),
                        ';#'
                    )
                ),
                '^\s+|\s+$', '', 'g' -- Remove leading/trailing whitespace
            )
        ) AS clean_name,
        common_name
    FROM system_intake_contacts
    WHERE common_name IS NOT NULL
),

data_to_update AS (
    SELECT
        original_contact_id,
        system_intake_id,
        component,
        role,
        created_at,
        updated_at,
        clean_name,
        common_name,
        -- Normalize spaces before and after INITCAP
        REGEXP_REPLACE(
            INITCAP(
                REGEXP_REPLACE(clean_name, '\s+', ' ', 'g')
            ),
            '\s+', ' ', 'g'
        ) AS clean_name_titlecase,
        ROW_NUMBER() OVER (PARTITION BY original_contact_id ORDER BY clean_name) AS split_index,
        COUNT(*) OVER (PARTITION BY original_contact_id) AS split_count
    FROM split_contacts
    WHERE
        clean_name <> ''
        AND clean_name <> common_name
),

new_records AS ( --noqa
    INSERT INTO system_intake_contacts (
        id,
        eua_user_id,
        system_intake_id,
        component,
        role,
        created_at,
        updated_at,
        common_name,
        user_id
    )
    SELECT
        GEN_RANDOM_UUID() AS id,               
        c.eua_user_id,
        du.system_intake_id,
        du.component,
        du.role,
        du.created_at, --todo, should this be now?
        du.updated_at,
        du.clean_name_titlecase,         
        c.user_id
    FROM data_to_update du
    JOIN system_intake_contacts c ON c.id = du.original_contact_id
    WHERE du.split_index > 1
)

UPDATE system_intake_contacts c
SET common_name = du.clean_name_titlecase
FROM (
    SELECT * FROM data_to_update WHERE split_index = 1
) du
WHERE c.id = du.original_contact_id
