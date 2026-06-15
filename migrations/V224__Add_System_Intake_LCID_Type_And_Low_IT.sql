CREATE TYPE system_intake_lcid_type AS ENUM (
    'NEW_SYSTEM',
    'RECOMPETE',
    'PILOT_SHORTENED_LCID'
);

ALTER TABLE system_intakes
ADD COLUMN lcid_type SYSTEM_INTAKE_LCID_TYPE;

ALTER TABLE system_intakes
ADD COLUMN lcid_is_low_it BOOLEAN;
