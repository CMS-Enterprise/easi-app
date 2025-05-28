CREATE TYPE system_relationship_type AS ENUM (
    'PRIMARY_SUPPORT',
    'PARTIAL_SUPORT',
    'USES_IN_TECH_SOLUTION',
    'USED_IN_TECH_SOLUTION'
    'OTHER'
);
  
ALTER TABLE system_intake_systems ADD COLUMN relationship_type SYSTEM_RELATIONSHIP_TYPE;

ALTER TABLE system_intake_systems ADD COLUMN other_type TEXT;

UPDATE system_intake_systems SET relationship_type = PRIMARY_SUPPORT;

ALTER TABLE system_intake_systems ADD CONSTRAINT system_intake_systems_other_type_is_null_unless_system_relationship_type_is_other
CHECK ((relationship_type = 'OTHER') = (other_type IS NOT NULL AND other_type != '')); 
