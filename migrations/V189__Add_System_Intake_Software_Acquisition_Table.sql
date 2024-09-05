CREATE TYPE software_acquisition_method AS ENUM ('CONTRACTOR_FURNISHED', 'FED_FURNISHED', 'ELA_OR_INTERNAL', 'OTHER');

-- TODO: NJD - should we rename this to software_to_system_intake?
-- TODO: NJD - can we make software_name an ENUM based on external (CEDAR) software list?
CREATE TABLE system_intake_software_acquisition (
    id uuid PRIMARY KEY NOT NULL,
    system_intake_id uuid NOT NULL REFERENCES system_intakes(id),
    using_software TEXT NOT NULL, 
    acquisition_methods software_acquisition_method ARRAY NOT NULL
);

-- ALTER TABLE system_intakes ADD using_software_products TEXT NOT NULL;
-- ALTER TABLE system_intakes ADD acquisition_approaches software_acquisition_method;

--     estimated_num_instances INTEGER
--     vendor/manufacture_name?
--     software_name TEXT NOT NULL
