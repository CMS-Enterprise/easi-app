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

ALTER TABLE system_intakes
ADD COLUMN lcid_component SYSTEM_INTAKE_CONTACT_COMPONENT;

UPDATE system_intakes
SET lcid_component = requester_contacts.component
FROM system_intake_contacts requester_contacts
WHERE
    requester_contacts.system_intake_id = system_intakes.id
    AND requester_contacts.is_requester = TRUE
    AND system_intakes.lcid IS NOT NULL
    AND system_intakes.lcid_component IS NULL;

ALTER TABLE actions
ADD COLUMN lcid_type_change_previous_value SYSTEM_INTAKE_LCID_TYPE,
ADD COLUMN lcid_type_change_new_value SYSTEM_INTAKE_LCID_TYPE,
ADD COLUMN lcid_component_change_previous_value SYSTEM_INTAKE_CONTACT_COMPONENT,
ADD COLUMN lcid_component_change_new_value SYSTEM_INTAKE_CONTACT_COMPONENT,
ADD COLUMN lcid_is_shortened_change_previous_value BOOLEAN,
ADD COLUMN lcid_is_shortened_change_new_value BOOLEAN,
ADD COLUMN lcid_is_low_it_change_previous_value BOOLEAN,
ADD COLUMN lcid_is_low_it_change_new_value BOOLEAN;
