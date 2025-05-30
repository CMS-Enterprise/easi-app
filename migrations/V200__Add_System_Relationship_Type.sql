CREATE TYPE system_relationship_type AS ENUM (
    'PRIMARY_SUPPORT',
    'PARTIAL_SUPORT',
    'USES_IN_TECH_SOLUTION',
    'USED_IN_TECH_SOLUTION',
    'OTHER'
);

ALTER TABLE system_intake_systems ADD COLUMN relationship_type SYSTEM_RELATIONSHIP_TYPE[];

ALTER TABLE system_intake_systems ADD COLUMN other_type TEXT;

ALTER TABLE system_intake_systems
ADD CONSTRAINT system_intake_systems_check_other_type_only_if_other
CHECK (
    other_type IS NULL
    OR relationship_type @> ARRAY['OTHER']::SYSTEM_RELATIONSHIP_TYPE[] -- does the array contain OTHER?
);
COMMENT ON CONSTRAINT system_intake_systems_check_other_type_only_if_other ON system_intake_systems IS 'Ensures that if other_type can only be provided if the relationship_type array includes the OTHER option.';
