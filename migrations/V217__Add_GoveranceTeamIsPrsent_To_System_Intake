-- Set any existing NULLs to a PRIMARY_SUPPORT
UPDATE system_intake_systems
SET relationship_type = '{PRIMARY_SUPPORT}'
WHERE relationship_type IS NULL;

-- Enforce NOT NULL at the schema level
ALTER TABLE system_intake_systems
ALTER COLUMN relationship_type SET NOT NULL;

-- Enforce that the array is not empty
ALTER TABLE system_intake_systems
ADD CONSTRAINT relationship_type_not_empty CHECK (array_length(relationship_type, 1) IS NOT NULL);

COMMENT ON CONSTRAINT relationship_type_not_empty ON system_intake_systems IS 'Enforce that the relationship_type array is not empty';
