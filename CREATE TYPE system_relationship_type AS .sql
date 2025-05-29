-- Step 1: Change the data in the database to support relationship_type on the system_relationship_type table

CREATE TYPE system_relationship_type AS ENUM (
    'PRIMARY_SUPPORT',
    'PARTIAL_SUPORT',
    'USES_IN_TECH_SOLUTION',
    'USED_IN_TECH_SOLUTION'
    'OTHER'
);
  
ALTER TABLE system_intake_systems ADD COLUMN relationship_type SYSTEM_RELATIONSHIP_TYPE;

ALTER TABLE system_intake_systems ADD COLUMN other_type TEXT;
-- TODO: NJD - I think this option would fit for most system linkage, but almost assuredly there would be some that are mislabeled

UPDATE system_intake_systems SET relationship_type = PRIMARY_SUPPORT;
-- UPDATE system_intake_systems SET relationship_type = OTHER;
-- UPDATE system_intake_systems SET other_type = 'Historical EASi System Linkage';

/* Don't allow other_type to be set unless system_relationship_type is 'OTHER'. */
ALTER TABLE system_intake_systems ADD CONSTRAINT system_intake_systems_other_type_is_null_unless_system_relationship_type_is_other
CHECK ((relationship_type = 'OTHER') = (other_type IS NOT NULL AND other_type != '')); 


-- Step 2: Whenever a system is created, we need to provide changes to support this data
-- Update the model in go, which affects:
-- Create TRB
-- Link
-- Unlink
--DB seeds

-- Update the embedded SQL
-- set.sql (handles insert!)
-- v177__Add_Intake_Systems_table.sql
-- get_by_system_intake_ids.sql
-- select_by_cedar_system_ids.sql (This one is roughly related, but I dont think will need an update)
        
-- Maybe? Depending on needs of the front end?)
-- related_intakes_by_intake_ids.sql 
-- related_intakes_by_trb_request_ids.sql 
-- related_trb_requests_by_intake_ids.sql 

-- Update the .graphql schema

-- Re-run gqlgen to regenerate the graphql

-- Resolver

-- Front end is a separate ticket


-- Step 3: Migrate the existing data
-- "Historic Information should be listed as Primary" - I think this means we should set it to system_relationship_type to 'PRIMARY_SUPPORT'
-- Done in the migration 
-- Do we need any complex logic to support mapping these links to this new ENUM and fill out the Other_Type field?


-- What about dev table migrations? Do we need to change seed data
-- How do we see this in the front end?
-- Is CodeGen usually run with the front end PR?
-- What branch should I point this PR at?
