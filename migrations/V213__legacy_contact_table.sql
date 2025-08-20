-- Create legacy contacts table
CREATE TABLE system_intake_contacts_legacy (
    id UUID NOT NULL PRIMARY KEY,
    eua_user_id TEXT,
    system_intake_id UUID NOT NULL,
    component TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    common_name TEXT,
    CONSTRAINT is_legacy_or_new_contact_legacy CHECK (
        eua_user_id IS NOT NULL OR (eua_user_id IS NULL AND common_name IS NOT NULL)
    ),
    CONSTRAINT system_intake_contacts_legacy_eua_user_id_check CHECK (
        eua_user_id ~ '^[A-Z0-9]{4}$'
    ),
    CONSTRAINT system_intake_contacts_legacy_system_intake_id_fkey FOREIGN KEY (system_intake_id)
    REFERENCES system_intakes(id)
);


COMMENT ON TABLE system_intake_contacts_legacy IS 'This table is used to store legacy contacts that have been migrated from the original system. They are migrated if they can not be identified as a user in okta that can be referenced in the user account table';
