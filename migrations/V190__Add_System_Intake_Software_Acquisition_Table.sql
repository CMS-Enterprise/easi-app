CREATE TYPE software_acquisition_method AS ENUM ('CONTRACTOR_FURNISHED', 'FED_FURNISHED', 'ELA_OR_INTERNAL', 'NOT_YET_DETERMINED', 'OTHER');

CREATE TABLE system_intake_software_acquisition (
    id uuid PRIMARY KEY NOT NULL,
    system_intake_id uuid NOT NULL REFERENCES system_intakes(id),
    using_software TEXT,
    acquisition_methods software_acquisition_method[]
);
