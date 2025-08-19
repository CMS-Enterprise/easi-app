CREATE TYPE system_relationship_type AS ENUM (
    'PRIMARY_SUPPORT',
    'PARTIAL_SUPPORT',
    'USES_OR_IMPACTED_BY_SELECTED_SYSTEM',
    'IMPACTS_SELECTED_SYSTEM',
    'OTHER'
);

ALTER TABLE system_intake_systems ADD COLUMN relationship_type SYSTEM_RELATIONSHIP_TYPE[];

ALTER TABLE system_intake_systems ADD COLUMN other_system_relationship_description ZERO_STRING;

ALTER TABLE system_intake_systems
ADD CONSTRAINT system_intake_systems_check_other_system_relationship_description_only_if_other
CHECK (
    other_system_relationship_description IS NULL
    OR relationship_type @> ARRAY['OTHER']::SYSTEM_RELATIONSHIP_TYPE[] -- does the array contain OTHER?
);
COMMENT ON CONSTRAINT system_intake_systems_check_other_system_relationship_description_only_if_other ON system_intake_systems IS 'Ensures that if other_system_relationship_description can only be provided if the relationship_type array includes the OTHER option.';

ALTER TABLE system_intakes ADD COLUMN does_not_support_systems BOOLEAN;

COMMENT ON COLUMN system_intakes.does_not_support_systems IS 'Indicates that the system does not support systems. This is used to indicate that the system does not have any relationships with other systems. When this is set to true, we dont expect any systems to be linked in the system_intake_systems table.';
