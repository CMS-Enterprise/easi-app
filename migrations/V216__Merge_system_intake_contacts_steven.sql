
-- data to update aggregates contacts using partition by logic. We can then programatically update the contact to have a list of all roles, and drop the old columns
WITH raw_data_to_update AS (
    SELECT
        sic.id,
        sic.eua_user_id,
        sic.user_id,
        sic.system_intake_id,
        sic.component,
        -- Deterministic group component
        /*
        Prefer the lowest (alphabetically) non-empty, non-'Other' component.
        If none exist, show 'Other' if present.
        If nothing at all, returns NULL.
        */
        COALESCE(
            MIN(NULLIF(CASE WHEN sic.component IS NULL OR sic.component = '' OR sic.component = 'Other' THEN NULL ELSE sic.component END, '')) OVER (PARTITION BY sic.user_id, sic.system_intake_id),
            MIN(CASE WHEN sic.component = 'Other' THEN 'Other' END) OVER (PARTITION BY sic.user_id, sic.system_intake_id)
        ) AS group_component,
        sic.role,
        sic.created_at,
        sic.updated_at,
        ua.common_name,
        -- This makes an array agg of all non-requester roles. We use ARRAY_REMOVE to get rid of any NULLs that are caused we skip requester
        ARRAY_REMOVE(
            ARRAY_AGG(
                CASE WHEN LOWER(sic.role) <> 'requester' THEN sic.role END
            ) OVER (PARTITION BY sic.user_id, sic.system_intake_id),
            NULL
        ) AS roles_array,
        -- for convenience distinguishing rows
        ROW_NUMBER() OVER (PARTITION BY sic.user_id,sic.system_intake_id ORDER BY sic.id) AS split_index,
        -- how many duplicate contacts are there
        COUNT(*) OVER (PARTITION BY sic.user_id,sic.system_intake_id) AS split_count,
        -- is this record the requester
        LOWER(sic.role) = 'requester' AS the_actual_requester,
        -- is this user the requester
        (MAX(CASE WHEN LOWER(sic.role) = 'requester' THEN 1 ELSE 0 END) OVER (PARTITION BY sic.user_id, sic.system_intake_id)) = 1 AS isrequester
    FROM system_intake_contacts sic
    LEFT JOIN user_account ua ON sic.user_id = ua.id
),

data_to_update AS (
    SELECT 
        raw_data.id,
        raw_data.eua_user_id,
        raw_data.user_id,
        raw_data.system_intake_id,
        raw_data.group_component,
        raw_data.component,
        raw_data.role,
        raw_data.created_at,
        raw_data.updated_at,
        raw_data.common_name,
        CASE WHEN raw_data.roles_array = '{}' THEN '{Other}' ELSE raw_data.roles_array END AS roles_array,
        
        raw_data.split_index,
        raw_data.split_count,
        raw_data.the_actual_requester,
        raw_data.isrequester
    FROM raw_data_to_update AS raw_data
)

-- UPDATE 

-- SELECT * FROM raw_data_to_update
-- WHERE roles_array = '{}' 

SELECT * FROM data_to_update
--WHERE group_component <> component
