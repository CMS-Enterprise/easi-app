CREATE TYPE software_acquisition_method AS ENUM (
    'CONTRACTOR_FURNISHED',
    'FED_FURNISHED',
    'ELA_OR_INTERNAL',
    'NOT_YET_DETERMINED',
    'OTHER'
);

ALTER TABLE system_intakes ADD COLUMN using_software TEXT;
ALTER TABLE system_intakes ADD COLUMN acquisition_methods software_acquisition_method[];
