-- Add new common_name column to support "legacy" contacts imported from system_intakes table
ALTER TABLE system_intake_contacts ADD COLUMN common_name TEXT;

-- Add new foreign key reference to user_account table (will eventually replace eua_user_id)
-- TODO: make this NOT NULL once user_table functionality fully integrated
ALTER TABLE system_intake_contacts ADD COLUMN user_id UUID REFERENCES user_account(id);

-- Temporarily remove NOT NULL check from eua_user_id to allow for one time migration of historical contact info from system_intakes
ALTER TABLE system_intake_contacts ALTER COLUMN eua_user_id DROP NOT NULL;

-- Set mutally exclusive / XOR constraint between eua_user_id and common_name
ALTER TABLE system_intake_contacts
ADD CONSTRAINT is_legacy_or_new_contact
CHECK (
    (eua_user_id IS NOT NULL) OR
    (eua_user_id IS NULL AND common_name IS NOT NULL)
);

-- Consolidate contact info from system_intakes into system_intake_contacts

-- Handle Requester
INSERT INTO system_intake_contacts
(
    id,
    eua_user_id,
    system_intake_id,
    component,
    role,
    created_at,
    updated_at,
    common_name
)
SELECT
    gen_random_uuid() AS id,
    si.eua_user_id,
    si.id AS system_intake_id,
    CASE
        WHEN component IS NULL OR component = '' THEN 'Other' -- Use 'Other' if null or empty string
        ELSE component
    END AS component,
    'Requester' AS role,
    si.created_at,
    si.updated_at,
    CASE
        WHEN si.eua_user_id IS NULL THEN si.requester -- Only insert requester name if eua_user_id is NULL
        ELSE NULL
    END AS common_name
FROM system_intakes si
WHERE NOT EXISTS (
    SELECT 1 
    FROM system_intake_contacts sic 
    WHERE
        sic.system_intake_id = si.id
        AND sic.role = 'Requester'
        AND (
            sic.eua_user_id = si.eua_user_id
            OR (sic.eua_user_id IS NULL AND si.eua_user_id IS NULL) 
        )
)
AND (
    si.eua_user_id IS NOT NULL
    OR (si.requester IS NOT NULL AND si.requester <> '')
);

-- Handle Business Owner
INSERT INTO system_intake_contacts
(
    id,
    system_intake_id,
    component,
    role,
    created_at,
    updated_at,
    common_name
)
SELECT
    gen_random_uuid() AS id,
    si.id AS system_intake_id,
    CASE
        WHEN si.business_owner_component IS NULL OR si.business_owner_component = '' THEN 'Other' -- Use 'Other' if null or empty string
        ELSE si.business_owner_component
    END AS business_owner_component,
    'Business Owner' AS role,
    si.created_at,
    si.updated_at,
    si.business_owner AS common_name
FROM system_intakes si
WHERE
    si.business_owner IS NOT NULL AND si.business_owner <> ''
    AND NOT EXISTS (
        SELECT 1 
        FROM system_intake_contacts sic 
        WHERE
            sic.system_intake_id = si.id
            AND sic.role = 'Business Owner'
    );

-- Handle Product Manager / Lead
INSERT INTO system_intake_contacts
(
    id,
    system_intake_id,
    component,
    role,
    created_at,
    updated_at,
    common_name
)
SELECT
    gen_random_uuid() AS id,
    si.id AS system_intake_id,
    CASE
        WHEN si.product_manager_component IS NULL OR si.product_manager_component = '' THEN 'Other' -- Use 'Other' if null or empty string
        ELSE si.product_manager_component
    END AS component,
    'Product Manager' AS role,
    si.created_at,
    si.updated_at,
    si.product_manager AS common_name
FROM system_intakes si
WHERE
    si.product_manager IS NOT NULL AND si.product_manager <> ''
    AND NOT EXISTS (
        SELECT 1 
        FROM system_intake_contacts sic 
        WHERE
            sic.system_intake_id = si.id 
            AND sic.role = 'Product Manager'
    );
