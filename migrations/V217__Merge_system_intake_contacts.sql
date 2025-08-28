CREATE TYPE SYSTEM_INTAKE_CONTACT_ROLE AS ENUM (
    'BUSINESS_OWNER',
    'CLOUD_NAVIGATOR',
    'CONTRACTING_OFFICERS_REPRESENTATIVE',
    'CYBER_RISK_ADVISOR',
    'INFORMATION_SYSTEM_SECURITY_ADVISOR',
    'OTHER',
    'PRIVACY_ADVISOR',
    'PRODUCT_OWNER',
    'PROJECT_MANAGER',
    'SUBJECT_MATTER_EXPERT',
    'SYSTEM_MAINTAINER',
    'SYSTEM_OWNER'
);
COMMENT ON TYPE SYSTEM_INTAKE_CONTACT_ROLE IS 'Roles that a user can as a contact on a system intake';

-- add roles column to the DB. TODO change this to an enum
ALTER TABLE IF EXISTS system_intake_contacts
ADD COLUMN roles SYSTEM_INTAKE_CONTACT_ROLE[] NOT NULL DEFAULT '{}',
ADD COLUMN is_requester BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN created_by UUID REFERENCES user_account(id), -- TODO set this not null later
ADD COLUMN modified_by UUID REFERENCES user_account(id);

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
                CASE 
                    WHEN LOWER(sic.role) = 'requester' THEN NULL
                    WHEN sic.role = 'Business owner' THEN 'BUSINESS_OWNER'::SYSTEM_INTAKE_CONTACT_ROLE
                    WHEN sic.role = 'Business Owner' THEN 'BUSINESS_OWNER'::SYSTEM_INTAKE_CONTACT_ROLE
                    WHEN sic.role = 'Cloud Navigator' THEN 'CLOUD_NAVIGATOR'::SYSTEM_INTAKE_CONTACT_ROLE
                    WHEN sic.role = 'Contracting Officer''s Representative (COR)' THEN 'CONTRACTING_OFFICERS_REPRESENTATIVE'::SYSTEM_INTAKE_CONTACT_ROLE
                    WHEN sic.role = 'Contracting Officer’s Representative (COR)' THEN 'CONTRACTING_OFFICERS_REPRESENTATIVE'::SYSTEM_INTAKE_CONTACT_ROLE
                    WHEN sic.role = 'CRA' THEN 'CYBER_RISK_ADVISOR'::SYSTEM_INTAKE_CONTACT_ROLE
                    WHEN sic.role = 'Cyber Risk Advisor (CRA)' THEN 'CYBER_RISK_ADVISOR'::SYSTEM_INTAKE_CONTACT_ROLE
                    WHEN sic.role = 'Information System Security Advisor (ISSO)' THEN 'INFORMATION_SYSTEM_SECURITY_ADVISOR'::SYSTEM_INTAKE_CONTACT_ROLE
                    WHEN sic.role = 'ISSO' THEN 'INFORMATION_SYSTEM_SECURITY_ADVISOR'::SYSTEM_INTAKE_CONTACT_ROLE
                    WHEN sic.role = 'Other' THEN 'OTHER'::SYSTEM_INTAKE_CONTACT_ROLE
                    WHEN sic.role = 'Product Manager' THEN 'PRODUCT_OWNER'::SYSTEM_INTAKE_CONTACT_ROLE
                    WHEN sic.role = 'Product Owner' THEN 'PRODUCT_OWNER'::SYSTEM_INTAKE_CONTACT_ROLE
                    WHEN sic.role = 'System Maintainer' THEN 'SYSTEM_MAINTAINER'::SYSTEM_INTAKE_CONTACT_ROLE
                    WHEN sic.role = 'System Owner' THEN 'SYSTEM_OWNER'::SYSTEM_INTAKE_CONTACT_ROLE
                    WHEN sic.role = 'Unknown' THEN 'OTHER'::SYSTEM_INTAKE_CONTACT_ROLE --use OTHER for unknown
                    ELSE 'OTHER'::SYSTEM_INTAKE_CONTACT_ROLE  --default case, set to OTHER
                END
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
        -- force null group_component to Other. It just means it was never set
        COALESCE(raw_data.group_component,'Other') AS group_component,
        raw_data.component,
        raw_data.role,
        raw_data.created_at,
        raw_data.updated_at,
        raw_data.common_name,
        CASE WHEN raw_data.roles_array = '{}' THEN '{OTHER}' ELSE raw_data.roles_array END AS roles_array,
        
        raw_data.split_index,
        raw_data.split_count,
        raw_data.the_actual_requester,
        raw_data.isrequester
    FROM raw_data_to_update AS raw_data
),

-- update the records of the first record. We put in a CTE so we can still reference the CTE later
updated_records AS ( --noqa
    UPDATE system_intake_contacts c
    SET
        roles = du.roles_array,
        is_requester = du.isrequester,
        component = du.group_component,
        updated_at = CURRENT_TIMESTAMP,
        created_by = '00000000-0000-0000-0000-000000000000', -- Unknown User Account
        modified_by = '00000001-0001-0001-0001-000000000001' -- System Account
    FROM (
        SELECT * FROM data_to_update WHERE split_index = 1
    ) du
    WHERE c.id = du.id
)

-- Delete duplicate contacts, noted by the split_index > 1
DELETE FROM system_intake_contacts
WHERE id IN (SELECT id FROM data_to_update WHERE split_index > 1);

-- Remove placeholder columns
ALTER TABLE system_intake_contacts
DROP COLUMN role,
DROP COLUMN eua_user_id,
DROP COLUMN common_name;

-- rename updated_at to modified_at to fit base struct definition
ALTER TABLE system_intake_contacts
RENAME COLUMN updated_at TO modified_at;

-- unique constraint between user_id and system_intake_id
ALTER TABLE system_intake_contacts
ADD CONSTRAINT user_intake_unique UNIQUE (user_id, system_intake_id);

ALTER TABLE system_intake_contacts
ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
-- created_by can not be null
ALTER TABLE system_intake_contacts
ALTER COLUMN created_by SET NOT NULL;
