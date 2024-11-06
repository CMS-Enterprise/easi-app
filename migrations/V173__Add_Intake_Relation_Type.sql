CREATE TYPE system_intake_relation_type AS ENUM (
  'NEW_SYSTEM',
  'EXISTING_SYSTEM',
  'EXISTING_SERVICE'
);

ALTER TABLE system_intakes ADD COLUMN system_relation_type system_intake_relation_type;
