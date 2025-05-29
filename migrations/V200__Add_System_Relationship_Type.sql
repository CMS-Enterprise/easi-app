CREATE TYPE system_relationship_type AS ENUM (
    'PRIMARY_SUPPORT',
    'PARTIAL_SUPORT',
    'USES_IN_TECH_SOLUTION',
    'USED_IN_TECH_SOLUTION',
    'OTHER_TYPE'
);

-- UPDATE system_intake_systems SET relationship_type = 'PRIMARY_SUPPORT';
-- If we make a new table, there will be no data for this
-- We could populate it, we could allow the front end to display blank
-- It sort of makes sense to leave it blank since we don't really know that it is PRIMARY SUPPORT

CREATE TABLE system_relationships (
    system_id UUID REFERENCES system_intake_systems(id),
    system_relationship_type SYSTEM_RELATIONSHIP_TYPE NOT NULL,
    other_type_description TEXT,
    PRIMARY KEY(system_id, system_relationship_type)
);

ALTER TABLE system_relationships ADD CONSTRAINT system_intake_systems_other_type_is_null_unless_system_relationship_type_is_other 
CHECK ((system_relationship_type = 'OTHER') = (other_type IS NOT NULL AND other_type != '')); 
