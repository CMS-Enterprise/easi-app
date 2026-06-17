CREATE TYPE system_intake_lcid_type AS ENUM (
    'NEW_SYSTEM',
    'RECOMPETE'
);

ALTER TABLE system_intakes
ADD COLUMN lcid_type SYSTEM_INTAKE_LCID_TYPE;

ALTER TABLE system_intakes
ADD COLUMN lcid_is_low_it BOOLEAN;

ALTER TABLE system_intakes
ADD COLUMN lcid_is_shortened BOOLEAN;

ALTER TABLE actions
ADD COLUMN lcid_type_change_previous_value SYSTEM_INTAKE_LCID_TYPE,
ADD COLUMN lcid_type_change_new_value SYSTEM_INTAKE_LCID_TYPE,
ADD COLUMN lcid_is_shortened_change_previous_value BOOLEAN,
ADD COLUMN lcid_is_shortened_change_new_value BOOLEAN,
ADD COLUMN lcid_is_low_it_change_previous_value BOOLEAN,
ADD COLUMN lcid_is_low_it_change_new_value BOOLEAN;
