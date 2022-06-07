DROP TABLE system_intake_contacts;

CREATE TABLE system_intake_contacts (
    id uuid PRIMARY KEY NOT NULL,
    eua_user_id TEXT NOT NULL CHECK (eua_user_id ~ '^[A-Z0-9]{4}$'),
    system_intake_id uuid NOT NULL REFERENCES system_intakes(id),
    component TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE UNIQUE INDEX sys_contacts_unique_idx ON system_intake_contacts(eua_user_id, system_intake_id);
