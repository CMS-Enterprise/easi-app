CREATE TYPE software_acquisition_method AS ENUM ('CONTRACTOR_FURNISHED', 'FED_FURNISHED', 'ELA_OR_INTERNAL', 'NOT_YET_DETERMINED', 'OTHER');

CREATE TABLE system_intake_software_acquisition (
    id uuid PRIMARY KEY NOT NULL,
    system_intake_id uuid NOT NULL REFERENCES system_intakes(id),
    using_software TEXT,
    acquisition_methods software_acquisition_method[],

    created_by TEXT NOT NULL CHECK (created_by ~ '^[A-Z0-9]{4}$'),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by TEXT CHECK (modified_by ~ '^[A-Z0-9]{4}$'),
    modified_at TIMESTAMP WITH TIME ZONE
);
